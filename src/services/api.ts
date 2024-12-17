import axios from 'axios';
import { commonService } from './common.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('user:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`REQUEST interceptorLog: => ${JSON.stringify(config)}`);
    return config;
});

// Add a response interceptor
api.interceptors.response.use(
    response => {
        console.log(`RESPONSE interceptorLog: => ${JSON.stringify(response)}`);
        return response;
    },
    async error => {
        const originalRequest = await error.config;
        console.log('RESPONSE interceptorErrorLog: **error.response.data** =>', JSON.stringify(await error.response.data));

        if (['INVALID_TOKEN'].includes(error.response.data.backend_code) && !originalRequest._retry) {
            originalRequest._retry = true;

            // Get the refresh token from local storage or your state management
            const refreshToken = localStorage.getItem('user:refresh_token'); // Adjust as necessary

            // Track refresh attempts
            if (!originalRequest._refreshAttempt) {
                originalRequest._refreshAttempt = true;

                try {
                    // Make a request to refresh the access token
                    const [errorRefresh, response] = await commonService.catchError(api.post('/refresh-token', { refreshToken: refreshToken }));

                    if (errorRefresh) {
                        console.log('responseErrorDataRefresh => ', JSON.stringify(errorRefresh.response.data));
                        return Promise.reject(errorRefresh.response.data?.code);
                    }

                    // Save the new access token (you might want to save it in local storage)
                    console.log('responseDataRefresh => ', JSON.stringify(response.data));
                    const newAccessToken = response.data.tokens.accessToken;
                    localStorage.setItem('user:token', response.data.tokens.accessToken);

                    // Update the Authorization header for the original request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Retry the original request
                    return api(originalRequest);
                } catch (refreshError: any) {
                    // Check if the refresh token request also resulted in a 401 error
                    if (refreshError.response && refreshError.response.status === 401) {
                        // Handle refresh token failure (e.g., redirect to login)
                        console.error('Refresh token failed:', refreshError);
                        // Optionally, redirect to login or show a message
                        localStorage.clear()
                    }
                    return Promise.reject(refreshError);
                }

            }

        }

        return Promise.reject(error);
    }
)

export default api;
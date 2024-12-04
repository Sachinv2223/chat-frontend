import api from './api';

export interface SignInData {
    email: string;
    password: string;
}

export interface SignUpData extends SignInData {
    fullName: string;
}

interface User {
    id: string;
    email: string;
    fullName: string;
}

interface AuthResponse {
    message: string;
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export const authService = {
    signIn: async (data: SignInData) => {
        const response = await api.post<AuthResponse>('/signin', data);
        if (response.data.tokens.accessToken) {
            localStorage.setItem('user:token', response.data.tokens.accessToken);
            localStorage.setItem('user:refresh_token', response.data.tokens.refreshToken);
            localStorage.setItem('user:data', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    
    signUp: async (data: SignUpData) => {
        const response = await api.post<AuthResponse>('/signup', data);
        if (response.data.tokens.accessToken) {
            localStorage.setItem('user:token', response.data.tokens.accessToken);
            localStorage.setItem('user:refresh_token', response.data.tokens.refreshToken);
            localStorage.setItem('user:data', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user:token');
        localStorage.removeItem('user:refresh_token');
        localStorage.removeItem('user:data');
    }
};
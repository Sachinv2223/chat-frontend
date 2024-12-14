import { AxiosError } from 'axios';
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

        try {
            const response = await api.post<AuthResponse>('/login', data);
            if (response.data.tokens.accessToken) {
                localStorage.setItem('user:token', response.data.tokens.accessToken);
                localStorage.setItem('user:refresh_token', response.data.tokens.refreshToken);
                localStorage.setItem('user:data', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new Error('Please check your credentials and try again.');
                }
            } else {
                console.error('Sign-in error:', error);
                throw new Error('Sign-in error. Please try again.');
            }
        }
    },

    signUp: async (data: SignUpData) => {
        const response = await api.post<AuthResponse>('/register', data);
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
import { commonService } from './common.service';
import api from './api';
import { iConversation, iMessage, iOtherUser } from '../types/dashboard.types';
import { NavigateFunction } from 'react-router-dom';
import { authService } from './auth.service';

export const dashboardService = {

    fetchConversations: async (userId: string, navigate: NavigateFunction) => {
        const [error, response] = await commonService.catchError(api.get<any>(`/protected/conversation/${userId}`));
        if (error) {
            console.error('getConversation ERROR:', JSON.stringify(error));
            if (['INVALID_REFRESH_TOKEN'].includes(error)) {
                localStorage.clear()
                navigate('/user/sign_in');
            }

            throw new Error('getConversation ERROR. Please try again.');
        }
        return response.data as iConversation[];
    },

    fetchMessages: async (conversationId: string, navigate: NavigateFunction) => {
        const [error, response] = await commonService.catchError(api.get<any>(`/protected/message/${conversationId}`));
        if (error) {
            console.error('getMessage ERROR:', JSON.stringify(error));
            if (['INVALID_REFRESH_TOKEN'].includes(error)) {
                navigate('/user/sign_in');
            }

            throw new Error('getMessage ERROR. Please try again.');
        }
        return response.data as iMessage[];
    },

    sendMessage: async (inputMessage: string, conversationId: string, userId: string, navigate: NavigateFunction) => {
        const [error, response] = await commonService.catchError(api.post<any>(`/protected/message`, { conversationId: conversationId, message: inputMessage, senderId: userId }));
        if (error) {
            console.error('sendInputMessage ERROR:', JSON.stringify(error));
            if (['INVALID_REFRESH_TOKEN'].includes(error)) {
                navigate('/user/sign_in');
            }

            throw new Error('sendInputMessage ERROR. Please try again.');
        }
        return response;
    },

    logout: async (navigate: NavigateFunction) => {
        authService.logout();
        navigate('/user/sign_in');
    },

    createConversation: async (userId: string, receiverId: string, navigate: NavigateFunction) => {
        const [error, response] = await commonService.catchError(api.post<any>(`/protected/conversation`, { senderId: userId, receiverId: receiverId }));
        if (error) {
            console.error('createConversation ERROR:', JSON.stringify(error));
            if (['INVALID_REFRESH_TOKEN'].includes(error)) {
                navigate('/user/sign_in');
            }

            throw new Error('createConversation ERROR. Please try again.');
        }
        return response?.data;
    },

    fetchAllUsers: async (userId: string, navigate: NavigateFunction) => {
        const [error, response] = await commonService.catchError(api.get<any>(`/protected/users/${userId}`));
        if (error) {
            console.error('fetchAllUsers ERROR:', JSON.stringify(error));
            if (['INVALID_REFRESH_TOKEN'].includes(error)) {
                navigate('/user/sign_in');
            }

            throw new Error('fetchAllUsers ERROR. Please try again.');
        }
        return response.data as iOtherUser[];
    },
};
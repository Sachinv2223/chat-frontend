import { commonService } from './common.service';
import api from './api';
import { iConversation, iMessage } from '../types/dashboard.types';
import { NavigateFunction } from 'react-router-dom';

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
    }
};
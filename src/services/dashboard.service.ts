import { commonService } from './common.service';
import api from './api';
import { iConversation, iMessage } from '../types/dashboard.types';

export const dashboardService = {

    fetchConversations: async (userId: string) => {
        const [error, response] = await commonService.catchError(api.get<any>(`/protected/conversation/${userId}`));
        if (error) {
            console.error('getConversation ERROR:', JSON.stringify(error));
            throw new Error('getConversation ERROR. Please try again.');
        }
        return response.data as iConversation[];
    },

    fetchMessages: async (conversationId: string) => {
        const [error, response] = await commonService.catchError(api.get<any>(`/protected/message/${conversationId}`));
        if (error) {
            console.error('getMessage ERROR:', JSON.stringify(error));
            throw new Error('getMessage ERROR. Please try again.');
        }
        return response.data as iMessage[];
    }
};
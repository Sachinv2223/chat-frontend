import { commonService } from './common.service';
import api from './api';
import { iConversation } from '../types/dashboard.types';

export const dashboardService = {

    fetchConversations: async (userId: string) => {
        const [error, response] = await commonService.catchError(api.get<any>(`/protected/conversation/${userId}`));
        if (error) {
            console.error('getConversation ERROR:', error);
            throw new Error('getConversation ERROR. Please try again.');
        }
        return response.data as iConversation[];
    },
};
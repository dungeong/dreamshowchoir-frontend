import axios from '@/lib/axios';

export interface ContentResponse {
    contentKey: string;
    title: string;
    content: string;
    updatedAt: string;
}

export const getContent = async (contentKey: string): Promise<ContentResponse> => {
    try {
        const response = await axios.get<ContentResponse>(`/api/content/${contentKey}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch content for key ${contentKey}:`, error);
        throw error;
    }
};

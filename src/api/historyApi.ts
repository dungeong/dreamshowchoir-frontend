import axios from '@/lib/axios';

export interface HistoryItem {
    historyId: number;
    year: number;
    month: number;
    content: string;
}

export const getHistory = async (): Promise<HistoryItem[]> => {
    const response = await axios.get('/api/history');
    return response.data;
};

export const createHistory = async (data: Omit<HistoryItem, 'historyId'>): Promise<HistoryItem> => {
    const response = await axios.post('/api/history', data);
    return response.data;
};

export const updateHistory = async (id: number, data: Partial<HistoryItem>): Promise<HistoryItem> => {
    const response = await axios.patch(`/api/history/${id}`, data);
    return response.data;
};

export const deleteHistory = async (id: number): Promise<void> => {
    await axios.delete(`/api/history/${id}`);
};

import axios from '@/lib/axios';

export interface Faq {
    faqId: number;
    question: string;
    answer: string;
    category?: string;
    order?: number;
}

// GET /api/faqs
export const getFaqs = async (): Promise<Faq[]> => {
    const response = await axios.get('/api/faqs');
    return response.data;
};

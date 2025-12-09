import axios from '@/lib/axios';

export interface Inquiry {
    inquiryId: number;
    title: string;
    content: string;
    authorName: string;
    isSecret: boolean;
    createdAt: string;
    status: 'WAITING' | 'ANSWERED';
    answer?: string;
    answeredAt?: string;
}

export interface InquiryResponse {
    content: Inquiry[];
    totalPages: number;
    totalElements: number;
    page: number;
    size: number;
}

export interface CreateInquiryDto {
    title: string;
    content: string;
    isSecret: boolean;
    password?: string; // For non-logged in users?
}

// GET /api/inquiries
export const getInquiries = async (page: number = 0, size: number = 10): Promise<InquiryResponse> => {
    const response = await axios.get('/api/inquiries', {
        params: { page, size, sort: 'createdAt,desc' }
    });
    return response.data;
};

// GET /api/inquiries/{id}
export const getInquiryDetail = async (id: number): Promise<Inquiry> => {
    const response = await axios.get(`/api/inquiries/${id}`);
    return response.data;
};

// POST /api/inquiries
export const createInquiry = async (dto: CreateInquiryDto): Promise<Inquiry> => {
    const response = await axios.post('/api/inquiries', dto);
    return response.data;
};

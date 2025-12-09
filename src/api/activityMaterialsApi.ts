import axios from '@/lib/axios';

export interface ActivityMaterial {
    materialId: number;
    title: string;
    description: string;
    createdAt: string;
    fileName?: string;
    fileKey?: string;
    // Add other fields if necessary
}

export interface ActivityMaterialsResponse {
    content: ActivityMaterial[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const getActivityMaterials = async (page: number = 0, size: number = 20): Promise<ActivityMaterialsResponse> => {
    const response = await axios.get(`/api/activity-materials?page=${page}&size=${size}`);
    return response.data;
};

export const getActivityMaterialById = async (id: number): Promise<ActivityMaterial> => {
    const response = await axios.get(`/api/activity-materials/${id}`);
    return response.data;
};

export const createActivityMaterial = async (data: { title: string; description: string }): Promise<ActivityMaterial> => {
    const response = await axios.post('/api/activity-materials', data);
    return response.data;
};

export const updateActivityMaterial = async (id: number, data: { title: string; description: string }): Promise<ActivityMaterial> => {
    const response = await axios.patch(`/api/activity-materials/${id}`, data);
    return response.data;
};

export const deleteActivityMaterial = async (id: number): Promise<void> => {
    await axios.delete(`/api/activity-materials/${id}`);
};

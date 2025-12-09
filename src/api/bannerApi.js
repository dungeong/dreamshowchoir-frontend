import axios from '@/lib/axios';

export const getBanners = async () => {
    try {
        const response = await axios.get('/api/banners');
        return response.data; // BannerResponseDto 리스트 반환
    } catch (error) {
        console.error('배너 조회 실패:', error);
        throw error;
    }
};

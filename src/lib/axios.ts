import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Determine refresh token source: Cookies (handled by browser) or LocalStorage?
                // Requirements say: "Use withCredentials: true (if Refresh Token is stored in a cookie)"
                // Our instance has withCredentials: true.
                // Assuming backend expects cookie or we send explicit data.
                // Current code: post('/api/auth/refresh') without body.

                const response = await instance.post('/api/auth/refresh');
                const { accessToken } = response.data;

                // Update Store & Header
                useAuthStore.getState().setAccessToken(accessToken);

                // Update headers for retry
                instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return instance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);

                // Logout
                useAuthStore.getState().logout();

                // Redirect
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;

import axios from 'axios';
import { useRentalStore } from '../store/useRentalStore';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useRentalStore.getState().token; 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
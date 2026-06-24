import axios from 'axios';
import { useRentalStore } from '../store/useRentalStore';

const baseURL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL,
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
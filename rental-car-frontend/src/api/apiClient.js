import axios from 'axios';
import { useRentalStore } from '../store/useRentalStore';

const baseURL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage (most reliable)
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear invalid credentials
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
            
            // Clear Zustand store
            useRentalStore.getState().logout();
            
            // Redirect to login to force re-authentication
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default apiClient;

import { create } from 'zustand';

export const useRentalStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user_data')) || null,
    token: localStorage.getItem('access_token') || null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    
    login: (userData, authToken) => {
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('access_token', authToken);
        set({ user: userData, token: authToken, isAuthenticated: true });
    },
    
    logout: () => {
        localStorage.removeItem('user_data');
        localStorage.removeItem('access_token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    cars: [],
    setCars: (data) => set({ cars: data }),

    transactions: [],
    addTransaction: (newTransaction) => set((state) => ({ transactions: [...state.transactions, newTransaction] })),
}));
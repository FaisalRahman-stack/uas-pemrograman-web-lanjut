import { create } from 'zustand';

export const useRentalStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (userData, authToken) => set({ user: userData, token: authToken, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),

    cars: [],
    setCars: (data) => set({ cars: data }),

    transactions: [],
    addTransaction: (newTransaction) => set((state) => ({ transactions: [...state.transactions, newTransaction] })),
}));
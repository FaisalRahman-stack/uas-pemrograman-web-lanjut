import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useRentalStore } from '../store/useRentalStore'; 
import apiClient from '../api/apiClient';
import LoginImage from '../assets/UI-assets/LoginRegisImage.png'; 
import LogoImage from '../assets/UI-assets/LightMode.png'; 

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginStore = useRentalStore((state) => state.login);

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            const userData = data.data || data.user || data;
            const authToken = data.access_token || data.token || null;
            
            if (authToken) {
                localStorage.setItem('access_token', authToken);
                localStorage.setItem('user_data', JSON.stringify(userData));
            }

            if (userData && !userData.role) {
                userData.role = {
                    role_name: userData.role_id === 1 ? 'admin' : 'customer'
                };
            }

            loginStore(userData, authToken);
            alert('Login Berhasil!');

            const userRole = userData?.role?.role_name?.toLowerCase() || '';
            
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        },
        onError: (error) => {
            const pesanError = error.response?.data?.message || 'Username atau password salah, atau Server mati!';
            alert(pesanError);
            console.error("Login Error:", error);
        }
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate({
            email: username.trim(),
            password: password.trim()
        });
    };

    const isLoading = loginMutation.isPending;

    return (
        <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
            <div className="hidden md:flex flex-1 relative bg-gray-100">
                <img 
                    src={LoginImage} 
                    alt="Rentix Prive Mobil Premium" 
                    className="absolute inset-0 w-full h-full object-cover" 
                />
            </div>

            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md flex flex-col items-center py-10">
                    
                    <div className="mb-6">
                        <img 
                            src={LogoImage} 
                            alt="Rentix Prive Logo" 
                            className="h-20 object-contain" 
                        />
                    </div>

                    <h1 className="text-3xl font-light mb-4 text-center">Akses Akun Rentix Privé</h1>
                    
                    <p className="text-xs text-center text-gray-800 mb-10 leading-relaxed px-4">
                        Dengan melanjutkan, termasuk melalui mitra platform kami, Anda menyetujui Perjanjian Pengguna kami dan mengakui Kebijakan Privasi kami.
                    </p>

                    <form onSubmit={handleLoginSubmit} className="w-full space-y-5">
                        <div>
                            <label className="block text-sm mb-1 text-gray-900">Alamat Email</label>
                            <input 
                                type="email" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                                className="w-full border border-black p-3 outline-none focus:ring-1 focus:ring-black transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-gray-900">Kata Sandi</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="w-full border border-black p-3 outline-none focus:ring-1 focus:ring-black transition-shadow"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full mt-4 py-4 uppercase tracking-widest text-sm transition-colors ${
                                isLoading 
                                ? 'bg-gray-400 text-gray-200 cursor-wait' 
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            {isLoading ? 'Memproses...' : 'MASUK'}
                        </button>
                    </form>

                    <div className="w-full mt-4 text-left">
                        <p className="text-sm text-gray-900">
                            Tidak punya akun? <a href="/register" className="cursor-pointer hover:underline font-bold">Daftar disini</a>
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;
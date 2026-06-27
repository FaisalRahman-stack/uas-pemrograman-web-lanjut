import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import LoginImage from '../assets/UI-assets/LoginRegisImage.png';
import LogoImage from '../assets/UI-assets/LightMode.png';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        },
        onSuccess: () => {
            alert('Registrasi Berhasil! Silakan masuk dengan akun baru Anda.');
            navigate('/login');
        },
        onError: (error) => {
            const pesanError = error.response?.data?.message || 'Terjadi kesalahan saat registrasi, pastikan email belum terdaftar!';
            alert(pesanError);
            console.error("Register Error:", error);
        }
    });

    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
            return;
        }

        registerMutation.mutate({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            password_confirmation: confirmPassword.trim()
        });
    };

    const isLoading = registerMutation.isPending;

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
                    <div className="mb-2">
                        <img 
                            src={LogoImage} 
                            alt="Rentix Prive Logo" 
                            className="h-28 object-contain" 
                        />
                    </div>

                    <h1 className="text-3xl font-light mb-4 text-center">Buat akun Rentix Privé</h1>
                    
                    <p className="text-xs text-center text-gray-800 mb-10 leading-relaxed px-4">
                        Mulailah perjalanan mobilitas premium Anda bersama kami. Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami.
                    </p>

                    <form onSubmit={handleRegisterSubmit} className="w-full space-y-5">
                        <div>
                            <label className="block text-sm mb-1 text-gray-900">Nama Lengkap</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full border border-black p-3 outline-none focus:ring-1 focus:ring-black transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-gray-900">Alamat Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
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
                                minLength="8"
                                className="w-full border border-black p-3 outline-none focus:ring-1 focus:ring-black transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-gray-900">Konfirmasi Kata Sandi</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                minLength="8"
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
                            {isLoading ? 'Memproses...' : 'DAFTAR'}
                        </button>
                    </form>

                    <div className="w-full mt-4 text-left">
                        <p className="text-sm text-gray-900">
                            Sudah memiliki akun? <a href="/login" className="cursor-pointer hover:underline font-bold">Masuk disini</a>
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Register;
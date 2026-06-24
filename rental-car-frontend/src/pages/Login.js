import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useRentalStore } from '../store/useRentalStore'; 
import apiClient from '../api/apiClient';

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
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>Masuk ke Sistem</h2>
                <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Silakan masukkan akun rental Anda</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Email:</label>
                    <input 
                        type="email" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        placeholder="faisal@gmail.com atau admin@gmail.com"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: isLoading ? '#6c757d' : '#007bff', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: isLoading ? 'wait' : 'pointer', 
                        fontWeight: 'bold', 
                        fontSize: '16px' 
                    }}
                >
                    {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
                </button>
            </form>
        </div>
    );
}

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore'; 
import apiClient from '../api/apiClient';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState('user'); // 'user' atau 'admin'

    const loginStore = useRentalStore((state) => state.login);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await apiClient.post('/auth/login', {
                email: username.trim(),
                password: password.trim()
            });
            const userData = response.data.data || response.data.user || response.data;
            const authToken = response.data.access_token || response.data.token || null;
            loginStore(userData, authToken);
            alert('Login Berhasil!');

            // Tentukan rute berdasarkan login type dan role dari response
            const userRole = userData?.role?.role_name?.toLowerCase() || '';
            
            if (loginType === 'admin' && userRole === 'admin') {
                navigate('/admin/dashboard');
            } else if (loginType === 'user' && userRole === 'customer') {
                navigate('/dashboard');
            } else if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            const pesanError = error.response?.data?.message || 'Username atau password salah, atau Server mati!';
            alert(pesanError);
            console.error("Login Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>Masuk ke Sistem</h2>
                <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Silakan masukkan akun rental Anda</p>
            </div>

            {/* Login Type Selector */}
            <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: '#333', fontWeight: 'bold' }}>Login Sebagai:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}>
                        <input 
                            type="radio" 
                            name="loginType" 
                            value="user" 
                            checked={loginType === 'user'} 
                            onChange={(e) => setLoginType(e.target.value)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px' }}>Pengguna</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}>
                        <input 
                            type="radio" 
                            name="loginType" 
                            value="admin" 
                            checked={loginType === 'admin'} 
                            onChange={(e) => setLoginType(e.target.value)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px' }}>Admin</span>
                    </label>
                </div>
            </div>

            <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Email:</label>
                    <input 
                        type="email" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        placeholder="Contoh: faisal@gmail.com"
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
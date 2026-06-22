import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore'; 
import apiClient from '../api/apiClient';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loginStore = useRentalStore((state) => state.login);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await apiClient.post('/auth/login', {
                email: username.trim(),
                password: password
            });
            const { user, token } = response.data;
            loginStore(user, token); 
            alert('Login Berhasil!');
            navigate('/dashboard');

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

            <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore'; 

function Navbar() {
    const navigate = useNavigate();
    const logout = useRentalStore((state) => state.logout);
    const user = useRentalStore((state) => state.user);
    const isAdmin = user?.role?.role_name?.toLowerCase() === 'admin';

    const handleLogoutClick = () => {
        logout();
        alert('Anda telah keluar dari sistem.');
        navigate('/');
    };

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#1a1a1a', 
            padding: '15px 30px', 
            color: '#fff',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                RentalCar <span style={{ color: '#007bff' }}>App</span>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {isAdmin && (
                    <span 
                        onClick={() => navigate('/admin')} 
                        style={{ cursor: 'pointer', fontSize: '14px' }}
                    >
                        Admin
                    </span>
                )}
                <span 
                    onClick={() => navigate('/dashboard')} 
                    style={{ cursor: 'pointer', fontSize: '14px' }}
                >
                    Katalog
                </span>
                <button 
                    onClick={handleLogoutClick}
                    style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#dc3545', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Keluar
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
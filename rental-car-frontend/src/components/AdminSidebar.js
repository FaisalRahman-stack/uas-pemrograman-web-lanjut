import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore';

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useRentalStore((state) => state.logout);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        alert('Anda telah keluar dari sistem.');
        navigate('/');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/mobil', label: 'Kelola Mobil' },
        { path: '/admin/transaksi', label: 'Kelola Transaksi' }
    ];

    return (
        <div style={{
            width: '250px',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            padding: '20px',
            minHeight: '100vh',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}>
            {/* Logo/Title */}
            <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #333' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                    RentalCar <span style={{ color: '#007bff' }}>Admin</span>
                </h2>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>Management Panel</p>
            </div>

            {/* Navigation Items */}
            <nav style={{ marginBottom: '30px' }}>
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            width: '100%',
                            padding: '12px 15px',
                            marginBottom: '8px',
                            backgroundColor: isActive(item.path) ? '#007bff' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: isActive(item.path) ? '600' : '500',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive(item.path)) {
                                e.target.style.backgroundColor = '#333';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive(item.path)) {
                                e.target.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #333' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '12px 15px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#c82333')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc3545')}
                >
                    Keluar
                </button>
            </div>
        </div>
    );
}

export default AdminSidebar;

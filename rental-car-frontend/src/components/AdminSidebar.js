import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/mobil', label: 'Kelola Mobil' },
        { path: '/admin/transaksi', label: 'Kelola Transaksi' }
    ];

    return (
        <div className="w-64 bg-[#f4f4f4] p-8 hidden md:flex flex-col border-r border-gray-200">
            <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full text-left px-6 py-3 rounded-full text-sm font-bold transition-all ${
                            isActive(item.path) 
                            ? 'bg-gray-200 text-black' 
                            : 'text-gray-500 hover:bg-gray-200 hover:text-black'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
export default AdminSidebar;
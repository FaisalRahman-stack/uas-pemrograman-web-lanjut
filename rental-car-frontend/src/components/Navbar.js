import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore'; 
import LogoImage from '../assets/UI-assets/LightMode.png'; 

function Navbar() {
    const navigate = useNavigate();
    const logout = useRentalStore((state) => state.logout);

    const handleLogoutClick = () => {
        logout();
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        alert('Anda telah keluar dari sistem.');
        navigate('/');
    };

    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-black bg-white">
            
            <div className="flex-1"></div>
            
            
            <div 
                className="flex-1 flex justify-center cursor-pointer" 
                onClick={() => navigate('/dashboard')}
            >
                <img 
                    src={LogoImage} 
                    alt="Rentix Prive Logo" 
                    className="h-10 object-contain" 
                />
            </div>
            
            <div className="flex-1 flex justify-end">
                <button 
                    onClick={handleLogoutClick}
                    className="text-gray-700 hover:text-black font-medium transition-colors text-sm uppercase tracking-wider"
                >
                    Keluar
                </button>
            </div>
            
        </nav>
    );
}

export default Navbar;
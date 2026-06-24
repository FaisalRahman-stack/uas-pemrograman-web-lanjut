import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Dashboard from './pages/Dashboard.js';
import RentalForm from './pages/RentalForm.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import KelolaMobil from './pages/admin/KelolaMobil.js';
import KelolaTransaksi from './pages/admin/KelolaTransaksi.js';
import Navbar from './components/Navbar.js';

function App() {
  const loginComponent = React.createElement(Login, null);
  
  const dashboardWithNavbar = React.createElement('div', null, 
    React.createElement(Navbar, null),
    React.createElement(Dashboard, null)
  );

  const rentalFormWithNavbar = React.createElement('div', null, 
    React.createElement(Navbar, null),
    React.createElement(RentalForm, null)
  );

  return React.createElement(Router, null, 
    React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' } }, 
      React.createElement(Routes, null, 
        React.createElement(Route, { path: '/', element: loginComponent }),
        React.createElement(Route, { path: '/dashboard', element: dashboardWithNavbar }),
        React.createElement(Route, { path: '/rental/:id', element: rentalFormWithNavbar }),
        React.createElement(Route, { path: '/admin/dashboard', element: React.createElement(AdminDashboard, null) }),
        React.createElement(Route, { path: '/admin/mobil', element: React.createElement(KelolaMobil, null) }),
        React.createElement(Route, { path: '/admin/transaksi', element: React.createElement(KelolaTransaksi, null) })
      )
    )
  );
}

export default App;
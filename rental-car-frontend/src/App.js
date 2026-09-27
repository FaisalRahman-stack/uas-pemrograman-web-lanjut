import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import RentalForm from './pages/RentalForm.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import KelolaMobil from './pages/admin/KelolaMobil.js';
import KelolaTransaksi from './pages/admin/KelolaTransaksi.js';
import Navbar from './components/Navbar.js';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<div><Navbar /><Dashboard /></div>} />
            <Route path="/rental/:id" element={<div><Navbar /><RentalForm /></div>} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/mobil" element={<KelolaMobil />} />
            <Route path="/admin/transaksi" element={<KelolaTransaksi />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
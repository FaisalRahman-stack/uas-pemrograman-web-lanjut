import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRentalStore } from '../../store/useRentalStore';
import apiClient from '../../api/apiClient';

import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

function AdminDashboard() {
    const navigate = useNavigate();
    const user = useRentalStore((state) => state.user);
    const queryClient = useQueryClient(); 

    const isAdmin = user?.role_id === 1 || user?.role?.role_name?.toLowerCase() === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const { data: vehicles = [], isLoading: loading, isError: error } = useQuery({
        queryKey: ['vehicles_catalog'],
        queryFn: async () => {
            const response = await apiClient.get('/vehicles');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : [];
        },
        enabled: isAdmin,
    });

    const deleteMutation = useMutation({
        mutationFn: async (vehicleId) => {
            const token = localStorage.getItem('access_token');
            return await apiClient.delete(`/vehicles/${vehicleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            alert('Kendaraan berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['vehicles_catalog'] });
        },
        onError: (err) => {
            console.error('Gagal menghapus kendaraan:', err);
            alert('Gagal menghapus kendaraan');
        }
    });

    const handleDelete = (vehicleId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) {
            deleteMutation.mutate(vehicleId);
        }
    };

    const availableCount = vehicles.filter((v) => v.status?.toLowerCase() === 'available').length;
    const rentedCount = vehicles.filter((v) => v.status?.toLowerCase() !== 'available').length;

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            
            <div className="flex flex-1 overflow-hidden">
                
                <AdminSidebar />
                
                
                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    
                    <h1 className="text-3xl font-bold text-black mb-8">Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#f4f4f4] rounded-xl p-6">
                            <h3 className="font-bold text-lg text-black mb-2">Total Armada</h3>
                            <p className="text-5xl font-bold text-black">{vehicles.length}</p>
                        </div>
                        <div className="bg-[#f4f4f4] rounded-xl p-6">
                            <h3 className="font-bold text-lg text-black mb-2">Armada Tersedia</h3>
                            <p className="text-5xl font-bold text-blue-500">{availableCount}</p>
                        </div>
                        <div className="bg-[#f4f4f4] rounded-xl p-6">
                            <h3 className="font-bold text-lg text-black mb-2">Armada Disewa</h3>
                            <p className="text-5xl font-bold text-red-500">{rentedCount}</p>
                        </div>
                    </div>

                    <div className="bg-[#f4f4f4] rounded-xl p-6 md:p-8">
                        
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-black">Daftar Armada</h2>
                            <button
                                onClick={() => navigate('/admin/mobil')}
                                className="bg-white px-6 py-2 rounded-full font-bold text-sm text-black hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                Tambah
                            </button>
                        </div>

                        {loading && <p className="text-gray-500">Memuat data armada...</p>}
                        {error && <p className="text-red-500">Tidak dapat memuat daftar kendaraan.</p>}
                        
                        {!loading && !error && vehicles.length === 0 && (
                            <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                Belum ada kendaraan terdaftar.
                            </div>
                        )}

                        {!loading && !error && vehicles.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Nama</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Tipe</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Plat</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Tarif/Hari</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Status</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((vehicle) => (
                                            <tr key={vehicle.id} className="border-b border-gray-200/50 hover:bg-gray-200/20 transition-colors">
                                                <td className="py-4 text-sm text-gray-900">{vehicle.nama || vehicle.name}</td>
                                                
                                                <td className="py-4 text-sm text-gray-900">
                                                    {vehicle.vehicle_type?.type_name || vehicle.vehicleType?.type_name || vehicle.tipe || '-'}
                                                </td>
                                                
                                                <td className="py-4 text-sm text-gray-900">
                                                    {vehicle.spek?.replace('Plat: ', '') || vehicle.plate_number || '-'}
                                                </td>
                                                
                                                <td className="py-4 text-sm text-gray-900">
                                                    Rp {Number(vehicle.harga || vehicle.price_per_day || 0).toLocaleString('id-ID')}
                                                </td>
                                                
                                                <td className="py-4">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium text-white ${
                                                        vehicle.status?.toLowerCase() === 'available' ? 'bg-[#3b6fff]' : 'bg-[#ef4444]'
                                                    }`}>
                                                        {vehicle.status?.toLowerCase() === 'available' ? 'Tersedia' : 'Disewa'}
                                                    </span>
                                                </td>
                                                
                                                <td className="py-4 text-center space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/mobil?id=${vehicle.id}`)}
                                                        className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-black rounded-full text-xs font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        disabled={deleteMutation.isPending}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                            deleteMutation.isPending && deleteMutation.variables === vehicle.id 
                                                            ? 'bg-gray-300 text-gray-500 cursor-wait' 
                                                            : 'bg-gray-200 hover:bg-gray-300 text-black cursor-pointer'
                                                        }`}
                                                    >
                                                        {deleteMutation.isPending && deleteMutation.variables === vehicle.id ? 'Hapus...' : 'Hapus'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
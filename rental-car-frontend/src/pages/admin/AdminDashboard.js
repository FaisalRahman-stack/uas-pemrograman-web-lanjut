import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRentalStore } from '../../store/useRentalStore';
import apiClient from '../../api/apiClient';
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
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AdminSidebar />
            
            <div style={{ flex: 1, padding: '30px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: '28px' }}>Dashboard Admin</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>Selamat datang, {user?.name || 'Admin'}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '12px', fontWeight: '600' }}>TOTAL ARMADA</p>
                        <h3 style={{ margin: '10px 0 0 0', color: '#1a1a1a', fontSize: '24px' }}>{vehicles.length}</h3>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '12px', fontWeight: '600' }}>TERSEDIA</p>
                        <h3 style={{ margin: '10px 0 0 0', color: '#28a745', fontSize: '24px' }}>{availableCount}</h3>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '12px', fontWeight: '600' }}>DISEWA</p>
                        <h3 style={{ margin: '10px 0 0 0', color: '#ffc107', fontSize: '24px' }}>{rentedCount}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: '18px' }}>Daftar Armada</h2>
                        <button
                            onClick={() => navigate('/admin/mobil')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}
                        >
                            + Tambah Mobil
                        </button>
                    </div>

                    {loading && <p style={{ color: '#666' }}>Memuat data armada...</p>}
                    {error && <p style={{ color: '#dc3545' }}>Tidak dapat memuat daftar kendaraan.</p>}
                    
                    {!loading && !error && vehicles.length === 0 && (
                        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>Belum ada kendaraan terdaftar.</p>
                    )}

                    {!loading && !error && vehicles.length > 0 && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e6e6e6' }}>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Nama</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Tipe</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Plat</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Tarif/Hari</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Status</th>
                                        <th style={{ textAlign: 'center', padding: '12px', color: '#333', fontWeight: '600' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((vehicle) => (
                                        <tr key={vehicle.id} style={{ borderBottom: '1px solid #e6e6e6' }}>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>{vehicle.nama || vehicle.name}</td>
                                            
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>{vehicle.vehicle_type?.type_name || vehicle.vehicleType?.type_name || vehicle.tipe || '-'}</td>
                                            
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>{vehicle.spek?.replace('Plat: ', '') || vehicle.plate_number || '-'}</td>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>Rp {Number(vehicle.harga || vehicle.price_per_day || 0).toLocaleString()}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '4px',
                                                    backgroundColor: vehicle.status?.toLowerCase() === 'available' ? '#d4edda' : '#fff3cd',
                                                    color: vehicle.status?.toLowerCase() === 'available' ? '#155724' : '#856404',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    {vehicle.status || 'Tidak diketahui'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => navigate(`/admin/mobil?id=${vehicle.id}`)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#28a745',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        marginRight: '5px',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    disabled={deleteMutation.isPending}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: deleteMutation.isPending ? '#6c757d' : '#dc3545',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: deleteMutation.isPending ? 'wait' : 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {deleteMutation.isPending && deleteMutation.variables === vehicle.id ? 'Menghapus...' : 'Hapus'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
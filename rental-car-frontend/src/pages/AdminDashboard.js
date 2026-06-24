import React, { useEffect, useState } from 'react';
import { useRentalStore } from '../store/useRentalStore';
import apiClient from '../api/apiClient';

function AdminDashboard() {
    const user = useRentalStore((state) => state.user);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/vehicles');
                const data = response.data.data || response.data;
                setVehicles(Array.isArray(data) ? data : []);
                setError(null);
            } catch (fetchError) {
                console.error('Gagal memuat kendaraan admin:', fetchError);
                setError('Tidak dapat memuat daftar kendaraan.');
                setVehicles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const isAdmin = user?.role?.role_name?.toLowerCase() === 'admin';

    if (!isAdmin) {
        return (
            <div style={{ maxWidth: '900px', margin: '60px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h2 style={{ marginBottom: '10px', color: '#1a1a1a' }}>Akses Ditolak</h2>
                <p style={{ color: '#555' }}>Halaman admin hanya dapat diakses oleh pengguna dengan peran admin.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>Admin Dashboard</h1>
                <p style={{ color: '#666', margin: 0 }}>Kelola armada, lihat detail kendaraan, dan monitor status sewa.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #e6e6e6', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>Admin</h3>
                    <p style={{ marginTop: '10px', color: '#555' }}>Nama: <strong>{user?.name || '-'}</strong></p>
                    <p style={{ margin: '5px 0 0 0', color: '#555' }}>Email: <strong>{user?.email || '-'}</strong></p>
                    <p style={{ margin: '5px 0 0 0', color: '#555' }}>Peran: <strong>{user?.role?.role_name || '-'}</strong></p>
                </div>
                <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #e6e6e6', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>Statistik Kendaraan</h3>
                    <p style={{ marginTop: '10px', color: '#555' }}>Total kendaraan: <strong>{vehicles.length}</strong></p>
                    <p style={{ margin: '5px 0 0 0', color: '#555' }}>Tersedia: <strong>{vehicles.filter((vehicle) => vehicle.status?.toLowerCase() === 'available').length}</strong></p>
                    <p style={{ margin: '5px 0 0 0', color: '#555' }}>Tidak tersedia: <strong>{vehicles.filter((vehicle) => vehicle.status?.toLowerCase() !== 'available').length}</strong></p>
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e6e6e6', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ margin: 0, color: '#1a1a1a' }}>Daftar Kendaraan</h2>
                        <p style={{ margin: '10px 0 0 0', color: '#555' }}>Seluruh kendaraan yang terdaftar di sistem</p>
                    </div>
                </div>

                {loading ? (
                    <p style={{ color: '#666' }}>Memuat daftar kendaraan...</p>
                ) : error ? (
                    <p style={{ color: '#dc3545' }}>{error}</p>
                ) : vehicles.length === 0 ? (
                    <p style={{ color: '#666' }}>Belum ada kendaraan yang terdaftar.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} style={{ borderRadius: '12px', border: '1px solid #e6e6e6', overflow: 'hidden', backgroundColor: '#fafafa' }}>
                                <div style={{ padding: '18px' }}>
                                    <h3 style={{ margin: 0, color: '#1a1a1a' }}>{vehicle.nama || vehicle.name}</h3>
                                    <p style={{ margin: '10px 0 6px 0', color: '#555' }}>Tipe: <strong>{vehicle.tipe || vehicle.vehicleType?.type_name || '-'}</strong></p>
                                    <p style={{ margin: '6px 0', color: '#555' }}>Plat: <strong>{vehicle.spek || vehicle.plate_number || '-'}</strong></p>
                                    <p style={{ margin: '6px 0', color: '#555' }}>Harga/hari: <strong>Rp {Number(vehicle.harga || vehicle.price_per_day || 0).toLocaleString()}</strong></p>
                                    <p style={{ margin: '6px 0 0 0', color: vehicle.status?.toLowerCase() === 'available' ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>{vehicle.status || vehicle.status_raw || 'Tidak diketahui'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;

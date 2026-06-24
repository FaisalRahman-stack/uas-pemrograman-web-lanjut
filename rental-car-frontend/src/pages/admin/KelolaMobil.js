import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRentalStore } from '../../store/useRentalStore';
import apiClient from '../../api/apiClient';
import AdminSidebar from '../../components/AdminSidebar';

function KelolaMobil() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user = useRentalStore((state) => state.user);
    const vehicleId = searchParams.get('id');
    const queryClient = useQueryClient();

    const isAdmin = user?.role_id === 1 || user?.role?.role_name?.toLowerCase() === 'admin';

    const [formData, setFormData] = useState({
        nama: '',
        tipe: '',
        merek: '',
        nomorPlat: '',
        tarifPerHari: '',
        status: 'available'
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const { isLoading: loadingFetch, isError: errorFetch } = useQuery({
        queryKey: ['vehicle_detail', vehicleId],
        queryFn: async () => {
            const response = await apiClient.get(`/vehicles/${vehicleId}`);
            const vehicle = response.data.data || response.data;
            return vehicle;
        },
        enabled: !!vehicleId && isAdmin,
        onSuccess: (vehicle) => {
             setFormData({
                nama: vehicle.nama || vehicle.name || '',
                tipe: vehicle.tipe || vehicle.vehicle_type?.type_name || '',
                merek: vehicle.merek || '',
                nomorPlat: vehicle.plate_number || '',
                tarifPerHari: vehicle.harga || vehicle.price_per_day || '',
                status: vehicle.status?.toLowerCase() === 'available' ? 'available' : 'disewa'
            });
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            const token = localStorage.getItem('access_token');
            const apiOptions = { headers: { Authorization: `Bearer ${token}` } };
            
            if (vehicleId) {
                return await apiClient.put(`/vehicles/${vehicleId}`, payload, apiOptions);
            } else {
                return await apiClient.post('/vehicles', payload, apiOptions);
            }
        },
        onSuccess: () => {
            alert(vehicleId ? 'Kendaraan berhasil diperbarui!' : 'Kendaraan berhasil ditambahkan!');
            queryClient.invalidateQueries({ queryKey: ['vehicles_catalog'] });
            navigate('/admin/dashboard');
        },
        onError: (err) => {
            console.error('Gagal menyimpan data kendaraan:', err);
            alert(err.response?.data?.message || 'Gagal menyimpan data kendaraan.');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        let mappedTypeId = 1; 
        if (formData.tipe === 'Sedan') mappedTypeId = 2;
        if (formData.tipe === 'MPV') mappedTypeId = 3;
        if (formData.tipe === 'Hatchback') mappedTypeId = 4;

        const payload = {
            vehicle_type_id: mappedTypeId,
            name: formData.nama,
            plate_number: formData.nomorPlat,
            price_per_day: parseInt(formData.tarifPerHari) || 0,
            status: formData.status === 'available' ? 'available' : 'rented'
        };

        saveMutation.mutate(payload);
    };

    if (!isAdmin) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AdminSidebar />
            <div style={{ flex: 1, padding: '30px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px', fontSize: '14px' }}
                    >
                        ← Kembali
                    </button>
                    <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: '28px' }}>
                        {vehicleId ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                    </h1>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6', maxWidth: '600px' }}>
                    
                    {loadingFetch && <p style={{ color: '#666', marginBottom: '15px' }}>Memuat data kendaraan...</p>}
                    {errorFetch && <p style={{ color: '#dc3545', marginBottom: '15px' }}>Gagal memuat data. Server mungkin bermasalah.</p>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '600' }}>Nama Mobil:</label>
                            <input type="text" name="nama" value={formData.nama} onChange={handleChange} required placeholder="Contoh: Toyota Avanza" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '600' }}>Merek/Merk:</label>
                            <input type="text" name="merek" value={formData.merek} onChange={handleChange} placeholder="Contoh: Toyota" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '600' }}>Tipe Kendaraan:</label>
                            <select name="tipe" value={formData.tipe} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                                <option value="">-- Pilih Tipe --</option>
                                <option value="SUV">SUV</option>
                                <option value="Sedan">Sedan</option>
                                <option value="MPV">MPV</option>
                                <option value="Hatchback">Hatchback</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '600' }}>Nomor Plat:</label>
                            <input type="text" name="nomorPlat" value={formData.nomorPlat} onChange={handleChange} required placeholder="Contoh: B 1234 ABC" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '600' }}>Tarif Per Hari (Rp):</label>
                            <input type="number" name="tarifPerHari" value={formData.tarifPerHari} onChange={handleChange} required min="0" placeholder="Contoh: 350000" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '600' }}>Status:</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                                <option value="available">Tersedia</option>
                                <option value="disewa">Disewa</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="submit"
                                disabled={saveMutation.isPending || loadingFetch}
                                style={{ flex: 1, padding: '12px', backgroundColor: saveMutation.isPending ? '#6c757d' : '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: saveMutation.isPending ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                            >
                                {saveMutation.isPending ? 'Menyimpan...' : vehicleId ? 'Update Kendaraan' : 'Tambah Kendaraan'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default KelolaMobil;
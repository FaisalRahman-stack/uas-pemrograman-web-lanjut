import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRentalStore } from '../../store/useRentalStore';
import apiClient from '../../api/apiClient';

import Navbar from '../../components/Navbar';
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
        status: 'available',
        fotoMobil: null,
        kapasitas: '',
        transmisi: '',
        bahanBakar: ''
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    // Fetch vehicle data
    const { isLoading: loadingFetch, isError: errorFetch } = useQuery({
        queryKey: ['vehicle_detail', vehicleId],
        queryFn: async () => {
            const response = await apiClient.get(`/vehicles/${vehicleId}`);
            const vehicle = response.data.data || response.data;
            return vehicle;
        },
        enabled: !!vehicleId && isAdmin,
    });

    // Sync vehicle data to form using useEffect (TanStack Query v5 compatible)
    useEffect(() => {
        // This will be triggered when query data changes
        const queryData = queryClient.getQueryData(['vehicle_detail', vehicleId]);
        if (queryData) {
            const vehicle = queryData;
            setFormData({
                nama: vehicle.nama || vehicle.name || '',
                tipe: vehicle.tipe || vehicle.vehicle_type?.type_name || '',
                merek: vehicle.merek || '',
                nomorPlat: vehicle.plate_number || '',
                tarifPerHari: vehicle.harga || vehicle.price_per_day || '',
                status: vehicle.status?.toLowerCase() === 'available' ? 'available' : 'disewa',
                kapasitas: vehicle.kapasitas || '',
                transmisi: vehicle.transmisi || '',
                bahanBakar: vehicle.bahan_bakar || ''
            });
        }
    }, [vehicleId, queryClient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi tipe file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Format file tidak didukung. Gunakan .jpg, .jpeg, atau .png');
                e.target.value = '';
                return;
            }
            // Validasi ukuran file (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 2MB');
                e.target.value = '';
                return;
            }
            setFormData((prev) => ({ ...prev, fotoMobil: file }));
        }
    };

    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            console.log('VehicleId:', vehicleId);
            console.log('Payload data:', payload);
            
            if (vehicleId) {
                // Use POST for update (backend route accepts POST for both create and update)
                return await apiClient.post(`/vehicles/${vehicleId}`, payload);
            } else {
                return await apiClient.post('/vehicles', payload);
            }
        },
        onSuccess: () => {
            alert(vehicleId ? 'Kendaraan berhasil diperbarui!' : 'Kendaraan berhasil ditambahkan!');
            queryClient.invalidateQueries({ queryKey: ['vehicles_catalog'] });
            navigate('/admin/dashboard');
        },
        onError: (err) => {
            console.error('Gagal menyimpan data kendaraan:', err);
            console.log('Error response:', err.response?.data);
            alert(err.response?.data?.message || 'Gagal menyimpan data kendaraan.');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Map vehicle type to ID based on database seeder
        // SUV=1, Sedan=2, MPV=3, Hatchback=4
        let mappedTypeId = 1; // Default SUV
        if (formData.tipe === 'Sedan') mappedTypeId = 2;
        else if (formData.tipe === 'MPV') mappedTypeId = 3;
        else if (formData.tipe === 'Hatchback') mappedTypeId = 4;
        else if (formData.tipe === 'SUV') mappedTypeId = 1;

        // Use FormData for multipart/form-data submission
        const formDataPayload = new FormData();
        formDataPayload.append('vehicle_type_id', mappedTypeId);
        formDataPayload.append('name', formData.nama);
        formDataPayload.append('plate_number', formData.nomorPlat);
        formDataPayload.append('price_per_day', parseInt(formData.tarifPerHari) || 0);
        formDataPayload.append('status', formData.status === 'available' ? 'available' : 'rented');
        formDataPayload.append('kapasitas', formData.kapasitas);
        formDataPayload.append('transmisi', formData.transmisi);
        formDataPayload.append('bahan_bakar', formData.bahanBakar);
        
        if (formData.fotoMobil) {
            formDataPayload.append('foto_mobil', formData.fotoMobil);
        }

        saveMutation.mutate(formDataPayload);
    };

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            
            <div className="flex flex-1 overflow-hidden">
                
                <AdminSidebar />
                
                
                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    
                    <h1 className="text-3xl font-bold text-black mb-8">
                        {vehicleId ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                    </h1>

                    <div className="bg-[#f4f4f4] rounded-xl p-8 md:p-10 max-w-5xl">
                        
                        {loadingFetch && <p className="text-gray-500 mb-6">Memuat data kendaraan...</p>}
                        {errorFetch && <p className="text-red-500 mb-6">Gagal memuat data. Server mungkin bermasalah.</p>}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                            
                            
                            <div>
                                <h2 className="text-2xl font-bold text-black mb-6">Informasi Mobil</h2>
                                
                                <div className="space-y-5">
                                    <div>
                                        <label className="block font-bold text-black mb-2">Nama Mobil:</label>
                                        <input 
                                            type="text" 
                                            name="nama" 
                                            value={formData.nama} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Contoh: Toyota Avanza" 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Merek:</label>
                                        <input 
                                            type="text" 
                                            name="merek" 
                                            value={formData.merek} 
                                            onChange={handleChange} 
                                            placeholder="Contoh: Toyota" 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Tipe Kendaraan:</label>
                                        <select 
                                            name="tipe" 
                                            value={formData.tipe} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors text-gray-700"
                                        >
                                            <option value="">– Pilih Tipe –</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="MPV">MPV</option>
                                            <option value="Hatchback">Hatchback</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Nomor Plat:</label>
                                        <input 
                                            type="text" 
                                            name="nomorPlat" 
                                            value={formData.nomorPlat} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Contoh: B 1234 ABC" 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Kapasitas (Penumpang):</label>
                                        <input 
                                            type="text" 
                                            name="kapasitas" 
                                            value={formData.kapasitas} 
                                            onChange={handleChange} 
                                            placeholder="Contoh: 7 Penumpang" 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Transmisi:</label>
                                        <select 
                                            name="transmisi" 
                                            value={formData.transmisi} 
                                            onChange={handleChange} 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors text-gray-700"
                                        >
                                            <option value="">– Pilih Transmisi –</option>
                                            <option value="Otomatis">Otomatis</option>
                                            <option value="Manual">Manual</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Bahan Bakar:</label>
                                        <select 
                                            name="bahanBakar" 
                                            value={formData.bahanBakar} 
                                            onChange={handleChange} 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors text-gray-700"
                                        >
                                            <option value="">– Pilih Bahan Bakar –</option>
                                            <option value="Bensin">Bensin</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="Listrik">Listrik</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Unggah Foto Mobil:</label>
                                        <input 
                                            type="file" 
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors"
                                        />
                                        {formData.fotoMobil && (
                                            <p className="text-sm text-green-600 mt-1">File dipilih: {formData.fotoMobil.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            
                            <div className="md:border-l md:border-black md:pl-16 flex flex-col">
                                <h2 className="text-2xl font-bold text-black mb-6">Formulir Penyewaan</h2>
                                
                                <div className="space-y-5 flex-1">
                                    <div>
                                        <label className="block font-bold text-black mb-2">Tarif Per Hari (Rp):</label>
                                        <input 
                                            type="number" 
                                            name="tarifPerHari" 
                                            value={formData.tarifPerHari} 
                                            onChange={handleChange} 
                                            required 
                                            min="0" 
                                            placeholder="Contoh: 350000" 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-black mb-2">Status:</label>
                                        <select 
                                            name="status" 
                                            value={formData.status} 
                                            onChange={handleChange} 
                                            className="w-full border border-gray-300 p-2.5 bg-white outline-none focus:border-black transition-colors text-gray-700"
                                        >
                                            <option value="available">Tersedia</option>
                                            <option value="disewa">Disewa</option>
                                        </select>
                                    </div>
                                </div>

                                
                                <div className="flex gap-4 mt-8 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saveMutation.isPending || loadingFetch}
                                        className={`flex-1 py-2.5 border border-gray-300 transition-colors ${
                                            saveMutation.isPending || loadingFetch
                                            ? 'bg-gray-100 text-gray-400 cursor-wait'
                                            : 'bg-white text-black hover:bg-gray-50'
                                        }`}
                                    >
                                        {saveMutation.isPending ? 'Menyimpan...' : vehicleId ? 'Simpan' : 'Tambah'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => navigate('/admin/dashboard')}
                                        className="flex-1 py-2.5 bg-white text-black border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default KelolaMobil;
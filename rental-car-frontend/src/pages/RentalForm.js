import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRentalStore } from '../store/useRentalStore';
import apiClient from '../api/apiClient';
import { dummyCars, getCarImage } from '../data/dummyCars';
import Navbar from '../components/Navbar';

const uploadBase = import.meta.env.VITE_UPLOAD_BASE || 'http://127.0.0.1:8000';

const getDeskripsiFungsional = (nama = '', tipe = '') => {
    const lowerNama = nama.toLowerCase();
    const lowerTipe = tipe.toLowerCase();

    if (lowerNama.includes('avanza') || lowerNama.includes('xpander') || lowerTipe === 'suv' || lowerTipe === 'mpv') {
        return "Kendaraan keluarga yang tangguh, kabin luas, cocok untuk perjalanan jauh maupun perkotaan.";
    }
    if (lowerNama.includes('civic') || lowerTipe === 'sedan') {
        return "Sedan sport premium dengan performa tinggi, kendali lincah, cocok untuk perjalanan dinas atau gaya hidup.";
    }
    if (lowerNama.includes('brio') || lowerTipe === 'hatchback') {
        return "Mobil lincah dan irit, ideal untuk mobilitas tinggi di dalam kota dan perjalanan singkat.";
    }
    return "Kendaraan serbaguna yang nyaman untuk berbagai jenis perjalanan, dilengkapi fitur modern.";
};

const getSpesifikasiLengkap = (nama = '', plat = '-') => {
    const lowerNama = nama.toLowerCase();
    let details = `Plat: ${plat}`;

    if (lowerNama.includes('avanza') || lowerNama.includes('xpander') || lowerNama.includes('fortuner') || lowerNama.includes('pajero') || lowerNama.includes('sigra') || lowerNama.includes('zenix') || lowerNama.includes('ertiga')) {
        details += " | Kapasitas: 7 Penumpang | Transmisi: Otomatis | Bahan Bakar: Bensin";
    } else if (lowerNama.includes('civic') || lowerNama.includes('raize') || lowerNama.includes('brio')) {
        details += " | Kapasitas: 5 Penumpang | Transmisi: Otomatis | Bahan Bakar: Bensin (Irit)";
    } else {
        details += " | Kapasitas: 5 Penumpang | Transmisi: Otomatis/Manual | Bahan Bakar: Bensin";
    }
    return details;
};

function RentalForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const cars = useRentalStore((state) => state.cars);
    const user = useRentalStore((state) => state.user);
    const addTransaction = useRentalStore((state) => state.addTransaction);
    
    const [tanggalMulai, setTanggalMulai] = useState('');
    const [tanggalSelesai, setTanggalSelesai] = useState('');
    const [durasi, setDurasi] = useState(0);
    const [buktiPembayaran, setBuktiPembayaran] = useState(null);
    const [rentalId, setRentalId] = useState(null);

    const { data: detailCar, isLoading: loadingCar } = useQuery({
        queryKey: ['vehicle_detail', id],
        queryFn: async () => {
            const existingCar = cars.find((car) => car.id.toString() === id);
            if (existingCar) return existingCar;

            const response = await apiClient.get(`/vehicles/${id}`);
            const apiData = response.data.data || response.data;
            const namaMobil = apiData.nama || apiData.name || 'Tidak Diketahui';
            const tipeMobil = apiData.tipe || apiData.vehicleType?.type_name || 'Unknown';
            const platNomor = apiData.plate_number || '-';

            // Prioritize uploaded image from database (foto_mobil)
            const uploadedImage = apiData.foto_mobil ? `${uploadBase}/uploads/foto-mobil/${apiData.foto_mobil}` : null;
            
            return {
                id: apiData.id,
                nama: namaMobil,
                tipe: tipeMobil,
                harga: apiData.harga || apiData.price_per_day || 350000,
                status: apiData.status && apiData.status.toString().toLowerCase() === 'available' ? 'Tersedia' : apiData.status || 'Tidak Tersedia',
                gambar: uploadedImage || getCarImage(namaMobil) || apiData.gambar || dummyCars[0]?.gambar,
                spek: getSpesifikasiLengkap(namaMobil, platNomor),
                Deskripsi: getDeskripsiFungsional(namaMobil, tipeMobil),
            };
        },
        staleTime: 1000 * 60 * 5,
    });

    const baseCar = detailCar || dummyCars.find((car) => car.id.toString() === id) || {
        nama: 'Sedang Memuat...', tipe: 'Unknown', harga: 0, status: 'Memuat...', gambar: dummyCars[0]?.gambar, spek: 'Plat: -', Deskripsi: 'Memuat detail...'
    };

    const getPlateFromSpek = (spek = '') => {
        if (spek.startsWith('Plat: ')) return spek.substring(6).trim();
        return spek;
    };

    const finalSelectedCar = {
        ...baseCar,
        gambar: baseCar.gambar || getCarImage(baseCar.nama) || dummyCars[0]?.gambar,
        spek: getSpesifikasiLengkap(baseCar.nama, getPlateFromSpek(baseCar.spek)),
        Deskripsi: getDeskripsiFungsional(baseCar.nama, baseCar.tipe),
    };

    const hargaPerHari = finalSelectedCar.harga || 350000;
    const totalBiaya = durasi * hargaPerHari;
    
    const hitungTotalBiaya = (mulai, selesai) => {
        if (mulai && selesai) {
            const tgl1 = new Date(mulai);
            const tgl2 = new Date(selesai);
            const selisihHari = Math.ceil((tgl2.getTime() - tgl1.getTime()) / (1000 * 3600 * 24));
            setDurasi(selisihHari > 0 ? selisihHari : 0);
        }
    };

    const rentMutation = useMutation({
        mutationFn: async (payload) => {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            return await apiClient.post('/rentals', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: (data) => {
            // Ambil data rental yang baru dibuat dari response API
            const newRental = data.data.data; 
            const namaPenyewa = user ? user.name || user.username : 'Pelanggan';
            
            addTransaction({
                idTransaksi: newRental.id, // Gunakan ID dari database
                mobilId: id,
                penyewa: namaPenyewa,
                tanggalMulai,
                tanggalSelesai,
                durasi,
                totalBiaya,
                status: newRental.status
            });

            setRentalId(newRental.id);
            alert(`Pesanan Sewa Berhasil Dibuat!\nID Pesanan: ${newRental.id}\nTotal Bayar: Rp ${totalBiaya.toLocaleString('id-ID')}\n\nSilakan lanjutkan ke pembayaran dan unggah bukti transfer.`);

            queryClient.invalidateQueries({ queryKey: ['vehicles_catalog'] });
            queryClient.invalidateQueries({ queryKey: ['rentals'] });
        },
        onError: (error) => {
            console.error("Gagal menyimpan transaksi ke database:", error);
            alert(error.response?.data?.message || 'Gagal terhubung ke server. Pastikan Anda sudah login akun dengan benar!');
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (formData) => {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            return await apiClient.post(`/rentals/${rentalId}/upload-proof`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            alert('Bukti pembayaran berhasil diupload!');
            setBuktiPembayaran(null);
            queryClient.invalidateQueries({ queryKey: ['rentals'] });
        },
        onError: (error) => {
            console.error("Gagal upload bukti pembayaran:", error);
            alert(error.response?.data?.message || 'Gagal upload bukti pembayaran');
        }
    });

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
            setBuktiPembayaran(file);
        }
    };

    const handleUploadBukti = (e) => {
        e.preventDefault();
        if (!buktiPembayaran) {
            alert('Pilih file bukti pembayaran terlebih dahulu');
            return;
        }

        const formData = new FormData();
        formData.append('bukti_pembayaran', buktiPembayaran);

        uploadMutation.mutate(formData);
    };

    const handleSubmitTransaksi = (e) => {
        e.preventDefault();
        if (durasi <= 0) {
            alert('Tanggal selesai harus setelah tanggal mulai sewa!');
            return;
        }

        const payload = {
            user_id: user?.id || 1,
            vehicle_id: id,
            start_date: tanggalMulai,
            end_date: tanggalSelesai,
            total_price: totalBiaya
        };

        rentMutation.mutate(payload);
    };

    if (loadingCar) {
        return (
            <div className="min-h-screen bg-white font-sans flex flex-col">
                <main className="flex-grow w-full pb-16">
                    <div className="max-w-5xl mx-auto px-6 pt-12 text-center">
                        <div className="mx-auto mb-4 h-12 w-2/3 rounded-xl bg-gray-200 animate-pulse" />
                        <div className="mx-auto mb-10 h-8 w-1/3 rounded-xl bg-gray-200 animate-pulse" />
                        <div className="flex justify-center mb-12">
                            <div className="w-full max-w-2xl h-64 rounded-3xl bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <div className="h-6 w-3/4 rounded-xl bg-gray-200 animate-pulse" />
                            <div className="h-40 rounded-3xl bg-gray-200 animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-6 w-1/2 rounded-xl bg-gray-200 animate-pulse" />
                            <div className="h-12 rounded-3xl bg-gray-200 animate-pulse" />
                            <div className="h-12 rounded-3xl bg-gray-200 animate-pulse" />
                            <div className="h-12 rounded-3xl bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const fallbackCarImage = getCarImage(finalSelectedCar.nama) || dummyCars[0]?.gambar || 'https://via.placeholder.com/600x400?text=Mobil';
    const imageSource = finalSelectedCar.gambar || fallbackCarImage;

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <main className="flex-grow w-full pb-16">
                
                <div className="max-w-5xl mx-auto px-6 pt-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
                        {finalSelectedCar.nama}
                    </h1>
                    <p className="text-xl text-gray-800 tracking-widest uppercase mb-10">
                        {finalSelectedCar.tipe}
                    </p>
                    <div className="flex justify-center mb-12">
                        <img 
                            src={imageSource} 
                            alt={finalSelectedCar.nama} 
                            className="w-full max-w-2xl h-auto object-contain mix-blend-multiply" 
                            loading="lazy"
                            onError={(e) => {
                                if (e.target.src !== fallbackCarImage) {
                                    e.target.onerror = null;
                                    e.target.src = fallbackCarImage;
                                }
                            }}
                        />
                    </div>
                </div>

                
                <div className="max-w-6xl mx-auto px-6 mb-12">
                    <hr className="border-t border-black" />
                </div>

                
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
                    
                    
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Informasi Mobil</h2>
                        <p className="text-gray-800 leading-relaxed mb-6">
                            {finalSelectedCar.Deskripsi}
                        </p>
                        
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-1">Status:</h3>
                            <p className="text-gray-800">{finalSelectedCar.status}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-1">Spesifikasi:</h3>
                            <p className="text-gray-800 leading-relaxed">{finalSelectedCar.spek}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Tarif Sewa:</h3>
                            <p className="text-gray-800">Rp {hargaPerHari.toLocaleString('id-ID')} / hari</p>
                        </div>
                    </div>

                    
                    <div className="md:border-l md:border-black md:pl-16">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Formulir Penyewaan Kendaraan</h2>
                        
                        <div className="text-gray-800 mb-6 space-y-1">
                            <p>ID Mobil yang dipilih: {id}</p>
                            <p>Nama Penyewa: {user ? (user.name || user.username) : 'Pelanggan'}</p>
                            <p>Tarif Sewa: Rp {hargaPerHari.toLocaleString('id-ID')} / hari</p>
                        </div>

                        <form onSubmit={handleSubmitTransaksi} className="space-y-4">
                            <div>
                                <label className="block text-gray-900 mb-1">Mulai Sewa:</label>
                                <input 
                                    type="date" 
                                    value={tanggalMulai} 
                                    onChange={(e) => { setTanggalMulai(e.target.value); hitungTotalBiaya(e.target.value, tanggalSelesai); }}
                                    className="w-full border border-black p-3"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-900 mb-1">Selesai Sewa:</label>
                                <input 
                                    type="date" 
                                    value={tanggalSelesai} 
                                    onChange={(e) => { setTanggalSelesai(e.target.value); hitungTotalBiaya(tanggalMulai, e.target.value); }}
                                    className="w-full border border-black p-3"
                                />
                            </div>
                            <div className="border-t border-black pt-4 mt-4">
                                <p className="text-gray-900">Total Durasi: <span className="font-bold">{durasi} Hari</span></p>
                                <p className="text-gray-900 text-xl">Total Biaya: <span className="font-bold">Rp {totalBiaya.toLocaleString('id-ID')}</span></p>
                            </div>
                            <button type="submit" disabled={rentMutation.isPending || finalSelectedCar.status !== 'Tersedia'} className="w-full bg-black text-white py-4 uppercase tracking-widest font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                                {rentMutation.isPending ? 'Memproses...' : (finalSelectedCar.status !== 'Tersedia' ? 'Mobil Tidak Tersedia' : 'Konfirmasi Sewa')}
                            </button>
                        </form>

                        {rentalId && (
                            <div className="mt-8 pt-8 border-t border-gray-300">
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Upload Bukti Pembayaran</h3>
                                <p className="text-sm text-gray-700 mb-4">Setelah melakukan transfer, upload bukti pembayaran Anda di sini.</p>
                                
                                <form onSubmit={handleUploadBukti} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-900 mb-2 font-bold">Pilih File (JPG, JPEG, PNG - Max 2MB):</label>
                                        <input 
                                            type="file" 
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            className="w-full border border-black p-2 bg-white"
                                        />
                                        {buktiPembayaran && (
                                            <p className="text-sm text-green-600 mt-1">File dipilih: {buktiPembayaran.name}</p>
                                        )}
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={uploadMutation.isPending || !buktiPembayaran}
                                        className={`w-full py-3 uppercase tracking-widest font-bold transition-colors ${
                                            uploadMutation.isPending || !buktiPembayaran
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {uploadMutation.isPending ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RentalForm;
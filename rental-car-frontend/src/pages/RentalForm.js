import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRentalStore } from '../store/useRentalStore';
import apiClient from '../api/apiClient';
import { dummyCars, getCarImage } from '../data/dummyCars';
import Navbar from '../components/Navbar';

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

            return {
                id: apiData.id,
                nama: namaMobil,
                tipe: tipeMobil,
                harga: apiData.harga || apiData.price_per_day || 350000,
                status: apiData.status && apiData.status.toString().toLowerCase() === 'available' ? 'Tersedia' : apiData.status || 'Tidak Tersedia',
                gambar: getCarImage(namaMobil) || apiData.gambar || dummyCars[0]?.gambar,
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
        gambar: getCarImage(baseCar.nama) || baseCar.gambar || dummyCars[0]?.gambar,
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
            const namaPenyewa = user ? user.name || user.username : 'Pelanggan';
            
            addTransaction({
                idTransaksi: `TRX-${new Date().getTime()}`,
                mobilId: id,
                penyewa: namaPenyewa,
                tanggalMulai,
                tanggalSelesai,
                durasi,
                totalBiaya,
                status: 'Menunggu Pembayaran'
            });

            alert(`Transaksi Berhasil Disimpan!\nID Mobil: ${id}\nPenyewa: ${namaPenyewa}\nTotal Durasi: ${durasi} Hari\nTotal Bayar: Rp ${totalBiaya.toLocaleString('id-ID')}`);
            
            queryClient.invalidateQueries({ queryKey: ['vehicles_catalog'] });
            queryClient.invalidateQueries({ queryKey: ['transactions_list'] });
            
            navigate('/dashboard'); 
        },
        onError: (error) => {
            console.error("Gagal menyimpan transaksi ke database:", error);
            alert(error.response?.data?.message || 'Gagal terhubung ke server. Pastikan Anda sudah login akun dengan benar!');
        }
    });

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
            <div className="flex h-screen w-full items-center justify-center text-gray-500 font-sans">
                Sedang memuat data kendaraan...
            </div>
        );
    }

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
                            src={finalSelectedCar.gambar} 
                            alt={finalSelectedCar.nama} 
                            className="w-full max-w-2xl h-auto object-contain mix-blend-multiply" 
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
                                    required 
                                    className="w-full border border-black p-2 outline-none focus:ring-1 focus:ring-black transition-shadow"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-900 mb-1">Selesai Sewa:</label>
                                <input 
                                    type="date" 
                                    value={tanggalSelesai} 
                                    onChange={(e) => { setTanggalSelesai(e.target.value); hitungTotalBiaya(tanggalMulai, e.target.value); }} 
                                    required 
                                    className="w-full border border-black p-2 outline-none focus:ring-1 focus:ring-black transition-shadow"
                                />
                            </div>
                            
                            <div className="pt-2 text-gray-900 space-y-1">
                                <p>Durasi: {durasi} Hari</p>
                                <p className="text-lg">Total Biaya: Rp {totalBiaya.toLocaleString('id-ID')}</p>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={rentMutation.isPending} 
                                className={`w-full mt-4 py-3 border border-black transition-colors ${
                                    rentMutation.isPending 
                                    ? 'bg-gray-200 text-gray-500 cursor-wait' 
                                    : 'bg-white text-black hover:bg-black hover:text-white'
                                }`}
                            >
                                {rentMutation.isPending ? 'MEMPROSES...' : 'KONFIRMASI PENYEWAAN MOBIL'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            
            <footer className="bg-black text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    <div>
                        <h4 className="font-bold mb-5 tracking-wider uppercase">Rentix Privé</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Koleksi armada terbaru, layanan terpersonalisasi, inspirasi perjalanan premium, dan kabar terkini di Rentix Privé.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-5 tracking-wider uppercase">Perusahaan</h4>
                        <ul className="text-gray-400 text-sm space-y-3">
                            <li className="hover:text-white cursor-pointer transition-colors">Tentang Rentix Privé</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Layanan Premium</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Keberlanjutan</li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold mb-5 tracking-wider uppercase">Bantuan & Kontak</h4>
                        <ul className="text-gray-400 text-sm space-y-3">
                            <li className="hover:text-white cursor-pointer transition-colors">Hubungi Kami</li>
                            <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Lokasi Cabang</li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold mb-5 tracking-wider uppercase">Legalitas</h4>
                        <ul className="text-gray-400 text-sm space-y-3">
                            <li className="hover:text-white cursor-pointer transition-colors">Syarat & Ketentuan</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Kebijakan Privasi</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Pengaturan Cookie</li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 pt-8 px-6 text-center text-xs text-gray-500 space-y-1">
                    <p>Hak Cipta © 2026 Rentix Privé.</p>
                    <p>Seluruh hak cipta dilindungi. Situs ini dilindungi oleh reCAPTCHA.</p>
                    <p>Kebijakan Privasi dan Persyaratan Layanan Google berlaku.</p>
                </div>
            </footer>
        </div>
    );
}

export default RentalForm;
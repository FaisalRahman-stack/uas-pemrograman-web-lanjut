import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useRentalStore } from '../store/useRentalStore'; 
import apiClient from '../api/apiClient';
import { dummyCars, getCarImage } from '../data/dummyCars';
import Navbar from '../components/Navbar'; 

function Dashboard() {
    const navigate = useNavigate();
    const [halamanAktif, setHalamanAktif] = useState(1);
    
    const itemPerHalaman = 8; 

    const cars = useRentalStore((state) => state.cars);
    const setCars = useRentalStore((state) => state.setCars);

    const { data: queryData, isLoading: loadingData, isError } = useQuery({
        queryKey: ['vehicles_catalog'],
        queryFn: async () => {
            const response = await apiClient.get('/vehicles'); 
            const dataYangBenar = response.data.data ? response.data.data : response.data;
            
            const formattedData = Array.isArray(dataYangBenar) ? dataYangBenar.map((item) => {
                const namaMobil = item.nama || item.name || 'Nama Tidak Diketahui';
                const tipeMobil = item.tipe || item.vehicle_type?.type_name || item.vehicleType?.type_name || 'Unknown';
                
                const rawStatus = item.status ? item.status.toString().toLowerCase() : '';
                const statusMapped = rawStatus === 'available' ? 'Tersedia' : (rawStatus === 'rented' ? 'Dipinjam' : 'Tidak tersedia');

                return {
                    id: item.id,
                    nama: namaMobil,
                    tipe: tipeMobil,
                    harga: item.harga || item.price_per_day || 0,
                    status: statusMapped,
                    gambar: getCarImage(namaMobil) || item.gambar || 'https://via.placeholder.com/300x180?text=Mobil',
                    spek: item.spek || `Plat: ${item.plate_number || '-'}`,
                };
            }) : dummyCars;

            return formattedData;
        },
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (queryData) {
            setCars(queryData.length ? queryData : dummyCars);
        } else if (isError) {
            setCars(dummyCars);
        }
    }, [queryData, isError, setCars]);

    const indeksTerakhir = halamanAktif * itemPerHalaman;
    const indeksPertama = indeksTerakhir - itemPerHalaman;
    const mobilTampil = cars.slice(indeksPertama, indeksTerakhir);
    const totalHalaman = Math.ceil(cars.length / itemPerHalaman);

    if (loadingData) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-gray-500 font-sans">
                Sedang memuat data katalog dari server...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            
            <div className="w-full">
                <div className="text-center py-5 border-b border-gray-200">
                    <h1 className="text-3xl font-bold tracking-wide">Katalogue</h1>
                </div>
                <div className="w-full h-[400px] bg-gray-100 overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000&auto=format&fit=crop" 
                        alt="Subaru Banner" 
                        className="w-full h-full object-cover object-center"
                    />
                </div>
            </div>

            
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                
                
                <div className="mb-6">
                    <p className="text-gray-700 text-sm">
                        Showing {cars.length > 0 ? indeksPertama + 1 : 0} - {Math.min(indeksTerakhir, cars.length)} of {cars.length} results
                    </p>
                </div>

                {cars.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-300 rounded-lg text-gray-500">
                        Data mobil belum tersedia di Database.
                    </div>
                ) : (
                    <>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {mobilTampil.map((mobil) => (
                                <div key={mobil.id} className="bg-[#f8f8f8] rounded-xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-lg">
                                    
                                    
                                    <div className="w-full h-32 mb-6 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={mobil.gambar} 
                                            alt={mobil.nama} 
                                            className="max-h-full max-w-full object-contain mix-blend-multiply" 
                                        />
                                    </div>
                                    
                                    
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{mobil.nama}</h3>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{mobil.spek}</p>
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">{mobil.tipe}</span>
                                    </div>

                                    
                                    <div className="mt-6 flex justify-between items-end border-t border-gray-200 pt-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 mb-0.5">Starting at</p>
                                            <p className="font-bold text-gray-900 text-sm">
                                                Rp {Number(mobil.harga).toLocaleString('id-ID')} <span className="font-normal text-xs text-gray-600">/ Hari</span>
                                            </p>
                                        </div>
                                        <button 
                                            disabled={mobil.status === 'Dipinjam'}
                                            onClick={() => navigate(`/rental/${mobil.id}`)}
                                            className={`px-5 py-1.5 text-xs font-bold rounded-full text-white transition-colors ${
                                                mobil.status === 'Tersedia' 
                                                ? 'bg-[#3b6fff] hover:bg-blue-700 shadow-md shadow-blue-500/30' 
                                                : 'bg-[#ef4444] cursor-not-allowed'
                                            }`}
                                        >
                                            {mobil.status === 'Tersedia' ? 'Sewa' : 'Dipinjam'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        
                        <div className="flex justify-center items-center gap-4 mt-16 mb-8">
                            <button 
                                disabled={halamanAktif === 1} 
                                onClick={() => setHalamanAktif(halamanAktif - 1)} 
                                className={`px-5 py-1.5 border border-black rounded-full text-sm font-medium transition-colors ${halamanAktif === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                                Sebelumnya
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                Halaman {halamanAktif} dari {totalHalaman}
                            </span>
                            <button 
                                disabled={halamanAktif === totalHalaman} 
                                onClick={() => setHalamanAktif(halamanAktif + 1)} 
                                className={`px-5 py-1.5 border border-black rounded-full text-sm font-medium transition-colors ${halamanAktif === totalHalaman ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                                Berikutnya
                            </button>
                        </div>
                    </>
                )}
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

export default Dashboard;
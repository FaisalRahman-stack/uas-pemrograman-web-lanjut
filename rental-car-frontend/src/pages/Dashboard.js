import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore'; 
import apiClient from '../api/apiClient';

function Dashboard() {
    const navigate = useNavigate();
    const [halamanAktif, setHalamanAktif] = useState(1);
    const [loadingData, setLoadingData] = useState(true);
    const itemPerHalaman = 6;

    const cars = useRentalStore((state) => state.cars);
    const setCars = useRentalStore((state) => state.setCars);

    useEffect(() => {
        const fetchMobil = async () => {
            try {
                setLoadingData(true);
                const response = await apiClient.get('/vehicles'); 
                const dataYangBenar = response.data.data ? response.data.data : response.data;
                console.log("Isi data dari Laravel:", dataYangBenar);
                setCars(dataYangBenar);
            } catch (error) {
                console.error("Gagal menarik data dari Backend:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchMobil();
    }, [setCars]);

    const indeksTerakhir = halamanAktif * itemPerHalaman;
    const indeksPertama = indeksTerakhir - itemPerHalaman;
    const mobilTampil = cars.slice(indeksPertama, indeksTerakhir);
    const totalHalaman = Math.ceil(cars.length / itemPerHalaman);

    if (loadingData) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#666' }}>
                Sedang memuat data dari server...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#1a1a1a', margin: '0 0 10px 0' }}>Katalog Penyewaan Mobil</h1>
                <p style={{ color: '#666', margin: 0 }}>Pilih kendaraan terbaik untuk perjalanan Anda</p>
            </div>

            {cars.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    Data mobil belum tersedia di Database.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                    {mobilTampil.map((mobil) => (
                        <div key={mobil.id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                            {/* Pastikan field 'gambar' sesuai dengan yang dikirim backend (misal URL gambar) */}
                            <img 
                                src={mobil.gambar} 
                                alt={mobil.nama} 
                                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#f0f0f0' }}
                            />
                            <h3 style={{ margin: '0 0 5px 0', color: '#1a1a1a' }}>{mobil.nama}</h3>
                            <span style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#555', alignSelf: 'flex-start' }}>{mobil.tipe}</span>
                            <p style={{ fontSize: '12px', color: '#777', margin: '10px 0 5px 0', fontWeight: 'bold' }}>{mobil.spek}</p>
                            <p style={{ fontSize: '13px', color: '#555', margin: '0 0 15px 0', lineHeight: '1.4' }}>{mobil.Deskripsi}</p>
                            
                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ margin: '10px 0 15px 0' }}>
                                    <span style={{ fontSize: '13px', color: '#888' }}>Tarif Sewa:</span>
                                    <h4 style={{ margin: '2px 0 0 0', color: '#28a745', fontSize: '18px' }}>
                                        Rp {Number(mobil.harga).toLocaleString()} <span style={{ fontSize: '12px', color: '#666' }}>/ hari</span>
                                    </h4>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                    <span style={{ color: mobil.status === 'Tersedia' ? '#28a745' : '#dc3545', fontWeight: 'bold', fontSize: '14px' }}>{mobil.status}</span>
                                    <button 
                                        disabled={mobil.status === 'Dipinjam'}
                                        onClick={() => navigate(`/rental/${mobil.id}`)}
                                        style={{ padding: '8px 16px', backgroundColor: mobil.status === 'Tersedia' ? '#007bff' : '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: mobil.status === 'Tersedia' ? 'pointer' : 'not-allowed', fontWeight: 'bold', marginLeft: '20px' }}
                                    >
                                        {mobil.status === 'Tersedia' ? 'Sewa Mobil' : 'Habis'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {cars.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', paddingBottom: '30px' }}>
                    <button disabled={halamanAktif === 1} onClick={() => setHalamanAktif(halamanAktif - 1)} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', cursor: halamanAktif === 1 ? 'not-allowed' : 'pointer' }}>Sebelumnya</button>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Halaman {halamanAktif} dari {totalHalaman}</span>
                    <button disabled={halamanAktif === totalHalaman} onClick={() => setHalamanAktif(halamanAktif + 1)} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', cursor: halamanAktif === totalHalaman ? 'not-allowed' : 'pointer' }}>Selanjutnya</button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
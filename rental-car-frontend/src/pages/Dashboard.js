import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore'; 
import imgAvanza from '../assets/avanza.jpg';
import imgCivic from '../assets/civic.jpg';
import imgPajero from '../assets/pajero.jpg';
import imgErtiga from '../assets/ertiga.jpg';
import imgFortuner from '../assets/fortuner.jpg'; 
import imgBrio from '../assets/brio.jpg';
import imgZenix from '../assets/zenix.jpg';
import imgHatchback from '../assets/hatchback.jpg';
import imgRaize from '../assets/raize.jpg';
import imgSigra from '../assets/sigra.jpg';
import imgCreta from '../assets/creta.jpg';
import imgXpander from '../assets/xpander.jpg';

function Dashboard() {
    const navigate = useNavigate();
    const [halamanAktif, setHalamanAktif] = useState(1);
    const itemPerHalaman = 6;
    const cars = useRentalStore((state) => state.cars);
    const setCars = useRentalStore((state) => state.setCars);
    const dataMobilTiruan = [
        { id: 101, nama: 'Toyota Avanza', tipe: 'MPV', harga: 350000, status: 'Tersedia', gambar: imgAvanza, spek: '1500cc | Manual | 7 Kursi', Deskripsi: 'Sangat cocok untuk perjalanan keluarga besar atau logistik kelompok.' },
        { id: 102, nama: 'Honda Civic', tipe: 'Sedan', harga: 700000, status: 'Tersedia', gambar: imgCivic, spek: '1500cc Turbo | Otomatis | 5 Kursi', Deskripsi: 'Cocok untuk kebutuhan kasual, menghadiri rapat formal, atau berkendara santai di dalam kota.' },
        { id: 103, nama: 'Mitsubishi Pajero Sport', tipe: 'SUV', harga: 900000, status: 'Dipinjam', gambar: imgPajero, spek: '2400cc Diesel | Otomatis | 7 Kursi', Deskripsi: 'Tangguh untuk medan berat, perjalanan luar kota yang menantang, atau tampil berwibawa.' },
        { id: 104, nama: 'Suzuki Ertiga', tipe: 'MPV', harga: 300000, status: 'Tersedia', gambar: imgErtiga, spek: '1462cc | Manual | 7 Kursi', Deskripsi: 'Pilihan ekonomis dan efisien bahan bakar untuk area perkotaan yang padat.' },
        { id: 105, nama: 'Toyota Fortuner', tipe: 'SUV', harga: 850000, status: 'Tersedia', gambar: imgFortuner, spek: '2700cc | Otomatis | 7 Kursi', Deskripsi: 'Gagah dan nyaman untuk perjalanan dinas maupun liburan adventure.' },
        { id: 106, nama: 'Honda Brio', tipe: 'City Car', harga: 250000, status: 'Tersedia', gambar: imgBrio, spek: '1200cc | Otomatis | 5 Kursi', Deskripsi: 'Sangat lincah untuk menyusuri jalanan sempit dan super hemat bahan bakar.' },
        { id: 107, nama: 'Toyota Innova Zenix', tipe: 'MPV Premium', harga: 600000, status: 'Tersedia', gambar: imgZenix, spek: '2000cc | CVT | 7 Kursi', Deskripsi: 'Kabin sangat luas, suspensi empuk, cocok untuk kenyamanan ekstra keluarga Anda.' },
        { id: 108, nama: 'Mazda 3 Hatchback', tipe: 'Hatchback', harga: 750000, status: 'Tersedia', gambar: imgHatchback, spek: '2000cc | Otomatis | 5 Kursi', Deskripsi: 'Menawarkan impresi berkendara premium, desain eksklusif, dan teknologi mutakhir.' },
        { id: 109, nama: 'Toyota Raize', tipe: 'Compact SUV', harga: 450000, status: 'Tersedia', gambar: imgRaize, spek: '1000cc Turbo | Otomatis | 5 Kursi', Deskripsi: 'Compact dan bertenaga, sangat pas untuk mobilitas anak muda di perkotaan.' },
        { id: 110, nama: 'Daihatsu Sigra', tipe: 'LCGC MPV', harga: 270000, status: 'Tersedia', gambar: imgSigra, spek: '1200cc | Manual | 7 Kursi', Deskripsi: 'Pilihan paling hemat untuk perjalanan operasional atau budget sewa minimalis.' },
        { id: 111, nama: 'Hyundai Creta', tipe: 'SUV', harga: 500000, status: 'Dipinjam', gambar: imgCreta, spek: '1500cc | IVT | 5 Kursi', Deskripsi: 'Dilengkapi panoramic sunroof dan fitur keamanan berkendara yang sangat modern.' },
        { id: 112, nama: 'Mitsubishi Xpander', tipe: 'MPV', harga: 400000, status: 'Tersedia', gambar: imgXpander, spek: '1500cc | Otomatis | 7 Kursi', Deskripsi: 'Kombinasi ketangguhan SUV dan kenyamanan MPV untuk liburan keluarga.' }
    ];
    useEffect(() => {
        if (cars.length === 0) {
            setCars(dataMobilTiruan);
        }
    }, [cars.length, setCars]);
    const dataYangDitampilkan = cars.length > 0 ? cars : dataMobilTiruan;
    const indeksTerakhir = halamanAktif * itemPerHalaman;
    const indeksPertama = indeksTerakhir - itemPerHalaman;
    const mobilTampil = dataYangDitampilkan.slice(indeksPertama, indeksTerakhir);
    const totalHalaman = Math.ceil(dataYangDitampilkan.length / itemPerHalaman);

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#1a1a1a', margin: '0 0 10px 0' }}>Katalog Penyewaan Mobil</h1>
                <p style={{ color: '#666', margin: 0 }}>Pilih kendaraan terbaik untuk perjalanan Anda</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                {mobilTampil.map((mobil) => (
                    <div key={mobil.id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                        <img 
                            src={mobil.gambar} 
                            alt={mobil.nama} 
                            style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                        />
                        <h3 style={{ margin: '0 0 5px 0', color: '#1a1a1a' }}>{mobil.nama}</h3>
                        <span style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#555', alignSelf: 'flex-start' }}>{mobil.tipe}</span>
                        <p style={{ fontSize: '12px', color: '#777', margin: '10px 0 5px 0', fontWeight: 'bold' }}>{mobil.spek}</p>
                        <p style={{ fontSize: '13px', color: '#555', margin: '0 0 15px 0', lineHeight: '1.4' }}>{mobil.Deskripsi}</p>
                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ margin: '10px 0 15px 0' }}>
                                <span style={{ fontSize: '13px', color: '#888' }}>Tarif Sewa:</span>
                                <h4 style={{ margin: '2px 0 0 0', color: '#28a745', fontSize: '18px' }}>Rp {mobil.harga.toLocaleString()} <span style={{ fontSize: '12px', color: '#666' }}>/ hari</span></h4>
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

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', paddingBottom: '30px' }}>
                <button disabled={halamanAktif === 1} onClick={() => setHalamanAktif(halamanAktif - 1)} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', cursor: halamanAktif === 1 ? 'not-allowed' : 'pointer' }}>Sebelumnya</button>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Halaman {halamanAktif} dari {totalHalaman}</span>
                <button disabled={halamanAktif === totalHalaman} onClick={() => setHalamanAktif(halamanAktif + 1)} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', cursor: halamanAktif === totalHalaman ? 'not-allowed' : 'pointer' }}>Selanjutnya</button>
            </div>
        </div>
    );
}

export default Dashboard;
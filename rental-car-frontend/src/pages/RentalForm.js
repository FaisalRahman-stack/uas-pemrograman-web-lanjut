import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore';
import apiClient from '../api/apiClient';
import { dummyCars, getCarImage } from '../data/dummyCars';

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
    const cars = useRentalStore((state) => state.cars);
    const user = useRentalStore((state) => state.user);
    const addTransaction = useRentalStore((state) => state.addTransaction);
    const [tanggalMulai, setTanggalMulai] = useState('');
    const [tanggalSelesai, setTanggalSelesai] = useState('');
    const [durasi, setDurasi] = useState(0);
    const [detailCar, setDetailCar] = useState(null);
    const [loadingCar, setLoadingCar] = useState(false);

    useEffect(() => {
        const loadVehicleDetail = async () => {
            if (!id) return;

            const existingCar = cars.find((car) => car.id.toString() === id);
            if (existingCar) {
                setDetailCar(null);
                return;
            }

            setLoadingCar(true);
            try {
                const response = await apiClient.get(`/vehicles/${id}`);
                const apiData = response.data.data || response.data;
                const namaMobil = apiData.nama || apiData.name || 'Tidak Diketahui';
                const tipeMobil = apiData.tipe || apiData.vehicleType?.type_name || 'Unknown';
                const platNomor = apiData.plate_number || '-';
                setDetailCar({
                    id: apiData.id,
                    nama: namaMobil,
                    tipe: tipeMobil,
                    harga: apiData.harga || apiData.price_per_day || 350000,
                    status: apiData.status && apiData.status.toString().toLowerCase() === 'available' ? 'Tersedia' : apiData.status || 'Tidak Tersedia',
                    gambar: getCarImage(namaMobil) || apiData.gambar || dummyCars[0]?.gambar,
                    spek: getSpesifikasiLengkap(namaMobil, platNomor),
                    Deskripsi: getDeskripsiFungsional(namaMobil, tipeMobil),
                });
            } catch (error) {
                console.error('Gagal mengambil detail kendaraan:', error.response?.data || error.message || error);
                setDetailCar(null);
            } finally {
                setLoadingCar(false);
            }
        };

        loadVehicleDetail();
    }, [id, cars]);

    const baseCar = detailCar || cars.find((car) => car.id.toString() === id) || dummyCars.find((car) => car.id.toString() === id) || {
        nama: 'Tidak Diketahui',
        tipe: 'Unknown',
        harga: 350000,
        status: 'Tidak Tersedia',
        gambar: dummyCars[0]?.gambar,
        spek: 'Plat: -',
        Deskripsi: 'Detail kendaraan tidak tersedia.',
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
            const selisihWaktu = tgl2.getTime() - tgl1.getTime();
            const selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
            
            if (selisihHari > 0) {
                setDurasi(selisihHari);
            } else {
                setDurasi(0);
            }
        }
    };

    const handleSubmitTransaksi = async (e) => {
        e.preventDefault();
        if (durasi <= 0) {
            alert('Tanggal selesai harus setelah tanggal mulai sewa!');
            return;
        }

        try {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');

            const payload = {
                user_id: user?.id || 1,
                vehicle_id: id,
                start_date: tanggalMulai,
                end_date: tanggalSelesai,
                total_price: totalBiaya
            };

            const response = await apiClient.post('/rentals', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success || response.status === 201) {
                const namaPenyewa = user ? user.name || user.username : 'Faisal';
                
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

                alert(`Transaksi Berhasil Disimpan ke Database!\nID Mobil: ${id}\nPenyewa: ${namaPenyewa}\nTotal Durasi: ${durasi} Hari\nTotal Bayar: Rp ${totalBiaya.toLocaleString()}`);
                
                navigate('/dashboard'); 
            }
        } catch (error) {
            console.error("Gagal menyimpan transaksi ke database:", error);
            const pesanError = error.response?.data?.message || 'Gagal terhubung ke server. Pastikan Anda sudah login akun dengan benar!';
            alert(pesanError);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <img src={finalSelectedCar.gambar} alt={finalSelectedCar.nama} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', minHeight: '280px' }} />
                </div>
                <div>
                    <h2>{finalSelectedCar.nama}</h2>
                    <p style={{ color: '#666', marginTop: '8px' }}>{finalSelectedCar.tipe}</p>
                    <p style={{ margin: '10px 0', fontWeight: 'bold' }}>{finalSelectedCar.Deskripsi}</p>
                    <p style={{ margin: '5px 0' }}><strong>Status:</strong> {finalSelectedCar.status}</p>
                    <p style={{ margin: '5px 0' }}><strong>Spesifikasi:</strong> {finalSelectedCar.spek}</p>
                    <p style={{ margin: '10px 0', fontSize: '18px', color: '#28a745' }}>Tarif Sewa: Rp {hargaPerHari.toLocaleString()} / hari</p>
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2>Formulir Penyewaan Kendaraan</h2>
                <p>ID Mobil yang dipilih: <strong>{id}</strong></p>
                {user && <p>Nama Penyewa: <strong>{user.name || user.username}</strong></p>}
                <p>Tarif Sewa: Rp {hargaPerHari.toLocaleString()} / hari</p>
                <hr />
            
            <form onSubmit={handleSubmitTransaksi}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Mulai Sewa:</label>
                    <input 
                        type="date" 
                        value={tanggalMulai} 
                        onChange={(e) => { setTanggalMulai(e.target.value); hitungTotalBiaya(e.target.value, tanggalSelesai); }} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Selesai Sewa:</label>
                    <input 
                        type="date" 
                        value={tanggalSelesai} 
                        onChange={(e) => { setTanggalSelesai(e.target.value); hitungTotalBiaya(tanggalMulai, e.target.value); }} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                    <p style={{ margin: '5px 0' }}>Durasi: <strong>{durasi} Hari</strong></p>
                    <h3 style={{ margin: '5px 0' }}>Total Biaya: Rp {totalBiaya.toLocaleString()}</h3>
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Konfirmasi Sewa Mobil
                </button>
            </form>
            </div>
        </div>
    );
}

export default RentalForm;
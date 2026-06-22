import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRentalStore } from '../store/useRentalStore';

function RentalForm() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const user = useRentalStore((state) => state.user);
    const addTransaction = useRentalStore((state) => state.addTransaction);
    const [tanggalMulai, setTanggalMulai] = useState('');
    const [tanggalSelesai, setTanggalSelesai] = useState('');
    const [durasi, setDurasi] = useState(0);
    const hargaPerHari = 350000; 
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

    const handleSubmitTransaksi = (e) => {
        e.preventDefault();
        if (durasi <= 0) {
            alert('Tanggal selesai harus setelah tanggal mulai sewa!');
            return;
        }

        const transaksiBaru = {
            idTransaksi: `TRX-${new Date().getTime()}`,
            mobilId: id,
            penyewa: user ? user.username : 'Guest',
            tanggalMulai,
            tanggalSelesai,
            durasi,
            totalBiaya,
            status: 'Menunggu Pembayaran'
        };

        addTransaction(transaksiBaru);

        alert(`Transaksi Berhasil Disimpan!\nID Mobil: ${id}\nPenyewa: ${transaksiBaru.penyewa}\nTotal Durasi: ${durasi} Hari\nTotal Bayar: Rp ${totalBiaya.toLocaleString()}`);
        
        navigate('/dashboard'); 
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Formulir Penyewaan Kendaraan</h2>
            <p>ID Mobil yang dipilih: <strong>{id}</strong></p>
            {user && <p>Nama Penyewa: <strong>{user.username}</strong></p>}
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
    );
}

export default RentalForm;
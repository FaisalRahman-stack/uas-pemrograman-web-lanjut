import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const dataMobilTiruan = [
        { id: 101, nama: 'Toyota Avanza', tipe: 'MPV', harga: 350000, status: 'Tersedia' },
        { id: 102, nama: 'Honda Civic', tipe: 'Sedan', harga: 700000, status: 'Tersedia' },
        { id: 103, nama: 'Mitsubishi Pajero', tipe: 'SUV', harga: 900000, status: 'Dipinjam' },
        { id: 104, nama: 'Suzuki Ertiga', tipe: 'MPV', harga: 300000, status: 'Tersedia' }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#1a1a1a', margin: '0 0 10px 0' }}>Katalog Penyewaan Mobil</h1>
                <p style={{ color: '#666', margin: 0 }}>Pilih kendaraan terbaik untuk perjalanan Anda</p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '25px' 
            }}>
                {dataMobilTiruan.map((mobil) => (
                    <div key={mobil.id} style={{ 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '12px', 
                        padding: '20px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        backgroundColor: '#fff'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>{mobil.nama}</h3>
                        <span style={{ 
                            backgroundColor: '#f0f0f0', 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '12px',
                            color: '#555' 
                        }}>{mobil.tipe}</span>
                        
                        <div style={{ margin: '20px 0 15px 0' }}>
                            <span style={{ fontSize: '14px', color: '#888' }}>Tarif Sewa:</span>
                            <h4 style={{ margin: '5px 0 0 0', color: '#28a745', fontSize: '18px' }}>
                                Rp {mobil.harga.toLocaleString()} <span style={{ fontSize: '12px', color: '#666' }}>/ hari</span>
                            </h4>
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginTop: '20px' 
                        }}>
                            <span style={{ 
                                color: mobil.status === 'Tersedia' ? '#28a745' : '#dc3545',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>{mobil.status}</span>
                            
                            <button 
                                disabled={mobil.status === 'Dipinjam'}
                                onClick={() => navigate(`/rental/${mobil.id}`)}
                                style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: mobil.status === 'Tersedia' ? '#007bff' : '#6c757d', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: mobil.status === 'Tersedia' ? 'pointer' : 'not-allowed',
                                    fontWeight: '5px'
                                }}
                            >
                                {mobil.status === 'Tersedia' ? 'Sewa Mobil' : 'Habis'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
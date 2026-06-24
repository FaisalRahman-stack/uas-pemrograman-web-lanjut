import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalStore } from '../../store/useRentalStore';
import apiClient from '../../api/apiClient';
import AdminSidebar from '../../components/AdminSidebar';

function KelolaTransaksi() {
    const navigate = useNavigate();
    const user = useRentalStore((state) => state.user);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAdmin = user?.role?.role_name?.toLowerCase() === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchTransactions();
    }, [isAdmin, navigate]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/rentals');
            const data = response.data.data || response.data;
            setTransactions(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Gagal memuat transaksi:', err);
            setError('Tidak dapat memuat daftar transaksi.');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (transactionId, newStatus) => {
        try {
            await apiClient.put(`/rentals/${transactionId}`, { status: newStatus });
            alert('Status transaksi berhasil diperbarui!');
            fetchTransactions();
        } catch (err) {
            console.error('Gagal mengubah status:', err);
            alert('Gagal mengubah status transaksi');
        }
    };

    const getStatusBadgeStyle = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'approved' || statusLower === 'selesai') {
            return { backgroundColor: '#d4edda', color: '#155724' };
        } else if (statusLower === 'pending' || statusLower === 'menunggu') {
            return { backgroundColor: '#fff3cd', color: '#856404' };
        } else if (statusLower === 'rejected' || statusLower === 'ditolak') {
            return { backgroundColor: '#f8d7da', color: '#721c24' };
        }
        return { backgroundColor: '#e2e3e5', color: '#383d41' };
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <AdminSidebar />
            
            <div style={{ flex: 1, padding: '30px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: '28px' }}>Kelola Transaksi</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>Kelola riwayat penyewaan mobil dari pelanggan</p>
                </div>

                {/* Transactions Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6' }}>
                    {loading && <p style={{ color: '#666' }}>Memuat data transaksi...</p>}
                    {error && <p style={{ color: '#dc3545' }}>{error}</p>}
                    
                    {!loading && !error && transactions.length === 0 && (
                        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>Belum ada transaksi.</p>
                    )}

                    {!loading && !error && transactions.length > 0 && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e6e6e6' }}>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>ID</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Penyewa</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Mobil</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Tgl Mulai</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Tgl Selesai</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Total (Rp)</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: '#333', fontWeight: '600' }}>Status</th>
                                        <th style={{ textAlign: 'center', padding: '12px', color: '#333', fontWeight: '600' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} style={{ borderBottom: '1px solid #e6e6e6' }}>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>#{transaction.id}</td>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>
                                                {transaction.user?.name || transaction.penyewa || '-'}
                                            </td>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>
                                                {transaction.vehicle?.name || transaction.mobil || '-'}
                                            </td>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>
                                                {transaction.start_date || transaction.tanggal_mulai || '-'}
                                            </td>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>
                                                {transaction.end_date || transaction.tanggal_selesai || '-'}
                                            </td>
                                            <td style={{ padding: '12px', color: '#1a1a1a' }}>
                                                {Number(transaction.total_price || transaction.total || 0).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    ...getStatusBadgeStyle(transaction.status)
                                                }}>
                                                    {transaction.status || 'Tidak diketahui'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <select
                                                    value={transaction.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #ccc',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    <option value="pending">Menunggu</option>
                                                    <option value="approved">Setujui</option>
                                                    <option value="completed">Selesai</option>
                                                    <option value="rejected">Tolak</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                {!loading && transactions.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '30px' }}>
                        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6' }}>
                            <p style={{ margin: 0, color: '#666', fontSize: '12px', fontWeight: '600' }}>TOTAL TRANSAKSI</p>
                            <h3 style={{ margin: '10px 0 0 0', color: '#1a1a1a', fontSize: '24px' }}>{transactions.length}</h3>
                        </div>
                        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e6e6e6' }}>
                            <p style={{ margin: 0, color: '#666', fontSize: '12px', fontWeight: '600' }}>TOTAL PENDAPATAN (Rp)</p>
                            <h3 style={{ margin: '10px 0 0 0', color: '#28a745', fontSize: '24px' }}>
                                {Number(
                                    transactions.reduce((sum, t) => sum + (t.total_price || t.total || 0), 0)
                                ).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default KelolaTransaksi;

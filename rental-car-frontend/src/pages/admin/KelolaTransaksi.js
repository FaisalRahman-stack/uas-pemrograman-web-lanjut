import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRentalStore } from '../../store/useRentalStore';
import apiClient from '../../api/apiClient';

import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

function KelolaTransaksi() {
    const navigate = useNavigate();
    const user = useRentalStore((state) => state.user);
    const queryClient = useQueryClient();
    const [selectedProof, setSelectedProof] = useState(null);

    const isAdmin = user?.role_id === 1 || user?.role?.role_name?.toLowerCase() === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const { data: transactions = [], isLoading: loading, isError: error } = useQuery({
        queryKey: ['transactions_list'],
        queryFn: async () => {
            const response = await apiClient.get('/rentals');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : [];
        },
        enabled: isAdmin,
    });

    const statusMutation = useMutation({
        mutationFn: async ({ transactionId, newStatus }) => {
            return await apiClient.patch(`/rentals/${transactionId}/update-status`, 
                { status: newStatus }
            );
        },
        onSuccess: (response, variables) => {
            alert('Status transaksi berhasil diperbarui!');
            const updatedId = variables.transactionId;
            const updatedStatus = variables.newStatus;

            queryClient.setQueryData(['transactions_list'], (oldData) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((transaction) => {
                    if (transaction.id !== updatedId) return transaction;
                    return { ...transaction, status: updatedStatus };
                });
            });

            queryClient.invalidateQueries({ queryKey: ['transactions_list'] });
        },
        onError: (err) => {
            console.error('Gagal mengubah status:', err);
            alert('Gagal mengubah status transaksi');
        }
    });

    const handleStatusChange = (transactionId, newStatus) => {
        statusMutation.mutate({ transactionId, newStatus });
    };

    const activeTransactions = transactions.filter((transaction) => transaction.status !== 'cancelled');

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                
                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-black mb-8">Kelola Transaksi</h1>

                    <div className="bg-[#f4f4f4] rounded-xl p-8">
                        {loading && <p className="text-gray-500">Memuat data transaksi...</p>}
                        {error && <p className="text-red-500">Gagal memuat transaksi.</p>}
                        
                        {!loading && !error && activeTransactions.length === 0 && (
                            <p className="text-center py-10 text-gray-500">Belum ada transaksi aktif.</p>
                        )}

                        {!loading && !error && activeTransactions.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">ID</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Penyewa</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Mobil</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Tgl Mulai</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Tgl Selesai</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Total (Rp)</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm">Status</th>
                                            <th className="border-b border-black pb-3 font-bold text-black text-sm text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="border-b border-gray-200/50 hover:bg-gray-200/20">
                                                <td className="py-4 text-sm text-gray-900">#{transaction.id}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.user?.name || transaction.penyewa}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.vehicle?.name || transaction.mobil}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.start_date || transaction.tanggal_mulai}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.end_date || transaction.tanggal_selesai}</td>
                                                <td className="py-4 text-sm text-gray-900">Rp {Number(transaction.total_price || transaction.total || 0).toLocaleString('id-ID')}</td>
                                                <td className="py-4">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                                                        transaction.status === 'menunggu' ? 'bg-yellow-200 text-yellow-800' :
                                                        transaction.status === 'disetujui' ? 'bg-green-200 text-green-800' :
                                                        transaction.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                                                        'bg-red-200 text-red-800'
                                                    }`}>
                                                        {transaction.status === 'menunggu' ? 'Menunggu' : 
                                                         transaction.status === 'disetujui' ? 'Disetujui' : 
                                                         transaction.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <div className="flex flex-col gap-2">
                                                        <select
                                                            value={transaction.status || 'menunggu'}
                                                            onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                                                            disabled={statusMutation.isPending}
                                                            className="border border-gray-300 rounded p-1 text-sm bg-white"
                                                        >
                                                            <option value="menunggu">Menunggu</option>
                                                            <option value="disetujui">Disetujui</option>
                                                            <option value="completed">Selesai</option>
                                                            <option value="cancelled">Tolak</option>
                                                        </select>
                                                        {transaction.bukti_pembayaran && (
                                                            <button
                                                                onClick={() => setSelectedProof(transaction.bukti_pembayaran)}
                                                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                            >
                                                                Lihat Bukti
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {!loading && transactions.length > 0 && (
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-[#f4f4f4] rounded-xl p-6">
                                <p className="font-bold text-black mb-2 text-sm">TOTAL TRANSAKSI</p>
                                <h3 className="text-4xl font-bold text-black">{activeTransactions.length}</h3>
                            </div>
                            <div className="bg-[#f4f4f4] rounded-xl p-6">
                                <p className="font-bold text-black mb-2 text-sm">TOTAL PENDAPATAN (RP)</p>
                                <h3 className="text-4xl font-bold text-blue-600">
                                    Rp {Number(activeTransactions.reduce((sum, t) => sum + (t.total_price || t.total || 0), 0)).toLocaleString('id-ID')}
                                </h3>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal untuk lihat bukti pembayaran */}
            {selectedProof && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedProof(null)}
                >
                    <div 
                        className="bg-white rounded-lg max-w-2xl w-full p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-black">Bukti Pembayaran</h3>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <img 
                            src={`http://127.0.0.1:8000/uploads/bukti-pembayaran/${selectedProof}`}
                            alt="Bukti Pembayaran"
                            className="w-full h-auto rounded"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x400?text=Gambar+Tidak+Ditemukan';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default KelolaTransaksi;
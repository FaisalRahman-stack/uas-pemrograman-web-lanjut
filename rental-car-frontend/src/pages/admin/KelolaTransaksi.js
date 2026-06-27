import React, { useEffect } from 'react';
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

    const isAdmin = user?.role_id === 1 || user?.role?.role_name?.toLowerCase() === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const { data: transactions = [], isLoading: loading, isError: error } = useQuery({
        queryKey: ['transactions_list'],
        queryFn: async () => {
            const token = localStorage.getItem('access_token');
            const response = await apiClient.get('/rentals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : [];
        },
        enabled: isAdmin,
    });

    const statusMutation = useMutation({
        mutationFn: async ({ transactionId, newStatus }) => {
            const token = localStorage.getItem('access_token');
            return await apiClient.put(`/rentals/${transactionId}`, 
                { status: newStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            alert('Status transaksi berhasil diperbarui!');
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
                        
                        {!loading && !error && transactions.length === 0 && (
                            <p className="text-center py-10 text-gray-500">Belum ada transaksi.</p>
                        )}

                        {!loading && !error && transactions.length > 0 && (
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
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id} className="border-b border-gray-200/50 hover:bg-gray-200/20">
                                                <td className="py-4 text-sm text-gray-900">#{transaction.id}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.user?.name || transaction.penyewa}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.vehicle?.name || transaction.mobil}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.start_date || transaction.tanggal_mulai}</td>
                                                <td className="py-4 text-sm text-gray-900">{transaction.end_date || transaction.tanggal_selesai}</td>
                                                <td className="py-4 text-sm text-gray-900">Rp {Number(transaction.total_price || transaction.total || 0).toLocaleString('id-ID')}</td>
                                                <td className="py-4">
                                                    <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                                        {transaction.status === 'pending' ? 'Aktif' : (transaction.status === 'completed' ? 'Selesai' : 'Dibatalkan')}                                                
                                                    </span>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <select
                                                        value={transaction.status || 'pending'}
                                                        onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                                                        disabled={statusMutation.isPending}
                                                        className="border border-gray-300 rounded p-1 text-sm bg-white"
                                                    >
                                                        <option value="pending">Aktif</option>
                                                        <option value="completed">Selesai</option>
                                                        <option value="cancelled">Tolak</option>
                                                    </select>
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
                                <h3 className="text-4xl font-bold text-black">{transactions.length}</h3>
                            </div>
                            <div className="bg-[#f4f4f4] rounded-xl p-6">
                                <p className="font-bold text-black mb-2 text-sm">TOTAL PENDAPATAN (RP)</p>
                                <h3 className="text-4xl font-bold text-blue-600">
                                    Rp {Number(transactions.reduce((sum, t) => sum + (t.total_price || t.total || 0), 0)).toLocaleString('id-ID')}
                                </h3>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default KelolaTransaksi;
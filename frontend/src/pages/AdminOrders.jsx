import React, { useEffect, useState } from 'react';
import { ClipboardList, UtensilsCrossed } from 'lucide-react';
import api from '../services/api';
import StatusBadge, { STATUS_OPTIONS } from '../components/ui/StatusBadge';

const orderTotal = (order) =>
    (order.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);

const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const loadOrders = async () => {
        try {
            const res = await api.get('/orders/all');
            const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sorted);
        } catch (err) {
            console.error('Erreur chargement commandes:', err);
            setMessage('Impossible de charger les commandes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadOrders(); }, []);

    const handleStatusChange = async (orderId, status) => {
        setUpdatingId(orderId);
        setMessage('');
        try {
            await api.put(`/orders/${orderId}/status`, null, { params: { status } });
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
        } catch (err) {
            console.error('Erreur changement statut:', err);
            setMessage('Impossible de mettre à jour le statut.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div>
            <h2 className="text-base font-bold text-slate-800 mb-4">Commandes ({orders.length})</h2>

            {message && (
                <div className="mb-4 p-3 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                    {message}
                </div>
            )}

            {loading ? (
                <p className="text-slate-500 text-sm">Chargement...</p>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
                    <ClipboardList size={28} className="text-slate-300 mx-auto mb-3" />
                    Aucune commande pour le moment.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Commande #{order.id}</p>
                                    <p className="text-sm text-slate-500">{order.customerEmail}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <StatusBadge status={order.status} />
                                    <select
                                        value={order.status}
                                        disabled={updatingId === order.id}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="text-sm border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                                {(order.items || []).map((item) => (
                                    <div key={item.id} className="flex items-center gap-2.5 text-sm">
                                        <UtensilsCrossed size={13} className="text-slate-300 flex-shrink-0" />
                                        <span className="text-slate-600 flex-grow">{item.quantity} × {item.productName}</span>
                                        <span className="font-semibold text-slate-800">{(item.price * item.quantity).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 mt-3 pt-3">
                                <span className="text-sm font-semibold text-slate-700">Total</span>
                                <span className="font-bold text-orange-600">{orderTotal(order).toFixed(2)} €</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;

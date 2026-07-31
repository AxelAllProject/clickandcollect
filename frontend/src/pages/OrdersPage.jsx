import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, UtensilsCrossed, AlertCircle, MapPin, Clock } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import PaymentStatusBadge from '../components/ui/PaymentStatusBadge';
import Button from '../components/ui/Button';

const formatSlotDate = (isoDate) =>
    new Date(`${isoDate}T00:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

const orderTotal = (order) =>
    (order.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);

const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await api.get('/orders');
                const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sorted);
            } catch (err) {
                console.error('Erreur chargement commandes:', err);
                setError("Impossible de charger vos commandes.");
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    return (
        <div className="pb-16">
            <div className="max-w-4xl mx-auto px-4 pt-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Mes commandes</h1>

                {loading && <p className="text-center text-slate-500 py-12">Chargement...</p>}

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg text-sm mb-6">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-14 text-center">
                        <ClipboardList size={32} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-700 font-semibold mb-1.5">Vous n'avez encore passé aucune commande.</p>
                        <Link to="/catalog" className="inline-block mt-4">
                            <Button size="lg">Voir le menu</Button>
                        </Link>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-bold text-slate-800">Commande #{order.id}</p>
                                    <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <StatusBadge status={order.status} />
                                    <PaymentStatusBadge status={order.paymentStatus} />
                                </div>
                            </div>

                            {order.pickupSlot && (
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3.5 py-2.5 mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-orange-600" />
                                        {order.pickupSlot.locationName} · {order.pickupSlot.locationCity}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-orange-600" />
                                        {formatSlotDate(order.pickupSlot.date)} · {order.pickupSlot.startTime.slice(0, 5)}–{order.pickupSlot.endTime.slice(0, 5)}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                                {(order.items || []).map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-300 flex-shrink-0">
                                            {item.productImageUrl ? (
                                                <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                <UtensilsCrossed size={13} />
                                            )}
                                        </div>
                                        <span className="text-slate-600 flex-grow">{item.quantity} × {item.productName}</span>
                                        <span className="font-semibold text-slate-800">{(item.price * item.quantity).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 mt-4 pt-4">
                                <span className="font-semibold text-slate-700 text-sm">Total</span>
                                <span className="text-lg font-bold text-orange-600">{orderTotal(order).toFixed(2)} €</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;

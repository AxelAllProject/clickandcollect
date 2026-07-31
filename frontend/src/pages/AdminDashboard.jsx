import React, { useEffect, useState } from 'react';
import { Wallet, ShoppingBag, Clock, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../services/api';
import StatTile from '../components/ui/StatTile';
import OrdersByStatusChart from '../components/ui/OrdersByStatusChart';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            try {
                const [ordersRes, usersRes, productsRes] = await Promise.all([
                    api.get('/orders/all'),
                    api.get('/admin/users'),
                    api.get('/products'),
                ]);
                setOrders(ordersRes.data);
                setUsers(usersRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error('Erreur chargement dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl skeleton" />
                ))}
            </div>
        );
    }

    const billableOrders = orders.filter((o) => o.status !== 'CANCELLED');
    const revenue = billableOrders.reduce(
        (sum, o) => sum + (o.items || []).reduce((s, i) => s + i.price * i.quantity, 0),
        0
    );
    const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
    const lowStockProducts = products.filter((p) => p.stock <= 5);

    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {});

    const productStats = {};
    billableOrders.forEach((order) => {
        (order.items || []).forEach((item) => {
            const key = item.productName || `#${item.productId}`;
            if (!productStats[key]) productStats[key] = { name: key, quantity: 0, revenue: 0 };
            productStats[key].quantity += item.quantity;
            productStats[key].revenue += item.price * item.quantity;
        });
    });
    const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const maxTopRevenue = Math.max(1, ...topProducts.map((p) => p.revenue));

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatTile
                    icon={<Wallet size={19} />}
                    label="Chiffre d'affaires"
                    value={`${revenue.toFixed(2)} €`}
                    accent="bg-orange-50 text-orange-600"
                />
                <StatTile
                    icon={<ShoppingBag size={19} />}
                    label="Commandes totales"
                    value={orders.length}
                    accent="bg-blue-50 text-blue-600"
                />
                <StatTile
                    icon={<Clock size={19} />}
                    label="En attente"
                    value={pendingCount}
                    accent="bg-amber-50 text-amber-600"
                />
                <StatTile
                    icon={<Users size={19} />}
                    label="Utilisateurs"
                    value={users.length}
                    accent="bg-indigo-50 text-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-5">Commandes par statut</h2>
                    <OrdersByStatusChart counts={statusCounts} />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <AlertTriangle size={16} className="text-amber-500" />
                        Stock faible
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">5 unités ou moins</p>
                    {lowStockProducts.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Aucun produit en stock faible.</p>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            {lowStockProducts.map((p) => (
                                <div key={p.id} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-700 truncate">{p.name}</span>
                                    <span className={`font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                        {p.stock === 0 ? 'Épuisé' : `${p.stock} restants`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-emerald-500" />
                    Top produits par chiffre d'affaires
                </h2>
                {topProducts.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">Pas encore de commandes.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {topProducts.map((p) => (
                            <div key={p.name} className="flex items-center gap-3">
                                <span className="w-32 sm:w-48 text-sm text-slate-700 truncate flex-shrink-0">{p.name}</span>
                                <div className="flex-grow bg-slate-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-orange-500 transition-all duration-500"
                                        style={{ width: `${(p.revenue / maxTopRevenue) * 100}%` }}
                                    />
                                </div>
                                <span className="w-24 text-sm font-semibold text-slate-800 text-right flex-shrink-0">{p.revenue.toFixed(2)} €</span>
                                <span className="w-16 text-xs text-slate-400 text-right flex-shrink-0 hidden sm:block">{p.quantity} vendus</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingCart, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const CartPage = () => {
    const { cart, loading, updateItem, removeItem, clearCart } = useCart();
    const [busyItemId, setBusyItemId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const items = cart.items || [];

    const handleQuantityChange = async (item, delta) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;
        setBusyItemId(item.id);
        setError('');
        try {
            await updateItem(item.id, newQuantity);
        } catch (err) {
            console.error('Erreur mise à jour quantité:', err);
            setError(err.response?.data?.message || "Impossible de mettre à jour la quantité (stock insuffisant ?).");
        } finally {
            setBusyItemId(null);
        }
    };

    const handleRemove = async (item) => {
        setBusyItemId(item.id);
        setError('');
        try {
            await removeItem(item.id);
        } catch (err) {
            console.error('Erreur suppression:', err);
            setError("Impossible de retirer cet article.");
        } finally {
            setBusyItemId(null);
        }
    };

    const handleClear = async () => {
        if (!window.confirm('Vider entièrement le panier ?')) return;
        setError('');
        try {
            await clearCart();
        } catch (err) {
            console.error('Erreur vidage panier:', err);
            setError("Impossible de vider le panier.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-slate-500">Chargement du panier...</p>
            </div>
        );
    }

    return (
        <div className="pb-16">
            <div className="max-w-4xl mx-auto px-4 pt-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Mon panier</h1>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg mb-6 text-sm">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-14 text-center">
                        <ShoppingCart size={32} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-700 font-semibold mb-1.5">Votre panier est vide.</p>
                        <p className="text-slate-400 text-sm mb-6">Parcourez notre menu pour ajouter des produits.</p>
                        <Link to="/catalog">
                            <Button size="lg">Voir le menu</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-3">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-300">
                                        {item.productImageUrl ? (
                                            <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <UtensilsCrossed size={20} />
                                        )}
                                    </div>

                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-semibold text-slate-800 truncate text-sm">{item.productName}</h3>
                                        <p className="text-xs text-slate-500">{Number(item.price).toFixed(2)} € / unité</p>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleQuantityChange(item, -1)}
                                            disabled={busyItemId === item.id || item.quantity <= 1}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-6 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item, 1)}
                                            disabled={busyItemId === item.id}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="w-20 text-right font-bold text-orange-600 text-sm">
                                        {(item.price * item.quantity).toFixed(2)} €
                                    </div>

                                    <button
                                        onClick={() => handleRemove(item)}
                                        disabled={busyItemId === item.id}
                                        className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                                        aria-label="Retirer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}

                            <button onClick={handleClear} className="self-start text-sm text-slate-400 hover:text-red-500 font-medium mt-2 transition-colors">
                                Vider le panier
                            </button>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                                <h3 className="text-base font-bold text-slate-900 mb-4">Récapitulatif</h3>
                                <div className="flex justify-between text-sm text-slate-600 mb-2">
                                    <span>Articles</span>
                                    <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-100 pt-4 mt-4">
                                    <span>Total</span>
                                    <span className="text-orange-600">{Number(cart.total).toFixed(2)} €</span>
                                </div>
                                <Button size="lg" onClick={() => navigate('/checkout')} className="w-full mt-6">
                                    Choisir un créneau &amp; payer
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

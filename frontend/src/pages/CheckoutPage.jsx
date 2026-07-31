import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { MapPin, Clock, AlertCircle, ChevronLeft } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

const formatSlotDate = (isoDate) => {
    const date = new Date(`${isoDate}T00:00:00`);
    const label = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    return label.charAt(0).toUpperCase() + label.slice(1);
};

const formatTime = (time) => time.slice(0, 5);

const PaymentStep = ({ orderTotal, onPaid }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setSubmitting(true);
        setError('');

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/orders`,
            },
            redirect: 'if_required',
        });

        if (confirmError) {
            setError(confirmError.message || "Le paiement a échoué.");
            showToast(confirmError.message || "Le paiement a échoué.", 'error');
            setSubmitting(false);
            return;
        }

        if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
            onPaid();
        } else {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg text-sm">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                </div>
            )}

            <PaymentElement />

            <Button type="submit" size="lg" disabled={!stripe || submitting} className="w-full">
                {submitting ? 'Paiement en cours...' : `Payer ${orderTotal.toFixed(2)} €`}
            </Button>

            <p className="text-xs text-slate-400 text-center">
                Mode test Stripe — utilise la carte 4242 4242 4242 4242, une date future et n'importe quel CVC.
            </p>
        </form>
    );
};

const CheckoutPage = () => {
    const { cart, refreshCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState('');

    const [startingPayment, setStartingPayment] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null); // { order, clientSecret, publishableKey }
    const [stripePromise, setStripePromise] = useState(null);

    const items = cart.items || [];
    const total = Number(cart.total) || 0;

    useEffect(() => {
        Promise.all([api.get('/pickup-locations'), api.get('/profile')])
            .then(([locRes, profileRes]) => {
                setLocations(locRes.data);
                if (profileRes.data.favoriteLocationId) {
                    setSelectedLocationId(profileRes.data.favoriteLocationId);
                }
            })
            .catch((err) => {
                console.error('Erreur chargement points relais:', err);
                setError("Impossible de charger les points relais.");
            });
    }, []);

    useEffect(() => {
        if (!selectedLocationId) {
            setSlots([]);
            return;
        }
        setLoadingSlots(true);
        setSelectedSlotId(null);
        api.get('/pickup-slots', { params: { locationId: selectedLocationId } })
            .then((res) => setSlots(res.data))
            .catch((err) => {
                console.error('Erreur chargement créneaux:', err);
                setError("Impossible de charger les créneaux disponibles.");
            })
            .finally(() => setLoadingSlots(false));
    }, [selectedLocationId]);

    const slotsByDate = useMemo(() => {
        const groups = {};
        for (const slot of slots) {
            if (!groups[slot.date]) groups[slot.date] = [];
            groups[slot.date].push(slot);
        }
        return groups;
    }, [slots]);

    const handleStartPayment = async () => {
        if (!selectedSlotId) return;
        setStartingPayment(true);
        setError('');
        try {
            const res = await api.post('/orders/checkout', { pickupSlotId: selectedSlotId });
            setCheckoutData(res.data);
            setStripePromise(loadStripe(res.data.publishableKey));
            await refreshCart();
        } catch (err) {
            console.error('Erreur checkout:', err);
            const msg = err.response?.data?.message || "Impossible de démarrer le paiement.";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setStartingPayment(false);
        }
    };

    const handlePaid = () => {
        showToast('Paiement en cours de confirmation', 'success');
        navigate('/orders');
    };

    if (items.length === 0 && !checkoutData) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="pb-16">
            <div className="max-w-3xl mx-auto px-4 pt-10">
                <button onClick={() => navigate('/cart')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors">
                    <ChevronLeft size={16} />
                    Retour au panier
                </button>

                <h1 className="text-2xl font-bold text-slate-900 mb-1">Retrait &amp; paiement</h1>
                <p className="text-slate-500 text-sm mb-8">Choisis ton point relais, un créneau, puis règle ta commande.</p>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg mb-6 text-sm">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {!checkoutData ? (
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <MapPin size={17} className="text-orange-600" />
                                Point relais
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {locations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setSelectedLocationId(loc.id)}
                                        className={`text-left p-4 rounded-xl border transition-colors ${selectedLocationId === loc.id ? 'border-orange-600 bg-orange-50 ring-1 ring-orange-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <p className="font-semibold text-slate-800 text-sm">{loc.name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{loc.address}, {loc.postalCode} {loc.city}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedLocationId && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Clock size={17} className="text-orange-600" />
                                    Créneau de retrait
                                </h2>

                                {loadingSlots ? (
                                    <p className="text-sm text-slate-500">Chargement des créneaux...</p>
                                ) : Object.keys(slotsByDate).length === 0 ? (
                                    <p className="text-sm text-slate-500">Aucun créneau disponible pour ce point relais.</p>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {Object.entries(slotsByDate).map(([date, daySlots]) => (
                                            <div key={date}>
                                                <p className="text-sm font-semibold text-slate-700 mb-2">{formatSlotDate(date)}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {daySlots.map((slot) => (
                                                        <button
                                                            key={slot.id}
                                                            onClick={() => setSelectedSlotId(slot.id)}
                                                            className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors ${selectedSlotId === slot.id ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                                                        >
                                                            {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                                                            <span className={`ml-1.5 text-xs font-normal ${selectedSlotId === slot.id ? 'text-orange-100' : 'text-slate-400'}`}>
                                                                {slot.remaining} place{slot.remaining > 1 ? 's' : ''}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-slate-700">{items.reduce((sum, i) => sum + i.quantity, 0)} article(s)</span>
                                <span className="text-lg font-bold text-orange-600">{total.toFixed(2)} €</span>
                            </div>
                            <Button size="lg" onClick={handleStartPayment} disabled={!selectedSlotId || startingPayment} className="w-full">
                                {startingPayment ? 'Préparation du paiement...' : 'Passer au paiement'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-5 pb-5 border-b border-slate-100">
                            <span className="text-sm font-semibold text-slate-700">Total à payer</span>
                            <span className="text-lg font-bold text-orange-600">{total.toFixed(2)} €</span>
                        </div>

                        {stripePromise && (
                            <Elements stripe={stripePromise} options={{ clientSecret: checkoutData.clientSecret }}>
                                <PaymentStep orderTotal={total} onPaid={handlePaid} />
                            </Elements>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;

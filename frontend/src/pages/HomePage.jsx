import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Leaf, CreditCard, UtensilsCrossed, Sparkles } from 'lucide-react';
import api from '../services/api';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const response = await api.get('/products');
                setFeaturedProducts(response.data.slice(0, 3));
            } catch (err) {
                console.error("Impossible de charger l'aperçu :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPreview();
    }, []);

    return (
        <div>
            <section className="relative overflow-hidden border-b border-slate-200 py-24 px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-slate-50 to-slate-50" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

                <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center">
                    <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 font-semibold px-3 py-1 rounded-full text-xs mb-6 ring-1 ring-orange-200">
                        <Sparkles size={13} />
                        NOUVEAU EN HAUTS-DE-FRANCE
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight tracking-tight">
                        Vos plats préférés,<br />
                        <span className="text-orange-600 italic">prêts quand vous l'êtes.</span>
                    </h1>
                    <p className="text-lg text-slate-500 mb-9 max-w-xl mx-auto">
                        Découvrez notre boutique de produits frais et artisanaux. Commandez en ligne, choisissez un point relais et un créneau, et venez récupérer votre commande sans attendre.
                    </p>
                    <Link to="/catalog" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors shadow-sm shadow-orange-900/10">
                        Voir le menu complet
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <section className="py-16 px-4 bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                            <Clock size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1.5">Créneau au choix</h3>
                        <p className="text-slate-500 text-sm">Réservez un point relais et un créneau de retrait qui vous arrange, sans file d'attente.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                            <Leaf size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1.5">Produits frais</h3>
                        <p className="text-slate-500 text-sm">Nous travaillons avec des producteurs locaux pour la meilleure qualité.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                            <CreditCard size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1.5">Paiement sécurisé</h3>
                        <p className="text-slate-500 text-sm">Réglez en ligne via Stripe, en toute sécurité, dès la validation du créneau.</p>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">À la une cette semaine</h2>
                            <p className="text-slate-500 mt-1.5 text-sm">Un aperçu de nos meilleures ventes.</p>
                        </div>
                        <Link to="/catalog" className="hidden md:inline-flex items-center gap-1 text-orange-600 font-semibold text-sm hover:underline">
                            Tout voir
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {!loading && featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-300">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UtensilsCrossed size={28} />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                                        <p className="text-orange-600 font-bold mt-1.5">{Number(product.price).toFixed(2)} €</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                <p className="text-slate-500 font-medium mb-2">Connectez-vous pour voir nos produits.</p>
                                <Link to="/login" className="text-orange-600 font-semibold hover:underline text-sm">Me connecter</Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

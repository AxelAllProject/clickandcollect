import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On essaie de récupérer quelques produits pour la vitrine
        const fetchPreview = async () => {
            try {
                const response = await api.get('/products');
                // On ne garde que les 3 premiers produits pour l'aperçu
                setFeaturedProducts(response.data.slice(0, 3));
            } catch (err) {
                console.error("Impossible de charger l'aperçu :", err);
                // Si l'utilisateur n'est pas connecté, l'API bloquera l'accès. C'est normal pour l'instant !
            } finally {
                setLoading(false);
            }
        };
        fetchPreview();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {}
            <section className="bg-orange-50 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <span className="bg-orange-100 text-orange-600 font-bold px-4 py-1 rounded-full text-sm mb-6 inline-block">
                        NOUVEAU DANS VOTRE VILLE 🚀
                    </span>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                        Vos plats préférés, <br/>
                        <span className="text-orange-500">prêts quand vous l'êtes.</span>
                    </h2>
                    <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                        Découvrez notre boutique de produits frais et artisanaux. Commandez en ligne, évitez la file d'attente, et passez récupérer votre commande directement au comptoir !
                    </p>
                    <Link to="/catalog" className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-500/30 transition-transform transform hover:scale-105">
                        Voir le Menu complet 🍔
                    </Link>
                </div>
            </section>

            {}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="text-5xl mb-4">⏱️</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Zéro attente</h3>
                        <p className="text-gray-500">Votre commande vous attend bien au chaud (ou au frais) à l'heure exacte de votre choix.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-5xl mb-4">🌱</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Produits frais</h3>
                        <p className="text-gray-500">Nous travaillons avec des producteurs locaux pour vous garantir la meilleure qualité.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-5xl mb-4">💳</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Paiement sécurisé</h3>
                        <p className="text-gray-500">Payez en ligne en un clic de manière 100% sécurisée pour un retrait éclair.</p>
                    </div>
                </div>
            </section>

            {}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">À la une cette semaine</h2>
                            <p className="text-gray-500 mt-2">Un petit aperçu de nos meilleures ventes.</p>
                        </div>
                        <Link to="/catalog" className="hidden md:block text-orange-500 font-bold hover:underline">
                            Tout voir →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="h-48 bg-orange-100 flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl">🍽️</span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                                        <p className="text-orange-500 font-black text-xl mt-2">{product.price} €</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-semibold mb-2">Connectez-vous pour voir nos délicieux produits !</p>
                                <Link to="/login" className="text-orange-500 font-bold hover:underline">Me connecter</Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {}
            <footer className="bg-gray-900 text-gray-400 py-10 text-center">
                <p>© 2026 Click & Collect. Fait avec passion par un super Chef Plombier.</p>
            </footer>

        </div>
    );
};

export default HomePage;
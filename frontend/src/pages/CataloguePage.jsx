import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

const CataloguePage = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    
    const navigate = useNavigate();

  
    useEffect(() => {
        const loadProducts = async () => {
            try {
                // On va chercher les produits (le token est envoyé automatiquement si configuré)
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des produits :", err);
                setError("Impossible de charger le menu. Êtes-vous bien connecté ?");
            } finally {
                setLoading(false); // On arrête le chargement quoi qu'il arrive
            }
        };

        loadProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login'); 
    };


    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-12">
            
            {/* Contenu principal */}
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Notre Menu</h2>

                {/* Gestion des états : Chargement ou Erreur */}
                {loading && <p className="text-center text-gray-500">Chargement des délices en cours... ⏳</p>}
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center max-w-md mx-auto mb-8">
                        {error}
                    </div>
                )}

                {/* La Grille des Produits */}
                {!loading && !error && (
                    <div>
                        <div className="mb-6 flex justify-between items-center gap-4">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher un produit..."
                                className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-300 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.filter(p => p.name && p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
                                <article key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                                    <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-4xl">🍔</div>
                                        )}
                                        <span className="absolute top-3 left-3 bg-white/80 text-sm px-2 py-1 rounded font-semibold">{product.name}</span>
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow">
                                        <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-3">{product.description}</p>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-extrabold text-orange-500">{product.price ? Number(product.price).toFixed(2) : '0.00'} €</span>
                                            </div>
                                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg">Ajouter</button>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {products.length === 0 && (
                                <div className="col-span-full text-center text-gray-500 bg-white p-8 rounded-2xl shadow-sm">
                                    Aucun produit n'est disponible pour le moment. L'Admin doit remplir le frigo ! 🧊
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CataloguePage;
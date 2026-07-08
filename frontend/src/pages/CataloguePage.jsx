import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

const CataloguePage = () => {
    // --- LA MÉMOIRE ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // --- LA TUYAUTERIE ---
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
        localStorage.removeItem('jwt_token'); // On vide le coffre-fort
        navigate('/login'); // On retourne à l'accueil
    };

    // --- LE VISUEL (DA TAILWIND) ---
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        
                        {/* Boucle d'affichage React */}
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
                                
                                {/* Zone Image */}
                                <div className="h-48 bg-orange-50 flex items-center justify-center">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">🍔</span> // Icône par défaut si pas d'image
                                    )}
                                </div>

                                {/* Zone Informations */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">
                                        {product.description}
                                    </p>
                                    
                                    {/* Prix et Bouton */}
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xl font-black text-orange-500">
                                            {product.price} €
                                        </span>
                                        <button className="bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-800 font-bold py-2 px-4 rounded-xl transition-colors duration-200">
                                            Ajouter
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}

                        {/* Message si le catalogue est vide (mais sans erreur) */}
                        {products.length === 0 && !loading && (
                            <div className="col-span-full text-center text-gray-500 bg-white p-8 rounded-2xl shadow-sm">
                                Aucun produit n'est disponible pour le moment. L'Admin doit remplir le frigo ! 🧊
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default CataloguePage;
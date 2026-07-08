import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPage = () => {
    // --- 1. LA MÉMOIRE ---
    const [products, setProducts] = useState([]);
    
    // Mémoire pour le formulaire d'ajout
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    const [message, setMessage] = useState('');

    // --- 2. LA TUYAUTERIE ---
    // A. Charger les produits (READ)
    const loadProducts = async () => {
        try {
            const response = await api.get('/products'); // Vérifie cette URL dans ton backend !
            setProducts(response.data);
        } catch (err) {
            console.error("Erreur de chargement:", err);
            setMessage("❌ Impossible de charger les produits.");
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // B. Ajouter un produit (CREATE)
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                name,
                description,
                price: parseFloat(price), // On s'assure que c'est un nombre
                imageUrl
            });
            setMessage("✅ Produit ajouté avec succès !");
            // On vide le formulaire
            setName(''); setDescription(''); setPrice(''); setImageUrl('');
            // On recharge la liste pour voir le nouveau produit
            loadProducts();
        } catch (err) {
            console.error("Erreur d'ajout:", err);
            setMessage("❌ Erreur lors de l'ajout. Êtes-vous bien ADMIN ?");
        }
    };

    // C. Supprimer un produit (DELETE)
    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
        
        try {
            await api.delete(`/products/${id}`);
            setMessage("🗑️ Produit supprimé.");
            loadProducts(); // On recharge la liste
        } catch (err) {
            console.error("Erreur de suppression:", err);
            setMessage("❌ Erreur lors de la suppression.");
        }
    };

    // --- 3. LE VISUEL (DA TAILWIND ADMIN) ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12">
            
            {/* Navbar Admin */}
            <nav className="bg-indigo-900 text-white shadow-md p-4 mb-8">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚙️</span>
                        <h1 className="text-xl font-bold">Panel Administration</h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLONNE GAUCHE : Formulaire d'ajout */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Ajouter un produit</h2>
                        
                        {message && (
                            <div className="mb-4 p-3 rounded bg-indigo-50 text-indigo-700 text-sm font-semibold">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Nom du produit</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                    className="w-full p-2 mt-1 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3"
                                    className="w-full p-2 mt-1 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">Prix (€)</label>
                                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                                    className="w-full p-2 mt-1 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">URL de l'image (Optionnel)</label>
                                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full p-2 mt-1 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>

                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg p-3 mt-2 transition-colors">
                                + Créer le produit
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLONNE DROITE : Liste des produits */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Stock actuel ({products.length})</h2>
                        
                        <div className="flex flex-col gap-3">
                            {products.length === 0 ? (
                                <p className="text-gray-500 italic">Aucun produit dans la base de données.</p>
                            ) : (
                                products.map((product) => (
                                    <div key={product.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="flex items-center justify-center h-full text-xl">🍔</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{product.name}</h3>
                                                <p className="text-sm text-gray-500 font-semibold">{product.price} €</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors font-bold text-sm"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPage;
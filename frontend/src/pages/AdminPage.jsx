import React, { useState, useEffect } from 'react';
import { Settings, Plus, Pencil, Trash2, Save, X, UtensilsCrossed, ShieldPlus } from 'lucide-react';
import api from '../services/api';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminDashboard from './AdminDashboard';

const fieldClass = "w-full p-2.5 mt-1 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-shadow";

const AdminPage = () => {
    const [products, setProducts] = useState([]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [message, setMessage] = useState('');
    const [promoteEmail, setPromoteEmail] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editImageUrl, setEditImageUrl] = useState('');
    const [editStock, setEditStock] = useState('');

    const loadProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            console.error("Erreur de chargement:", err);
            setMessage("Impossible de charger les produits.");
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const [activeTab, setActiveTab] = useState('dashboard');

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock || '0'),
                imageUrl
            });
            setMessage("Produit ajouté avec succès.");

            setName(''); setDescription(''); setPrice(''); setImageUrl('');
            setStock('');

            loadProducts();
        } catch (err) {
            console.error("Erreur d'ajout:", err);
            setMessage("Erreur lors de l'ajout. Êtes-vous bien ADMIN ?");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

        try {
            await api.delete(`/products/${id}`);
            setMessage("Produit supprimé.");
            loadProducts();
        } catch (err) {
            console.error("Erreur de suppression:", err);
            setMessage("Erreur lors de la suppression.");
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setEditName(product.name || '');
        setEditDescription(product.description || '');
        setEditPrice(product.price || '');
        setEditImageUrl(product.imageUrl || '');
        setEditStock(product.stock || 0);
        setMessage('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName(''); setEditDescription(''); setEditPrice(''); setEditImageUrl('');
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editingId}`, {
                name: editName,
                description: editDescription,
                price: parseFloat(editPrice),
                stock: parseInt(editStock || '0'),
                imageUrl: editImageUrl
            });
            setMessage('Produit mis à jour.');
            cancelEdit();
            loadProducts();
        } catch (err) {
            console.error('Erreur mise à jour:', err);
            setMessage('Erreur lors de la mise à jour.');
        }
    };

    const TABS = [
        { key: 'dashboard', label: 'Aperçu' },
        { key: 'products', label: 'Produits' },
        { key: 'users', label: 'Utilisateurs' },
        { key: 'orders', label: 'Commandes' },
    ];

    return (
        <div className="pb-16">
            <div className="bg-slate-900 text-white mb-8">
                <div className="max-w-6xl mx-auto flex items-center gap-2.5 px-4 py-5">
                    <Settings size={20} className="text-slate-300" />
                    <h1 className="text-lg font-bold">Panel Administration</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <div className="inline-flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'dashboard' ? (
                <div className="max-w-6xl mx-auto px-4">
                    <AdminDashboard />
                </div>
            ) : activeTab === 'products' ? (
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                            <h2 className="text-base font-bold text-slate-800 mb-4">Ajouter un produit</h2>

                            {message && (
                                <div className="mb-4 p-3 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Nom du produit</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                        className={fieldClass} />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3"
                                        className={fieldClass}></textarea>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">Prix (€)</label>
                                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                                        className={fieldClass} />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">Stock</label>
                                    <input type="number" step="1" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required
                                        className={fieldClass} />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700">URL de l'image (optionnel)</label>
                                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className={fieldClass} />
                                </div>

                                <button type="submit" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg p-3 mt-2 transition-colors">
                                    <Plus size={17} /> Créer le produit
                                </button>
                            </form>

                            <div className="mt-6 border-t border-slate-100 pt-4">
                                <h3 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                    <ShieldPlus size={15} className="text-slate-400" />
                                    Promouvoir un utilisateur
                                </h3>
                                <p className="text-xs text-slate-500 mb-2">Entrez l'email et cliquez sur Promouvoir.</p>
                                <div className="flex gap-2">
                                    <input type="email" value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} placeholder="user@example.com"
                                        className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none" />
                                    <button onClick={async () => {
                                        try {
                                            await api.post('/admin/promote', { email: promoteEmail });
                                            setMessage('Utilisateur promu en ADMIN.');
                                            setPromoteEmail('');
                                        } catch (err) {
                                            console.error('Erreur promotion:', err);
                                            setMessage('Impossible de promouvoir (vérifie les droits).');
                                        }
                                    }} className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 rounded-lg text-sm whitespace-nowrap transition-colors">
                                        Promouvoir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                            <h2 className="text-base font-bold text-slate-800 mb-4">Stock actuel ({products.length})</h2>

                            <div className="flex flex-col gap-3">
                                {products.length === 0 ? (
                                    <p className="text-slate-500 italic text-sm">Aucun produit dans la base de données.</p>
                                ) : (
                                    products.map((product) => (
                                        <div key={product.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                            {editingId === product.id ? (
                                                <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
                                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} required
                                                        className="p-2 rounded-lg border border-slate-300 text-sm" />
                                                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2}
                                                        className="p-2 rounded-lg border border-slate-300 text-sm" />
                                                    <input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                                                        className="p-2 rounded-lg border border-slate-300 text-sm" />
                                                    <input type="number" step="1" min="0" value={editStock} onChange={(e) => setEditStock(e.target.value)}
                                                        className="p-2 rounded-lg border border-slate-300 text-sm" />
                                                    <input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)}
                                                        className="p-2 rounded-lg border border-slate-300 text-sm" />
                                                    <div className="flex gap-2">
                                                        <button className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors">
                                                            <Save size={14} /> Enregistrer
                                                        </button>
                                                        <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-2 rounded-lg transition-colors">
                                                            <X size={14} /> Annuler
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-11 h-11 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-300">
                                                            {product.imageUrl ? (
                                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <UtensilsCrossed size={16} />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-semibold text-slate-800 text-sm truncate">{product.name}</h3>
                                                            <p className="text-sm text-slate-500 font-medium">{product.price} € · stock {product.stock}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 flex-shrink-0">
                                                        <button onClick={() => startEdit(product)}
                                                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors font-semibold text-sm">
                                                            <Pencil size={14} /> Éditer
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="inline-flex items-center gap-1.5 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors font-semibold text-sm"
                                                        >
                                                            <Trash2 size={14} /> Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            ) : activeTab === 'users' ? (
                <div className="max-w-6xl mx-auto px-4">
                    <AdminUsers />
                </div>
            ) : (
                <div className="max-w-6xl mx-auto px-4">
                    <AdminOrders />
                </div>
            )}
        </div>
    );
};

export default AdminPage;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UtensilsCrossed, Minus, Plus, PackageSearch, AlertCircle, ArrowUpDown } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const SORT_OPTIONS = [
    { value: 'default', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name', label: 'Nom (A-Z)' },
];

const CataloguePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('default');
    const [quantities, setQuantities] = useState({});
    const [addingId, setAddingId] = useState(null);

    const { addItem } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des produits :", err);
                setError("Impossible de charger le menu. Êtes-vous bien connecté ?");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const getQuantity = (id) => quantities[id] || 1;

    const setQuantity = (id, value) => {
        setQuantities((prev) => ({ ...prev, [id]: Math.max(1, value) }));
    };

    const handleAddToCart = async (product) => {
        if (!localStorage.getItem('jwt_token')) {
            navigate('/login');
            return;
        }
        setAddingId(product.id);
        setError('');
        try {
            await addItem(product.id, getQuantity(product.id));
            showToast(`${product.name} ajouté au panier`, 'success');
            setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
        } catch (err) {
            console.error("Erreur lors de l'ajout au panier :", err);
            const msg = err.response?.data?.message || "Impossible d'ajouter ce produit au panier.";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setAddingId(null);
        }
    };

    const filteredProducts = useMemo(() => {
        const list = products.filter(p => p.name && p.name.toLowerCase().includes(search.toLowerCase()));
        switch (sort) {
            case 'price-asc':
                return [...list].sort((a, b) => a.price - b.price);
            case 'price-desc':
                return [...list].sort((a, b) => b.price - a.price);
            case 'name':
                return [...list].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return list;
        }
    }, [products, search, sort]);

    return (
        <div className="pb-16">
            <div className="max-w-6xl mx-auto px-4 pt-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Notre menu</h1>
                <p className="text-slate-500 text-sm mb-8">Des produits frais, prêts à emporter.</p>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                                <div className="h-44 skeleton" />
                                <div className="p-4 flex flex-col gap-2">
                                    <div className="h-4 w-2/3 rounded skeleton" />
                                    <div className="h-3 w-full rounded skeleton" />
                                    <div className="h-8 w-full rounded skeleton mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg text-sm max-w-md mx-auto mb-8">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div>
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="relative flex-grow sm:max-w-sm">
                                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher un produit..."
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 outline-none transition-shadow"
                                />
                            </div>

                            <div className="relative">
                                <ArrowUpDown size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 appearance-none bg-white"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <span className="text-sm text-slate-400 sm:ml-auto">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filteredProducts.map((product, idx) => {
                                const lowStock = product.stock > 0 && product.stock <= 5;
                                const outOfStock = product.stock === 0;
                                return (
                                    <article
                                        key={product.id}
                                        className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col animate-fade-up"
                                        style={{ animationDelay: `${Math.min(idx, 8) * 50}ms` }}
                                    >
                                        <div className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden text-slate-300">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                            ) : (
                                                <UtensilsCrossed size={30} />
                                            )}
                                            {outOfStock && (
                                                <span className="absolute top-3 left-3 bg-slate-900/85 text-white text-xs font-semibold px-2 py-1 rounded-md">Épuisé</span>
                                            )}
                                            {lowStock && (
                                                <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-md">Plus que {product.stock}</span>
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-semibold text-slate-800 mb-1">{product.name}</h3>
                                            <p className="text-sm text-slate-500 mb-3 flex-grow line-clamp-2">{product.description}</p>

                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-lg font-bold text-orange-600">{product.price ? Number(product.price).toFixed(2) : '0.00'} €</span>
                                                {!outOfStock && (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => setQuantity(product.id, getQuantity(product.id) - 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-5 text-center text-sm font-semibold text-slate-700">{getQuantity(product.id)}</span>
                                                        <button
                                                            onClick={() => setQuantity(product.id, getQuantity(product.id) + 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={addingId === product.id || outOfStock}
                                                className="w-full font-semibold text-sm py-2.5 rounded-lg text-white transition-all active:scale-[0.98] disabled:opacity-50 bg-orange-600 hover:bg-orange-700"
                                            >
                                                {outOfStock ? 'Épuisé' : addingId === product.id ? 'Ajout...' : 'Ajouter au panier'}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}

                            {filteredProducts.length === 0 && (
                                <div className="col-span-full flex flex-col items-center text-center text-slate-500 bg-white p-12 rounded-xl border border-slate-200">
                                    <PackageSearch size={32} className="text-slate-300 mb-3" />
                                    {products.length === 0 ? "Aucun produit n'est disponible pour le moment." : 'Aucun résultat pour cette recherche.'}
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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LayoutDashboard, ClipboardList, UserCircle, Settings2, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { itemCount, resetCart } = useCart();
    const token = localStorage.getItem('jwt_token');
    const isLoggedIn = !!token;
    const claims = isLoggedIn ? decodeToken(token) : null;
    const userRole = claims?.role || null;
    const userEmail = claims?.sub || '';
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        resetCart();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3.5">
                <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-600 text-white">
                        <ShoppingBag size={18} strokeWidth={2.25} />
                    </span>
                    Click<span className="text-orange-600">&amp;</span>Collect
                </Link>

                <div className="flex items-center gap-5">
                    <Link to="/catalog" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Menu</Link>
                    {userRole === 'ADMIN' && (
                        <Link to="/admin" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                            <LayoutDashboard size={16} />
                            Admin
                        </Link>
                    )}

                    {isLoggedIn && (
                        <Link to="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <ShoppingCart size={19} />
                            {itemCount > 0 && (
                                <span key={itemCount} className="animate-pop absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[11px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                            >
                                {userEmail ? userEmail[0].toUpperCase() : '?'}
                            </button>

                            {isOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20">
                                        <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                                            <p className="text-xs text-slate-400">Connecté en tant que</p>
                                            <p className="text-sm font-semibold text-slate-800 truncate">{userEmail}</p>
                                        </div>
                                        <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <ClipboardList size={16} className="text-slate-400" />
                                            Mes commandes
                                        </Link>
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <UserCircle size={16} className="text-slate-400" />
                                            Mon profil
                                        </Link>
                                        <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <Settings2 size={16} className="text-slate-400" />
                                            Paramètres
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                        >
                                            <LogOut size={16} />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

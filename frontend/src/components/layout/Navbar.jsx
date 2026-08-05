import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    ShoppingBag,
    ShoppingCart,
    LayoutDashboard,
    ClipboardList,
    UserCircle,
    Settings2,
    LogOut,
} from 'lucide-react';
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
    const [scrolled, setScrolled] = useState(false);
    const { itemCount, resetCart } = useCart();
    const token = localStorage.getItem('jwt_token');
    const isLoggedIn = !!token;
    const claims = isLoggedIn ? decodeToken(token) : null;
    const userRole = claims?.role || null;
    const userEmail = claims?.sub || '';
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isHome = pathname === '/';

    // La navbar se pose sur le hero (transparente) puis gagne un fond opaque
    // et une ombre dès que la page défile.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        resetCart();
        setIsOpen(false);
        navigate('/');
    };

    const transparent = isHome && !scrolled;

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                transparent
                    ? 'bg-transparent'
                    : 'bg-slate-50/85 backdrop-blur-md border-b border-slate-200 shadow-sm shadow-slate-900/[0.03]'
            }`}
        >
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3.5">
                <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white">
                        <ShoppingBag size={18} strokeWidth={2.25} />
                    </span>
                    Click<span className="text-orange-600">&amp;</span>Collect
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        to="/catalog"
                        className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                    >
                        Catalogue
                    </Link>

                    {isHome && (
                        <a
                            href="#etapes"
                            className="hidden md:inline-flex px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                        >
                            Comment ça marche
                        </a>
                    )}

                    {userRole === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                        >
                            <LayoutDashboard size={16} />
                            Admin
                        </Link>
                    )}

                    {isLoggedIn && (
                        <Link
                            to="/cart"
                            className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                            aria-label="Mon panier"
                        >
                            <ShoppingCart size={19} />
                            {itemCount > 0 && (
                                <span
                                    key={itemCount}
                                    className="animate-pop absolute -top-1 -right-1 bg-orange-600 text-white text-[11px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-slate-50"
                                >
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-700 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
                                aria-label="Menu du compte"
                            >
                                {userEmail ? userEmail[0].toUpperCase() : '?'}
                            </button>

                            {isOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 py-1.5 z-20 animate-fade-up">
                                        <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                                            <p className="text-xs text-slate-400">Connecté en tant que</p>
                                            <p className="text-sm font-semibold text-slate-800 truncate">{userEmail}</p>
                                        </div>
                                        <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                            <ClipboardList size={16} className="text-slate-400" />
                                            Mes commandes
                                        </Link>
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                            <UserCircle size={16} className="text-slate-400" />
                                            Mon profil
                                        </Link>
                                        <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                            <Settings2 size={16} className="text-slate-400" />
                                            Paramètres
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
                                        >
                                            <LogOut size={16} />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-700 transition-colors shadow-sm shadow-orange-900/10"
                        >
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

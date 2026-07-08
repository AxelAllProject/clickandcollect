import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    // On vérifie si le token existe pour savoir si on est connecté
    const isLoggedIn = !!localStorage.getItem('jwt_token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        setIsOpen(false);
        navigate('/'); // Retour à l'accueil
    };

    return (
        <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-gray-900">🛍️ Click<span className="text-orange-500">&</span>Collect</Link>
                
                <div className="flex items-center gap-6">
                    <Link to="/catalog" className="font-semibold text-gray-600 hover:text-orange-500">Menu</Link>

                    {isLoggedIn ? (
                        /* Menu déroulant profil */
                        <div className="relative">
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                            >
                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    U
                                </div>
                            </button>

                            {/* Le menu qui descend */}
                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs text-gray-400">Mon compte</p>
                                    </div>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Mon profil</Link>
                                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Paramètres</Link>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Mes commandes</Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                                    >
                                        Se déconnecter
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Boutons si déconnecté */
                        <Link to="/login" className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Outil de React Router pour forcer le changement de page
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('jwt_token', response.data.token);
            
            // Redirection automatique vers le catalogue après connexion !
            navigate('/');
        } catch (err) {
            console.error("Erreur de connexion:", err);
            setError("Identifiants incorrects ou problème de serveur.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
                
                <div className="text-center mb-8">
                    <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🛍️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Click & Collect</h2>
                    <p className="text-sm text-gray-500">Connectez-vous pour commander</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="jean.dupont@email.com"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg p-4 mt-2 transition-colors duration-200">
                        Se connecter 🚀
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Pas encore de compte ? <Link to="/register" className="text-orange-500 font-bold hover:underline">Créer un compte</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
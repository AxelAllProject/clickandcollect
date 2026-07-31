import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const inputClass = "w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-shadow";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshCart } = useCart();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('jwt_token', response.data.token);
            await refreshCart();
            navigate('/');
        } catch (err) {
            console.error("Erreur de connexion:", err);
            setError("Identifiants incorrects ou problème de serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-slate-200 p-8">

                <div className="text-center mb-8">
                    <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                        <ShoppingBag size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-1">Click &amp; Collect</h1>
                    <p className="text-sm text-slate-500">Connectez-vous pour commander</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-6">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="jean.dupont@email.com"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className={inputClass}
                        />
                    </div>

                    <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Pas encore de compte ? <Link to="/register" className="text-orange-600 font-semibold hover:underline">Créer un compte</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;

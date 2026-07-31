import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';

const inputClass = "w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-shadow";

const RegisterPage = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 12) {
            setError("Le mot de passe doit contenir au moins 12 caractères.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { firstname, lastname, email, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            console.error("Erreur d'inscription:", err);
            if (err.response && err.response.status === 400) {
                setError("Données invalides. Vérifiez les champs requis.");
            } else {
                setError("Impossible de créer le compte. L'email existe peut-être déjà.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-slate-200 p-8">

                <div className="text-center mb-8">
                    <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-1">Créer un compte</h1>
                    <p className="text-sm text-slate-500">Rejoignez Click &amp; Collect</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-6">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm mb-6">
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                        Compte créé avec succès, redirection...
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="text-sm font-medium text-slate-700">Prénom</label>
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                                placeholder="Jean"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="text-sm font-medium text-slate-700">Nom</label>
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                                placeholder="Dupont"
                                className={inputClass}
                            />
                        </div>
                    </div>

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
                            placeholder="••••••••••••"
                            minLength="12"
                            className={inputClass}
                        />
                        <span className="text-xs text-slate-400">12 caractères minimum</span>
                    </div>

                    <Button type="submit" size="lg" disabled={loading || success} className="w-full mt-1">
                        {loading ? 'Création...' : "M'inscrire"}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Déjà un compte ? <Link to="/login" className="text-orange-600 font-semibold hover:underline">Se connecter</Link>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;

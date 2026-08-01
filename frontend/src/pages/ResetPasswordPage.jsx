import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';

const inputClass = "w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-shadow";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 12) {
            setError('Le mot de passe doit contenir au moins 12 caractères.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Les deux mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error('Erreur réinitialisation mot de passe:', err);
            setError(err.response?.data?.message || "Lien invalide ou expiré, refais une demande.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-slate-200 p-8">

                <div className="text-center mb-8">
                    <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-1">Nouveau mot de passe</h1>
                    <p className="text-sm text-slate-500">Choisis un nouveau mot de passe pour ton compte.</p>
                </div>

                {!token && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-6">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        Lien invalide : aucun token trouvé dans l'URL.
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-6">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm">
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                        Mot de passe réinitialisé, redirection vers la connexion...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={12}
                                placeholder="••••••••••••"
                                className={inputClass}
                            />
                            <span className="text-xs text-slate-400">12 caractères minimum</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={12}
                                placeholder="••••••••••••"
                                className={inputClass}
                            />
                        </div>

                        <Button type="submit" size="lg" disabled={loading || !token} className="w-full mt-1">
                            {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                        </Button>
                    </form>
                )}

                <div className="mt-8 text-center text-sm text-slate-500">
                    <Link to="/login" className="text-orange-600 font-semibold hover:underline">Retour à la connexion</Link>
                </div>

            </div>
        </div>
    );
};

export default ResetPasswordPage;

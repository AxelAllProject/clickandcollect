import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';

const inputClass = "w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-shadow";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            console.error('Erreur mot de passe oublié:', err);
            setError("Une erreur est survenue, réessaie plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-slate-200 p-8">

                <div className="text-center mb-8">
                    <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                        <KeyRound size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-1">Mot de passe oublié</h1>
                    <p className="text-sm text-slate-500">On t'envoie un lien de réinitialisation par email.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-6">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {sent ? (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm">
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                        Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                placeholder="jean.dupont@email.com"
                                className={inputClass}
                            />
                        </div>

                        <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
                            {loading ? 'Envoi...' : 'Envoyer le lien'}
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

export default ForgotPasswordPage;

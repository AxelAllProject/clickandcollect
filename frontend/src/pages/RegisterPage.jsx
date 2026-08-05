import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import Alert from '../components/ui/Alert';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const HIGHLIGHTS = [
    'Un compte gratuit, sans engagement',
    'Vos créneaux et commandes au même endroit',
    'Réservez votre premier panier en 2 minutes',
];

const QUOTE = {
    texte: "Créer le compte m'a pris une minute, et j'avais mon panier prêt pour le soir même.",
    auteur: 'Thomas, client à Roubaix',
};

const RegisterPage = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { refreshCart } = useCart();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (userResponse) => {
        setError('');
        localStorage.setItem('jwt_token', userResponse.token);
        await refreshCart();
        navigate('/');
    };

    const handleGoogleError = (err) => {
        console.error("Erreur d'inscription Google:", err);
        setError("Impossible de continuer avec Google.");
    };

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
        <AuthLayout
            icon={UserPlus}
            title="Créer votre compte"
            subtitle="Quelques informations et votre premier panier est à portée de clic."
            highlights={HIGHLIGHTS}
            quote={QUOTE}
            footer={
                <>
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                        Se connecter
                    </Link>
                </>
            }
        >
            {error && <Alert className="mb-6">{error}</Alert>}
            {success && (
                <Alert tone="success" className="mb-6">
                    Compte créé avec succès, redirection...
                </Alert>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                    <TextField
                        label="Prénom"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                        autoComplete="given-name"
                        placeholder="Jean"
                    />
                    <TextField
                        label="Nom"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                        autoComplete="family-name"
                        placeholder="Dupont"
                    />
                </div>

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="jean.dupont@email.com"
                />

                <TextField
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={12}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    hint="12 caractères minimum"
                />

                <Button type="submit" size="lg" disabled={loading || success} className="w-full mt-1">
                    {loading ? 'Création...' : "Créer mon compte"}
                </Button>
            </form>

            <div className="flex items-center gap-3 my-7">
                <div className="flex-grow h-px bg-slate-200" />
                <span className="text-xs text-slate-400">ou continuer avec</span>
                <div className="flex-grow h-px bg-slate-200" />
            </div>

            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </AuthLayout>
    );
};

export default RegisterPage;

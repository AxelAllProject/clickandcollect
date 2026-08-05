import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import Alert from '../components/ui/Alert';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Étape 2FA : si le backend renvoie twoFactorRequired, on demande le code
    // envoyé par email avant de finaliser la connexion.
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [code, setCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    const { refreshCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const completeLogin = async (token) => {
        localStorage.setItem('jwt_token', token);
        await refreshCart();
        navigate('/');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.twoFactorRequired) {
                setTwoFactorRequired(true);
            } else {
                await completeLogin(response.data.user.token);
            }
        } catch (err) {
            console.error("Erreur de connexion:", err);
            setError("Identifiants incorrects ou problème de serveur.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setVerifying(true);

        try {
            const response = await api.post('/auth/2fa/verify', { email, code });
            await completeLogin(response.data.token);
        } catch (err) {
            console.error("Erreur de vérification 2FA:", err);
            setError("Code invalide ou expiré.");
        } finally {
            setVerifying(false);
        }
    };

    const handleResendCode = async () => {
        setResending(true);
        try {
            await api.post('/auth/2fa/resend', { email });
            showToast('Un nouveau code a été envoyé.', 'success');
        } catch (err) {
            console.error("Erreur de renvoi du code:", err);
            showToast("Impossible de renvoyer le code.", 'error');
        } finally {
            setResending(false);
        }
    };

    const handleGoogleSuccess = async (userResponse) => {
        setError('');
        await completeLogin(userResponse.token);
    };

    const handleGoogleError = (err) => {
        console.error("Erreur de connexion Google:", err);
        setError("Impossible de se connecter avec Google.");
    };

    return (
        <AuthLayout
            icon={twoFactorRequired ? ShieldCheck : LogIn}
            title={twoFactorRequired ? 'Vérification en deux étapes' : 'Content de vous revoir'}
            subtitle={
                twoFactorRequired
                    ? `Saisissez le code à 6 chiffres envoyé à ${email}.`
                    : 'Connectez-vous pour commander et suivre vos retraits.'
            }
            footer={
                !twoFactorRequired && (
                    <>
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-orange-600 font-semibold hover:underline">
                            Créer un compte
                        </Link>
                    </>
                )
            }
        >
            {error && <Alert className="mb-6">{error}</Alert>}

            {twoFactorRequired ? (
                <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
                    <TextField
                        label="Code de vérification"
                        type="text"
                        inputMode="numeric"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        autoFocus
                        placeholder="123456"
                        hint="Valable 10 minutes."
                        className="tracking-[0.4em] text-center text-lg"
                    />

                    <Button type="submit" size="lg" disabled={verifying} className="w-full">
                        {verifying ? 'Vérification...' : 'Valider le code'}
                    </Button>

                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resending}
                        className="text-sm text-orange-600 font-semibold hover:underline disabled:opacity-50"
                    >
                        {resending ? 'Envoi...' : 'Renvoyer le code'}
                    </button>
                </form>
            ) : (
                <>
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                            autoComplete="current-password"
                            placeholder="••••••••"
                            action={
                                <Link to="/forgot-password" className="text-xs text-orange-600 font-semibold hover:underline">
                                    Mot de passe oublié ?
                                </Link>
                            }
                        />

                        <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    <div className="flex items-center gap-3 my-7">
                        <div className="flex-grow h-px bg-slate-200" />
                        <span className="text-xs text-slate-400">ou continuer avec</span>
                        <div className="flex-grow h-px bg-slate-200" />
                    </div>

                    <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                </>
            )}
        </AuthLayout>
    );
};

export default LoginPage;

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import Alert from '../components/ui/Alert';

const HIGHLIGHTS = [
    'Choisissez un mot de passe d\'au moins 12 caractères',
    'Le lien devient inutilisable après réinitialisation',
    'Vous serez redirigé vers la connexion',
];

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
        <AuthLayout
            icon={ShieldCheck}
            title="Nouveau mot de passe"
            subtitle="Choisissez un nouveau mot de passe pour votre compte."
            highlights={HIGHLIGHTS}
            footer={
                <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                    Retour à la connexion
                </Link>
            }
        >
            {!token && (
                <Alert className="mb-6">Lien invalide : aucun token trouvé dans l&apos;URL.</Alert>
            )}
            {error && <Alert className="mb-6">{error}</Alert>}

            {success ? (
                <Alert tone="success">
                    Mot de passe réinitialisé, redirection vers la connexion...
                </Alert>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <TextField
                        label="Nouveau mot de passe"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={12}
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        hint="12 caractères minimum"
                    />

                    <TextField
                        label="Confirmer le mot de passe"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={12}
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                    />

                    <Button type="submit" size="lg" disabled={loading || !token} className="w-full mt-1">
                        {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPasswordPage;

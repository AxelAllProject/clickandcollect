import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import api from '../services/api';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import Alert from '../components/ui/Alert';

const HIGHLIGHTS = [
    'Un lien de réinitialisation valable 30 minutes',
    'Aucun mot de passe transmis par email',
    'Vos commandes en cours restent intactes',
];

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
        <AuthLayout
            icon={KeyRound}
            title="Mot de passe oublié"
            subtitle="On vous envoie un lien de réinitialisation par email."
            highlights={HIGHLIGHTS}
            footer={
                <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                    Retour à la connexion
                </Link>
            }
        >
            {error && <Alert className="mb-6">{error}</Alert>}

            {sent ? (
                <Alert tone="success">
                    Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être envoyé.
                </Alert>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                        autoComplete="email"
                        placeholder="jean.dupont@email.com"
                    />

                    <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
                        {loading ? 'Envoi...' : 'Envoyer le lien'}
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPasswordPage;

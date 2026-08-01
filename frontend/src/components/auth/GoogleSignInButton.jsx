import React, { useEffect, useRef } from 'react';
import api from '../../services/api';

// Bouton "Se connecter avec Google" basé sur Google Identity Services.
// Le script est chargé globalement dans index.html ; ce composant récupère
// le Client ID (public, pas un secret) auprès du backend, puis délègue la
// vérification du jeton d'identité à POST /api/auth/google.
const GoogleSignInButton = ({ onSuccess, onError }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        let pollId;

        const renderButton = (clientId) => {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response) => {
                    try {
                        const res = await api.post('/auth/google', { idToken: response.credential });
                        onSuccess(res.data);
                    } catch (err) {
                        onError(err);
                    }
                },
            });

            window.google.accounts.id.renderButton(buttonRef.current, {
                theme: 'outline',
                size: 'large',
                width: 320,
                text: 'continue_with',
                locale: 'fr',
            });
        };

        const init = async () => {
            try {
                const { data } = await api.get('/auth/config');
                if (cancelled || !data.googleClientId) return;
                renderButton(data.googleClientId);
            } catch (err) {
                console.error('Impossible de charger la configuration Google:', err);
            }
        };

        if (window.google?.accounts?.id) {
            init();
        } else {
            pollId = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(pollId);
                    init();
                }
            }, 150);
        }

        return () => {
            cancelled = true;
            if (pollId) clearInterval(pollId);
        };
    }, [onSuccess, onError]);

    return <div ref={buttonRef} className="flex justify-center" />;
};

export default GoogleSignInButton;

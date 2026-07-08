import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    // --- 1. LA MÉMOIRE (Adaptée au DTO Spring Boot) ---
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // --- 2. LA TUYAUTERIE ---
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Vérification de sécurité côté React avant d'envoyer au backend
        if (password.length < 12) {
            setError("Le mot de passe doit contenir au moins 12 caractères.");
            return;
        }

        try {
            // Le colis correspond maintenant EXACTEMENT au RegisterRequestDTO Java
            await api.post('/auth/register', { 
                firstname: firstname, 
                lastname: lastname, 
                email: email, 
                password: password 
            });
            
            alert("Inscription réussie ! Connectez-vous maintenant.");
            navigate('/login'); 
            
        } catch (err) {
            console.error("Erreur d'inscription:", err);
            // On peut même afficher le message précis renvoyé par Spring Boot s'il y en a un
            if (err.response && err.response.status === 400) {
                setError("Données invalides. Vérifiez les champs requis.");
            } else {
                setError("Impossible de créer le compte. L'email existe peut-être déjà.");
            }
        }
    };

    // --- 3. LE VISUEL (DA TAILWIND) ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
                
                <div className="text-center mb-8">
                    <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">👋</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Créer un compte</h2>
                    <p className="text-sm text-gray-500">Rejoignez le Click & Collect</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    
                    {/* Les deux nouveaux champs côte à côte */}
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="text-sm font-semibold text-gray-700">Prénom</label>
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                                placeholder="Jean"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="text-sm font-semibold text-gray-700">Nom</label>
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                                placeholder="Dupont"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="jean.dupont@email.com"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••••••"
                            minLength="12"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-gray-400">12 caractères minimum</span>
                    </div>

                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg p-4 mt-2 transition-colors duration-200">
                        M'inscrire 🎉
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Déjà un compte ? <Link to="/login" className="text-emerald-500 font-bold hover:underline">Se connecter</Link>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;
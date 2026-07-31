import React, { useEffect, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

const SettingsPage = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const [locations, setLocations] = useState([]);
    const [favoriteLocationId, setFavoriteLocationId] = useState(null);

    useEffect(() => {
        Promise.all([api.get('/pickup-locations'), api.get('/profile')])
            .then(([locRes, profileRes]) => {
                setLocations(locRes.data);
                setFavoriteLocationId(profileRes.data.favoriteLocationId);
            })
            .catch((err) => {
                console.error('Erreur chargement paramètres:', err);
                setError("Impossible de charger tes paramètres.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await api.put('/profile/settings', { favoriteLocationId });
            showToast('Paramètres enregistrés', 'success');
        } catch (err) {
            console.error('Erreur enregistrement paramètres:', err);
            setError("Impossible d'enregistrer les paramètres.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-slate-500">Chargement...</p></div>;
    }

    return (
        <div className="pb-16">
            <div className="max-w-2xl mx-auto px-4 pt-10 flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Paramètres</h1>
                    <p className="text-slate-500 text-sm">Personnalise ton expérience Click &amp; Collect.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <MapPin size={18} className="text-orange-600" />
                        Point relais favori
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">Il sera présélectionné automatiquement au moment du paiement.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        <button
                            onClick={() => setFavoriteLocationId(null)}
                            className={`text-left p-4 rounded-xl border transition-colors ${favoriteLocationId === null ? 'border-orange-600 bg-orange-50 ring-1 ring-orange-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            <p className="font-semibold text-slate-800 text-sm">Aucun</p>
                            <p className="text-xs text-slate-500 mt-0.5">Choisir à chaque commande</p>
                        </button>

                        {locations.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => setFavoriteLocationId(loc.id)}
                                className={`text-left p-4 rounded-xl border transition-colors ${favoriteLocationId === loc.id ? 'border-orange-600 bg-orange-50 ring-1 ring-orange-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                            >
                                <p className="font-semibold text-slate-800 text-sm">{loc.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{loc.address}, {loc.postalCode} {loc.city}</p>
                            </button>
                        ))}
                    </div>

                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

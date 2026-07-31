import React, { useEffect, useState } from 'react';
import { UserCircle, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

const inputClass = "w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-shadow";
const readOnlyClass = "w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500";

const ProfilePage = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    useEffect(() => {
        api.get('/profile')
            .then((res) => {
                setEmail(res.data.email);
                setFirstname(res.data.firstname);
                setLastname(res.data.lastname);
                setPhone(res.data.phone || '');
            })
            .catch((err) => console.error('Erreur chargement profil:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileError('');
        try {
            await api.put('/profile', { firstname, lastname, phone });
            showToast('Profil mis à jour', 'success');
        } catch (err) {
            console.error('Erreur mise à jour profil:', err);
            setProfileError("Impossible de mettre à jour le profil.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (newPassword.length < 12) {
            setPasswordError('Le nouveau mot de passe doit contenir au moins 12 caractères.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Les deux mots de passe ne correspondent pas.');
            return;
        }

        setSavingPassword(true);
        try {
            await api.put('/profile/password', { currentPassword, newPassword });
            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showToast('Mot de passe modifié', 'success');
        } catch (err) {
            console.error('Erreur changement mot de passe:', err);
            setPasswordError(err.response?.data?.message || "Impossible de changer le mot de passe.");
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-slate-500">Chargement...</p></div>;
    }

    return (
        <div className="pb-16">
            <div className="max-w-2xl mx-auto px-4 pt-10 flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Mon profil</h1>
                    <p className="text-slate-500 text-sm">Gère tes informations personnelles.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <UserCircle size={18} className="text-orange-600" />
                        Informations personnelles
                    </h2>

                    {profileError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-5">
                            <AlertCircle size={16} className="flex-shrink-0" />
                            {profileError}
                        </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input value={email} disabled className={`${readOnlyClass} mt-1`} />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="text-sm font-medium text-slate-700">Prénom</label>
                                <input value={firstname} onChange={(e) => setFirstname(e.target.value)} required className={`${inputClass} mt-1`} />
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm font-medium text-slate-700">Nom</label>
                                <input value={lastname} onChange={(e) => setLastname(e.target.value)} required className={`${inputClass} mt-1`} />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Téléphone (pour te contacter au retrait)</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" className={`${inputClass} mt-1`} />
                        </div>

                        <Button type="submit" disabled={savingProfile} className="self-start mt-1">
                            {savingProfile ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <KeyRound size={18} className="text-orange-600" />
                        Mot de passe
                    </h2>

                    {passwordError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-5">
                            <AlertCircle size={16} className="flex-shrink-0" />
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm mb-5">
                            <CheckCircle2 size={16} className="flex-shrink-0" />
                            Mot de passe modifié avec succès.
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Mot de passe actuel</label>
                            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={`${inputClass} mt-1`} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={12} className={`${inputClass} mt-1`} />
                            <span className="text-xs text-slate-400">12 caractères minimum</span>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Confirmer le nouveau mot de passe</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={12} className={`${inputClass} mt-1`} />
                        </div>

                        <Button type="submit" disabled={savingPassword} className="self-start mt-1">
                            {savingPassword ? 'Modification...' : 'Changer le mot de passe'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

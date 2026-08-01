import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import api from '../services/api';

const fieldClass = "w-full p-2.5 mt-1 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-shadow";

const emptyForm = { name: '', address: '', city: '', postalCode: '' };

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(emptyForm);

    const loadLocations = async () => {
        try {
            const res = await api.get('/pickup-locations');
            setLocations(res.data);
        } catch (err) {
            console.error('Erreur chargement points relais:', err);
            setMessage('Impossible de charger les points relais.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadLocations(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/pickup-locations', form);
            setMessage('Point relais créé avec succès.');
            setForm(emptyForm);
            loadLocations();
        } catch (err) {
            console.error('Erreur création point relais:', err);
            setMessage(err.response?.data?.message || "Erreur lors de la création du point relais.");
        }
    };

    const startEdit = (location) => {
        setEditingId(location.id);
        setEditForm({
            name: location.name,
            address: location.address,
            city: location.city,
            postalCode: location.postalCode,
        });
        setMessage('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(emptyForm);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/pickup-locations/${editingId}`, editForm);
            setMessage('Point relais mis à jour.');
            cancelEdit();
            loadLocations();
        } catch (err) {
            console.error('Erreur mise à jour point relais:', err);
            setMessage(err.response?.data?.message || 'Erreur lors de la mise à jour.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce point relais ?')) return;
        try {
            await api.delete(`/pickup-locations/${id}`);
            setMessage('Point relais supprimé.');
            loadLocations();
        } catch (err) {
            console.error('Erreur suppression point relais:', err);
            setMessage(err.response?.data?.message || "Impossible de supprimer ce point relais.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MapPin size={17} className="text-indigo-600" />
                        Nouveau point relais
                    </h2>

                    {message && (
                        <div className="mb-4 p-3 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Nom</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={fieldClass} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Adresse</label>
                            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className={fieldClass} />
                        </div>
                        <div className="flex gap-3">
                            <div className="w-2/3">
                                <label className="text-sm font-medium text-slate-700">Ville</label>
                                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className={fieldClass} />
                            </div>
                            <div className="w-1/3">
                                <label className="text-sm font-medium text-slate-700">Code postal</label>
                                <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required className={fieldClass} />
                            </div>
                        </div>

                        <button type="submit" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg p-3 mt-2 transition-colors">
                            <Plus size={17} /> Créer le point relais
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Points relais ({locations.length})</h2>

                    {loading ? (
                        <p className="text-slate-500 text-sm">Chargement...</p>
                    ) : locations.length === 0 ? (
                        <p className="text-slate-500 italic text-sm">Aucun point relais.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {locations.map((location) => (
                                <div key={location.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                    {editingId === location.id ? (
                                        <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
                                            <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required
                                                className="p-2 rounded-lg border border-slate-300 text-sm" />
                                            <input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required
                                                className="p-2 rounded-lg border border-slate-300 text-sm" />
                                            <div className="flex gap-2">
                                                <input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} required
                                                    className="p-2 rounded-lg border border-slate-300 text-sm w-2/3" />
                                                <input value={editForm.postalCode} onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })} required
                                                    className="p-2 rounded-lg border border-slate-300 text-sm w-1/3" />
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors">
                                                    <Save size={14} /> Enregistrer
                                                </button>
                                                <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-2 rounded-lg transition-colors">
                                                    <X size={14} /> Annuler
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-slate-800 text-sm truncate">{location.name}</h3>
                                                <p className="text-sm text-slate-500 mt-0.5">{location.address}, {location.postalCode} {location.city}</p>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button onClick={() => startEdit(location)}
                                                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors font-semibold text-sm">
                                                    <Pencil size={14} /> Éditer
                                                </button>
                                                <button onClick={() => handleDelete(location.id)}
                                                    className="inline-flex items-center gap-1.5 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors font-semibold text-sm">
                                                    <Trash2 size={14} /> Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLocations;

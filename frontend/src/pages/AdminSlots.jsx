import React, { useEffect, useState } from 'react';
import { CalendarClock, MapPin, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const fieldClass = "w-full p-2.5 mt-1 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-shadow";

const formatDate = (isoDate) =>
    new Date(`${isoDate}T00:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

const AdminSlots = () => {
    const [locations, setLocations] = useState([]);
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const [locationId, setLocationId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [capacity, setCapacity] = useState('5');

    const loadData = async () => {
        try {
            const [locRes, slotRes] = await Promise.all([
                api.get('/pickup-locations'),
                api.get('/pickup-slots'),
            ]);
            setLocations(locRes.data);
            setSlots(slotRes.data);
        } catch (err) {
            console.error('Erreur chargement créneaux:', err);
            setMessage('Impossible de charger les points relais/créneaux.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/pickup-slots', {
                locationId: parseInt(locationId, 10),
                date,
                startTime,
                endTime,
                capacity: parseInt(capacity || '0', 10),
            });
            setMessage('Créneau créé avec succès.');
            setDate(''); setStartTime(''); setEndTime('');
            loadData();
        } catch (err) {
            console.error('Erreur création créneau:', err);
            setMessage(err.response?.data?.message || "Erreur lors de la création du créneau.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce créneau ?')) return;
        try {
            await api.delete(`/pickup-slots/${id}`);
            loadData();
        } catch (err) {
            console.error('Erreur suppression créneau:', err);
            setMessage("Impossible de supprimer ce créneau.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CalendarClock size={17} className="text-indigo-600" />
                        Nouveau créneau
                    </h2>

                    {message && (
                        <div className="mb-4 p-3 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Point relais</label>
                            <select value={locationId} onChange={(e) => setLocationId(e.target.value)} required className={fieldClass}>
                                <option value="" disabled>Choisir...</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={fieldClass} />
                        </div>

                        <div className="flex gap-3">
                            <div className="w-1/2">
                                <label className="text-sm font-medium text-slate-700">Début</label>
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={fieldClass} />
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm font-medium text-slate-700">Fin</label>
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className={fieldClass} />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Capacité (commandes max)</label>
                            <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} required className={fieldClass} />
                        </div>

                        <button type="submit" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg p-3 mt-2 transition-colors">
                            <Plus size={17} /> Créer le créneau
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Créneaux à venir ({slots.length})</h2>

                    {loading ? (
                        <p className="text-slate-500 text-sm">Chargement...</p>
                    ) : slots.length === 0 ? (
                        <p className="text-slate-500 italic text-sm">Aucun créneau à venir.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {slots.map((slot) => (
                                <div key={slot.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                                            <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                                            {slot.locationName} · {slot.locationCity}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-0.5">
                                            {formatDate(slot.date)} · {slot.startTime.slice(0, 5)}–{slot.endTime.slice(0, 5)} · {slot.remaining}/{slot.capacity} places
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(slot.id)}
                                        className="inline-flex items-center gap-1.5 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors font-semibold text-sm flex-shrink-0"
                                    >
                                        <Trash2 size={14} /> Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSlots;

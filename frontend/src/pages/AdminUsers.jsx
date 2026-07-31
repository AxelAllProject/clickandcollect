import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import api from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const loadUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Erreur chargement users', err);
            setMessage('Impossible de charger les utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const changeRole = async (id, role) => {
        try {
            await api.put(`/admin/users/${id}/role`, { role });
            setMessage('Rôle mis à jour.');
            loadUsers();
        } catch (err) {
            console.error('Erreur role', err);
            setMessage('Impossible de mettre à jour le rôle.');
        }
    };

    const removeUser = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setMessage('Utilisateur supprimé.');
            loadUsers();
        } catch (err) {
            console.error('Erreur delete', err);
            setMessage("Impossible de supprimer l'utilisateur.");
        }
    };

    return (
        <div>
            <h2 className="text-base font-bold text-slate-800 mb-4">Utilisateurs ({users.length})</h2>
            {message && <div className="mb-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">{message}</div>}

            {loading ? (
                <p className="text-slate-500 text-sm">Chargement...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                                <th className="py-3 px-4 font-semibold">Email</th>
                                <th className="py-3 px-4 font-semibold">Nom</th>
                                <th className="py-3 px-4 font-semibold">Rôle</th>
                                <th className="py-3 px-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                                    <td className="py-3 px-4 text-slate-700">{u.email}</td>
                                    <td className="py-3 px-4 text-slate-700">{u.firstname} {u.lastname}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2 justify-end">
                                            {u.role !== 'ADMIN' ? (
                                                <button onClick={() => changeRole(u.id, 'ADMIN')} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold transition-colors">
                                                    <ShieldCheck size={14} /> Promouvoir
                                                </button>
                                            ) : (
                                                <button onClick={() => changeRole(u.id, 'USER')} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-colors">
                                                    <ShieldOff size={14} /> Rétrograder
                                                </button>
                                            )}
                                            <button onClick={() => removeUser(u.id)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors">
                                                <Trash2 size={14} /> Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

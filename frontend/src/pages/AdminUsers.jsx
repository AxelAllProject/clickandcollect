import React, { useEffect, useState } from 'react';
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
            setMessage('Impossible de supprimer l\'utilisateur.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
                {message && <div className="mb-4 p-2 bg-indigo-50 text-indigo-700 rounded">{message}</div>}

                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <div className="bg-white rounded shadow p-4">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">ID</th>
                                    <th className="py-2">Email</th>
                                    <th className="py-2">Nom</th>
                                    <th className="py-2">Rôle</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b">
                                        <td className="py-2">{u.id}</td>
                                        <td className="py-2">{u.email}</td>
                                        <td className="py-2">{u.firstname} {u.lastname}</td>
                                        <td className="py-2">{u.role}</td>
                                        <td className="py-2 flex gap-2">
                                            {u.role !== 'ADMIN' ? (
                                                <button onClick={() => changeRole(u.id, 'ADMIN')} className="px-3 py-1 bg-green-600 text-white rounded">Promouvoir</button>
                                            ) : (
                                                <button onClick={() => changeRole(u.id, 'USER')} className="px-3 py-1 bg-yellow-500 text-white rounded">Rétrograder</button>
                                            )}
                                            <button onClick={() => removeUser(u.id)} className="px-3 py-1 bg-red-600 text-white rounded">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;

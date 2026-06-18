import { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function AdminPanel({ token, onLogout }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        if (isMounted) {
                            onLogout();
                        }
                        return;
                    }
                    throw new Error('Impossible de récupérer la liste complète');
                }
                const data = await response.json();
                if (isMounted) {
                    setUsers(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchUsers();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error('Échec de la suppression');
            }
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    return (
        <div>
            <div>
                <h2>Liste complète des inscrits</h2>
                <button type="button" onClick={onLogout}>
                    Déconnexion
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {users.length === 0 ? (
                <p>Aucun inscrit pour le moment.</p>
            ) : (
                <table data-testid="admin-user-list">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Date de naissance</th>
                        <th>Ville</th>
                        <th>Code postal</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.lastName}</td>
                            <td>{user.firstName}</td>
                            <td>{user.email}</td>
                            <td>{user.birthDate}</td>
                            <td>{user.city}</td>
                            <td>{user.postalCode}</td>
                            <td>
                                <button type="button" onClick={() => handleDelete(user.id)}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
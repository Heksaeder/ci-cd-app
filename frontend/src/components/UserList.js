import { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/users`);
                if (!response.ok) {
                    throw new Error('Impossible de récupérer la liste des inscrits');
                }
                const data = await response.json();
                if (isMounted) {
                    setUsers(data);
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
    }, []);

    if (isLoading) {
        return <p>Chargement de la liste des inscrits...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (users.length === 0) {
        return <p>Aucun inscrit pour le moment.</p>;
    }

    return (
        <table data-testid="user-list">
            <thead>
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Ville</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                    <td>{user.lastName}</td>
                    <td>{user.firstName}</td>
                    <td>{user.city}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPanel from './AdminPanel';

const mockUsers = [
    {
        id: 1,
        lastName: 'Dupont',
        firstName: 'Jean',
        email: 'jean@test.com',
        birthDate: '1990-01-01',
        city: 'Paris',
        postalCode: '75000',
    },
];

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

test('affiche la liste complète des inscrits', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

    render(<AdminPanel token="fake-token" onLogout={jest.fn()} />);

    const table = await screen.findByTestId('admin-user-list');
    expect(table).toHaveTextContent('jean@test.com');
    expect(table).toHaveTextContent('75000');
    expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users'),
        expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
    );
});

test('affiche un message si aucun inscrit', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<AdminPanel token="fake-token" onLogout={jest.fn()} />);

    expect(await screen.findByText(/Aucun inscrit/)).toBeInTheDocument();
});

test('déconnecte automatiquement si le token est invalide (401)', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 401 });
    const onLogout = jest.fn();

    render(<AdminPanel token="expired-token" onLogout={onLogout} />);

    await waitFor(() => {
        expect(onLogout).toHaveBeenCalled();
    });
});

test('affiche une erreur si la requête échoue pour une autre raison', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<AdminPanel token="fake-token" onLogout={jest.fn()} />);

    expect(await screen.findByText(/Impossible de récupérer/)).toBeInTheDocument();
});

test('supprime un utilisateur de la liste après confirmation du backend', async () => {
    global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers })
        .mockResolvedValueOnce({ ok: true });

    render(<AdminPanel token="fake-token" onLogout={jest.fn()} />);

    await screen.findByTestId('admin-user-list');
    fireEvent.click(screen.getByRole('button', { name: /Supprimer/ }));

    await waitFor(() => {
        expect(screen.queryByText('jean@test.com')).not.toBeInTheDocument();
    });
});

test('affiche une erreur si la suppression échoue', async () => {
    global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers })
        .mockResolvedValueOnce({ ok: false });

    render(<AdminPanel token="fake-token" onLogout={jest.fn()} />);

    await screen.findByTestId('admin-user-list');
    fireEvent.click(screen.getByRole('button', { name: /Supprimer/ }));

    expect(await screen.findByText(/Échec de la suppression/)).toBeInTheDocument();
});

test('appelle onLogout au clic sur le bouton de déconnexion', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUsers });
    const onLogout = jest.fn();

    render(<AdminPanel token="fake-token" onLogout={onLogout} />);

    await screen.findByTestId('admin-user-list');
    fireEvent.click(screen.getByRole('button', { name: /Déconnexion/ }));

    expect(onLogout).toHaveBeenCalled();
});
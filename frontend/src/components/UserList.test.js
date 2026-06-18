import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

test('affiche un message de chargement initialement', () => {
    global.fetch.mockReturnValue(new Promise(() => {})); // never resolves
    render(<UserList />);
    expect(screen.getByText(/Chargement/)).toBeInTheDocument();
});

test('affiche la liste des inscrits une fois chargée', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
            { id: 1, lastName: 'Dupont', firstName: 'Jean', city: 'Paris' },
            { id: 2, lastName: 'Martin', firstName: 'Alice', city: 'Lyon' },
        ],
    });

    render(<UserList />);

    const table = await screen.findByTestId('user-list');
    expect(table).toHaveTextContent('Dupont');
    expect(table).toHaveTextContent('Martin');
});

test('affiche un message si aucun inscrit', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
    });

    render(<UserList />);

    expect(await screen.findByText(/Aucun inscrit/)).toBeInTheDocument();
});

test('affiche une erreur si la requête échoue', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    render(<UserList />);

    expect(await screen.findByText(/Impossible de récupérer/)).toBeInTheDocument();
});

test('affiche une erreur si fetch rejette', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<UserList />);

    expect(await screen.findByText('Network error')).toBeInTheDocument();
});

test('ne met pas à jour le state après démontage du composant (succès)', async () => {
    let resolveFetch;
    global.fetch.mockReturnValueOnce(
        new Promise((resolve) => {
            resolveFetch = resolve;
        })
    );

    const { unmount } = render(<UserList />);
    unmount();

    resolveFetch({ ok: true, json: async () => [] });

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});

test('ne met pas à jour le state après démontage du composant (erreur)', async () => {
    let rejectFetch;
    global.fetch.mockReturnValueOnce(
        new Promise((_, reject) => {
            rejectFetch = reject;
        })
    );

    const { unmount } = render(<UserList />);
    unmount();

    rejectFetch(new Error('Erreur après démontage'));

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});
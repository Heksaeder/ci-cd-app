import { render, screen, fireEvent } from '@testing-library/react';
import AdminLogin from './AdminLogin';

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

const fillAndSubmit = (email, password) => {
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/), { target: { value: password } });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/ }));
};

test('appelle onLoginSuccess avec le token si le login réussit', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'fake-token', token_type: 'bearer' }),
    });
    const onLoginSuccess = jest.fn();

    render(<AdminLogin onLoginSuccess={onLoginSuccess} />);
    fillAndSubmit('admin@test.com', 'motdepasse');

    await screen.findByRole('button', { name: /Se connecter/ });
    expect(onLoginSuccess).toHaveBeenCalledWith('fake-token');
});

test('affiche une erreur si les identifiants sont invalides', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Identifiants invalides' }),
    });

    render(<AdminLogin onLoginSuccess={jest.fn()} />);
    fillAndSubmit('admin@test.com', 'mauvais-mdp');

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
});

test('affiche un message générique si la réponse d\'erreur est vide', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
    });

    render(<AdminLogin onLoginSuccess={jest.fn()} />);
    fillAndSubmit('admin@test.com', 'mauvais-mdp');

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
});

test('affiche un message générique si la réponse d\'erreur n\'est pas un JSON valide', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
            throw new Error('invalid json');
        },
    });

    render(<AdminLogin onLoginSuccess={jest.fn()} />);
    fillAndSubmit('admin@test.com', 'mauvais-mdp');

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
});

test('affiche une erreur réseau', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network down'));

    render(<AdminLogin onLoginSuccess={jest.fn()} />);
    fillAndSubmit('admin@test.com', 'motdepasse');

    expect(await screen.findByText('Network down')).toBeInTheDocument();
});
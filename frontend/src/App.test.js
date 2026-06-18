import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });
});

afterEach(() => {
  jest.restoreAllMocks();
  window.history.pushState({}, '', '/');
});

test('affiche le titre Inscription', () => {
  render(<App />);
  expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
});

test('affiche le lien vers la documentation', () => {
  render(<App />);
  expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
});

describe('sur la route /admin', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/admin');
  });

  test('affiche le formulaire de connexion admin par défaut', () => {
    render(<App />);
    expect(screen.getByText(/Administration/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/ })).toBeInTheDocument();
  });

  test('affiche le panneau admin après connexion réussie', async () => {
    global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'fake-token' }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/), { target: { value: 'pwd' } });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/ }));

    expect(await screen.findByText(/Liste complète des inscrits/)).toBeInTheDocument();
  });

  test('revient au formulaire de connexion après déconnexion', async () => {
    global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'fake-token' }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/), { target: { value: 'pwd' } });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/ }));

    await screen.findByText(/Liste complète des inscrits/);
    fireEvent.click(screen.getByRole('button', { name: /Déconnexion/ }));

    expect(screen.getByRole('button', { name: /Se connecter/ })).toBeInTheDocument();
  });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';

const fillValid = () => {
    fireEvent.change(screen.getByLabelText(/^Nom$/), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByLabelText(/Prénom/), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'jean@test.com' } });
    fireEvent.change(screen.getByLabelText(/naissance/), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/Ville/), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/postal/), { target: { value: '75000' } });
};

beforeEach(() => localStorage.clear());

test('le bouton est désactivé si les champs ne sont pas tous remplis', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('button', { name: /Sauvegarder/ })).toBeDisabled();
});

test('le bouton devient actif quand tous les champs sont remplis', () => {
    render(<RegisterForm />);
    fillValid();
    expect(screen.getByRole('button', { name: /Sauvegarder/ })).not.toBeDisabled();
});

test('sauvegarde en local storage, toast succès et champs vidés', async () => {
    render(<RegisterForm />);
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: /Sauvegarder/ }));

    expect(await screen.findByTestId('toast')).toHaveTextContent('Enregistrement réussi');
    expect(JSON.parse(localStorage.getItem('user')).lastName).toBe('Dupont');
    expect(screen.getByLabelText(/^Nom$/).value).toBe('');
});

test('affiche un toast erreur et les messages en rouge si invalide', async () => {
    render(<RegisterForm />);
    fillValid();
    fireEvent.change(screen.getByLabelText(/postal/), { target: { value: 'AAAA' } });
    fireEvent.click(screen.getByRole('button', { name: /Sauvegarder/ }));

    expect(await screen.findByTestId('toast')).toHaveTextContent('Erreur');
    const error = screen.getByText(/Code postal invalide/);
    expect(error).toHaveStyle('color: rgb(255, 0, 0)');
});

test('refuse un mineur', () => {
    render(<RegisterForm />);
    fillValid();
    const recent = new Date();
    recent.setFullYear(recent.getFullYear() - 10);
    fireEvent.change(screen.getByLabelText(/naissance/), {
        target: { value: recent.toISOString().split('T')[0] },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sauvegarder/ }));
    expect(screen.getByText(/18 ans/)).toBeInTheDocument();
});
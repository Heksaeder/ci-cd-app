import { render, screen } from '@testing-library/react';
import App from './App';

test('affiche le titre Inscription', () => {
  render(<App />);
  expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
});

test('affiche le lien vers la documentation', () => {
  render(<App />);
  expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
});
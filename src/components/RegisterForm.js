import { useState } from 'react';
import Toast from './Toast';
import { isAdult, isValidPostalCode, isValidName, isValidEmail } from '../utils/validators';

const initialState = { lastName: '', firstName: '', email: '', birthDate: '', city: '', postalCode: '' };

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function RegisterForm() {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ visible: false, type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const isFormFilled = Object.values(form).every((v) => v.trim() !== '');

    const validate = () => {
        const newErrors = {};
        if (!isValidName(form.lastName)) newErrors.lastName = 'Nom invalide';
        if (!isValidName(form.firstName)) newErrors.firstName = 'Prénom invalide';
        if (!isValidEmail(form.email)) newErrors.email = 'Email invalide';
        if (!isAdult(form.birthDate)) newErrors.birthDate = 'Vous devez avoir 18 ans ou plus';
        if (!isValidName(form.city)) newErrors.city = 'Ville invalide';
        if (!isValidPostalCode(form.postalCode)) newErrors.postalCode = 'Code postal invalide (format français)';
        return newErrors;
    };

    const showToast = (type, message) => {
        setToast({ visible: true, type, message });
        setTimeout(() => setToast({ visible: false, type: '', message: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast('error', 'Erreur dans le formulaire');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Erreur serveur');
            }

            setErrors({});
            setForm(initialState);
            showToast('success', 'Enregistrement réussi !');
        } catch (err) {
            showToast('error', `Échec de l'enregistrement : ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Toast {...toast} />

            <label htmlFor="lastName">Nom</label>
            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
            {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}

            <label htmlFor="firstName">Prénom</label>
            <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
            {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}

            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={form.email} onChange={handleChange} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

            <label htmlFor="birthDate">Date de naissance</label>
            <input id="birthDate" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
            {errors.birthDate && <p style={{ color: 'red' }}>{errors.birthDate}</p>}

            <label htmlFor="city">Ville</label>
            <input id="city" name="city" value={form.city} onChange={handleChange} />
            {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}

            <label htmlFor="postalCode">Code postal</label>
            <input id="postalCode" name="postalCode" value={form.postalCode} onChange={handleChange} />
            {errors.postalCode && <p style={{ color: 'red' }}>{errors.postalCode}</p>}

            <button type="submit" disabled={!isFormFilled || isSubmitting}>
                {isSubmitting ? 'Envoi...' : 'Sauvegarder'}
            </button>
        </form>
    );
}
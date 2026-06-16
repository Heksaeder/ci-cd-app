import { useState } from 'react';
import Toast from './Toast';
import { isAdult, isValidPostalCode, isValidName, isValidEmail } from '../utils/validators';

const initialState = { lastName: '', firstName: '', email: '', birthDate: '', city: '', postalCode: '' };

export default function RegisterForm() {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ visible: false, type: '', message: '' });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            localStorage.setItem('user', JSON.stringify(form));
            setToast({ visible: true, type: 'success', message: 'Enregistrement réussi !' });
            setErrors({});
            setForm(initialState);
        } else {
            setErrors(newErrors);
            setToast({ visible: true, type: 'error', message: 'Erreur dans le formulaire' });
        }
        setTimeout(() => setToast({ visible: false, type: '', message: '' }), 3000);
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

            <button type="submit" disabled={!isFormFilled}>Sauvegarder</button>
        </form>
    );
}
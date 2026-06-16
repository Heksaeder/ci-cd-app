import { calculateAge, isAdult, isValidPostalCode, isValidName, isValidEmail } from './validators';

describe('calculateAge', () => {
    test('calcule correctement un âge révolu', () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 20);
        expect(calculateAge(date.toISOString().split('T')[0])).toBe(20);
    });

    test('gère anniversaire pas encore passé cette année', () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 20);
        date.setDate(date.getDate() + 1);
        expect(calculateAge(date.toISOString().split('T')[0])).toBe(19);
    });
});

describe('isAdult', () => {
    test('refuse moins de 18 ans', () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 17);
        expect(isAdult(date.toISOString().split('T')[0])).toBe(false);
    });

    test('accepte exactement 18 ans', () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 18);
        expect(isAdult(date.toISOString().split('T')[0])).toBe(true);
    });
});

describe('isValidPostalCode', () => {
    test('accepte un code à 5 chiffres', () => {
        expect(isValidPostalCode('75000')).toBe(true);
    });
    test('refuse moins de 5 chiffres', () => {
        expect(isValidPostalCode('7500')).toBe(false);
    });
    test('refuse les lettres', () => {
        expect(isValidPostalCode('7500A')).toBe(false);
    });
});

describe('isValidName', () => {
    test('accepte un nom simple', () => expect(isValidName('Dupont')).toBe(true));
    test('accepte les accents', () => expect(isValidName('Émile')).toBe(true));
    test('accepte les tirets', () => expect(isValidName('Jean-Pierre')).toBe(true));
    test('accepte les apostrophes', () => expect(isValidName("O'Brien")).toBe(true));
    test('refuse les chiffres', () => expect(isValidName('Jean3')).toBe(false));
    test('refuse les caractères spéciaux', () => expect(isValidName('Jean@')).toBe(false));
    test('refuse une chaîne vide', () => expect(isValidName('')).toBe(false));
});

describe('isValidEmail', () => {
    test('accepte un email valide', () => expect(isValidEmail('a@b.com')).toBe(true));
    test('refuse sans @', () => expect(isValidEmail('ab.com')).toBe(false));
    test('refuse sans domaine', () => expect(isValidEmail('a@b')).toBe(false));
    test('refuse avec espace', () => expect(isValidEmail('a b@c.com')).toBe(false));
});
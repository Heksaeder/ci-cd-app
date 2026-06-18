export function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

export function isAdult(birthDate) {
    return calculateAge(birthDate) >= 18;
}

export function isValidPostalCode(postalCode) {
    return /^[0-9]{5}$/.test(postalCode);
}

export function isValidName(name) {
    // lettres, accents, tréma, tirets, apostrophes, espaces — pas de chiffres/spéciaux
    return /^[A-Za-zÀ-ÖØ-öø-ÿ]+([- '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name);
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
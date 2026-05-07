/**
 * Validation utilities for user registration form
 */

/**
 * Check if a name is valid (non-empty, no numbers, min 2 chars)
 * @param {string} name - The name to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName);
}

/**
 * Check if an email is valid
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Check if user is at least 18 years old
 * @param {Date|string} birthDate - The birth date to validate
 * @returns {boolean} True if user is 18+, false otherwise
 */
export function isAdult(birthDate) {
  if (!birthDate) {
    return false;
  }

  let date;
  if (typeof birthDate === 'string') {
    date = new Date(birthDate);
  } else if (birthDate instanceof Date) {
    date = birthDate;
  } else {
    return false;
  }

  if (isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
}

/**
 * Check if a city name is valid
 * @param {string} city - The city to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidCity(city) {
  if (!city || typeof city !== 'string') {
    return false;
  }
  const trimmedCity = city.trim();
  return trimmedCity.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedCity);
}

/**
 * Check if a postal code is valid (French format: 5 digits)
 * @param {string} postalCode - The postal code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidPostalCode(postalCode) {
  if (!postalCode || typeof postalCode !== 'string') {
    return false;
  }
  const trimmedCode = postalCode.trim();
  return /^\d{5}$/.test(trimmedCode);
}

/**
 * Validate all form fields
 * @param {object} formData - The form data object
 * @returns {object} Object with validation results and messages
 */
export function validateForm(formData) {
  const errors = {};

  if (!isValidName(formData.firstName)) {
    errors.firstName = 'First name must be at least 2 characters and contain only letters';
  }

  if (!isValidName(formData.lastName)) {
    errors.lastName = 'Last name must be at least 2 characters and contain only letters';
  }

  if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.birthDate) {
    errors.birthDate = 'Birth date is required';
  } else if (!isAdult(formData.birthDate)) {
    errors.birthDate = 'You must be at least 18 years old';
  }

  if (!isValidCity(formData.city)) {
    errors.city = 'City must be at least 2 characters and contain only letters';
  }

  if (!isValidPostalCode(formData.postalCode)) {
    errors.postalCode = 'Postal code must be 5 digits (French format)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Save user data to localStorage
 * @param {object} userData - The user data to save
 * @returns {boolean} True if saved successfully
 */
export function saveUserToLocalStorage(userData) {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({
      ...userData,
      id: Date.now(),
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
    return false;
  }
}

/**
 * Get all users from localStorage
 * @returns {array} Array of user objects
 */
export function getUsersFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem('users')) || [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
}

/**
 * Clear all users from localStorage
 * @returns {boolean} True if cleared successfully
 */
export function clearUsersFromLocalStorage() {
  try {
    localStorage.removeItem('users');
    return true;
  } catch (error) {
    console.error('Error clearing users from localStorage:', error);
    return false;
  }
}


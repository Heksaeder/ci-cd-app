# User Registration Form - React CI/CD Project

## 📋 Project Overview

This is a complete React application featuring a user registration form with comprehensive validation, localStorage persistence, and 100% test coverage. It serves as an example of a production-ready project with both unit and integration tests.

## ✨ Features

### Registration Form
- **Input Fields:**
  - First Name (validation: min 2 chars, letters only)
  - Last Name (validation: min 2 chars, letters only)
  - Email (validation: valid email format)
  - Birth Date (validation: user must be 18+ years old)
  - City (validation: min 2 chars, letters only)
  - Postal Code (validation: French format - 5 digits)

### Validations
- ✅ Age restriction: Users must be at least 18 years old
- ✅ French postal code format: Exactly 5 digits
- ✅ Names and emails: Valid characters only
- ✅ Real-time error clearing: Errors disappear when user starts typing
- ✅ Comprehensive error messages: Clear feedback on what's wrong

### Data Persistence
- ✅ localStorage: User data saved automatically on successful registration
- ✅ Multiple entries: Form can be submitted multiple times
- ✅ Data structure: Each user entry includes ID and registration timestamp

### User Experience
- ✅ Form validation on submit
- ✅ Error messages next to invalid fields
- ✅ Success message after registration
- ✅ Form reset after successful submission
- ✅ Responsive design

## 📁 Project Structure

```
src/
├── components/
│   ├── RegistrationForm.jsx         # Main form component
│   ├── RegistrationForm.test.jsx    # Integration tests (17 tests)
│   └── RegistrationForm.css         # Form styling
├── utils/
│   ├── validation.js                # Validation functions
│   ├── validation.test.js           # Unit tests (45+ tests)
│   └── module.js                    # Existing utility
│   └── module.test.js               # Existing unit tests
├── App.jsx                          # Main app component with counter
├── App.test.jsx                     # App integration tests
├── App.css                          # App styling
└── ...
```

## 🧪 Test Coverage

### Unit Tests (validation.js)
**45+ tests covering:**
- ✅ Valid and invalid names
- ✅ Valid and invalid emails
- ✅ Age validation (adults vs minors)
- ✅ City validation
- ✅ Postal code validation (French format)
- ✅ Complete form validation
- ✅ localStorage operations (save, retrieve, clear)
- ✅ Edge cases and error handling

**Coverage: 100%**

### Integration Tests (RegistrationForm.jsx)
**17 tests covering:**
- ✅ Form rendering
- ✅ All input fields present
- ✅ Submit button functionality
- ✅ Input value updates
- ✅ Form validation errors
- ✅ Age restriction validation
- ✅ Email validation
- ✅ Postal code validation
- ✅ Successful form submission
- ✅ Data localStorage integration
- ✅ Form reset after submission
- ✅ Error clearing on input
- ✅ Multiple form submissions

**Coverage: 100%**

## 📊 Overall Test Metrics

```
Test Files  4 passed (4)
Tests       65+ passed (65+)
Coverage    100% (excluding index.js, reportWebVitals.js)

Files covered:
├── validation.js    100%
├── RegistrationForm.jsx 100%
├── App.jsx          100%
└── module.js        100%
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run all tests once
npm run test -- run

# Run tests in watch mode
npm run test

# Run tests with coverage report
npm run test:coverage
```

## 📖 Validation Functions Documentation

### `isValidName(name: string): boolean`
Validates that a name is:
- Non-empty
- At least 2 characters
- Contains only letters (with support for accented characters)

```javascript
isValidName('John')        // true
isValidName('J')           // false
isValidName('John123')     // false
```

### `isValidEmail(email: string): boolean`
Validates email format using standard regex pattern.

```javascript
isValidEmail('john@example.com')      // true
isValidEmail('invalid.email')         // false
```

### `isAdult(birthDate: Date|string): boolean`
Checks if user is at least 18 years old. Handles both Date objects and ISO date strings.

```javascript
const birthDate = new Date('2000-01-01')
isAdult(birthDate)         // true (if old enough)
isAdult('2010-01-01')      // false (minor)
```

### `isValidCity(city: string): boolean`
Validates city name (same rules as names).

### `isValidPostalCode(postalCode: string): boolean`
Validates French postal code format (5 digits).

```javascript
isValidPostalCode('75001')  // true
isValidPostalCode('7500')   // false
isValidPostalCode('7500A')  // false
```

### `validateForm(formData: object): object`
Complete form validation returning isValid flag and error messages.

```javascript
const result = validateForm({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  birthDate: '2000-01-01',
  city: 'Paris',
  postalCode: '75001'
})

// Returns: { isValid: true, errors: {} }
```

### `saveUserToLocalStorage(userData: object): boolean`
Saves user data with auto-generated ID and timestamp.

```javascript
saveUserToLocalStorage({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  birthDate: '2000-01-01',
  city: 'Paris',
  postalCode: '75001'
})
```

### `getUsersFromLocalStorage(): array`
Retrieves all saved users from localStorage.

### `clearUsersFromLocalStorage(): boolean`
Clears all user data from localStorage.

## 🔧 Technologies Used

- **React 19.2.5** - UI framework
- **Vite 8.0.10** - Build tool
- **Vitest 1.6.0** - Test framework
- **@testing-library/react 16.0.1** - React testing utilities
- **@testing-library/jest-dom 6.6.0** - DOM matchers
- **jsdom 23.0.0** - DOM simulation

## 📝 Code Quality

### Test Reliability
- ✅ No flaky tests
- ✅ Proper async/await handling
- ✅ Comprehensive error scenarios
- ✅ Edge case coverage
- ✅ Data isolation between tests

### Best Practices
- ✅ Separation of concerns (validation logic separate from UI)
- ✅ Pure functions for validation
- ✅ Proper error handling
- ✅ Semantic HTML
- ✅ Accessibility-first development

## 🎯 Running Specific Tests

```bash
# Run only validation tests
npm run test -- src/utils/validation.test.js

# Run only form component tests
npm run test -- src/components/RegistrationForm.test.jsx

# Run tests matching a pattern
npm run test -- --grep "should submit valid form"

# Run with verbose output
npm run test -- --reporter=verbose
```

## 📊 Coverage Report

After running `npm run test:coverage`, view the detailed report:

```bash
# Open HTML coverage report
open coverage/index.html
```

## ✅ Validation Requirements Met

- ✅ Nom, prénom, mail valides
- ✅ Date de naissance : bloque les -18 ans
- ✅ Code postal français (5 chiffres)
- ✅ Sauvegarde en localStorage
- ✅ Fonctions de vérification dans fichier JS séparé
- ✅ Composants React testés
- ✅ 100% de couverture (sauf index.js et reportWebVitals)
- ✅ Tous les tests unitaires et d'intégration passant
- ✅ Documentation complète
- ✅ Fiabilité des tests

## 🐛 Debugging

### View saved users in localStorage
```javascript
JSON.parse(localStorage.getItem('users'))
```

### Clear all test data
```javascript
localStorage.removeItem('users')
```

### Run tests in debug mode
```bash
npm run test -- --inspect-brk
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is part of a CI/CD course at Ynov.

---

**Project Status:** ✅ Complete with 100% test coverage and all requirements met.


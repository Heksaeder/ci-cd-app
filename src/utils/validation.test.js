import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  isValidName,
  isValidEmail,
  isAdult,
  isValidCity,
  isValidPostalCode,
  validateForm,
  saveUserToLocalStorage,
  getUsersFromLocalStorage,
  clearUsersFromLocalStorage
} from './validation'

describe('Validation Functions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('isValidName', () => {
    it('should accept valid names', () => {
      expect(isValidName('John')).toBe(true)
      expect(isValidName('Marie')).toBe(true)
      expect(isValidName('Jean-Pierre')).toBe(true)
      expect(isValidName("O'Connor")).toBe(true)
      expect(isValidName('Müller')).toBe(true)
    })

    it('should reject invalid names', () => {
      expect(isValidName('')).toBe(false)
      expect(isValidName('J')).toBe(false)
      expect(isValidName('John123')).toBe(false)
      expect(isValidName(null)).toBe(false)
      expect(isValidName(undefined)).toBe(false)
      expect(isValidName(123)).toBe(false)
      expect(isValidName('   ')).toBe(false)
    })

    it('should trim whitespace', () => {
      expect(isValidName('  John  ')).toBe(true)
    })
  })

  describe('isValidEmail', () => {
    it('should accept valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('john.doe@domain.co.uk')).toBe(true)
      expect(isValidEmail('test+tag@email.com')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid.email')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail(null)).toBe(false)
      expect(isValidEmail(undefined)).toBe(false)
      expect(isValidEmail(123)).toBe(false)
      expect(isValidEmail('user @example.com')).toBe(false)
    })
  })

  describe('isAdult', () => {
    it('should accept valid adult dates', () => {
      const today = new Date()
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      expect(isAdult(eighteenYearsAgo)).toBe(true)

      const thirtyYearsAgo = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate())
      expect(isAdult(thirtyYearsAgo)).toBe(true)
    })

    it('should reject minors', () => {
      const today = new Date()
      const seventeenYearsAgo = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())
      expect(isAdult(seventeenYearsAgo)).toBe(false)
    })

    it('should accept string dates', () => {
      const today = new Date()
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      const dateString = eighteenYearsAgo.toISOString().split('T')[0]
      expect(isAdult(dateString)).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(isAdult(null)).toBe(false)
      expect(isAdult(undefined)).toBe(false)
      expect(isAdult('invalid-date')).toBe(false)
      expect(isAdult(123)).toBe(false)
    })

    it('should handle edge case: exactly 18 years old', () => {
      const today = new Date()
      const exactlyEighteen = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      expect(isAdult(exactlyEighteen)).toBe(true)
    })
  })

  describe('isValidCity', () => {
    it('should accept valid cities', () => {
      expect(isValidCity('Paris')).toBe(true)
      expect(isValidCity('Lyon')).toBe(true)
      expect(isValidCity('Saint-Étienne')).toBe(true)
      expect(isValidCity("Côte-d'Or")).toBe(true)
    })

    it('should reject invalid cities', () => {
      expect(isValidCity('')).toBe(false)
      expect(isValidCity('A')).toBe(false)
      expect(isValidCity('Paris123')).toBe(false)
      expect(isValidCity(null)).toBe(false)
      expect(isValidCity(undefined)).toBe(false)
      expect(isValidCity('   ')).toBe(false)
    })
  })

  describe('isValidPostalCode', () => {
    it('should accept valid French postal codes', () => {
      expect(isValidPostalCode('75001')).toBe(true)
      expect(isValidPostalCode('69000')).toBe(true)
      expect(isValidPostalCode('13000')).toBe(true)
    })

    it('should reject invalid postal codes', () => {
      expect(isValidPostalCode('7500')).toBe(false) // Too short
      expect(isValidPostalCode('750001')).toBe(false) // Too long
      expect(isValidPostalCode('7500A')).toBe(false) // Contains letter
      expect(isValidPostalCode('')).toBe(false)
      expect(isValidPostalCode(null)).toBe(false)
      expect(isValidPostalCode(undefined)).toBe(false)
      expect(isValidPostalCode('ABC12')).toBe(false)
    })
  })

  describe('validateForm', () => {
    it('should validate a correct form', () => {
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())

      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        birthDate: birthDate,
        city: 'Paris',
        postalCode: '75001'
      }

      const result = validateForm(formData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should detect all validation errors', () => {
      const formData = {
        firstName: 'J',
        lastName: '',
        email: 'invalid-email',
        birthDate: '2010-01-01',
        city: 'A',
        postalCode: '750'
      }

      const result = validateForm(formData)
      expect(result.isValid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(0)
      expect(result.errors.firstName).toBeDefined()
      expect(result.errors.lastName).toBeDefined()
      expect(result.errors.email).toBeDefined()
      expect(result.errors.birthDate).toBeDefined()
      expect(result.errors.city).toBeDefined()
      expect(result.errors.postalCode).toBeDefined()
    })

    it('should detect specific errors', () => {
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())

      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        birthDate: birthDate,
        city: 'Paris',
        postalCode: '75001'
      }

      const result = validateForm(formData)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
      expect(result.errors.firstName).toBeUndefined()
    })
  })

  describe('LocalStorage functions', () => {
    it('should save user to localStorage', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        birthDate: '1995-01-01',
        city: 'Paris',
        postalCode: '75001'
      }

      const result = saveUserToLocalStorage(userData)
      expect(result).toBe(true)

      const users = getUsersFromLocalStorage()
      expect(users.length).toBe(1)
      expect(users[0].firstName).toBe('John')
      expect(users[0].email).toBe('john@example.com')
    })

    it('should save multiple users', () => {
      const user1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        birthDate: '1995-01-01',
        city: 'Paris',
        postalCode: '75001'
      }

      const user2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        birthDate: '1990-05-15',
        city: 'Lyon',
        postalCode: '69000'
      }

      saveUserToLocalStorage(user1)
      saveUserToLocalStorage(user2)

      const users = getUsersFromLocalStorage()
      expect(users.length).toBe(2)
    })

    it('should add metadata to saved user', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        birthDate: '1995-01-01',
        city: 'Paris',
        postalCode: '75001'
      }

      saveUserToLocalStorage(userData)
      const users = getUsersFromLocalStorage()

      expect(users[0].id).toBeDefined()
      expect(users[0].registeredAt).toBeDefined()
    })

    it('should get users from localStorage', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        birthDate: '1995-01-01',
        city: 'Paris',
        postalCode: '75001'
      }

      saveUserToLocalStorage(userData)
      const users = getUsersFromLocalStorage()

      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBe(1)
    })

    it('should return empty array if no users', () => {
      const users = getUsersFromLocalStorage()
      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBe(0)
    })

    it('should clear localStorage', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        birthDate: '1995-01-01',
        city: 'Paris',
        postalCode: '75001'
      }

      saveUserToLocalStorage(userData)
      let users = getUsersFromLocalStorage()
      expect(users.length).toBe(1)

      const result = clearUsersFromLocalStorage()
      expect(result).toBe(true)

      users = getUsersFromLocalStorage()
      expect(users.length).toBe(0)
    })

    it('should handle corrupted localStorage data', () => {
      // Set corrupted JSON in localStorage
      localStorage.setItem('users', 'corrupted data {invalid json')
      
      const users = getUsersFromLocalStorage()
      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBe(0)
    })

    it('should handle localStorage errors for saveUserToLocalStorage', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        birthDate: '1995-01-01',
        city: 'Paris',
        postalCode: '75001'
      }

      // Spy on localStorage to simulate error
      const setItemOriginal = Storage.prototype.setItem
      Storage.prototype.setItem = () => {
        throw new Error('Storage error')
      }

      const result = saveUserToLocalStorage(userData)
      expect(result).toBe(false)

      // Restore original
      Storage.prototype.setItem = setItemOriginal
    })

    it('should handle localStorage errors for clearUsersFromLocalStorage', () => {
      const removeItemOriginal = Storage.prototype.removeItem
      Storage.prototype.removeItem = () => {
        throw new Error('Storage error')
      }

      const result = clearUsersFromLocalStorage()
      expect(result).toBe(false)

      // Restore original
      Storage.prototype.removeItem = removeItemOriginal
    })
  })
})


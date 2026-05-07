import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegistrationForm from './RegistrationForm'
import { clearUsersFromLocalStorage } from '../utils/validation'

describe('RegistrationForm Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Form Rendering', () => {
    it('should render the registration form', () => {
      render(<RegistrationForm />)
      expect(screen.getByText('User Registration Form')).toBeInTheDocument()
      expect(screen.getByTestId('registration-form')).toBeInTheDocument()
    })

    it('should render all input fields', () => {
      render(<RegistrationForm />)
      expect(screen.getByTestId('firstName-input')).toBeInTheDocument()
      expect(screen.getByTestId('lastName-input')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('birthDate-input')).toBeInTheDocument()
      expect(screen.getByTestId('city-input')).toBeInTheDocument()
      expect(screen.getByTestId('postalCode-input')).toBeInTheDocument()
    })

    it('should render the submit button', () => {
      render(<RegistrationForm />)
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
    })

    it('should have empty initial values', () => {
      render(<RegistrationForm />)
      expect(screen.getByTestId('firstName-input').value).toBe('')
      expect(screen.getByTestId('lastName-input').value).toBe('')
      expect(screen.getByTestId('email-input').value).toBe('')
      expect(screen.getByTestId('birthDate-input').value).toBe('')
      expect(screen.getByTestId('city-input').value).toBe('')
      expect(screen.getByTestId('postalCode-input').value).toBe('')
    })
  })

  describe('Form Input Handling', () => {
    it('should update input values when user types', () => {
      render(<RegistrationForm />)
      
      const firstNameInput = screen.getByTestId('firstName-input')
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      expect(firstNameInput.value).toBe('John')

      const lastNameInput = screen.getByTestId('lastName-input')
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
      expect(lastNameInput.value).toBe('Doe')

      const emailInput = screen.getByTestId('email-input')
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      expect(emailInput.value).toBe('john@example.com')
    })

    it('should update all fields correctly', () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      expect(screen.getByTestId('firstName-input').value).toBe('John')
      expect(screen.getByTestId('lastName-input').value).toBe('Doe')
      expect(screen.getByTestId('email-input').value).toBe('john@example.com')
      expect(screen.getByTestId('birthDate-input').value).toBe(birthDateString)
      expect(screen.getByTestId('city-input').value).toBe('Paris')
      expect(screen.getByTestId('postalCode-input').value).toBe('75001')
    })
  })

  describe('Form Validation', () => {
    it('should show error for invalid first name', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'J' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.getByTestId('firstName-error')).toBeInTheDocument()
      })
    })

    it('should show error for invalid email', () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      // Fill all fields with valid data except email
      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })
      
      // Leave email empty to trigger validation error
      fireEvent.click(screen.getByTestId('submit-button'))

      expect(screen.getByTestId('email-error')).toBeInTheDocument()
    })

    it('should show error for minor user', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const minorDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
      const minorDateString = minorDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: minorDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.getByTestId('birthDate-error')).toBeInTheDocument()
        expect(screen.getByTestId('birthDate-error')).toHaveTextContent('must be at least 18')
      })
    })

    it('should show error for invalid postal code', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '750' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.getByTestId('postalCode-error')).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission Success', () => {
    it('should submit valid form successfully', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument()
        expect(screen.getByTestId('success-message')).toHaveTextContent('Registration successful')
      })
    })

    it('should clear form after successful submission', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.getByTestId('firstName-input').value).toBe('')
        expect(screen.getByTestId('lastName-input').value).toBe('')
        expect(screen.getByTestId('email-input').value).toBe('')
        expect(screen.getByTestId('birthDate-input').value).toBe('')
        expect(screen.getByTestId('city-input').value).toBe('')
        expect(screen.getByTestId('postalCode-input').value).toBe('')
      })
    })

    it('should save data to localStorage on successful submission', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        const users = JSON.parse(localStorage.getItem('users'))
        expect(users).toBeDefined()
        expect(users.length).toBe(1)
        expect(users[0].firstName).toBe('John')
        expect(users[0].email).toBe('john@example.com')
      })
    })
  })

  describe('Error Clearing', () => {
    it('should clear error when user starts typing', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'J' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.getByTestId('firstName-error')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'Jo' } })

      // The error should be removed (query returns null if not in document)
      expect(screen.queryByTestId('firstName-error')).not.toBeInTheDocument()
    })
  })

  describe('Multiple Submissions', () => {
    it('should allow multiple form submissions', async () => {
      render(<RegistrationForm />)
      
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      const birthDateString = birthDate.toISOString().split('T')[0]

      // First submission
      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'John' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Paris' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '75001' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument()
      })

      // Second submission
      fireEvent.change(screen.getByTestId('firstName-input'), { target: { value: 'Jane' } })
      fireEvent.change(screen.getByTestId('lastName-input'), { target: { value: 'Smith' } })
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'jane@example.com' } })
      fireEvent.change(screen.getByTestId('birthDate-input'), { target: { value: birthDateString } })
      fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Lyon' } })
      fireEvent.change(screen.getByTestId('postalCode-input'), { target: { value: '69000' } })

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        const users = JSON.parse(localStorage.getItem('users'))
        expect(users.length).toBe(2)
      })
    })
  })
})



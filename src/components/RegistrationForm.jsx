import React, { useState } from 'react'
import { validateForm, saveUserToLocalStorage } from '../utils/validation'
import './RegistrationForm.css'

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    city: '',
    postalCode: ''
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setSuccessMessage('')

    const validation = validateForm(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // Save to localStorage
    const saved = saveUserToLocalStorage(formData)

    if (saved) {
      setSuccessMessage('Registration successful! Your data has been saved.')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        city: '',
        postalCode: ''
      })
      setErrors({})
      setSubmitted(false)
    } else {
      setSuccessMessage('Error saving registration. Please try again.')
    }
  }

  return (
    <div className="registration-form-container">
      <h1>User Registration Form</h1>
      
      {successMessage && (
        <div className={`message ${successMessage.includes('successful') ? 'success' : 'error'}`} data-testid="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="registration-form">
        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            data-testid="firstName-input"
          />
          {errors.firstName && (
            <span className="error-message" data-testid="firstName-error">
              {errors.firstName}
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            data-testid="lastName-input"
          />
          {errors.lastName && (
            <span className="error-message" data-testid="lastName-error">
              {errors.lastName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            data-testid="email-input"
          />
          {errors.email && (
            <span className="error-message" data-testid="email-error">
              {errors.email}
            </span>
          )}
        </div>

        {/* Birth Date */}
        <div className="form-group">
          <label htmlFor="birthDate">Birth Date *</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            data-testid="birthDate-input"
          />
          {errors.birthDate && (
            <span className="error-message" data-testid="birthDate-error">
              {errors.birthDate}
            </span>
          )}
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            data-testid="city-input"
          />
          {errors.city && (
            <span className="error-message" data-testid="city-error">
              {errors.city}
            </span>
          )}
        </div>

        {/* Postal Code */}
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code *</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter your postal code"
            maxLength="5"
            data-testid="postalCode-input"
          />
          {errors.postalCode && (
            <span className="error-message" data-testid="postalCode-error">
              {errors.postalCode}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" data-testid="submit-button">
          Register
        </button>
      </form>
    </div>
  )
}


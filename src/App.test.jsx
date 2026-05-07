import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Integration Tests', () => {
  it('should render the app with initial count 0', () => {
    render(<App />)
    const countElement = screen.getByTestId('count')
    expect(countElement).toBeInTheDocument()
    expect(countElement).toHaveTextContent('0')
  })

  it('should display the Click me button', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
  })

  it('check counter on click me button', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: 'Click me' })
    const counter = screen.getByTestId('count')
    expect(button).toBeInTheDocument()
    expect(counter).toBeInTheDocument()
    expect(counter).toHaveTextContent('0')
    fireEvent.click(button)
    expect(counter).toHaveTextContent('1')
  })

  it('should increment count multiple times on clicks', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: 'Click me' })
    const counter = screen.getByTestId('count')

    for (let i = 0; i < 5; i++) {
      fireEvent.click(button)
    }

    expect(counter).toHaveTextContent('5')
  })

  it('should show and hide registration form', () => {
    render(<App />)
    
    // Initially form should not be visible
    expect(screen.queryByTestId('registration-form')).not.toBeInTheDocument()
    
    // Click to show form
    const toggleButton = screen.getByRole('button', { name: 'Show Registration Form' })
    fireEvent.click(toggleButton)
    
    // Form should now be visible
    expect(screen.getByTestId('registration-form')).toBeInTheDocument()
    
    // Click again to hide
    fireEvent.click(toggleButton)
    
    // Form should be hidden again
    expect(screen.queryByTestId('registration-form')).not.toBeInTheDocument()
  })
})





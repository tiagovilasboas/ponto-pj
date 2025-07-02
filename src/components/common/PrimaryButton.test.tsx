import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PrimaryButton } from './PrimaryButton'

describe('PrimaryButton', () => {
  it('renders with children', () => {
    render(<PrimaryButton>Test Button</PrimaryButton>)
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<PrimaryButton loading>Test Button</PrimaryButton>)
    const button = screen.getByRole('button', { name: 'Test Button' })
    expect(button).toBeDisabled()
    expect(button).not.toHaveAttribute('aria-label')
  })

  it('applies aria-label when provided', () => {
    render(<PrimaryButton aria-label="Salvar">Salvar</PrimaryButton>)
    const button = screen.getByRole('button', { name: 'Salvar' })
    expect(button).toHaveAttribute('aria-label', 'Salvar')
  })

  it('is disabled when loading', () => {
    render(<PrimaryButton loading>Test Button</PrimaryButton>)
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeDisabled()
  })
}) 
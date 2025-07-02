import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { ResetPassword } from '@/pages/ResetPassword'
import { AuthRepository } from '@/repositories/AuthRepository'

vi.mock('@/repositories/AuthRepository')
const mockAuthRepository = vi.mocked(AuthRepository)

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/services/notifications', () => ({
  notificationService: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </MantineProvider>
  )
}

describe('Reset Password Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ForgotPassword', () => {
    it('should allow submitting a valid email', async () => {
      const mockResetPassword = vi.fn().mockResolvedValue({ error: null })
      mockAuthRepository.mockImplementation(() => ({
        resetPassword: mockResetPassword,
      } as any))

      renderWithProviders(<ForgotPassword />)

      const emailInput = screen.getByPlaceholderText('auth.forgotPassword.emailPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.forgotPassword.submit' })

      await userEvent.type(emailInput, 'user@example.com')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith({ email: 'user@example.com' })
        expect(screen.getByText('auth.forgotPassword.success')).toBeInTheDocument()
      })
    })

    it('should show error for invalid email', async () => {
      renderWithProviders(<ForgotPassword />)

      const emailInput = screen.getByPlaceholderText('auth.forgotPassword.emailPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.forgotPassword.submit' })

      await userEvent.clear(emailInput)
      await userEvent.click(submitButton)

      expect(await screen.findByTestId('email-error')).toBeInTheDocument()
    })
  })

  describe('ResetPassword', () => {
    it('should allow submitting new password and confirmation', async () => {
      const mockResetPassword = vi.fn().mockResolvedValue({ error: null })
      mockAuthRepository.mockImplementation(() => ({
        resetPassword: mockResetPassword,
        updatePassword: mockResetPassword,
      } as any))

      renderWithProviders(<ResetPassword />)

      const passwordInput = screen.getByPlaceholderText('auth.resetPassword.passwordPlaceholder')
      const confirmPasswordInput = screen.getByPlaceholderText('auth.resetPassword.confirmPasswordPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.resetPassword.submit' })

      await userEvent.type(passwordInput, 'novaSenha123')
      await userEvent.type(confirmPasswordInput, 'novaSenha123')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalled()
        expect(screen.getByText('auth.resetPassword.success')).toBeInTheDocument()
      })
    })

    it('should show error when passwords do not match', async () => {
      renderWithProviders(<ResetPassword />)

      const passwordInput = screen.getByPlaceholderText('auth.resetPassword.passwordPlaceholder')
      const confirmPasswordInput = screen.getByPlaceholderText('auth.resetPassword.confirmPasswordPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.resetPassword.submit' })

      await userEvent.type(passwordInput, 'novaSenha123')
      await userEvent.type(confirmPasswordInput, 'outraSenha')
      await userEvent.click(submitButton)

      expect(await screen.findByTestId('password-error')).toBeInTheDocument()
    })
  })
}) 
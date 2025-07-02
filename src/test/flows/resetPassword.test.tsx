import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { AuthRepository } from '@/repositories/AuthRepository'
import { notificationService } from '@/services/notifications'

vi.mock('@/repositories/AuthRepository')
const mockAuthRepository = vi.mocked(AuthRepository)

const mockNavigate = vi.fn()

// Mock do react-router-dom
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
        expect(notificationService.success).toHaveBeenCalledWith(
          'auth.forgotPassword.success',
          'app.success'
        )
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    })

    it('should show error for empty email', async () => {
      renderWithProviders(<ForgotPassword />)

      const emailInput = screen.getByPlaceholderText('auth.forgotPassword.emailPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.forgotPassword.submit' })

      // Verificar se o campo está vazio
      expect(emailInput).toHaveValue('')

      await userEvent.click(submitButton)

      // Aguardar um pouco mais para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100))

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument()
        expect(notificationService.error).toHaveBeenCalledWith(
          'auth.forgotPassword.errors.fillFields',
          'app.error'
        )
      })
    })

    it('should show error for user not found', async () => {
      const mockResetPassword = vi.fn().mockResolvedValue({ 
        error: { message: 'User not found' } 
      })
      mockAuthRepository.mockImplementation(() => ({
        resetPassword: mockResetPassword,
      } as any))

      renderWithProviders(<ForgotPassword />)

      const emailInput = screen.getByPlaceholderText('auth.forgotPassword.emailPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.forgotPassword.submit' })

      await userEvent.type(emailInput, 'nonexistent@example.com')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument()
        expect(notificationService.error).toHaveBeenCalledWith(
          'auth.forgotPassword.errors.emailNotFound',
          'app.error'
        )
      })
    })

    it('should show generic error for other failures', async () => {
      const mockResetPassword = vi.fn().mockResolvedValue({ 
        error: { message: 'Network error' } 
      })
      mockAuthRepository.mockImplementation(() => ({
        resetPassword: mockResetPassword,
      } as any))

      renderWithProviders(<ForgotPassword />)

      const emailInput = screen.getByPlaceholderText('auth.forgotPassword.emailPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.forgotPassword.submit' })

      await userEvent.type(emailInput, 'user@example.com')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument()
        expect(notificationService.error).toHaveBeenCalledWith(
          'auth.forgotPassword.errors.generic',
          'app.error'
        )
      })
    })
  })
}) 
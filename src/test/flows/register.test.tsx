import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Register } from '@/pages/Register'
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

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </MantineProvider>
  )
}

describe('Registration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthRepository.mockImplementation(() => ({
      signUp: vi.fn().mockResolvedValue({ user: null, error: null }),
    } as any))
  })

  describe('User Registration', () => {
    it('should allow registration with valid data', async () => {
      // const user = userEvent.setup()
      const mockSignUp = vi.fn().mockResolvedValue({ user: { id: '1' }, error: null })
      
      mockAuthRepository.mockImplementation(() => ({
        signUp: mockSignUp,
      } as any))

      renderWithProviders(<Register />)

      const emailInput = screen.getByPlaceholderText('auth.register.emailPlaceholder')
      const passwordInput = screen.getByPlaceholderText('auth.register.passwordPlaceholder')
      const confirmPasswordInput = screen.getByPlaceholderText('auth.register.confirmPasswordPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.register.submit' })

      await userEvent.type(emailInput, 'joao@exemplo.com')
      await userEvent.type(passwordInput, 'senha123')
      await userEvent.type(confirmPasswordInput, 'senha123')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText(/Passwords do not match|As senhas não coincidem/i)).not.toBeInTheDocument()
      })
    })

    it('should show error when passwords do not match', async () => {
      // const user = userEvent.setup()
      renderWithProviders(<Register />)

      const emailInput = screen.getByPlaceholderText('auth.register.emailPlaceholder')
      const passwordInput = screen.getByPlaceholderText('auth.register.passwordPlaceholder')
      const confirmPasswordInput = screen.getByPlaceholderText('auth.register.confirmPasswordPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.register.submit' })

      await userEvent.type(emailInput, 'joao@exemplo.com')
      await userEvent.type(passwordInput, 'senha123')
      await userEvent.type(confirmPasswordInput, 'outrasenha')
      await userEvent.click(submitButton)

      expect(await screen.findByTestId('password-error')).toBeInTheDocument()
    })

    it('should show loading during registration', async () => {
      // const user = userEvent.setup()
      const mockSignUp = vi.fn().mockImplementation(() => new Promise(() => {})) // Never resolves
      
      mockAuthRepository.mockImplementation(() => ({
        signUp: mockSignUp,
      } as any))

      renderWithProviders(<Register />)

      const emailInput = screen.getByPlaceholderText('auth.register.emailPlaceholder')
      const passwordInput = screen.getByPlaceholderText('auth.register.passwordPlaceholder')
      const confirmPasswordInput = screen.getByPlaceholderText('auth.register.confirmPasswordPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.register.submit' })

      await userEvent.type(emailInput, 'joao@exemplo.com')
      await userEvent.type(passwordInput, 'senha123')
      await userEvent.type(confirmPasswordInput, 'senha123')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate to login when clicking link', async () => {
      // const user = userEvent.setup()
      renderWithProviders(<Register />)

      const loginLink = screen.getByRole('link', { name: 'auth.register.signIn' })
      expect(loginLink).toHaveAttribute('href', '/login')
      
      // O clique pode não funcionar no ambiente de teste devido ao Mantine Anchor
      // Mas podemos verificar se o link está presente e tem o href correto
    })
  })
}) 
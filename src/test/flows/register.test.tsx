import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Register } from '@/pages/Register'
import { useAppStore } from '@/hooks/useAppStore'

vi.mock('@/hooks/useAppStore')
const mockUseAppStore = vi.mocked(useAppStore)

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
    mockUseAppStore.mockReturnValue({
      actionLoading: false,
      register: vi.fn(),
    } as any)
  })

  describe('User Registration', () => {
    it('should allow registration with valid data', async () => {
      const user = userEvent.setup()
      const mockRegister = vi.fn().mockResolvedValue(undefined)
      
      mockUseAppStore.mockReturnValue({
        actionLoading: false,
        register: mockRegister,
      } as any)

      renderWithProviders(<Register />)

      const nameInput = screen.getByLabelText(/nome/i)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i)
      const submitButton = screen.getByRole('button', { name: /criar conta/i })

      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@exemplo.com')
      await user.type(passwordInput, 'senha123')
      await user.type(confirmPasswordInput, 'senha123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'João Silva',
          email: 'joao@exemplo.com',
          password: 'senha123',
        })
      })
    })

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup()
      const mockRegister = vi.fn()
      
      mockUseAppStore.mockReturnValue({
        actionLoading: false,
        register: mockRegister,
      } as any)

      renderWithProviders(<Register />)

      const nameInput = screen.getByLabelText(/nome/i)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i)
      const submitButton = screen.getByRole('button', { name: /criar conta/i })

      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@exemplo.com')
      await user.type(passwordInput, 'senha123')
      await user.type(confirmPasswordInput, 'senha456')
      await user.click(submitButton)

      expect(mockRegister).not.toHaveBeenCalled()
      expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument()
    })

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup()
      const mockRegister = vi.fn()
      
      mockUseAppStore.mockReturnValue({
        actionLoading: false,
        register: mockRegister,
      } as any)

      renderWithProviders(<Register />)

      const nameInput = screen.getByLabelText(/nome/i)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i)
      const submitButton = screen.getByRole('button', { name: /criar conta/i })

      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'email-invalido')
      await user.type(passwordInput, 'senha123')
      await user.type(confirmPasswordInput, 'senha123')
      await user.click(submitButton)

      expect(mockRegister).not.toHaveBeenCalled()
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument()
    })

    it('should show loading during registration', async () => {
      const user = userEvent.setup()
      const mockRegister = vi.fn()
      
      mockUseAppStore.mockReturnValue({
        actionLoading: true,
        register: mockRegister,
      } as any)

      renderWithProviders(<Register />)

      const submitButton = screen.getByRole('button', { name: /criando conta/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Navigation', () => {
    it('should navigate to login when clicking link', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Register />)

      const loginLink = screen.getByRole('link', { name: /já tem uma conta/i })
      await user.click(loginLink)

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
}) 
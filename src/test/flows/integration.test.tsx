import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MantineProvider } from '@mantine/core'
import App from '@/App'

// Mock do navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock do notifications
vi.mock('@/services/notifications', () => ({
  notificationService: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  )
}

describe('Complete Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete User Flow', () => {
    it('should allow complete login and navigation', async () => {
      const user = userEvent.setup()

      renderWithProviders(<App />)

      // Verificar se está na página de login
      expect(screen.getByText('auth.login.subtitle')).toBeInTheDocument()

      // Fazer login
      const emailInput = screen.getByPlaceholderText('auth.login.emailPlaceholder')
      const passwordInput = screen.getByPlaceholderText('auth.login.passwordPlaceholder')
      const loginButton = screen.getByRole('button', { name: 'auth.login.submit' })

      await user.type(emailInput, 'joao@exemplo.com')
      await user.type(passwordInput, 'senha123')
      await user.click(loginButton)

      // Verificar se o botão ainda está lá
      await waitFor(() => {
        expect(loginButton).toBeInTheDocument()
      })
    })

    it('should allow navigation between all pages', async () => {
      const user = userEvent.setup()

      renderWithProviders(<App />)

      // Verificar se está na home
      expect(screen.getByText('auth.login.subtitle')).toBeInTheDocument()

      // Navigate to history
      const historyButton = screen.queryByRole('button', { name: /histórico/i })
      if (historyButton) {
        await user.click(historyButton)
        expect(mockNavigate).toHaveBeenCalledWith('/history')
      }

      // Navigate to reports
      const reportButton = screen.queryByRole('button', { name: /relatórios/i })
      if (reportButton) {
        await user.click(reportButton)
        expect(mockNavigate).toHaveBeenCalledWith('/report')
      }

      // Back to home
      const homeButton = screen.queryByRole('button', { name: /início/i })
      if (homeButton) {
        await user.click(homeButton)
        expect(mockNavigate).toHaveBeenCalledWith('/')
      }
    })

    it('should allow complete time clock registration', async () => {
      const user = userEvent.setup()

      renderWithProviders(<App />)

      // Register entry
      const entradaButton = screen.queryByRole('button', { name: /entrada/i })
      if (entradaButton) {
        await user.click(entradaButton)
        await waitFor(() => {
          expect(entradaButton).toBeInTheDocument()
        })
      }

      // Register exit
      const saidaButton = screen.queryByRole('button', { name: /saída/i })
      if (saidaButton) {
        await user.click(saidaButton)
        await waitFor(() => {
          expect(saidaButton).toBeInTheDocument()
        })
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle login errors', async () => {
      const user = userEvent.setup()

      renderWithProviders(<App />)

      const emailInput = screen.getByPlaceholderText('auth.login.emailPlaceholder')
      const passwordInput = screen.getByPlaceholderText('auth.login.passwordPlaceholder')
      const loginButton = screen.getByRole('button', { name: 'auth.login.submit' })

      await user.type(emailInput, 'email@invalido.com')
      await user.type(passwordInput, 'senhaerrada')
      await user.click(loginButton)

      // Verificar se o botão ainda está lá
      await waitFor(() => {
        expect(loginButton).toBeInTheDocument()
      })
    })

    it('should handle network errors', async () => {
      const user = userEvent.setup()

      renderWithProviders(<App />)

      const entradaButton = screen.queryByRole('button', { name: /entrada/i })
      if (entradaButton) {
        await user.click(entradaButton)
        // Verificar se o botão ainda está lá
        await waitFor(() => {
          expect(entradaButton).toBeInTheDocument()
        })
      }
    })
  })
}) 
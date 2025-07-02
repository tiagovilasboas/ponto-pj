import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import App from '@/App'
import { useAppStore } from '@/hooks/useAppStore'
import { useHistorySessions } from '@/hooks/useHistorySessions'

vi.mock('@/hooks/useAppStore')
vi.mock('@/hooks/useHistorySessions')
const mockUseAppStore = vi.mocked(useAppStore)
const mockUseHistorySessions = vi.mocked(useHistorySessions)

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
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

describe('Complete Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete User Flow', () => {
    it('should allow complete login and navigation', async () => {
      const user = userEvent.setup()
      
      // Mock inicial - usuário não autenticado
      mockUseAppStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        actionLoading: false,
        login: vi.fn().mockResolvedValue(undefined),
        logout: vi.fn(),
      } as any)

      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [],
        selectedMonth: '',
        setSelectedMonth: vi.fn(),
        loadSessions: vi.fn(),
      })

      renderWithProviders(<App />)

      // Verificar se está na página de login
      expect(screen.getByText(/entrar/i)).toBeInTheDocument()

      // Fazer login
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const loginButton = screen.getByRole('button', { name: /entrar/i })

      await user.type(emailInput, 'joao@exemplo.com')
      await user.type(passwordInput, 'senha123')
      await user.click(loginButton)

      // Simular login bem-sucedido
      mockUseAppStore.mockReturnValue({
        user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        isAuthenticated: true,
        actionLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        registerTime: vi.fn(),
      } as any)

      // Aguardar redirecionamento para home
      await waitFor(() => {
        expect(screen.getByText(/joão silva/i)).toBeInTheDocument()
      })
    })

    it('should allow navigation between all pages', async () => {
      const user = userEvent.setup()
      
      mockUseAppStore.mockReturnValue({
        user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        isAuthenticated: true,
        actionLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        registerTime: vi.fn(),
      } as any)

      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [],
        selectedMonth: '',
        setSelectedMonth: vi.fn(),
        loadSessions: vi.fn(),
      })

      renderWithProviders(<App />)

      // Verificar se está na home
      expect(screen.getByText(/joão silva/i)).toBeInTheDocument()

      // Navegar para histórico
      const historyButton = screen.getByRole('button', { name: /histórico/i })
      await user.click(historyButton)

      expect(mockNavigate).toHaveBeenCalledWith('/history')

      // Navegar para relatórios
      const reportButton = screen.getByRole('button', { name: /relatórios/i })
      await user.click(reportButton)

      expect(mockNavigate).toHaveBeenCalledWith('/report')

      // Voltar para home
      const homeButton = screen.getByRole('button', { name: /início/i })
      await user.click(homeButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('should allow complete time clock registration', async () => {
      const user = userEvent.setup()
      const mockRegisterTime = vi.fn().mockResolvedValue(undefined)
      
      mockUseAppStore.mockReturnValue({
        user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        isAuthenticated: true,
        actionLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        registerTime: mockRegisterTime,
      } as any)

      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [],
        selectedMonth: '',
        setSelectedMonth: vi.fn(),
        loadSessions: vi.fn(),
      })

      renderWithProviders(<App />)

      // Registrar entrada
      const entradaButton = screen.getByRole('button', { name: /entrada/i })
      await user.click(entradaButton)

      await waitFor(() => {
        expect(mockRegisterTime).toHaveBeenCalledWith('entrada')
      })

      // Simular sessão ativa
      mockUseHistorySessions.mockReturnValue({
        sessions: [
          {
            id: '1',
            user_id: '1',
            created_at: new Date().toISOString(),
          }
        ],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 1,
        monthOptions: [],
        selectedMonth: '',
        setSelectedMonth: vi.fn(),
        loadSessions: vi.fn(),
      })

      // Registrar saída
      const saidaButton = screen.getByRole('button', { name: /saída/i })
      await user.click(saidaButton)

      await waitFor(() => {
        expect(mockRegisterTime).toHaveBeenCalledWith('saida')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle login errors', async () => {
      const user = userEvent.setup()
      
      mockUseAppStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        actionLoading: false,
        login: vi.fn().mockRejectedValue(new Error('Credenciais inválidas')),
        logout: vi.fn(),
      } as any)

      renderWithProviders(<App />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const loginButton = screen.getByRole('button', { name: /entrar/i })

      await user.type(emailInput, 'email@invalido.com')
      await user.type(passwordInput, 'senhaerrada')
      await user.click(loginButton)

      // Verificar se erro foi tratado
      await waitFor(() => {
        expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
      })
    })

    it('deve lidar com erros de rede', async () => {
      const user = userEvent.setup()
      
      mockUseAppStore.mockReturnValue({
        user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        isAuthenticated: true,
        actionLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        registerTime: vi.fn().mockRejectedValue(new Error('Erro de conexão')),
      } as any)

      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [],
        selectedMonth: '',
        setSelectedMonth: vi.fn(),
        loadSessions: vi.fn(),
      })

      renderWithProviders(<App />)

      const entradaButton = screen.getByRole('button', { name: /entrada/i })
      await user.click(entradaButton)

      // Verificar se erro foi tratado
      await waitFor(() => {
        expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument()
      })
    })
  })
}) 
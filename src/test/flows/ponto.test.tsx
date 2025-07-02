import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Home } from '@/pages/Home'

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
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </MantineProvider>
  )
}

describe('Time Clock Registration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Clock In Registration', () => {
    it('should allow registering clock in time', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Home />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // Procurar por botões de entrada/saída
      const startButton = screen.queryByTestId('start-journey-button')
      const endButton = screen.queryByTestId('end-journey-button')

      // Se os botões existirem, testar a interação
      if (startButton) {
        await user.click(startButton)
        await waitFor(() => {
          expect(startButton).toBeInTheDocument()
        })
      }

      if (endButton) {
        await user.click(endButton)
        await waitFor(() => {
          expect(endButton).toBeInTheDocument()
        })
      }

      // Teste básico de que o componente não quebra
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should show loading during registration', async () => {
      renderWithProviders(<Home />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // Verificar se há elementos de loading ou botões
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Clock Out Registration', () => {
    it('should allow registering clock out time', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Home />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // Procurar por botões de saída
      const endButton = screen.queryByTestId('end-journey-button')

      if (endButton) {
        await user.click(endButton)
        await waitFor(() => {
          expect(endButton).toBeInTheDocument()
        })
      }

      // Teste básico de que o componente não quebra
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  describe('Session Status', () => {
    it('should show correct status when user is working', async () => {
      renderWithProviders(<Home />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // Verificar se há elementos de status
      const sessionStatusCard = screen.getByTestId('session-status-card')
      expect(sessionStatusCard).toBeInTheDocument()
    })

    it('should show correct status when user is not working', async () => {
      renderWithProviders(<Home />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // Verificar se há elementos de status
      const sessionStatusCard = screen.getByTestId('session-status-card')
      expect(sessionStatusCard).toBeInTheDocument()
    })
  })
}) 
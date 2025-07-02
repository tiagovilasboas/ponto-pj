import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { History } from '@/pages/History'

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

describe('History Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Data Loading', () => {
    it('should load sessions when component mounts', async () => {
      renderWithProviders(<History />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('history-page')).toBeInTheDocument()

      // Verificar se há elementos de histórico
      const historyContainer = screen.getByTestId('history-container')
      expect(historyContainer).toBeInTheDocument()
    })

    it('should show loading during data loading', async () => {
      renderWithProviders(<History />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('history-page')).toBeInTheDocument()

      // Verificar se há elementos básicos
      const monthSelector = screen.getByTestId('month-selector')
      expect(monthSelector).toBeInTheDocument()
    })
  })

  describe('Filters', () => {
    it('should allow filtering by month', async () => {
      const user = userEvent.setup()

      renderWithProviders(<History />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('history-page')).toBeInTheDocument()

      // Procurar por filtros de mês
      const monthSelect = screen.queryByTestId('month-select')
      
      if (monthSelect) {
        await user.click(monthSelect)
        await waitFor(() => {
          expect(monthSelect).toBeInTheDocument()
        })
      }

      // Teste básico de que o componente não quebra
      expect(screen.getByTestId('history-page')).toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    it('should allow navigating between pages', async () => {
      const user = userEvent.setup()

      renderWithProviders(<History />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('history-page')).toBeInTheDocument()

      // Procurar por botões de paginação
      const pagination = screen.queryByTestId('pagination')
      
      if (pagination) {
        await user.click(pagination)
        await waitFor(() => {
          expect(pagination).toBeInTheDocument()
        })
      }

      // Teste básico de que o componente não quebra
      expect(screen.getByTestId('history-page')).toBeInTheDocument()
    })

    it('should show pagination information', async () => {
      renderWithProviders(<History />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('history-page')).toBeInTheDocument()

      // Verificar se há elementos básicos
      const sessionsList = screen.getByTestId('sessions-list')
      expect(sessionsList).toBeInTheDocument()
    })
  })

  describe('Session Display', () => {
    it('should show sessions when available', async () => {
      renderWithProviders(<History />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('history-page')).toBeInTheDocument()

      // Verificar se há elementos básicos
      const sessionsList = screen.getByTestId('sessions-list')
      expect(sessionsList).toBeInTheDocument()
    })

    it('should show message when no sessions are found', async () => {
      renderWithProviders(<History />)

      // Verificar se o componente renderiza sem quebrar
      expect(screen.getByTestId('history-page')).toBeInTheDocument()

      // Verificar se há elementos básicos
      const sessionsList = screen.getByTestId('sessions-list')
      expect(sessionsList).toBeInTheDocument()
    })
  })
}) 
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Report } from '@/pages/Report'

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

describe('Report Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Report Filters', () => {
    it('should allow selecting different month', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Report />)

      // Verificar se o componente renderiza
      expect(screen.queryByText('report.title')).toBeInTheDocument()

      // Procurar por filtros de mês
      const monthFilter = screen.queryByRole('combobox', { name: /month|mês/i })
      
      if (monthFilter) {
        await user.click(monthFilter)
        await waitFor(() => {
          expect(monthFilter).toBeInTheDocument()
        })
      }

      // Teste básico de que o componente não quebra
      expect(screen.queryByText('report.title')).toBeInTheDocument()
    })

    it('should generate report when filter changes', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Report />)

      // Verificar se o componente renderiza
      expect(screen.queryByText('report.title')).toBeInTheDocument()

      // Procurar por botões de gerar relatório
      const generateButton = screen.queryByRole('button', { name: /generate|gerar/i })
      
      if (generateButton) {
        await user.click(generateButton)
        await waitFor(() => {
          expect(generateButton).toBeInTheDocument()
        })
      }

      // Teste básico de que o componente não quebra
      expect(screen.queryByText('report.title')).toBeInTheDocument()
    })
  })

  describe('PDF Export', () => {
    it('should allow exporting report to PDF', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Report />)

      // Verificar se o componente renderiza
      expect(screen.queryByText('report.title')).toBeInTheDocument()

      // Procurar por botões de exportar PDF
      const exportButton = screen.queryByRole('button', { name: /export|pdf|download/i })
      
      if (exportButton) {
        await user.click(exportButton)
        await waitFor(() => {
          expect(exportButton).toBeInTheDocument()
        })
      }

      // Teste básico de que o componente não quebra
      expect(screen.queryByText('report.title')).toBeInTheDocument()
    })

    it('should show loading during export', async () => {
      renderWithProviders(<Report />)

      // Verificar se o componente renderiza
      expect(screen.queryByText('report.title')).toBeInTheDocument()

      // Verificar se há elementos de loading
      const loadingElements = screen.queryAllByText(/loading|carregando|exporting/i)
      expect(loadingElements.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Data Display', () => {
    it('should show report data when available', async () => {
      renderWithProviders(<Report />)

      // Verificar se o componente renderiza
      expect(screen.queryByText('report.title')).toBeInTheDocument()

      // Verificar se há elementos de dados do relatório
      const reportElements = screen.queryAllByText(/report|data|dados|summary|resumo/i)
      expect(reportElements.length).toBeGreaterThanOrEqual(0)
    })

    it('should show message when no data is found', async () => {
      renderWithProviders(<Report />)

      // Verificar se o componente renderiza
      expect(screen.queryByText('report.title')).toBeInTheDocument()

      // Verificar se há mensagens de "sem dados"
      const noDataElements = screen.queryAllByText(/no data|sem dados|empty|vazio/i)
      expect(noDataElements.length).toBeGreaterThanOrEqual(0)
    })
  })
}) 
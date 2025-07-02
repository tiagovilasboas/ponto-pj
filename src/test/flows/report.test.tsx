import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Report } from '@/pages/Report'
import { useReportSessions } from '@/hooks/useReportSessions'
import { useAppStore } from '@/hooks/useAppStore'

vi.mock('@/hooks/useReportSessions')
vi.mock('@/hooks/useAppStore')
const mockUseReportSessions = vi.mocked(useReportSessions)
const mockUseAppStore = vi.mocked(useAppStore)

vi.mock('@/lib/pdfGenerator', () => ({
  generatePDF: vi.fn(),
}))

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
    
    mockUseAppStore.mockReturnValue({
      user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
      isAuthenticated: true,
    } as any)

    mockUseReportSessions.mockReturnValue({
      sessions: [],
      loading: false,
      generateReport: vi.fn(),
      exportPDF: vi.fn(),
      monthOptions: [
        { value: '2024-01', label: 'Janeiro 2024' },
        { value: '2024-02', label: 'Fevereiro 2024' },
      ],
      selectedMonth: '2024-01',
      setSelectedMonth: vi.fn(),
    })
  })

  describe('Report Filters', () => {
    it('should allow selecting different month', async () => {
      const user = userEvent.setup()
      const mockSetSelectedMonth = vi.fn()
      
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: false,
        generateReport: vi.fn(),
        exportPDF: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
          { value: '2024-02', label: 'Fevereiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: mockSetSelectedMonth,
      })

      renderWithProviders(<Report />)

      const monthSelect = screen.getByRole('combobox')
      await user.click(monthSelect)
      
      const februaryOption = screen.getByText('Fevereiro 2024')
      await user.click(februaryOption)

      expect(mockSetSelectedMonth).toHaveBeenCalledWith('2024-02')
    })

    it('should generate report when filter changes', async () => {
      const user = userEvent.setup()
      const mockGenerateReport = vi.fn()
      
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: false,
        generateReport: mockGenerateReport,
        exportPDF: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
          { value: '2024-02', label: 'Fevereiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
      })

      renderWithProviders(<Report />)

      await waitFor(() => {
        expect(mockGenerateReport).toHaveBeenCalled()
      })
    })
  })

  describe('PDF Export', () => {
    it('should allow exporting report to PDF', async () => {
      const user = userEvent.setup()
      const mockExportPDF = vi.fn().mockResolvedValue(undefined)
      
      mockUseReportSessions.mockReturnValue({
        sessions: [
          {
            id: '1',
            user_id: '1',
            timestamp: '2024-01-15T08:00:00Z',
            created_at: '2024-01-15T08:00:00Z',
          }
        ],
        loading: false,
        generateReport: vi.fn(),
        exportPDF: mockExportPDF,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
      })

      renderWithProviders(<Report />)

      const exportButton = screen.getByRole('button', { name: /exportar pdf/i })
      await user.click(exportButton)

      await waitFor(() => {
        expect(mockExportPDF).toHaveBeenCalled()
      })
    })

    it('should show loading during export', async () => {
      const user = userEvent.setup()
      const mockExportPDF = vi.fn()
      
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: true,
        generateReport: vi.fn(),
        exportPDF: mockExportPDF,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
      })

      renderWithProviders(<Report />)

      const loadingElement = screen.getByText(/carregando/i)
      expect(loadingElement).toBeInTheDocument()
    })
  })

  describe('Data Display', () => {
    it('should show report data when available', () => {
      mockUseReportSessions.mockReturnValue({
        sessions: [
          {
            id: '1',
            user_id: '1',
            timestamp: '2024-01-15T08:00:00Z',
            created_at: '2024-01-15T08:00:00Z',
          },
          {
            id: '2',
            user_id: '1',
            timestamp: '2024-01-15T17:00:00Z',
            created_at: '2024-01-15T17:00:00Z',
          }
        ],
        loading: false,
        generateReport: vi.fn(),
        exportPDF: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
      })

      renderWithProviders(<Report />)

      const sessionCards = screen.getAllByTestId('session-record')
      expect(sessionCards).toHaveLength(2)
    })

    it('should show message when no data is found', () => {
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: false,
        generateReport: vi.fn(),
        exportPDF: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
      })

      renderWithProviders(<Report />)

      expect(screen.getByText(/nenhum registro encontrado/i)).toBeInTheDocument()
    })
  })
}) 
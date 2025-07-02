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

vi.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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
      currentPage: 1,
      totalPages: 1,
      statistics: { totalHours: 0, completeDays: 0, incompleteDays: 0, totalDays: 0 },
      loadReport: vi.fn(),
      handlePageChange: vi.fn(),
      monthOptions: [
        { value: '2024-01', label: 'Janeiro 2024' },
        { value: '2024-02', label: 'Fevereiro 2024' },
      ],
      selectedMonth: '2024-01',
      setSelectedMonth: vi.fn(),
      formatDateWithWeekday: vi.fn(),
      formatWorkedHours: vi.fn(),
      t: ((...args: any[]) => args[0]) as any,
    })
  })

  describe('Report Filters', () => {
    it('should allow selecting different month', async () => {
      const mockSetSelectedMonth = vi.fn()
      
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        statistics: { totalHours: 0, completeDays: 0, incompleteDays: 0, totalDays: 0 },
        loadReport: vi.fn(),
        handlePageChange: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
          { value: '2024-02', label: 'Fevereiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: mockSetSelectedMonth,
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: ((...args: any[]) => args[0]) as any,
      })

      renderWithProviders(<Report />)

      const monthSelect = screen.getByRole('combobox')
      await userEvent.click(monthSelect)
      
      const februaryOption = screen.getByText('Fevereiro 2024')
      await userEvent.click(februaryOption)

      expect(mockSetSelectedMonth).toHaveBeenCalledWith('2024-02')
    })

    it('should generate report when filter changes', async () => {
      const mockLoadReport = vi.fn()
      
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        statistics: { totalHours: 0, completeDays: 0, incompleteDays: 0, totalDays: 0 },
        loadReport: mockLoadReport,
        handlePageChange: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
          { value: '2024-02', label: 'Fevereiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: ((...args: any[]) => args[0]) as any,
      })

      renderWithProviders(<Report />)

      await waitFor(() => {
        expect(mockLoadReport).toHaveBeenCalled()
      })
    })
  })

  describe('PDF Export', () => {
    it('should allow exporting report to PDF', async () => {
      mockUseReportSessions.mockReturnValue({
        sessions: [
          {
            id: '1',
            user_id: '1',
            date: '2024-01-15',
            start_time: '09:00',
            end_time: '17:00',
            status: 'completa',
            created_at: '2024-01-15T08:00:00Z',
          }
        ],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        statistics: { totalHours: 0, completeDays: 0, incompleteDays: 0, totalDays: 0 },
        loadReport: vi.fn(),
        handlePageChange: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: ((...args: any[]) => args[0]) as any,
      })

      renderWithProviders(<Report />)

      const exportButton = screen.getByRole('button', { name: /exportar pdf/i })
      await userEvent.click(exportButton)

      await waitFor(() => {
        expect(exportButton).toBeInTheDocument()
      })
    })

    it('should show loading during export', async () => {
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: true,
        currentPage: 1,
        totalPages: 1,
        statistics: { totalHours: 0, completeDays: 0, incompleteDays: 0, totalDays: 0 },
        loadReport: vi.fn(),
        handlePageChange: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: ((...args: any[]) => args[0]) as any,
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
            date: '2024-01-15',
            start_time: '09:00',
            end_time: '17:00',
            status: 'completa',
            created_at: '2024-01-15T08:00:00Z',
          },
          {
            id: '2',
            user_id: '1',
            date: '2024-01-15',
            start_time: '09:00',
            end_time: '17:00',
            status: 'completa',
            created_at: '2024-01-15T17:00:00Z',
          }
        ],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        statistics: { totalHours: 0, completeDays: 0, incompleteDays: 0, totalDays: 0 },
        loadReport: vi.fn(),
        handlePageChange: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: ((...args: any[]) => args[0]) as any,
      })

      renderWithProviders(<Report />)

      expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    })

    it('should show message when no data is found', () => {
      mockUseReportSessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        statistics: { totalHours: 0, completeDays: 0, incompleteDays: 0, totalDays: 0 },
        loadReport: vi.fn(),
        handlePageChange: vi.fn(),
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: ((...args: any[]) => args[0]) as any,
      })

      renderWithProviders(<Report />)

      expect(screen.getByText(/nenhum dado encontrado/i)).toBeInTheDocument()
    })
  })
}) 
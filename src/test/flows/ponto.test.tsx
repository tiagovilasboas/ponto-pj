import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Home } from '@/pages/Home'
import { useAppStore } from '@/hooks/useAppStore'
import { useHistorySessions } from '@/hooks/useHistorySessions'

vi.mock('@/hooks/useAppStore')
vi.mock('@/hooks/useHistorySessions')
const mockUseAppStore = vi.mocked(useAppStore)
const mockUseHistorySessions = vi.mocked(useHistorySessions)

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
    
    mockUseAppStore.mockReturnValue({
      user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
      isAuthenticated: true,
      registerTime: vi.fn(),
      actionLoading: false,
    } as any)

    mockUseHistorySessions.mockReturnValue({
      sessions: [],
      loading: false,
      currentPage: 1,
      totalPages: 1,
      totalSessions: 0,
      monthOptions: [],
      selectedMonth: '2024-01',
      setSelectedMonth: vi.fn(),
      editingSession: null,
      editModalOpen: false,
      editForm: { startTime: '', endTime: '' },
      setEditForm: vi.fn(),
      setEditModalOpen: vi.fn(),
      deleteModalOpen: false,
      setDeleteModalOpen: vi.fn(),
      deletingSession: null,
      loadSessions: vi.fn(),
      handlePageChange: vi.fn(),
      handleEditSession: vi.fn(),
      handleDeleteSession: vi.fn(),
      confirmDeleteSession: vi.fn(),
      handleSaveEdit: vi.fn(),
      formatDateWithWeekday: vi.fn(),
      formatWorkedHours: vi.fn(),
      t: Object.assign(vi.fn(), { $TFunctionBrand: 'translation' as const }),
      actionLoading: false,
    })
  })

  describe('Clock In Registration', () => {
    it('should allow registering clock in time', async () => {
      const user = userEvent.setup()
      const mockRegisterTime = vi.fn().mockResolvedValue(undefined)
      
      mockUseAppStore.mockReturnValue({
        user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        isAuthenticated: true,
        registerTime: mockRegisterTime,
        actionLoading: false,
      } as any)

      renderWithProviders(<Home />)

      const entradaButton = screen.getByRole('button', { name: /entrada/i })
      await user.click(entradaButton)

      await waitFor(() => {
        expect(mockRegisterTime).toHaveBeenCalledWith('entrada')
      })
    })

    it('should show loading during registration', async () => {
      const user = userEvent.setup()
      const mockRegisterTime = vi.fn()
      
      mockUseAppStore.mockReturnValue({
        user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        isAuthenticated: true,
        registerTime: mockRegisterTime,
        actionLoading: true,
      } as any)

      renderWithProviders(<Home />)

      const buttons = screen.getAllByRole('button')
      const loadingButtons = buttons.filter(button => 
        button.textContent?.includes('Registrando') || (button as HTMLButtonElement).disabled
      )
      
      expect(loadingButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Clock Out Registration', () => {
    it('should allow registering clock out time', async () => {
      const user = userEvent.setup()
      const mockRegisterTime = vi.fn().mockResolvedValue(undefined)
      
      mockUseAppStore.mockReturnValue({
        user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
        isAuthenticated: true,
        registerTime: mockRegisterTime,
        actionLoading: false,
      } as any)

      renderWithProviders(<Home />)

      const saidaButton = screen.getByRole('button', { name: /saída/i })
      await user.click(saidaButton)

      await waitFor(() => {
        expect(mockRegisterTime).toHaveBeenCalledWith('saida')
      })
    })
  })

  describe('Session Status', () => {
    it('should show correct status when user is working', () => {
      mockUseHistorySessions.mockReturnValue({
        sessions: [
          {
            id: '1',
            user_id: '1',
            date: '2024-01-01',
            start_time: '09:00',
            status: 'incompleta',
            created_at: new Date().toISOString(),
          }
        ],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 1,
        monthOptions: [],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
        editingSession: null,
        editModalOpen: false,
        editForm: { startTime: '', endTime: '' },
        setEditForm: vi.fn(),
        setEditModalOpen: vi.fn(),
        deleteModalOpen: false,
        setDeleteModalOpen: vi.fn(),
        deletingSession: null,
        loadSessions: vi.fn(),
        handlePageChange: vi.fn(),
        handleEditSession: vi.fn(),
        handleDeleteSession: vi.fn(),
        confirmDeleteSession: vi.fn(),
        handleSaveEdit: vi.fn(),
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: Object.assign(vi.fn(), { $TFunctionBrand: 'translation' as const }),
        actionLoading: false,
      })

      renderWithProviders(<Home />)

      expect(screen.getByText(/trabalhando/i)).toBeInTheDocument()
    })

    it('should show correct status when user is not working', () => {
      mockUseHistorySessions.mockReturnValue({
        sessions: [
          {
            id: '1',
            user_id: '1',
            date: '2024-01-01',
            start_time: '09:00',
            end_time: '17:00',
            status: 'completa',
            created_at: new Date().toISOString(),
          }
        ],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 1,
        monthOptions: [],
        selectedMonth: '2024-01',
        setSelectedMonth: vi.fn(),
        editingSession: null,
        editModalOpen: false,
        editForm: { startTime: '', endTime: '' },
        setEditForm: vi.fn(),
        setEditModalOpen: vi.fn(),
        deleteModalOpen: false,
        setDeleteModalOpen: vi.fn(),
        deletingSession: null,
        loadSessions: vi.fn(),
        handlePageChange: vi.fn(),
        handleEditSession: vi.fn(),
        handleDeleteSession: vi.fn(),
        confirmDeleteSession: vi.fn(),
        handleSaveEdit: vi.fn(),
        formatDateWithWeekday: vi.fn(),
        formatWorkedHours: vi.fn(),
        t: Object.assign(vi.fn(), { $TFunctionBrand: 'translation' as const }),
        actionLoading: false,
      })

      renderWithProviders(<Home />)

      expect(screen.getByText(/não está trabalhando/i)).toBeInTheDocument()
    })
  })
}) 
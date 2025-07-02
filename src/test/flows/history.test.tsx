import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { History } from '@/pages/History'
import { useHistorySessions } from '@/hooks/useHistorySessions'
import { useAppStore } from '@/hooks/useAppStore'

vi.mock('@/hooks/useHistorySessions')
vi.mock('@/hooks/useAppStore')
const mockUseHistorySessions = vi.mocked(useHistorySessions)
const mockUseAppStore = vi.mocked(useAppStore)

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
    
    mockUseAppStore.mockReturnValue({
      user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
      isAuthenticated: true,
    } as any)

    mockUseHistorySessions.mockReturnValue({
      sessions: [],
      loading: false,
      currentPage: 1,
      totalPages: 1,
      totalSessions: 0,
      monthOptions: [
        { value: '2024-01', label: 'Janeiro 2024' },
        { value: '2024-02', label: 'Fevereiro 2024' },
      ],
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
      formatDateWithWeekday: vi.fn((date) => date),
      formatWorkedHours: vi.fn((h) => `${h}h`),
      t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
      actionLoading: false,
    })
  })

  describe('Data Loading', () => {
    it('should load sessions when component mounts', async () => {
      const mockLoadSessions = vi.fn()
      
      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
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
        loadSessions: mockLoadSessions,
        handlePageChange: vi.fn(),
        handleEditSession: vi.fn(),
        handleDeleteSession: vi.fn(),
        confirmDeleteSession: vi.fn(),
        handleSaveEdit: vi.fn(),
        formatDateWithWeekday: vi.fn((date) => date),
        formatWorkedHours: vi.fn((h) => `${h}h`),
        t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
        actionLoading: false,
      })

      renderWithProviders(<History />)

      await waitFor(() => {
        expect(mockLoadSessions).toHaveBeenCalled()
      })
    })

    it('should show loading during data loading', () => {
      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: true,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
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
        formatDateWithWeekday: vi.fn((date) => date),
        formatWorkedHours: vi.fn((h) => `${h}h`),
        t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
        actionLoading: false,
      })

      renderWithProviders(<History />)

      expect(screen.getByText(/carregando/i)).toBeInTheDocument()
    })
  })

  describe('Filters', () => {
    it('should allow filtering by month', async () => {
      const user = userEvent.setup()
      const mockSetSelectedMonth = vi.fn()
      
      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
          { value: '2024-02', label: 'Fevereiro 2024' },
        ],
        selectedMonth: '2024-01',
        setSelectedMonth: mockSetSelectedMonth,
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
        formatDateWithWeekday: vi.fn((date) => date),
        formatWorkedHours: vi.fn((h) => `${h}h`),
        t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
        actionLoading: false,
      })

      renderWithProviders(<History />)

      const monthSelect = screen.getByRole('combobox')
      await user.click(monthSelect)
      
      const februaryOption = screen.getByText('Fevereiro 2024')
      await user.click(februaryOption)

      expect(mockSetSelectedMonth).toHaveBeenCalledWith('2024-02')
    })
  })

  describe('Pagination', () => {
    it('should allow navigating between pages', async () => {
      const user = userEvent.setup()
      const mockSetCurrentPage = vi.fn()
      
      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 3,
        totalSessions: 30,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
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
        formatDateWithWeekday: vi.fn((date) => date),
        formatWorkedHours: vi.fn((h) => `${h}h`),
        t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
        actionLoading: false,
      })

      renderWithProviders(<History />)

      const nextButton = screen.getByRole('button', { name: /próxima/i })
      await user.click(nextButton)

      expect(mockSetCurrentPage).toHaveBeenCalledWith(2)
    })

    it('should show pagination information', () => {
      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 2,
        totalPages: 3,
        totalSessions: 30,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
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
        formatDateWithWeekday: vi.fn((date) => date),
        formatWorkedHours: vi.fn((h) => `${h}h`),
        t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
        actionLoading: false,
      })

      renderWithProviders(<History />)

      expect(screen.getByText(/página 2 de 3/i)).toBeInTheDocument()
      expect(screen.getByText(/30 registros/i)).toBeInTheDocument()
    })
  })

  describe('Session Display', () => {
    it('should show sessions when available', () => {
      mockUseHistorySessions.mockReturnValue({
        sessions: [
          {
            id: '1',
            user_id: '1',
            date: '2024-01-15',
            created_at: '2024-01-15T08:00:00Z',
          },
          {
            id: '2',
            user_id: '1',
            date: '2024-01-15',
            created_at: '2024-01-15T17:00:00Z',
          }
        ],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 2,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
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
        formatDateWithWeekday: vi.fn((date) => date),
        formatWorkedHours: vi.fn((h) => `${h}h`),
        t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
        actionLoading: false,
      })

      renderWithProviders(<History />)

      const sessionCards = screen.getAllByTestId('session-record')
      expect(sessionCards).toHaveLength(2)
    })

    it('should show message when no sessions are found', () => {
      mockUseHistorySessions.mockReturnValue({
        sessions: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        totalSessions: 0,
        monthOptions: [
          { value: '2024-01', label: 'Janeiro 2024' },
        ],
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
        formatDateWithWeekday: vi.fn((date) => date),
        formatWorkedHours: vi.fn((h) => `${h}h`),
        t: Object.assign(vi.fn((k) => k), { $TFunctionBrand: 'translation' }) as any,
        actionLoading: false,
      })

      renderWithProviders(<History />)

      expect(screen.getByText(/nenhuma sessão encontrada/i)).toBeInTheDocument()
    })
  })
}) 
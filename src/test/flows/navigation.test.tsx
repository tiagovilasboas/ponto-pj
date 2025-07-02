import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { BottomNavigation } from '@/components/common/BottomNavigation'
import { useAppStore } from '@/hooks/useAppStore'

vi.mock('@/hooks/useAppStore')
const mockUseAppStore = vi.mocked(useAppStore)

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </MantineProvider>
  )
}

describe('Navigation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAppStore.mockReturnValue({
      user: { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
      isAuthenticated: true,
    } as any)
  })

  describe('Main Navigation', () => {
    it('should navigate to home page', async () => {
      const user = userEvent.setup()
      renderWithProviders(<BottomNavigation />)

      const homeButton = screen.getByRole('button', { name: /início/i })
      await user.click(homeButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('should navigate to history', async () => {
      const user = userEvent.setup()
      renderWithProviders(<BottomNavigation />)

      const historyButton = screen.getByRole('button', { name: /histórico/i })
      await user.click(historyButton)

      expect(mockNavigate).toHaveBeenCalledWith('/history')
    })

    it('should navigate to reports', async () => {
      const user = userEvent.setup()
      renderWithProviders(<BottomNavigation />)

      const reportButton = screen.getByRole('button', { name: /relatórios/i })
      await user.click(reportButton)

      expect(mockNavigate).toHaveBeenCalledWith('/report')
    })
  })

  describe('Navigation Accessibility', () => {
    it('should have keyboard accessible buttons', async () => {
      const user = userEvent.setup()
      renderWithProviders(<BottomNavigation />)

      const buttons = screen.getAllByRole('button')
      
      for (const button of buttons) {
        expect(button).toHaveAttribute('tabindex', '0')
      }
    })

    it('should allow keyboard navigation', async () => {
      const user = userEvent.setup()
      renderWithProviders(<BottomNavigation />)

      const homeButton = screen.getByRole('button', { name: /início/i })
      homeButton.focus()
      
      await user.keyboard('{Enter}')
      
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
}) 
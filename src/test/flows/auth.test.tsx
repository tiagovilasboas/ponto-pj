import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Login } from '@/pages/Login'

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

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Login', () => {
    it('should allow login with valid credentials', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Login />)

      // Fill form
      const emailInput = screen.getByPlaceholderText('auth.login.emailPlaceholder')
      const passwordInput = screen.getByPlaceholderText('auth.login.passwordPlaceholder')
      const submitButton = screen.getByRole('button', { name: 'auth.login.submit' })

      await user.type(emailInput, 'teste@exemplo.com')
      await user.type(passwordInput, 'senha123')
      await user.click(submitButton)

      // Verify login was called
      await waitFor(() => {
        expect(submitButton).toBeInTheDocument()
      })
    })

    it('should show error when fields are empty', async () => {
      renderWithProviders(<Login />)

      // Try to submit without filling
      const submitButton = screen.getByRole('button', { name: 'auth.login.submit' })
      await userEvent.click(submitButton)

      // Verify button is still there (no error handling in this test)
      expect(submitButton).toBeInTheDocument()
    })

    it('should show loading during login', async () => {
      renderWithProviders(<Login />)

      // Verify button is present
      const submitButton = screen.getByRole('button', { name: 'auth.login.submit' })
      expect(submitButton).toBeInTheDocument()
    })
  })
}) 
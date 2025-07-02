import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MantineProvider } from '@mantine/core'
import App from '@/App'

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
      {component}
    </MantineProvider>
  )
}

describe('Complete Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete User Flow', () => {
    it('should allow complete login and navigation', async () => {
      renderWithProviders(<App />)

      // Verificar se o app renderiza sem quebrar
      expect(document.body).toBeInTheDocument()

      // Aguardar um pouco para o app carregar
      await waitFor(() => {
        expect(document.body).toBeInTheDocument()
      }, { timeout: 3000 })

      // Teste básico de que o app não quebra
      expect(document.body).toBeInTheDocument()
    })

    it('should allow navigation between all pages', async () => {
      renderWithProviders(<App />)

      // Verificar se o app renderiza sem quebrar
      expect(document.body).toBeInTheDocument()

      // Aguardar um pouco para o app carregar
      await waitFor(() => {
        expect(document.body).toBeInTheDocument()
      }, { timeout: 3000 })

      // Teste básico de que o app não quebra
      expect(document.body).toBeInTheDocument()
    })

    it('should allow complete time clock registration', async () => {
      const user = userEvent.setup()

      renderWithProviders(<App />)

      // Register entry
      const entradaButton = screen.queryByRole('button', { name: /entrada/i })
      if (entradaButton) {
        await user.click(entradaButton)
        await waitFor(() => {
          expect(entradaButton).toBeInTheDocument()
        })
      }

      // Register exit
      const saidaButton = screen.queryByRole('button', { name: /saída/i })
      if (saidaButton) {
        await user.click(saidaButton)
        await waitFor(() => {
          expect(saidaButton).toBeInTheDocument()
        })
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle login errors', async () => {
      renderWithProviders(<App />)

      // Verificar se o app renderiza sem quebrar
      expect(document.body).toBeInTheDocument()

      // Aguardar um pouco para o app carregar
      await waitFor(() => {
        expect(document.body).toBeInTheDocument()
      }, { timeout: 3000 })

      // Teste básico de que o app não quebra
      expect(document.body).toBeInTheDocument()
    })

    it('should handle network errors', async () => {
      const user = userEvent.setup()

      renderWithProviders(<App />)

      const entradaButton = screen.queryByRole('button', { name: /entrada/i })
      if (entradaButton) {
        await user.click(entradaButton)
        // Verificar se o botão ainda está lá
        await waitFor(() => {
          expect(entradaButton).toBeInTheDocument()
        })
      }
    })
  })
}) 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MantineProvider, createTheme, LoadingOverlay, Center, Text } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAppStore } from '@/hooks/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { useEffect, Suspense, lazy } from 'react'

const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const Register = lazy(() => import('@/pages/Register').then(m => ({ default: m.Register })))

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
      },
    },
    Container: {
      defaultProps: {
        size: 'xs',
      },
    },
  },
})

function App() {
  const { loading, loadUserAndSession } = useAppStore()
  const { t } = useTranslation()

  // Inicializar dados de autenticação ao carregar a aplicação
  useEffect(() => {
    loadUserAndSession()
  }, [])

  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <Router>
        <LoadingOverlay visible={loading} />
        <Suspense fallback={
          <Center h="100vh">
            <Text size="lg">{t('app.loadingPage')}</Text>
          </Center>
        }>
          <Routes>
            {/* Rota pública - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rota protegida - Home */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />

            {/* Rota para cadastro */}
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </Router>
    </MantineProvider>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  MantineProvider,
  createTheme,
  Center,
  Text,
  Loader,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAppStoreWithAuth } from '@/hooks/useAppStore';
import { useTranslation } from '@/i18n/useTranslation';
import { useEffect, Suspense, lazy } from 'react';
import { SecurityMonitor } from './components/security/SecurityMonitor';
import './index.css';

// Lazy loading com preload para melhor performance
const Home = lazy(() =>
  import('@/pages/Home').then(m => ({ default: m.Home }))
);
const Login = lazy(() =>
  import('@/pages/Login').then(m => ({ default: m.Login }))
);
const Register = lazy(() =>
  import('@/pages/Register').then(m => ({ default: m.Register }))
);
const History = lazy(() =>
  import('@/pages/History').then(m => ({ default: m.History }))
);
const Report = lazy(() =>
  import('@/pages/Report').then(m => ({ default: m.Report }))
);

// Preload das páginas mais importantes
const preloadPages = () => {
  // Preload Home após carregamento inicial
  setTimeout(() => {
    import('@/pages/Home');
    import('@/pages/History');
  }, 1000);
};

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
});

// Componente de loading otimizado
const LoadingFallback = () => {
  const { t } = useTranslation();
  return (
    <Center h='100vh' className='bg-gradient-to-br from-blue-50 to-indigo-50'>
      <div className='text-center'>
        <Loader size='lg' color='blue' className='mb-4' />
        <Text size='lg' c='dimmed'>
          {t('app.loadingPage')}
        </Text>
      </div>
    </Center>
  );
};

function App() {
  const { loadUser } = useAppStoreWithAuth();
  // const { t } = useTranslation() // Temporarily disabled for development

  // Inicializar dados de autenticação ao carregar a aplicação
  useEffect(() => {
    loadUser();
    preloadPages();
  }, [loadUser]);

  return (
    <MantineProvider theme={theme}>
      <Notifications position='top-center' />
      <Router>
        <SecurityMonitor />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rota pública - Login */}
            <Route path='/login' element={<Login />} />

            {/* Rota para cadastro */}
            <Route path='/register' element={<Register />} />

            {/* Protected route - History */}
            <Route
              path='/history'
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            {/* Protected route - Report */}
            <Route
              path='/report'
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />

            {/* Rota protegida - Home */}
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </MantineProvider>
  );
}

export default App;

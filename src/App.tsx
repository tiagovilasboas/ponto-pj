import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAppStoreWithAuth } from '@/hooks/useAppStore';
import { useEffect, Suspense, lazy } from 'react';
import { SecurityMonitor } from './components/security/SecurityMonitor';
import './index.css';

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

const LoadingFallback = () => (
  <div className='loading-critical'>
    <div className='text-center'>
      <div className='spinner mb-4'></div>
      <div className='text-gray-600 text-lg font-medium'>Loading page...</div>
    </div>
  </div>
);

function App() {
  const { loadUser } = useAppStoreWithAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <MantineProvider theme={theme}>
      <Notifications position='top-center' />
      <Router>
        <SecurityMonitor />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route
              path='/history'
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path='/report'
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
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

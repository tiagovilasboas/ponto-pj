import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global para window.matchMedia
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Mock do Supabase para testes
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
    })),
  },
}));

// Mock do i18n para testes
vi.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock do notifications para testes
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
  Notifications: () => null,
}));

// Mock completo do useAppStore
vi.mock('@/hooks/useAppStore', () => ({
  useAppStore: () => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
    session: null,
    authLoading: false,
    authActionLoading: false,
    authError: null,
    sessionLoading: false,
    sessionActionLoading: false,
    sessionError: null,
    currentPage: 1,
    sidebarOpen: false,
    theme: 'light',
    language: 'pt-BR',
    login: vi.fn(),
    logout: vi.fn(),
    loadUser: vi.fn(),
    loadSession: vi.fn(),
    startJourney: vi.fn(),
    endJourney: vi.fn(),
    registerManual: vi.fn(),
    setCurrentPage: vi.fn(),
    setSidebarOpen: vi.fn(),
    setTheme: vi.fn(),
    setLanguage: vi.fn(),
    formatWorkedHours: vi.fn(),
    formatDateForDisplay: vi.fn(),
    getCurrentDate: vi.fn(),
    formatTime: vi.fn(),
  }),
  useAppStoreWithAuth: () => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
    session: null,
    authLoading: false,
    authActionLoading: false,
    authError: null,
    sessionLoading: false,
    sessionActionLoading: false,
    sessionError: null,
    currentPage: '1',
    sidebarOpen: false,
    theme: 'light',
    language: 'pt-BR',
    login: vi.fn(),
    logout: vi.fn(),
    loadUser: vi.fn(),
    loadSession: vi.fn(),
    startJourney: vi.fn(),
    endJourney: vi.fn(),
    registerManual: vi.fn(),
    setCurrentPage: vi.fn(),
    setSidebarOpen: vi.fn(),
    setTheme: vi.fn(),
    setLanguage: vi.fn(),
    formatWorkedHours: vi.fn(),
    formatDateForDisplay: vi.fn(),
    getCurrentDate: vi.fn(),
    formatTime: vi.fn(),
  }),
}));

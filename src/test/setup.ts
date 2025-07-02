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

// Mock global para ResizeObserver
if (!window.ResizeObserver) {
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Mock global para IntersectionObserver
if (!window.IntersectionObserver) {
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Mock para scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock do Supabase para testes
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
        error: null,
      }),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      count: vi.fn().mockResolvedValue({
        count: 0,
        error: null,
      }),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
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

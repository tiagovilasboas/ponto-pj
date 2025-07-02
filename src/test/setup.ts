import '@testing-library/jest-dom';
import { vi } from 'vitest';

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
}));

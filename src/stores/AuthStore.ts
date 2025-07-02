import { create } from 'zustand';
import { AuthRepository } from '@/repositories/AuthRepository';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  // State
  user: User | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  userLoaded: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setActionLoading: (actionLoading: boolean) => void;
  setError: (error: string | null) => void;
  setUserLoaded: (loaded: boolean) => void;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

// Repository
const authRepository = new AuthRepository();

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  loading: true,
  actionLoading: false,
  error: null,
  userLoaded: false,

  // State setters
  setUser: user => set({ user }),
  setLoading: loading => set({ loading }),
  setActionLoading: actionLoading => set({ actionLoading }),
  setError: error => set({ error }),
  setUserLoaded: loaded => set({ userLoaded: loaded }),

  // Auth actions
  login: async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email e senha são obrigatórios');
    }

    set({ actionLoading: true });
    try {
      const { user, error } = await authRepository.signIn({ email, password });
      if (error) {
        throw new Error(error.message);
      }
      if (user) {
        set({ user });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    } finally {
      set({ actionLoading: false });
    }
  },

  logout: async () => {
    set({ actionLoading: true, error: null });
    try {
      await authRepository.signOut();
      set({ user: null, userLoaded: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    } finally {
      set({ actionLoading: false });
    }
  },

  loadUser: async () => {
    const { userLoaded } = get();

    if (userLoaded) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const user = await authRepository.getCurrentUser();
      set({ user, userLoaded: true });
    } catch (error: unknown) {
      set({ user: null, error: null, userLoaded: true });
      if (import.meta.env.DEV) {
        console.error('Error loading user:', error);
      }
    } finally {
      set({ loading: false });
    }
  },
}));

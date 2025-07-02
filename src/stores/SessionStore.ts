import { create } from 'zustand';
import { workSessionService } from '@/services/WorkSessionService';
import type { WorkSession } from '@/types/workSession';
import { getCurrentDate } from '@/lib/utils';

interface SessionState {
  // State
  session: WorkSession | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;

  // Actions
  setSession: (session: WorkSession | null) => void;
  setLoading: (loading: boolean) => void;
  setActionLoading: (actionLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Session actions
  loadSession: () => Promise<void>;
  startJourney: () => Promise<void>;
  endJourney: () => Promise<void>;
  registerManual: (startTime: string, endTime: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  session: null,
  loading: false,
  actionLoading: false,
  error: null,

  // State setters
  setSession: session => set({ session }),
  setLoading: loading => set({ loading }),
  setActionLoading: actionLoading => set({ actionLoading }),
  setError: error => set({ error }),

  // Session actions - apenas orquestração, sem lógica de negócio
  loadSession: async () => {
    set({ loading: true, error: null });
    try {
      const today = getCurrentDate();
      const session = await workSessionService.getSessionByDate(today);
      set({ session });
    } catch (error: unknown) {
      set({ session: null, error: null });
      if (import.meta.env.DEV) {
        console.error('Error loading session:', error);
      }
    } finally {
      set({ loading: false });
    }
  },

  startJourney: async () => {
    set({ actionLoading: true, error: null });
    try {
      const today = getCurrentDate();
      const now = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const session = await workSessionService.startSession(today, now);
      set({ session });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ actionLoading: false });
    }
  },

  endJourney: async () => {
    set({ actionLoading: true, error: null });
    try {
      const { session } = get();
      if (!session) throw new Error('Sessão não encontrada');

      const now = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const updatedSession = await workSessionService.endSession(
        session.date,
        now
      );
      set({ session: updatedSession });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ actionLoading: false });
    }
  },

  registerManual: async (startTime: string, endTime: string) => {
    set({ actionLoading: true, error: null });
    try {
      const today = getCurrentDate();
      const session = await workSessionService.manualRegister(
        today,
        startTime,
        endTime
      );
      set({ session });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ actionLoading: false });
    }
  },
}));

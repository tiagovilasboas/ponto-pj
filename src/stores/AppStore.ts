import { create } from 'zustand';
import {
  formatWorkedHours,
  formatDateForDisplay,
  getCurrentDate,
  formatTime,
} from '@/lib/utils';

interface AppState {
  // UI State
  currentPage: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'pt-BR' | 'en-US';

  // UI Actions
  setCurrentPage: (page: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'pt-BR' | 'en-US') => void;

  // Formatting utilities
  formatWorkedHours: (hours: number) => string;
  formatDateForDisplay: (date: string) => string;
  getCurrentDate: () => string;
  formatTime: (time: string) => string;
}

export const useAppStore = create<AppState>(set => ({
  // Initial state
  currentPage: 'home',
  sidebarOpen: false,
  theme: 'light',
  language: 'pt-BR',

  // UI Actions
  setCurrentPage: page => set({ currentPage: page }),
  setSidebarOpen: open => set({ sidebarOpen: open }),
  setTheme: theme => set({ theme }),
  setLanguage: language => set({ language }),

  // Formatting utilities
  formatWorkedHours,
  formatDateForDisplay,
  getCurrentDate,
  formatTime,
}));

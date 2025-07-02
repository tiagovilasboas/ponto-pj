import { useAuthStore } from '@/stores/AuthStore';
import { useSessionStore } from '@/stores/SessionStore';
import { useAppStore as useAppStoreOriginal } from '@/stores/AppStore';

// Re-export the original useAppStore
export const useAppStore = useAppStoreOriginal;

// Composed hook for components that need both auth and session
export const useAppStoreWithAuth = () => {
  const auth = useAuthStore();
  const session = useSessionStore();
  const app = useAppStoreOriginal();

  return {
    // Auth
    user: auth.user,
    authLoading: auth.loading,
    authActionLoading: auth.actionLoading,
    authError: auth.error,
    login: auth.login,
    logout: auth.logout,
    loadUser: auth.loadUser,

    // Session
    session: session.session,
    sessionLoading: session.loading,
    sessionActionLoading: session.actionLoading,
    sessionError: session.error,
    loadSession: session.loadSession,
    startJourney: session.startJourney,
    endJourney: session.endJourney,
    registerManual: session.registerManual,

    // App
    currentPage: app.currentPage,
    sidebarOpen: app.sidebarOpen,
    theme: app.theme,
    language: app.language,
    setCurrentPage: app.setCurrentPage,
    setSidebarOpen: app.setSidebarOpen,
    setTheme: app.setTheme,
    setLanguage: app.setLanguage,

    // Formatting
    formatWorkedHours: app.formatWorkedHours,
    formatDateForDisplay: app.formatDateForDisplay,
    getCurrentDate: app.getCurrentDate,
    formatTime: app.formatTime,
  };
};

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import {
  getCurrentMonth,
  getLastNMonthsOptions,
  formatDateWithWeekday,
  formatWorkedHours,
} from '@/lib/utils';
import type { WorkSession } from '@/types/workSession';
import { HistoryService } from '@/services/HistoryService';

export function useHistorySessions() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const monthOptions = getLastNMonthsOptions();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [editingSession, setEditingSession] = useState<WorkSession | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ startTime: '', endTime: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState<WorkSession | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);

  // Notification handlers
  const showError = useCallback(
    (messageKey: string) => {
      HistoryService.showNotification('error', 'app.error', messageKey, t);
    },
    [t]
  );

  const showSuccess = useCallback(
    (messageKey: string) => {
      HistoryService.showNotification('success', 'app.success', messageKey, t);
    },
    [t]
  );

  // Load sessions from business service
  const loadSessions = useCallback(async () => {
    setLoading(true);
    const result = await HistoryService.loadSessionsForMonth(
      selectedMonth,
      currentPage,
      showError
    );

    if (result) {
      setSessions(result.sessions);
      setTotalPages(result.totalPages);
      setTotalSessions(result.total);
    }
    setLoading(false);
  }, [selectedMonth, currentPage, showError]);

  // Load sessions on mount and when month changes
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadSessions();
  };

  const handleEditSession = (session: WorkSession) => {
    setEditingSession(session);
    setEditForm({
      startTime: session.start_time || '',
      endTime: session.end_time || '',
    });
    setEditModalOpen(true);
  };

  const handleDeleteSession = (session: WorkSession) => {
    setDeletingSession(session);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSession = async () => {
    if (!deletingSession) return;
    setActionLoading(true);

    const success = await HistoryService.deleteSession(
      deletingSession.date,
      showSuccess,
      showError
    );

    if (success) {
      setDeleteModalOpen(false);
      setDeletingSession(null);
      loadSessions(); // Reload current page
    }
    setActionLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!editingSession) return;
    setActionLoading(true);

    const success = await HistoryService.updateSession(
      editingSession.date,
      editForm,
      showSuccess,
      showError
    );

    if (success) {
      setEditModalOpen(false);
      loadSessions(); // Reload current page
    }
    setActionLoading(false);
  };

  return {
    sessions,
    loading,
    currentPage,
    totalPages,
    totalSessions,
    monthOptions,
    selectedMonth,
    setSelectedMonth,
    editingSession,
    editModalOpen,
    editForm,
    setEditForm,
    setEditModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    deletingSession,
    loadSessions,
    handlePageChange,
    handleEditSession,
    handleDeleteSession,
    confirmDeleteSession,
    handleSaveEdit,
    formatDateWithWeekday,
    formatWorkedHours,
    t,
    actionLoading,
  };
}

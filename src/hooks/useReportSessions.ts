import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import {
  getCurrentMonth,
  getLastNMonthsOptions,
  formatDateWithWeekday,
  formatWorkedHours,
} from '@/lib/utils';
import type { WorkSession } from '@/types/workSession';
import { ReportService } from '@/services/ReportService';

export function useReportSessions() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({
    totalHours: 0,
    completeDays: 0,
    incompleteDays: 0,
    totalDays: 0,
  });
  const monthOptions = getLastNMonthsOptions();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // Error handler
  const showError = useCallback(
    (messageKey: string) => {
      ReportService.showNotification('error', 'app.error', messageKey, t);
    },
    [t]
  );

  // Load report data from business service
  const loadReport = useCallback(async () => {
    setLoading(true);
    const result = await ReportService.loadReportData(
      selectedMonth,
      currentPage,
      showError
    );

    if (result) {
      setSessions(result.sessions);
      setTotalPages(result.totalPages);
      setStatistics(result.statistics);
    }
    setLoading(false);
  }, [selectedMonth, currentPage, showError]);

  // Load report on mount and when month changes
  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadReport();
  };

  return {
    sessions,
    loading,
    currentPage,
    totalPages,
    monthOptions,
    selectedMonth,
    setSelectedMonth,
    statistics,
    loadReport,
    handlePageChange,
    formatDateWithWeekday,
    formatWorkedHours,
    t,
  };
}

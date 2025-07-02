import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from '@/i18n/useTranslation'
import { getCurrentMonth, getLastNMonthsOptions, formatDateWithWeekday, formatWorkedHours } from '@/lib/utils'

export function useReportSessions() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const monthOptions = getLastNMonthsOptions()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  // Simulate async load (replace with real API call)
  const loadReport = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: Implement real API call
      // const response = await workSessionService.getReport(selectedMonth, currentPage)
      // setSessions(response.sessions)
      // setTotalPages(response.totalPages)
      // setStatistics(response.statistics)
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('relatorio.loadError'),
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }, [t])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadReport()
  }

  return {
    sessions: [], // TODO: Return real sessions from API
    loading,
    currentPage,
    totalPages: 1, // TODO: Return real total pages from API
    monthOptions,
    selectedMonth,
    setSelectedMonth,
    statistics: {
      totalHours: 0,
      completeDays: 0,
      incompleteDays: 0,
      totalDays: 0,
    }, // TODO: Return real statistics from API
    loadReport,
    handlePageChange,
    formatDateWithWeekday,
    formatWorkedHours,
    t,
  }
} 
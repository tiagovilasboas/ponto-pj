import { useState, useCallback, useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from '@/i18n/useTranslation'
import { getCurrentMonth, getLastNMonthsOptions, formatDateWithWeekday, formatWorkedHours } from '@/lib/utils'
import type { WorkSession } from '@/types/workSession'
import { workSessionService } from '@/services/workSessions'

export function useReportSessions() {
  const { t } = useTranslation()
  const [sessions, setSessions] = useState<WorkSession[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statistics, setStatistics] = useState({
    totalHours: 0,
    completeDays: 0,
    incompleteDays: 0,
    totalDays: 0,
  })
  const monthOptions = getLastNMonthsOptions()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  // Load report data from Supabase API
  const loadReport = useCallback(async () => {
    setLoading(true)
    try {
      const [sessionsResponse, statsResponse] = await Promise.all([
        workSessionService.getSessionsForMonth(selectedMonth, currentPage),
        workSessionService.getMonthStatistics(selectedMonth)
      ])
      
      setSessions(sessionsResponse.sessions)
      setTotalPages(sessionsResponse.totalPages)
      setStatistics(statsResponse)
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('relatorio.loadError'),
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, currentPage, t])

  // Load report on mount and when month changes
  useEffect(() => {
    loadReport()
  }, [loadReport])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadReport()
  }

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
  }
} 
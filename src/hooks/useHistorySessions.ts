import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from '@/i18n/useTranslation'
import { getCurrentMonth, getLastNMonthsOptions, formatDateWithWeekday, formatWorkedHours } from '@/lib/utils'
import type { WorkSession } from '@/types/workSession'
import { workSessionService } from '@/services/workSessions'

export function useHistorySessions() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const monthOptions = getLastNMonthsOptions()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [editingSession, setEditingSession] = useState<WorkSession | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({ startTime: '', endTime: '' })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingSession, setDeletingSession] = useState<WorkSession | null>(null)

  // Simulate async load (replace with real API call)
  const loadSessions = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: Implement real API call
      // const response = await workSessionService.getSessions(selectedMonth, currentPage)
      // setSessions(response.sessions)
      // setTotalPages(response.totalPages)
      // setTotalSessions(response.totalSessions)
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('historico.loadError'),
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }, [t])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadSessions()
  }

  const handleEditSession = (session: WorkSession) => {
    setEditingSession(session)
    setEditForm({
      startTime: session.start_time || '',
      endTime: session.end_time || '',
    })
    setEditModalOpen(true)
  }

  const handleDeleteSession = (session: WorkSession) => {
    setDeletingSession(session)
    setDeleteModalOpen(true)
  }

  const confirmDeleteSession = async () => {
    if (!deletingSession) return
    try {
      await workSessionService.deleteSession(deletingSession.date)
      notifications.show({
        title: t('app.success'),
        message: t('historico.deleteSuccess'),
        color: 'green',
      })
      setDeleteModalOpen(false)
      setDeletingSession(null)
      loadSessions() // Reload current page
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('historico.deleteError'),
        color: 'red',
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!editingSession) return
    try {
      const startTime = new Date(`2000-01-01T${editForm.startTime}`)
      const endTime = new Date(`2000-01-01T${editForm.endTime}`)
      if (endTime <= startTime) {
        notifications.show({
          title: t('app.error'),
          message: t('historico.invalidTimes'),
          color: 'red',
        })
        return
      }
      await workSessionService.updateSession(editingSession.date, {
        start_time: editForm.startTime,
        end_time: editForm.endTime,
        manual_edit: true
      })
      notifications.show({
        title: t('app.success'),
        message: t('historico.editSuccess'),
        color: 'green',
      })
      setEditModalOpen(false)
      loadSessions() // Reload current page
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('historico.editError'),
        color: 'red',
      })
    }
  }

  return {
    sessions: [], // TODO: Return real sessions from API
    loading,
    currentPage,
    totalPages: 1, // TODO: Return real total pages from API
    totalSessions: 0, // TODO: Return real total sessions from API
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
  }
} 
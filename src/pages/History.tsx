import { useState, useEffect } from 'react'
import { Container, Stack, Card, Text, Badge, Group, ActionIcon, Modal, TextInput, Button, Select, Pagination } from '@mantine/core'
import { IconEdit, IconCalendar, IconClock, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppStore } from '@/hooks/useAppStore'
import { AppHeader } from '@/components/common/AppHeader'
import { BottomNavigation } from '@/components/common/BottomNavigation'
import { workSessionService } from '@/services'
import { getMonthOptionsThisYear, getCurrentMonth, formatDateWithWeekday } from '@/lib/utils'
import type { WorkSession } from '@/types/workSession'

export const History = () => {
  const { t } = useTranslation()
  const { formatTime, formatWorkedHours } = useAppStore()
  const [sessions, setSessions] = useState<WorkSession[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSessions, setTotalSessions] = useState(0)
  const monthOptions = getMonthOptionsThisYear()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [editingSession, setEditingSession] = useState<WorkSession | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    startTime: '',
    endTime: ''
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingSession, setDeletingSession] = useState<WorkSession | null>(null)

  useEffect(() => {
    loadSessions()
  }, [selectedMonth])

  const loadSessions = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await workSessionService.getSessionsForMonth(selectedMonth, page, 10) // 10 itens por página
      setSessions(result.sessions)
      setTotalPages(result.totalPages)
      setTotalSessions(result.total)
      setCurrentPage(result.page)
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('historico.loadError'),
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    loadSessions(page)
  }

  const handleEditSession = (session: WorkSession) => {
    setEditingSession(session)
    setEditForm({
      startTime: session.start_time || '',
      endTime: session.end_time || ''
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
      loadSessions(currentPage) // Recarregar página atual
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
      loadSessions(currentPage) // Recarregar página atual
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('historico.editError'),
        color: 'red',
      })
    }
  }

  const getStatusBadge = (session: WorkSession) => {
    const color = session.status === 'completa' ? 'green' : session.status === 'incompleta' ? 'yellow' : 'gray'
    const label = session.status === 'completa' ? t('historico.complete') : 
                  session.status === 'incompleta' ? t('historico.incomplete') : t('historico.noRecord')
    return <Badge color={color} size="xs">{label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader 
        title={t('historico.title')} 
        showBack={true}
        subtitle={t('historico.currentMonth')}
      />
      <Container size="sm" py="sm">
        <Stack gap="sm">
          {/* Month Selector - Compact */}
          <Card withBorder p="sm" className="bg-white">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <IconCalendar size={16} className="text-blue-600" />
                <Text fw={600} size="sm">{t('historico.currentMonth')}</Text>
              </Group>
              <Select
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value || selectedMonth)}
                data={monthOptions}
                size="xs"
                w={140}
                searchable
              />
            </Group>
          </Card>

          {/* Sessions List - Horizontal Layout */}
          <Card withBorder p="sm" className="bg-white">
            {loading ? (
              <div className="text-center py-4">
                <Text c="gray.6" size="sm">{t('app.loading')}</Text>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-4">
                <IconClock size={24} className="text-gray-400 mx-auto mb-2" />
                <Text c="gray.6" size="sm">{t('historico.noSessions')}</Text>
              </div>
            ) : (
              <>
                {/* Sessions Count */}
                <div className="mb-3 pb-2 border-b border-gray-100">
                  <Text size="xs" c="gray.6">
                    {t('historico.showing')} {sessions.length} {t('historico.of')} {totalSessions} {t('historico.records')}
                  </Text>
                </div>

                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                      {/* Main Row - Date, Status, Actions */}
                      <Group justify="space-between" align="center" mb="xs">
                        <Group gap="sm" align="center">
                          <Text fw={600} size="sm" className="min-w-[85px]">
                            {formatDateWithWeekday(session.date)}
                          </Text>
                          {getStatusBadge(session)}
                          {session.manual_edit && (
                            <Badge color="blue" size="xs" variant="light">
                              {t('workSession.status.manualEdit')}
                            </Badge>
                          )}
                        </Group>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            size="md"
                            onClick={() => handleEditSession(session)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            size="md"
                            onClick={() => handleDeleteSession(session)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>

                      {/* Time Row - Entry, Exit, Worked Time */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <Text size="xs" c="gray.6" mb="xs">{t('historico.entry')}</Text>
                          <Text fw={500} size="xs">
                            {session.start_time ? formatTime(session.start_time) : '-'}
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="gray.6" mb="xs">{t('historico.exit')}</Text>
                          <Text fw={500} size="xs">
                            {session.end_time ? formatTime(session.end_time) : '-'}
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="gray.6" mb="xs">{t('historico.netTime')}</Text>
                          <Text fw={600} c="blue.6" size="xs">
                            {session.worked_time_real ? formatWorkedHours(session.worked_time_real) : '-'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Pagination
                      total={totalPages}
                      value={currentPage}
                      onChange={handlePageChange}
                      size="xs"
                      radius="md"
                      className="justify-center"
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </Stack>
      </Container>
      <BottomNavigation />

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={t('historico.editSession')}
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm" c="gray.6">
            {t('historico.editSessionSubtitle')}
          </Text>
          <TextInput
            label={t('workSession.manual.startTime')}
            type="time"
            value={editForm.startTime}
            onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
          />
          <TextInput
            label={t('workSession.manual.endTime')}
            type="time"
            value={editForm.endTime}
            onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={() => setEditModalOpen(false)}>
              {t('app.cancel')}
            </Button>
            <Button onClick={handleSaveEdit}>
              {t('app.save')}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('historico.deleteSession')}
        size="xs"
      >
        <Stack gap="md">
          <Text size="sm" c="gray.6">
            {t('historico.deleteConfirm')}
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" color="gray" onClick={() => setDeleteModalOpen(false)}>
              {t('app.cancel')}
            </Button>
            <Button color="red" onClick={confirmDeleteSession}>
              {t('app.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
} 
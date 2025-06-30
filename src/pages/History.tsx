import { useState, useEffect } from 'react'
import { Container, Stack, Card, Text, Badge, Group, ActionIcon, Modal, TextInput, Button, Select } from '@mantine/core'
import { IconEdit, IconCalendar, IconClock, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppStore } from '@/hooks/useAppStore'
import { AppHeader } from '@/components/common/AppHeader'
import { BottomNavigation } from '@/components/common/BottomNavigation'
import { workSessionService } from '@/services'
import { getMonthOptionsThisYear, getCurrentMonth, formatDateForDisplay } from '@/lib/utils'
import type { WorkSession } from '@/types/workSession'

export const History = () => {
  const { t } = useTranslation()
  const { formatTime, formatWorkedHours } = useAppStore()
  const [sessions, setSessions] = useState<WorkSession[]>([])
  const [loading, setLoading] = useState(false)
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

  const loadSessions = async () => {
    setLoading(true)
    try {
      const data = await workSessionService.getSessionsForMonth(selectedMonth)
      setSessions(data)
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
      loadSessions()
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
      loadSessions()
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
    return <Badge color={color} size="sm">{label}</Badge>
  }



  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader 
        title={t('historico.title')} 
        showBack={true}
        subtitle={t('historico.currentMonth')}
      />
      <Container size="sm" py="md">
        <Stack gap="lg">
          {/* Month Selector */}
          <Card withBorder p="lg" className="bg-white">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <IconCalendar size={20} className="text-blue-600" />
                <Text fw={600}>{t('historico.currentMonth')}</Text>
              </Group>
              <Select
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value || selectedMonth)}
                data={monthOptions}
                size="sm"
                w={180}
                searchable
              />
            </Group>
          </Card>
          {/* Sessions List */}
          <Card withBorder p="lg" className="bg-white">
            {loading ? (
              <div className="text-center py-8">
                <Text c="gray.6">{t('app.loading')}</Text>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <IconClock size={48} className="text-gray-400 mx-auto mb-4" />
                <Text c="gray.6">{t('historico.noSessions')}</Text>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <Group justify="space-between" align="flex-start" mb="sm">
                      <div>
                        <Text fw={600} size="sm">
                          {formatDateForDisplay(session.date)}
                        </Text>
                        <Text size="xs" c="gray.6">
                          {session.manual_edit && t('workSession.status.manualEdit')}
                        </Text>
                      </div>
                      <Group gap="xs">
                        {getStatusBadge(session)}
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => handleEditSession(session)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => handleDeleteSession(session)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Text size="xs" c="gray.6" mb="xs">{t('historico.entry')}</Text>
                        <Text fw={500}>
                          {session.start_time ? formatTime(session.start_time) : '-'}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="gray.6" mb="xs">{t('historico.exit')}</Text>
                        <Text fw={500}>
                          {session.end_time ? formatTime(session.end_time) : '-'}
                        </Text>
                      </div>
                    </div>
                    {session.worked_time_real && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Text size="xs" c="gray.6" mb="xs">{t('historico.netTime')}</Text>
                        <Text fw={600} c="blue.6">
                          {formatWorkedHours(session.worked_time_real)}
                        </Text>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
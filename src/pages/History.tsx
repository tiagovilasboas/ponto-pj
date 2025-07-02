import { Container, Stack, Card, Text, Badge, Group, Modal, TextInput, Button, Select, Pagination } from '@mantine/core'
import { IconCalendar, IconClock } from '@tabler/icons-react'
import { useAppStore } from '@/hooks/useAppStore'
import { AppHeader } from '@/components/common/AppHeader'
import { BottomNavigation } from '@/components/common/BottomNavigation'
import type { WorkSession } from '@/types/workSession'
import { SessionRecordCard } from '../components/common/SessionRecordCard'
import { useHistorySessions } from '../hooks/useHistorySessions'

export const History = () => {
  const {
    sessions,
    loading,
    currentPage,
    totalPages,
    totalSessions,
    monthOptions,
    selectedMonth,
    setSelectedMonth,
    editModalOpen,
    editForm,
    setEditForm,
    setEditModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    handlePageChange,
    handleEditSession,
    handleDeleteSession,
    confirmDeleteSession,
    handleSaveEdit,
    formatDateWithWeekday,
    formatWorkedHours,
    t,
    actionLoading,
  } = useHistorySessions()
  const { formatTime } = useAppStore()

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
                    <SessionRecordCard
                      key={session.id}
                      date={formatDateWithWeekday(session.date)}
                      status={(session.status as 'completa' | 'incompleta' | 'pendente') || 'pendente'}
                      statusLabel={getStatusBadge(session).props.children}
                      manualEdit={!!session.manual_edit}
                      manualEditLabel={session.manual_edit ? t('workSession.status.manualEdit') : undefined}
                      startTime={session.start_time ? formatTime(session.start_time) : '-'}
                      endTime={session.end_time ? formatTime(session.end_time) : '-'}
                      netTime={session.worked_time_real ? formatWorkedHours(session.worked_time_real) : '-'}
                      onEdit={() => handleEditSession(session)}
                      onDelete={() => handleDeleteSession(session)}
                    />
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
            <Button variant="subtle" onClick={() => setEditModalOpen(false)} aria-label="Cancelar edição">
              {t('app.cancel')}
            </Button>
            <Button onClick={handleSaveEdit} loading={actionLoading} disabled={actionLoading} aria-label="Salvar edição">
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
            <Button variant="subtle" color="gray" onClick={() => setDeleteModalOpen(false)} aria-label="Cancelar exclusão">
              {t('app.cancel')}
            </Button>
            <Button color="red" onClick={confirmDeleteSession} loading={actionLoading} disabled={actionLoading} aria-label="Confirmar exclusão">
              {t('app.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
} 
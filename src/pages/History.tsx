import { Container, Stack, Badge } from '@mantine/core';
import { useAppStore } from '@/hooks/useAppStore';
import { AppHeader } from '@/components/common/AppHeader';
import { BottomNavigation } from '@/components/common/BottomNavigation';
import { MonthSelector } from '@/components/common/MonthSelector';
import { SessionsList } from '@/components/common/SessionsList';
import { EditSessionModal } from '@/components/common/EditSessionModal';
import { DeleteSessionModal } from '@/components/common/DeleteSessionModal';
import type { WorkSession } from '@/types/workSession';
import { useHistorySessions } from '../hooks/useHistorySessions';

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
  } = useHistorySessions();
  const { formatTime } = useAppStore();

  const getStatusBadge = (session: WorkSession) => {
    const color =
      session.status === 'completa'
        ? 'green'
        : session.status === 'incompleta'
          ? 'yellow'
          : 'gray';
    const label =
      session.status === 'completa'
        ? t('historico.complete')
        : session.status === 'incompleta'
          ? t('historico.incomplete')
          : t('historico.noRecord');
    return (
      <Badge color={color} size='xs'>
        {label}
      </Badge>
    );
  };

  const handleStartTimeChange = (value: string) => {
    setEditForm(prev => ({ ...prev, startTime: value }));
  };

  const handleEndTimeChange = (value: string) => {
    setEditForm(prev => ({ ...prev, endTime: value }));
  };

  return (
    <div data-testid='history-page' className='min-h-screen bg-gray-50 pb-20'>
      <AppHeader
        title={t('historico.title')}
        showBack={true}
        subtitle={t('historico.currentMonth')}
      />
      <Container data-testid='history-container' size='sm' py='sm'>
        <Stack gap='sm'>
          <MonthSelector
            selectedMonth={selectedMonth}
            monthOptions={monthOptions}
            onMonthChange={setSelectedMonth}
            title={t('historico.currentMonth')}
            testId='month-selector'
          />

          <SessionsList
            sessions={sessions}
            loading={loading}
            totalSessions={totalSessions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
            formatDateWithWeekday={formatDateWithWeekday}
            formatWorkedHours={formatWorkedHours}
            formatTime={formatTime}
            getStatusBadge={getStatusBadge}
            t={t}
            testId='sessions-list'
          />
        </Stack>
      </Container>
      <BottomNavigation />

      <EditSessionModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        startTime={editForm.startTime}
        endTime={editForm.endTime}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
        onSave={handleSaveEdit}
        loading={actionLoading}
        t={t}
        testId='edit-modal'
      />

      <DeleteSessionModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteSession}
        loading={actionLoading}
        t={t}
        testId='delete-modal'
      />
    </div>
  );
};

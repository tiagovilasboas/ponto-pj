import { Card, Text, Pagination } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { SessionRecordCard } from './SessionRecordCard';
import type { WorkSession } from '@/types/workSession';

interface SessionsListProps {
  sessions: WorkSession[];
  loading: boolean;
  totalSessions: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditSession: (session: WorkSession) => void;
  onDeleteSession: (session: WorkSession) => void;
  formatDateWithWeekday: (date: string) => string;
  formatWorkedHours: (hours: number) => string;
  formatTime: (time: string) => string;
  getStatusBadge: (session: WorkSession) => React.ReactNode;
  t: (key: string) => string;
  testId?: string;
}

export const SessionsList = ({
  sessions,
  loading,
  totalSessions,
  currentPage,
  totalPages,
  onPageChange,
  onEditSession,
  onDeleteSession,
  formatDateWithWeekday,
  formatWorkedHours,
  formatTime,
  getStatusBadge,
  t,
  testId = 'sessions-list',
}: SessionsListProps) => {
  if (loading) {
    return (
      <Card data-testid={testId} withBorder p='sm' className='bg-white'>
        <div data-testid='loading-sessions' className='text-center py-4'>
          <Text c='gray.6' size='sm'>
            {t('app.loading')}
          </Text>
        </div>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card data-testid={testId} withBorder p='sm' className='bg-white'>
        <div data-testid='no-sessions' className='text-center py-4'>
          <IconClock size={24} className='text-gray-400 mx-auto mb-2' />
          <Text c='gray.6' size='sm'>
            {t('historico.noSessions')}
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card data-testid={testId} withBorder p='sm' className='bg-white'>
      {/* Sessions Count */}
      <div
        data-testid='sessions-count'
        className='mb-3 pb-2 border-b border-gray-100'
      >
        <Text size='xs' c='gray.6'>
          {t('historico.showing')} {sessions.length} {t('historico.of')}{' '}
          {totalSessions} {t('historico.records')}
        </Text>
      </div>

      <div data-testid='sessions-container' className='space-y-1'>
        {sessions.map(session => (
          <SessionRecordCard
            key={session.id}
            date={formatDateWithWeekday(session.date)}
            status={
              (session.status as 'completa' | 'incompleta' | 'pendente') ||
              'pendente'
            }
            statusLabel={getStatusBadge(session) as string}
            manualEdit={!!session.manual_edit}
            manualEditLabel={
              session.manual_edit
                ? t('workSession.status.manualEdit')
                : undefined
            }
            startTime={
              session.start_time ? formatTime(session.start_time) : '-'
            }
            endTime={session.end_time ? formatTime(session.end_time) : '-'}
            netTime={
              session.worked_time_real
                ? formatWorkedHours(session.worked_time_real)
                : '-'
            }
            onEdit={() => onEditSession(session)}
            onDelete={() => onDeleteSession(session)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          data-testid='pagination'
          className='mt-4 pt-3 border-t border-gray-100'
        >
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
            size='xs'
            radius='md'
            className='justify-center'
          />
        </div>
      )}
    </Card>
  );
};

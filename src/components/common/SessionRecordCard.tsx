import React from 'react';
import { Text, Badge, ActionIcon } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface SessionRecordCardProps {
  date: string;
  status: 'completa' | 'incompleta' | 'pendente';
  statusLabel: string;
  manualEdit?: boolean;
  manualEditLabel?: string;
  startTime?: string;
  endTime?: string;
  netTime?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SessionRecordCard = React.memo<SessionRecordCardProps>(
  ({
    date,
    status,
    statusLabel,
    manualEdit,
    manualEditLabel,
    startTime,
    endTime,
    netTime,
    onEdit,
    onDelete,
  }) => {
    return (
      <div className='border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors'>
        {/* Main Row - Date, Status, Actions */}
        <div className='flex items-center justify-between mb-1'>
          <div className='flex items-center gap-2 min-w-0'>
            <Text fw={600} size='sm' className='truncate'>
              {date}
            </Text>
            <Badge
              color={
                status === 'completa'
                  ? 'green'
                  : status === 'incompleta'
                    ? 'yellow'
                    : 'gray'
              }
              size='xs'
            >
              {statusLabel}
            </Badge>
            {manualEdit && manualEditLabel && (
              <Badge color='blue' size='xs' variant='light'>
                {manualEditLabel}
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-1'>
            {onEdit && (
              <ActionIcon
                variant='subtle'
                size='lg'
                onClick={onEdit}
                className='text-blue-600 hover:bg-blue-50'
                aria-label='Editar registro de ponto'
              >
                <IconEdit size={18} aria-hidden='true' />
              </ActionIcon>
            )}
            {onDelete && (
              <ActionIcon
                variant='subtle'
                size='lg'
                onClick={onDelete}
                className='text-red-600 hover:bg-red-50'
                aria-label='Excluir registro de ponto'
              >
                <IconTrash size={18} aria-hidden='true' />
              </ActionIcon>
            )}
          </div>
        </div>
        {/* Time Row - Entry → Exit | Net Time */}
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 text-gray-600'>
            {startTime && (
              <>
                <span className='font-mono'>{startTime}</span>
                <span>→</span>
              </>
            )}
            {endTime && <span className='font-mono'>{endTime}</span>}
          </div>
          {netTime && (
            <Text size='sm' fw={600} className='text-blue-600'>
              {netTime}
            </Text>
          )}
        </div>
      </div>
    );
  }
);

SessionRecordCard.displayName = 'SessionRecordCard';

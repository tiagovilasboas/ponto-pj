import { Text, Badge, ActionIcon } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import React from 'react'

interface SessionRecordCardProps {
  date: string
  status: 'completa' | 'incompleta' | string
  statusLabel: string
  manualEdit?: boolean
  manualEditLabel?: string
  startTime?: string
  endTime?: string
  netTime?: string
  onEdit?: () => void
  onDelete?: () => void
}

export const SessionRecordCard: React.FC<SessionRecordCardProps> = ({
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
    <div className="border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
      {/* Main Row - Date, Status, Actions */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <Text fw={600} size="sm" className="truncate">
            {date}
          </Text>
          <Badge color={status === 'completa' ? 'green' : status === 'incompleta' ? 'yellow' : 'gray'} size="xs">
            {statusLabel}
          </Badge>
          {manualEdit && manualEditLabel && (
            <Badge color="blue" size="xs" variant="light">
              {manualEditLabel}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={onEdit}
              className="text-blue-600 hover:bg-blue-50"
              aria-label="Editar registro de ponto"
            >
              <IconEdit size={18} aria-hidden="true" />
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={onDelete}
              className="text-red-600 hover:bg-red-50"
              aria-label="Excluir registro de ponto"
            >
              <IconTrash size={18} aria-hidden="true" />
            </ActionIcon>
          )}
        </div>
      </div>
      {/* Time Row - Entry → Exit | Net Time */}
      <div className="flex items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Entrada</span>
          <span className="font-bold text-base text-gray-800">{startTime || '-'}</span>
          <span className="mx-1 text-gray-400">→</span>
          <span className="text-gray-500">Saída</span>
          <span className="font-bold text-base text-gray-800">{endTime || '-'}</span>
        </div>
        <div className="flex items-center ml-auto pl-4">
          <span className="font-bold text-base text-blue-700">{netTime || '-'}</span>
        </div>
      </div>
    </div>
  )
} 
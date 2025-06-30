import { Card, CardSection, Group, Title, Stack, Text, Badge } from '@mantine/core'
import { IconClock, IconPlayerPlay, IconPlayerStop, IconEdit } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
import { PrimaryButton } from '../common/PrimaryButton'
import { useState, useEffect } from 'react'
import type { WorkSession } from '@/types/workSession'

interface SessionStatusCardProps {
  session: WorkSession | null
  actionLoading: boolean
  onStart: () => void
  onEnd: () => void
  onManualRegister: () => void
  formatTime: (time: string) => string
  formatWorkedHours: (hours: number) => string
}

export function SessionStatusCard({
  session,
  actionLoading,
  onStart,
  onEnd,
  onManualRegister,
  formatTime,
  formatWorkedHours
}: SessionStatusCardProps) {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  })

  // Atualizar hora atual a cada segundo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      setCurrentTime(timeString)
    }

    // Atualizar imediatamente
    updateTime()
    
    // Configurar intervalo para atualizar a cada segundo
    const interval = setInterval(updateTime, 1000)

    // Cleanup: limpar intervalo quando componente for desmontado
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Card withBorder>
      <CardSection bg="blue" c="white" p="md" style={{ borderTopLeftRadius: 'var(--mantine-radius-md)', borderTopRightRadius: 'var(--mantine-radius-md)' }}>
        <Group justify="center">
          <IconClock size={24} />
          <Title order={2} size="h4">{t('app.title')}</Title>
        </Group>
      </CardSection>
      <Stack gap="md" p="md">
        {!session?.start_time ? (
          <Stack align="center" gap="md">
            <Text size="lg" c="gray.6">{t('workSession.status.noSession')}</Text>
            <PrimaryButton
              onClick={onStart}
              loading={actionLoading}
              leftIcon={<IconPlayerPlay size={18} />}
              className="w-full text-lg py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={actionLoading}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold">{actionLoading ? t('workSession.start.submitting') : t('workSession.start.button')}</span>
                <span className="text-sm font-mono bg-white/20 px-2 py-1 rounded mt-1">
                  {currentTime}
                </span>
              </div>
            </PrimaryButton>
          </Stack>
        ) : !session?.end_time ? (
          <Stack align="center" gap="md">
            <Text c="gray.6">{t('workSession.status.startedAt')}</Text>
            <Text size="2rem" fw={700} c="blue.6">
              {formatTime(session.start_time)}
            </Text>
            <PrimaryButton
              onClick={onEnd}
              loading={actionLoading}
              leftIcon={<IconPlayerStop size={18} />}
              className="w-full text-lg py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              disabled={actionLoading}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold">{actionLoading ? t('workSession.end.submitting') : t('workSession.end.button')}</span>
                <span className="text-sm font-mono bg-white/20 px-2 py-1 rounded mt-1">
                  {currentTime}
                </span>
              </div>
            </PrimaryButton>
          </Stack>
        ) : (
          <Stack align="center" gap="md">
            <Text c="gray.6">{t('workSession.status.endedAt')}</Text>
            <Text size="2rem" fw={700} c="green.6">
              {formatTime(session.end_time)}
            </Text>
            <Text size="sm" c="gray.5">
              {t('workSession.status.workedTime')}: {formatWorkedHours(session.worked_time_real || 0)}
            </Text>
            <Badge 
              size="lg"
              variant={session.status === 'completa' ? 'filled' : 'light'}
              color={session.status === 'completa' ? 'green' : 'yellow'}
            >
              {session.status === 'completa' ? t('workSession.status.complete') : t('workSession.status.incomplete')}
            </Badge>
          </Stack>
        )}
        <button 
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-blue-600 bg-transparent border border-blue-600 hover:bg-blue-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed w-full"
          onClick={onManualRegister}
        >
          <IconEdit size={16} className="mr-2" />
          {t('workSession.manual.title')}
        </button>
      </Stack>
    </Card>
  )
} 
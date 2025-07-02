import { Card, Title, Stack, Text, Badge, Button } from '@mantine/core'
import { IconClock, IconEdit } from '@tabler/icons-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useState, useEffect } from 'react'
import type { WorkSession } from '../../types/workSession'

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
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card
      className="shadow-2xl border-0 bg-white/60 backdrop-blur-lg relative overflow-hidden px-0"
      style={{ border: 0 }}
      p={0}
    >
      {/* Header com gradiente e borda arredondada consistente */}
      <div className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 px-6 py-4 flex items-center gap-2">
        <IconClock size={22} className="text-white/90" aria-hidden="true" />
        <Title order={2} size="h4" className="text-white font-bold tracking-tight" aria-label={t('app.title')}>
          {t('app.title')}
        </Title>
      </div>
      <Stack gap={4} p="md">
        {/* Status e ação */}
        {!session?.start_time ? (
          <Stack align="center" gap={4}>
            {/* Relógio digital grande acima do botão */}
            <span className="font-mono text-4xl text-blue-700 tracking-widest select-none" style={{ letterSpacing: '0.1em' }}>{currentTime}</span>
            <Text size="md" className="text-gray-700 text-center">
              {t('workSession.status.noSession')}
            </Text>
            <Button
              fullWidth
              size="lg"
              variant="filled"
              color="blue"
              radius="xl"
              fw={700}
              style={{ minHeight: 56 }}
              loading={actionLoading}
              onClick={onStart}
              disabled={actionLoading}
              aria-label={t('workSession.start.button')}
            >
              {actionLoading ? t('workSession.start.submitting') : t('workSession.start.button')}
            </Button>
          </Stack>
        ) : !session?.end_time ? (
          <Stack align="center" gap={4}>
            {/* Relógio digital grande acima do botão */}
            <span className="font-mono text-4xl text-blue-700 tracking-widest select-none" style={{ letterSpacing: '0.1em' }}>{currentTime}</span>
            <Text className="text-gray-700 text-center">{t('workSession.status.startedAt')}</Text>
            <Text size="2xl" fw={700} className="text-blue-700">
              {formatTime(session.start_time)}
            </Text>
            <Button
              fullWidth
              size="lg"
              variant="filled"
              color="blue"
              radius="xl"
              fw={700}
              style={{ minHeight: 56 }}
              loading={actionLoading}
              onClick={onEnd}
              disabled={actionLoading}
              aria-label={t('workSession.end.button')}
            >
              {actionLoading ? t('workSession.end.submitting') : t('workSession.end.button')}
            </Button>
          </Stack>
        ) : (
          <Stack align="center" gap="md">
            <Text className="text-gray-700 text-center">{t('workSession.status.endedAt')}</Text>
            <Text size="2xl" fw={700} className="text-green-700">
              {formatTime(session.end_time)}
            </Text>
            <Text size="sm" className="text-gray-500">
              {t('workSession.status.workedTime')}: {formatWorkedHours(session.worked_time_real || 0)}
            </Text>
            <Badge 
              size="lg"
              className={`px-4 py-2 rounded-full text-white ${session.status === 'completa' ? 'bg-green-500' : 'bg-yellow-400 text-gray-900'}`}
            >
              {session.status === 'completa' ? t('workSession.status.complete') : t('workSession.status.incomplete')}
            </Badge>
          </Stack>
        )}
        {/* Divider visual */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent my-2" />
        {/* Botão de registro manual */}
        <button 
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-bold text-blue-800 bg-white/70 border border-blue-300 hover:bg-blue-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed w-full shadow"
          onClick={onManualRegister}
          aria-label={t('workSession.manual.title')}
        >
          <IconEdit size={20} className="mr-2 text-blue-800 font-bold" aria-hidden="true" />
          {t('workSession.manual.title')}
        </button>
      </Stack>
    </Card>
  )
} 
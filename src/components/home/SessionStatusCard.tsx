import { Card, CardSection, Group, Title, Stack, Text, Button, Badge } from '@mantine/core'
import { IconClock, IconPlayerPlay, IconPlayerStop, IconEdit } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
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
            <Button 
              onClick={onStart}
              loading={actionLoading}
              size="lg"
              fullWidth
              variant="gradient"
              gradient={{ from: 'green', to: 'emerald' }}
              leftSection={<IconPlayerPlay size={18} />}
              styles={{
                root: {
                  color: 'white',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                },
              }}
            >
              {actionLoading ? t('workSession.start.submitting') : t('workSession.start.button')}
            </Button>
          </Stack>
        ) : !session?.end_time ? (
          <Stack align="center" gap="md">
            <Text c="gray.6">{t('workSession.status.startedAt')}</Text>
            <Text size="2rem" fw={700} c="blue.6">
              {formatTime(session.start_time)}
            </Text>
            <Button 
              onClick={onEnd}
              loading={actionLoading}
              size="lg"
              fullWidth
              variant="gradient"
              gradient={{ from: 'red', to: 'pink' }}
              leftSection={<IconPlayerStop size={18} />}
              styles={{
                root: {
                  color: 'white',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                },
              }}
            >
              {actionLoading ? t('workSession.end.submitting') : t('workSession.end.button')}
            </Button>
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
        <Button 
          variant="outline" 
          size="sm" 
          fullWidth
          onClick={onManualRegister}
          leftSection={<IconEdit size={16} />}
          color="blue"
        >
          {t('workSession.manual.title')}
        </Button>
      </Stack>
    </Card>
  )
} 
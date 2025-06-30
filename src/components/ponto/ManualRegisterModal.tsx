import { useState, useEffect } from 'react'
import { Modal, TextInput, Button, Stack, Title, Text, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconClock, IconDeviceFloppy, IconX } from '@tabler/icons-react'
import { useAppStore } from '@/hooks/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'

interface ManualRegisterModalProps {
  open: boolean
  onClose: () => void
}

export const ManualRegisterModal = ({ open, onClose }: ManualRegisterModalProps) => {
  const appStore = useAppStore()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  })
  const { t } = useTranslation()

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
      console.log('Relógio atualizado:', timeString) // Debug
    }

    // Atualizar imediatamente
    updateTime()
    
    // Configurar intervalo para atualizar a cada segundo
    const interval = setInterval(updateTime, 1000)

    // Cleanup: limpar intervalo quando componente for desmontado
    return () => {
      clearInterval(interval)
    }
  }, []) // Array vazio para executar apenas uma vez na montagem

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      notifications.show({
        title: t('app.error'),
        message: t('workSession.manual.fillTimes'),
        color: 'red',
      })
      return
    }

    try {
      await appStore.registerManual(startTime, endTime)
      notifications.show({
        title: t('app.success'),
        message: t('workSession.manual.success'),
        color: 'green',
      })
      onClose()
      setStartTime('')
      setEndTime('')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('app.unknownError')
      const isConstraintError = errorMessage === 'database.constraintError'
      
      notifications.show({
        title: t('app.error'),
        message: isConstraintError ? t('database.constraintError') : t('workSession.manual.error'),
        color: 'red',
      })
      console.error(error)
    }
  }

  const handleClose = () => {
    setStartTime('')
    setEndTime('')
    onClose()
  }

  return (
    <Modal 
      opened={open} 
      onClose={handleClose}
      title={
        <Group>
          <IconClock size={20} />
          <Title order={3}>{t('workSession.manual.title')}</Title>
        </Group>
      }
      size="sm"
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="gray.6">
          {t('workSession.manual.subtitle')}
        </Text>

        {/* Relógio em tempo real */}
        <Group justify="center" gap="xs" p="md" bg="blue.0" style={{ borderRadius: '8px', border: '1px solid var(--mantine-color-blue-3)' }}>
          <IconClock size={20} color="var(--mantine-color-blue-6)" />
          <Text size="lg" fw={600} c="blue.7">
            {t('workSession.manual.currentTime') || 'Hora Atual'}: {currentTime || '--:--:--'}
          </Text>
        </Group>

        <TextInput
          label={t('workSession.manual.startTime')}
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          leftSection={<IconClock size={16} />}
          required
        />

        <TextInput
          label={t('workSession.manual.endTime')}
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          leftSection={<IconClock size={16} />}
          required
        />

        <Group justify="flex-end" gap="sm">
          <Button 
            variant="light" 
            color="gray" 
            onClick={handleClose}
            leftSection={<IconX size={16} />}
          >
            {t('app.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            loading={appStore.actionLoading}
            leftSection={<IconDeviceFloppy size={16} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'indigo' }}
            styles={{
              root: {
                color: 'white !important',
                backgroundColor: 'transparent !important',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                '& .mantine-Button-label': {
                  color: 'white !important',
                },
                '& .mantine-Button-leftSection': {
                  color: 'white !important',
                },
              },
            }}
          >
            {appStore.actionLoading ? t('app.saving') : t('app.save')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
} 
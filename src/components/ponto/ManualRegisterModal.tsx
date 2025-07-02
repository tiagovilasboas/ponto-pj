import { Modal, TextInput, Stack, Title, Text, Group } from '@mantine/core'
import { IconClock, IconDeviceFloppy, IconX } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { useAppStoreWithAuth } from '@/hooks/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { PrimaryButton } from '../common/PrimaryButton'
import { notificationService } from '@/services/notifications'

interface ManualRegisterModalProps {
  open: boolean
  onClose: () => void
}

export const ManualRegisterModal = ({ open, onClose }: ManualRegisterModalProps) => {
  const appStore = useAppStoreWithAuth()
  const { t } = useTranslation()
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
  const [loading, setLoading] = useState(false)

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
  }, []) // Array vazio para executar apenas uma vez na montagem

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      // TODO: Mostrar erro
      return
    }

    setLoading(true)
    try {
      await appStore.registerManual(startTime, endTime)
      notificationService.success(t('workSession.manual.success'), t('app.success'))
      onClose()
      setStartTime('')
      setEndTime('')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('app.unknownError')
      const isConstraintError = errorMessage === 'database.constraintError'
      
      notificationService.error(
        isConstraintError ? t('database.constraintError') : t('workSession.manual.error'), 
        t('app.error')
      )
      console.error(t('workSession.manual.error'), error)
    } finally {
      setLoading(false)
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
      role="dialog"
      aria-label="Registro manual de ponto"
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
          <button 
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleClose}
            aria-label="Cancelar registro manual"
          >
            <IconX size={16} className="mr-2" aria-hidden="true" />
            {t('app.cancel')}
          </button>
          <PrimaryButton
            type="button"
            onClick={handleSubmit}
            loading={loading}
            leftIcon={<IconDeviceFloppy size={16} aria-hidden="true" />}
            disabled={loading}
            aria-label="Salvar registro manual"
          >
            {loading ? t('app.saving') : t('app.save')}
          </PrimaryButton>
        </Group>
      </Stack>
    </Modal>
  )
} 
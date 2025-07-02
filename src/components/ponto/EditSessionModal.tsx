import { useState } from 'react'
import { Modal, TextInput, Stack, Title, Text, Group, Button } from '@mantine/core'
import { IconClock, IconDeviceFloppy, IconX } from '@tabler/icons-react'
import { useAppStore } from '@/hooks/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { PrimaryButton } from '../common/PrimaryButton'
import { workSessionRepository } from '@/repositories/WorkSessionRepository'
import type { WorkSession } from '@/types/workSession'
import { notificationService } from '@/services/notifications'

interface EditSessionModalProps {
  open: boolean
  session: WorkSession
  onClose: () => void
  onSuccess: () => void
}

export const EditSessionModal = ({ open, session, onClose, onSuccess }: EditSessionModalProps) => {
  const appStore = useAppStore()
  const [startTime, setStartTime] = useState(session.start_time || '')
  const [endTime, setEndTime] = useState(session.end_time || '')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      notificationService.error(t('workSession.manual.fillTimes'), t('app.error'))
      return
    }

    // Validar se end_time é maior que start_time
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    
    if (end <= start) {
      notificationService.error(t('historico.invalidTimes'), t('app.error'))
      return
    }

    setLoading(true)
    try {
      const { user } = appStore
      if (!user) {
        throw new Error(t('auth.notAuthenticated'))
      }

      // Calcular tempo trabalhado
      const workedHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

      // Determinar status baseado nos horários
      const status = workedHours > 0 ? 'completa' : 'incompleta'

      // Atualizar sessão
      await workSessionRepository.update(user.id, session.date, {
        start_time: startTime,
        end_time: endTime,
        worked_time_real: workedHours,
        status,
        manual_edit: true
      })

      onSuccess()
    } catch (error: unknown) {
      notificationService.error(t('historico.editError'), t('app.error'))
      console.error(t('historico.editError'), error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStartTime(session.start_time || '')
    setEndTime(session.end_time || '')
    onClose()
  }

  return (
    <Modal 
      opened={open} 
      onClose={handleClose}
      title={
        <Group>
          <IconClock size={20} />
          <Title order={3}>{t('historico.editSession')}</Title>
        </Group>
      }
      size="sm"
      centered
      role="dialog"
      aria-label="Editar registro de ponto"
    >
      <Stack gap="md">
        <Text size="sm" c="gray.6">
          {t('historico.editSessionSubtitle')}
        </Text>

        <Text size="sm" fw={500}>
          {t('historico.date')}: {new Date(session.date).toLocaleDateString('pt-BR')}
        </Text>

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
            aria-label="Cancelar edição"
          >
            {t('app.cancel')}
          </Button>
          <PrimaryButton
            onClick={handleSubmit}
            loading={loading}
            leftIcon={<IconDeviceFloppy size={16} />}
            aria-label="Salvar edição"
          >
            {loading ? t('app.saving') : t('app.save')}
          </PrimaryButton>
        </Group>
      </Stack>
    </Modal>
  )
} 
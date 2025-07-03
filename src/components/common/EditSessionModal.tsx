import { Modal, Stack, Text, TextInput, Button, Group } from '@mantine/core';

interface EditSessionModalProps {
  opened: boolean;
  onClose: () => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onSave: () => void;
  loading?: boolean;
  t: (key: string) => string;
  testId?: string;
}

export const EditSessionModal = ({
  opened,
  onClose,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onSave,
  loading = false,
  t,
  testId = 'edit-modal',
}: EditSessionModalProps) => {
  return (
    <Modal
      data-testid={testId}
      opened={opened}
      onClose={onClose}
      title={t('historico.editSession')}
      size='sm'
    >
      <Stack gap='md'>
        <Text size='sm' c='gray.6'>
          {t('historico.editSessionSubtitle')}
        </Text>
        <TextInput
          data-testid='edit-start-time'
          label={t('workSession.manual.startTime')}
          type='time'
          value={startTime}
          onChange={e => onStartTimeChange(e.target.value)}
        />
        <TextInput
          data-testid='edit-end-time'
          label={t('workSession.manual.endTime')}
          type='time'
          value={endTime}
          onChange={e => onEndTimeChange(e.target.value)}
        />
        <Group justify='flex-end' gap='sm'>
          <Button
            variant='subtle'
            onClick={onClose}
            aria-label='Cancelar edição'
          >
            {t('app.cancel')}
          </Button>
          <Button
            data-testid='save-edit-button'
            onClick={onSave}
            loading={loading}
            disabled={loading}
            aria-label='Salvar edição'
          >
            {t('app.save')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

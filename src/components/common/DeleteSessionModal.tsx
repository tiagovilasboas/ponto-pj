import { Modal, Stack, Text, Button, Group } from '@mantine/core';

interface DeleteSessionModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  t: (key: string) => string;
  testId?: string;
}

export const DeleteSessionModal = ({
  opened,
  onClose,
  onConfirm,
  loading = false,
  t,
  testId = 'delete-modal',
}: DeleteSessionModalProps) => {
  return (
    <Modal
      data-testid={testId}
      opened={opened}
      onClose={onClose}
      title={t('historico.deleteSession')}
      size='xs'
    >
      <Stack gap='md'>
        <Text size='sm' c='gray.6'>
          {t('historico.deleteConfirm')}
        </Text>
        <Group justify='flex-end' gap='sm'>
          <Button
            variant='subtle'
            color='gray'
            onClick={onClose}
            aria-label='Cancelar exclusão'
          >
            {t('app.cancel')}
          </Button>
          <Button
            data-testid='confirm-delete-button'
            color='red'
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            aria-label='Confirmar exclusão'
          >
            {t('app.delete')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

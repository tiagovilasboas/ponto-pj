import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

interface ExportButtonProps {
  onExport: () => void;
  loading?: boolean;
  disabled?: boolean;
  t: (key: string) => string;
  testId?: string;
}

export const ExportButton = ({
  onExport,
  loading = false,
  disabled = false,
  t,
  testId = 'export-button',
}: ExportButtonProps) => {
  return (
    <Button
      data-testid={testId}
      leftSection={<IconDownload size={16} />}
      onClick={onExport}
      loading={loading}
      disabled={disabled}
      variant='gradient'
      gradient={{ from: 'blue', to: 'indigo' }}
      size='sm'
      fullWidth
    >
      {t('relatorio.exportPDF')}
    </Button>
  );
};

import { Card, Group, Text, Grid } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';

interface StatisticsGridProps {
  statistics: {
    totalHours: number;
    completeDays: number;
    incompleteDays: number;
    totalDays: number;
  };
  formatWorkedHours: (hours: number) => string;
  t: (key: string) => string;
  testId?: string;
}

export const StatisticsGrid = ({
  statistics,
  formatWorkedHours,
  t,
  testId = 'statistics-card',
}: StatisticsGridProps) => {
  return (
    <Card data-testid={testId} withBorder p='sm' className='bg-white'>
      <Group gap='sm' mb='sm'>
        <IconChartBar size={16} className='text-purple-600' />
        <Text fw={600} size='sm'>
          {t('relatorio.statistics')}
        </Text>
      </Group>

      <Grid gutter='sm'>
        <Grid.Col span={6}>
          <div className='text-center p-3 bg-blue-50 rounded-lg'>
            <Text size='lg' fw={700} c='blue.6'>
              {formatWorkedHours(statistics.totalHours)}
            </Text>
            <Text size='xs' c='gray.6'>
              {t('relatorio.totalHours')}
            </Text>
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <div className='text-center p-3 bg-green-50 rounded-lg'>
            <Text size='lg' fw={700} c='green.6'>
              {statistics.completeDays}
            </Text>
            <Text size='xs' c='gray.6'>
              {t('relatorio.completeDays')}
            </Text>
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <div className='text-center p-3 bg-yellow-50 rounded-lg'>
            <Text size='lg' fw={700} c='yellow.6'>
              {statistics.incompleteDays}
            </Text>
            <Text size='xs' c='gray.6'>
              {t('relatorio.incompleteDays')}
            </Text>
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <div className='text-center p-3 bg-gray-50 rounded-lg'>
            <Text size='lg' fw={700} c='gray.6'>
              {statistics.totalDays}
            </Text>
            <Text size='xs' c='gray.6'>
              Total
            </Text>
          </div>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

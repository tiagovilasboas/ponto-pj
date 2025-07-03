import { Card, Group, Text, Select } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';

interface MonthSelectorProps {
  selectedMonth: string;
  monthOptions: { value: string; label: string }[];
  onMonthChange: (month: string) => void;
  title: string;
  testId?: string;
}

export const MonthSelector = ({
  selectedMonth,
  monthOptions,
  onMonthChange,
  title,
  testId = 'month-selector',
}: MonthSelectorProps) => {
  return (
    <Card data-testid={testId} withBorder p='sm' className='bg-white'>
      <Group justify='space-between' align='center'>
        <Group gap='sm'>
          <IconCalendar size={16} className='text-blue-600' />
          <Text fw={600} size='sm'>
            {title}
          </Text>
        </Group>
        <Select
          data-testid='month-select'
          value={selectedMonth}
          onChange={value => onMonthChange(value || selectedMonth)}
          data={monthOptions}
          size='xs'
          w={140}
          searchable
        />
      </Group>
    </Card>
  );
};

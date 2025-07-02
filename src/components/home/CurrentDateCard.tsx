import { Card, Group, Text } from '@mantine/core'
import { IconCalendar } from '@tabler/icons-react'

interface CurrentDateCardProps {
  date: string
}

export function CurrentDateCard({ date }: CurrentDateCardProps) {
  return (
    <Card withBorder>
      <Group justify="center" align="center">
        <IconCalendar size={24} color="var(--mantine-color-blue-6)" aria-hidden="true" />
        <Text size="lg" fw={600} c="gray.7" aria-label={date}>{date}</Text>
      </Group>
    </Card>
  )
} 
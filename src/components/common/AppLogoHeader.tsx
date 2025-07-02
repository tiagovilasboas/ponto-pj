import { Group, Title } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'

export const AppLogoHeader = () => (
  <Group justify="center" align="center" gap={8} mb="lg">
    <IconClock size={36} color="var(--mantine-color-blue-6)" />
    <Title order={1} size="h2" c="blue.7" style={{ letterSpacing: 1 }}>Ponto PJ</Title>
  </Group>
) 
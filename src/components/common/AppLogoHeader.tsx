import { Group, Title } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'

export const AppLogoHeader = () => (
  <Group justify="center" align="center" gap={8} mb="lg">
    <IconClock size={36} color="var(--mantine-color-blue-6)" aria-hidden="true" />
    <Title order={1} size="h2" c="blue.7" style={{ letterSpacing: 1 }} aria-label="Ponto PJ">Ponto PJ</Title>
  </Group>
) 
import { Card, Group, Title, ActionIcon } from '@mantine/core'
import { IconLogout, IconClock } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'

interface HomeHeaderProps {
  onLogout: () => void
}

export function HomeHeader({ onLogout }: HomeHeaderProps) {
  const { t } = useTranslation()

  return (
    <Card withBorder mb="md">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <IconClock size={24} color="var(--mantine-color-blue-6)" />
          <Title order={1} size="h4" c="gray.8">{t('app.title')}</Title>
        </Group>
        <Group gap="sm">
          <LanguageSwitcher />
          <ActionIcon 
            variant="light" 
            color="red" 
            size="lg"
            onClick={onLogout}
            aria-label={t('home.logout')}
          >
            <IconLogout size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  )
} 
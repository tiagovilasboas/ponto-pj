import { Card, Group, Title, ActionIcon, Button } from '@mantine/core'
import { IconLogout, IconClock, IconHistory, IconFileReport } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useNavigate } from 'react-router-dom'

interface HomeHeaderProps {
  onLogout: () => void
}

export function HomeHeader({ onLogout }: HomeHeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Card withBorder mb="md">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <IconClock size={24} color="var(--mantine-color-blue-6)" />
          <Title order={1} size="h4" c="gray.8">{t('app.title')}</Title>
        </Group>
        <Group gap="sm">
          <Button
            variant="light"
            size="sm"
            leftSection={<IconHistory size={16} />}
            onClick={() => navigate('/history')}
          >
            {t('historico.title')}
          </Button>
          <Button
            variant="light"
            size="sm"
            leftSection={<IconFileReport size={16} />}
            onClick={() => navigate('/report')}
          >
            {t('relatorio.title')}
          </Button>
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
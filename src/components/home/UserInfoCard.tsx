import { Card, CardSection, Group, Title, Stack, Text } from '@mantine/core'
import { IconUser, IconMail, IconId } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
import type { User } from '@supabase/supabase-js'

interface UserInfoCardProps {
  user: User | null
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  const { t } = useTranslation()

  return (
    <Card withBorder>
      <CardSection bg="gray" c="white" p="md" style={{ borderTopLeftRadius: 'var(--mantine-radius-md)', borderTopRightRadius: 'var(--mantine-radius-md)' }}>
        <Group>
          <IconUser size={20} aria-hidden="true" />
          <Title order={3} size="h5" aria-label={t('user.title')}>{t('user.title')}</Title>
        </Group>
      </CardSection>
      <Stack gap="xs" p="md">
        <Group gap="xs">
          <IconMail size={16} color="var(--mantine-color-blue-6)" aria-hidden="true" />
          <Text size="sm">
            <Text component="span" fw={600}>{t('user.email')}:</Text> {user?.email}
          </Text>
        </Group>
        <Group gap="xs">
          <IconId size={16} color="var(--mantine-color-gray-6)" aria-hidden="true" />
          <Text size="sm">
            <Text component="span" fw={600}>{t('user.id')}:</Text> {user?.id}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
} 
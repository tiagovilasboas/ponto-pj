import { useAppStore } from '@/hooks/useAppStore'
import { useState } from 'react'
import { TextInput, PasswordInput, Card, Title, Stack, Container, Text, Center, Anchor, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconMail, IconLock } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { mapAuthError, AuthErrorType } from '@/types/auth'
import { useTranslation } from '@/i18n/useTranslation'
import { PrimaryButton } from '../components/common/PrimaryButton'

export const Login = () => {
  const appStore = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      notifications.show({
        title: t('app.error'),
        message: t('auth.login.errors.fillFields'),
        color: 'red',
      })
      return
    }
    try {
      await appStore.login(email, password)
      notifications.show({
        title: t('app.success'),
        message: t('auth.login.success'),
        color: 'green',
      })
      navigate('/')
    } catch (error: unknown) {
      const type = mapAuthError(error instanceof Error ? error.message : '')
      let msg = t('auth.login.errors.generic')
      if (type === AuthErrorType.INVALID_CREDENTIALS) msg = t('auth.login.errors.invalidCredentials')
      if (type === AuthErrorType.EMAIL_NOT_CONFIRMED) msg = t('auth.login.errors.emailNotConfirmed')
      notifications.show({
        title: t('app.error'),
        message: msg,
        color: 'red',
      })
    }
  }

  return (
    <Center h="100vh" w="100vw" style={{ background: '#f8fafc' }}>
      <Container size="xs" px="md" w="100%" maw={400}>
        <Card withBorder shadow="md" p="xl" radius="md" w="100%">
          <Stack gap="lg">
            <div style={{ textAlign: 'center' }}>
              <Title order={1} size="h2" c="blue.6" mb="xs">{t('app.title')}</Title>
              <Text c="gray.6" size="sm">{t('auth.login.title')}</Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label={t('auth.login.email')}
                  placeholder={t('auth.login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  required
                  type="email"
                  autoComplete="username"
                />

                <PasswordInput
                  label={t('auth.login.password')}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  required
                  autoComplete="current-password"
                />

                <Stack gap="xs" align="center">
                  <PrimaryButton
                    type="submit"
                    loading={appStore.actionLoading}
                    className="w-full mt-2"
                  >
                    {appStore.actionLoading ? t('auth.login.submitting') : t('auth.login.submit')}
                  </PrimaryButton>
                  <Group gap={4}>
                    <Text size="sm" c="gray.7">{t('auth.login.noAccount')}</Text>
                    <Anchor component={Link} to="/register" size="sm">{t('auth.login.signUp')}</Anchor>
                  </Group>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Container>
    </Center>
  )
} 
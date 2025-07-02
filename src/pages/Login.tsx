import { useAppStore } from '@/hooks/useAppStore'
import { useState } from 'react'
import { TextInput, PasswordInput, Card, Stack, Container, Text, Anchor, Group } from '@mantine/core'
import { IconMail, IconLock } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { mapAuthError, AuthErrorType } from '@/types/auth'
import { useTranslation } from '@/i18n/useTranslation'
import { PrimaryButton } from '../components/common/PrimaryButton'
import { notificationService } from '@/services/notifications'
import { AppLogoHeader } from '../components/common/AppLogoHeader'

export const Login = () => {
  const appStore = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      notificationService.error(t('auth.login.errors.fillFields'), t('app.error'))
      return
    }
    try {
      await appStore.login(email, password)
      notificationService.success(t('auth.login.success'), t('app.success'))
      navigate('/')
    } catch (error: unknown) {
      const type = mapAuthError(error instanceof Error ? error.message : '')
      let msg = t('auth.login.errors.generic')
      if (type === AuthErrorType.INVALID_CREDENTIALS) msg = t('auth.login.errors.invalidCredentials')
      if (type === AuthErrorType.EMAIL_NOT_CONFIRMED) msg = t('auth.login.errors.emailNotConfirmed')
      notificationService.error(msg, t('app.error'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <AppLogoHeader />
      <div className="h-4" />
      <Container size="xs" w="100%" maw={400}>
        <Card 
          p="xl"
          radius="3xl"
          className="bg-white/80 backdrop-blur-md shadow-2xl border-0"
          style={{ border: 0 }}
        >
          <Stack gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Text c="gray.6" size="md">Digite seus dados para acessar o sistema</Text>
            </div>
            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                <TextInput
                  label={t('auth.login.email')}
                  placeholder={t('auth.login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} aria-hidden="true" />}
                  required
                  type="email"
                  autoComplete="username"
                  size="md"
                />
                <PasswordInput
                  label={t('auth.login.password')}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} aria-hidden="true" />}
                  required
                  autoComplete="current-password"
                  size="md"
                />
                <Stack gap="md" align="center">
                  <PrimaryButton
                    type="submit"
                    loading={appStore.actionLoading}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
                  >
                    {appStore.actionLoading ? t('auth.login.submitting') : t('auth.login.submit')}
                  </PrimaryButton>
                  <Group gap={4}>
                    <Text size="sm" c="gray.7">{t('auth.login.noAccount')}</Text>
                    <Anchor component={Link} to="/register" size="sm" c="blue.7" fw={700}>{t('auth.login.signUp')}</Anchor>
                  </Group>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Container>
    </div>
  )
} 
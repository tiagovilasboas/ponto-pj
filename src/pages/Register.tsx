import { useState } from 'react'
import { TextInput, PasswordInput, Card, Title, Stack, Container, Text, Anchor, Group } from '@mantine/core'
import { IconMail, IconLock } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthRepository } from '@/repositories/AuthRepository'
import { useTranslation } from '@/i18n/useTranslation'
import { PrimaryButton } from '../components/common/PrimaryButton'
import { notificationService } from '@/services/notifications'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const authRepository = new AuthRepository()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      notificationService.error(t('auth.register.errors.fillFields'), t('app.error'))
      return
    }
    setLoading(true)
    try {
      const { user, error } = await authRepository.signUp({ email, password })
      if (error) {
        notificationService.error(error.message, t('app.error'))
        return
      }
      if (user) {
        notificationService.success(t('auth.register.success'), t('app.success'))
        navigate('/login')
      }
    } catch {
      notificationService.error(t('auth.register.errors.generic'), t('app.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container size="xs" w="100%" maw={400}>
        <Card 
          withBorder 
          shadow="xl" 
          p="xl" 
          radius="xl" 
          w="100%"
          className="bg-white/95 backdrop-blur-sm"
        >
          <Stack gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Title order={1} size="h2" c="blue.6" mb="xs">{t('auth.register.title')}</Title>
              <Text c="gray.6" size="sm">{t('auth.register.subtitle')}</Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                <TextInput
                  label={t('auth.register.email')}
                  placeholder={t('auth.register.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  required
                  type="email"
                  autoComplete="username"
                  size="md"
                />

                <PasswordInput
                  label={t('auth.register.password')}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  required
                  autoComplete="new-password"
                  size="md"
                />

                <Stack gap="md" align="center">
                  <PrimaryButton
                    type="submit"
                    loading={loading}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {t('auth.register.submit')}
                  </PrimaryButton>
                  <Group gap={4}>
                    <Text size="sm" c="gray.7">{t('auth.register.hasAccount')}</Text>
                    <Anchor component={Link} to="/login" size="sm" c="blue.6">{t('auth.register.signIn')}</Anchor>
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
import { useState } from 'react'
import { TextInput, PasswordInput, Button, Card, Title, Stack, Container, Text, Center, Anchor, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconMail, IconLock, IconUserPlus } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthRepository } from '@/repositories/AuthRepository'
import { useTranslation } from '@/i18n/useTranslation'

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
      notifications.show({
        title: t('app.error'),
        message: t('auth.register.errors.fillFields'),
        color: 'red',
      })
      return
    }
    setLoading(true)
    try {
      const { user, error } = await authRepository.signUp({ email, password })
      if (error) {
        notifications.show({
          title: t('app.error'),
          message: error.message,
          color: 'red',
        })
        return
      }
      if (user) {
        notifications.show({
          title: t('app.success'),
          message: t('auth.register.success'),
          color: 'green',
        })
        navigate('/login')
      }
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('auth.register.errors.generic'),
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Center h="100vh" w="100vw" style={{ background: '#f8fafc' }}>
      <Container size="xs" px="md" w="100%" maw={400}>
        <Card withBorder shadow="md" p="xl" radius="md" w="100%">
          <Stack gap="lg">
            <div style={{ textAlign: 'center' }}>
              <Title order={1} size="h2" c="blue.6" mb="xs">{t('auth.register.title')}</Title>
              <Text c="gray.6" size="sm">{t('auth.register.subtitle')}</Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label={t('auth.register.email')}
                  placeholder={t('auth.register.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  required
                  type="email"
                  autoComplete="username"
                />

                <PasswordInput
                  label={t('auth.register.password')}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  required
                  autoComplete="new-password"
                />

                <Stack gap="xs" align="center">
                  <Button
                    type="submit"
                    loading={loading}
                    leftSection={<IconUserPlus size={16} />}
                    size="md"
                    fullWidth
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'indigo' }}
                    styles={{
                      root: {
                        color: 'white !important',
                        backgroundColor: 'transparent !important',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        },
                        '& .mantine-Button-label': {
                          color: 'white !important',
                        },
                        '& .mantine-Button-leftSection': {
                          color: 'white !important',
                        },
                      },
                    }}
                  >
                    {loading ? t('auth.register.submitting') : t('auth.register.submit')}
                  </Button>
                  <Group gap={4}>
                    <Text size="sm" c="gray.7">{t('auth.register.hasAccount')}</Text>
                    <Anchor component={Link} to="/login" size="sm">{t('auth.register.signIn')}</Anchor>
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
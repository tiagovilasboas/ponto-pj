import { useAppStoreWithAuth } from '@/hooks/useAppStore';
import { Container, Card, Text, TextInput, PasswordInput, Group, Anchor } from '@mantine/core';
import { IconMail, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { notificationService } from '@/services/notifications';
import { AppLogoHeader } from '../components/common/AppLogoHeader';
import { Stack } from '@mantine/core';

export const Login = () => {
  const appStore = useAppStoreWithAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notificationService.error(t('auth.login.fillFields'), t('app.error'));
      return;
    }
    try {
      await appStore.login(email, password);
      notificationService.success(t('auth.login.success'), t('app.success'));
      navigate('/');
    } catch {
      notificationService.error(t('auth.loginError'), t('app.error'));
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4'>
      <AppLogoHeader />
      <div className='h-4' />
      <Container size='xs' w='100%' maw={400}>
        <Card
          p='xl'
          radius='3xl'
          className='bg-white/80 backdrop-blur-md shadow-2xl border-0'
          style={{ border: 0 }}
        >
          <Stack gap='xl'>
            <div style={{ textAlign: 'center' }}>
              <Text c='gray.6' size='md'>
                {t('auth.login.subtitle')}
              </Text>
            </div>
            <form onSubmit={handleSubmit}>
              <Stack gap='lg'>
                <TextInput
                  label={t('auth.login.email')}
                  placeholder={t('auth.login.emailPlaceholder')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} aria-hidden='true' />}
                  required
                  type='email'
                  autoComplete='username'
                  size='md'
                />
                <PasswordInput
                  label={t('auth.login.password')}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} aria-hidden='true' />}
                  required
                  autoComplete='current-password'
                  size='md'
                />
                <Stack gap='md' align='center'>
                  <PrimaryButton
                    type='submit'
                    loading={appStore.authActionLoading}
                    className='w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md'
                  >
                    {appStore.authActionLoading
                      ? t('auth.login.submitting')
                      : t('auth.login.submit')}
                  </PrimaryButton>
                  <Group gap={4}>
                    <Text size='sm' c='gray.7'>
                      {t('auth.login.noAccount')}
                    </Text>
                    <Anchor
                      component={Link}
                      to='/register'
                      size='sm'
                      c='blue.7'
                      fw={700}
                    >
                      {t('auth.login.signUp')}
                    </Anchor>
                  </Group>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

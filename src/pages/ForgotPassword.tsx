import { useState } from 'react';
import {
  TextInput,
  Card,
  Title,
  Stack,
  Container,
  Text,
  Anchor,
  Group,
} from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthRepository } from '@/repositories/AuthRepository';
import { useTranslation } from '@/i18n/useTranslation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { notificationService } from '@/services/notifications';
import { AppLogoHeader } from '../components/common/AppLogoHeader';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authRepository = new AuthRepository();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError(t('auth.forgotPassword.errors.fillFields'));
      notificationService.error(
        t('auth.forgotPassword.errors.fillFields'),
        t('app.error')
      );
      return;
    }
    setLoading(true);
    try {
      const { error } = await authRepository.resetPassword({ email });
      if (error) {
        if (error.message === 'User not found') {
          setError(t('auth.forgotPassword.errors.emailNotFound'));
        } else {
          setError(t('auth.forgotPassword.errors.generic'));
        }
        notificationService.error(
          error.message === 'User not found'
            ? t('auth.forgotPassword.errors.emailNotFound')
            : t('auth.forgotPassword.errors.generic'),
          t('app.error')
        );
        return;
      }
      notificationService.success(
        t('auth.forgotPassword.success'),
        t('app.success')
      );
      navigate('/login');
    } catch {
      setError(t('auth.forgotPassword.errors.generic'));
      notificationService.error(
        t('auth.forgotPassword.errors.generic'),
        t('app.error')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4'>
      <AppLogoHeader />
      <div className='h-4' />
      <Container size='xs' w='100%' maw={400}>
        <Card
          withBorder
          shadow='xl'
          p='xl'
          radius='xl'
          w='100%'
          className='bg-white/95 backdrop-blur-sm'
        >
          <Stack gap='xl'>
            <div style={{ textAlign: 'center' }}>
              <Title order={1} size='h2' c='blue.6' mb='xs'>
                {t('auth.forgotPassword.title')}
              </Title>
              <Text c='gray.6' size='sm'>
                {t('auth.forgotPassword.subtitle')}
              </Text>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <Stack gap='lg'>
                <TextInput
                  label={t('auth.forgotPassword.email')}
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  required
                  type='email'
                  autoComplete='email'
                  size='md'
                  error={!!error}
                />
                {error && (
                  <Text c='red.6' size='sm' data-testid='email-error'>
                    {error}
                  </Text>
                )}
                <Stack gap='md' align='center'>
                  <PrimaryButton
                    type='submit'
                    loading={loading}
                    disabled={loading}
                    className='w-full h-12 text-base font-semibold'
                  >
                    {loading
                      ? t('auth.forgotPassword.submitting')
                      : t('auth.forgotPassword.submit')}
                  </PrimaryButton>
                  <Group gap={4}>
                    <Text size='sm' c='gray.7'>
                      {t('auth.forgotPassword.backToLogin')}
                    </Text>
                    <Anchor component={Link} to='/login' size='sm' c='blue.6'>
                      {t('auth.login.title')}
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

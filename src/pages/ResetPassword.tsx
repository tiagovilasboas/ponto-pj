import { useState, useEffect, useMemo } from 'react';
import {
  PasswordInput,
  Card,
  Title,
  Stack,
  Container,
  Text,
  Anchor,
  Group,
} from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthRepository } from '@/repositories/AuthRepository';
import { useTranslation } from '@/i18n/useTranslation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { notificationService } from '@/services/notifications';
import { AppLogoHeader } from '../components/common/AppLogoHeader';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authRepository = useMemo(() => new AuthRepository(), []);
  const { t } = useTranslation();

  // Verificar se há token de acesso na URL
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    // Se não há tokens, redirecionar para login
    if (!accessToken || !refreshToken) {
      notificationService.error('Link inválido ou expirado', t('app.error'));
      navigate('/login');
      return;
    }

    // Configurar a sessão com os tokens
    const setupSession = async () => {
      try {
        const { error } = await authRepository.setSession(
          accessToken,
          refreshToken
        );
        if (error) {
          notificationService.error(
            'Link inválido ou expirado',
            t('app.error')
          );
          navigate('/login');
        }
      } catch {
        notificationService.error('Link inválido ou expirado', t('app.error'));
        navigate('/login');
      }
    };

    setupSession();
  }, [accessToken, refreshToken, navigate, t, authRepository]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      notificationService.error(
        t('auth.resetPassword.errors.fillFields'),
        t('app.error')
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.resetPassword.errors.passwordsNotMatch'));
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { error } = await authRepository.updatePassword(password);
      if (error) {
        notificationService.error(
          t('auth.resetPassword.errors.generic'),
          t('app.error')
        );
        return;
      }

      notificationService.success(
        t('auth.resetPassword.success'),
        t('app.success')
      );
      navigate('/login');
    } catch {
      notificationService.error(
        t('auth.resetPassword.errors.generic'),
        t('app.error')
      );
    } finally {
      setLoading(false);
    }
  };

  // Se não há tokens, mostrar loading
  if (!accessToken || !refreshToken) {
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
            <div className='text-center'>
              <div className='spinner mb-4'></div>
              <Text c='gray.6' size='sm'>
                Verificando link...
              </Text>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

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
                {t('auth.resetPassword.title')}
              </Title>
              <Text c='gray.6' size='sm'>
                {t('auth.resetPassword.subtitle')}
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap='lg'>
                <PasswordInput
                  label={t('auth.resetPassword.password')}
                  placeholder={t('auth.resetPassword.passwordPlaceholder')}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  required
                  autoComplete='new-password'
                  size='md'
                />

                <PasswordInput
                  label={t('auth.resetPassword.confirmPassword')}
                  placeholder={t(
                    'auth.resetPassword.confirmPasswordPlaceholder'
                  )}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  required
                  autoComplete='new-password'
                  size='md'
                  error={!!error}
                />
                {error && (
                  <Text c='red.6' size='sm' data-testid='password-error'>
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
                      ? t('auth.resetPassword.submitting')
                      : t('auth.resetPassword.submit')}
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

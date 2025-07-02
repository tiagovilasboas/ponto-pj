import { Group, Text, ActionIcon, Stack } from '@mantine/core';
import { IconArrowLeft, IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppStoreWithAuth } from '@/hooks/useAppStore';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogout?: boolean;
}

export const AppHeader = ({
  title,
  subtitle,
  showBack = false,
  showLogout = true,
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAppStoreWithAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className='sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3'>
      <Group justify='space-between' align='center'>
        <Group gap='sm'>
          {showBack && (
            <ActionIcon
              variant='subtle'
              size='lg'
              onClick={() => navigate(-1)}
              className='text-gray-600 hover:bg-gray-100'
              aria-label='Voltar'
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          )}
          <Stack gap={0}>
            <Text fw={600} size='lg' className='text-gray-900'>
              {title}
            </Text>
            {subtitle && (
              <Text size='sm' c='gray.6'>
                {subtitle}
              </Text>
            )}
          </Stack>
        </Group>
        <Group gap='xs'>
          <LanguageSwitcher />
          {showLogout && (
            <ActionIcon
              variant='subtle'
              size='lg'
              onClick={handleLogout}
              className='text-red-600 hover:bg-red-50'
              aria-label='Sair'
            >
              <IconLogout size={20} />
            </ActionIcon>
          )}
        </Group>
      </Group>
    </div>
  );
};

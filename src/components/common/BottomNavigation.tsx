import { Text, ActionIcon } from '@mantine/core';
import { IconHome, IconHistory, IconReport } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      path: '/',
      icon: IconHome,
      label: t('app.title'),
      color: 'blue',
    },
    {
      path: '/history',
      icon: IconHistory,
      label: t('historico.title'),
      color: 'green',
    },
    {
      path: '/report',
      icon: IconReport,
      label: t('relatorio.title'),
      color: 'purple',
    },
  ];

  return (
    <div
      className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-0 py-2'
      role='navigation'
      aria-label={t('aria.navigation')}
    >
      <div className='flex justify-between items-center w-full'>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              className='flex-1 min-w-0 flex flex-col items-center py-2 px-0 rounded-lg transition-colors cursor-pointer'
              onClick={() => navigate(item.path)}
            >
              <ActionIcon
                variant='subtle'
                size='lg'
                className={
                  `flex justify-center items-center mx-auto ` +
                  (isActive
                    ? `text-${item.color}-600 bg-${item.color}-50`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50')
                }
                aria-label={item.label}
              >
                <Icon size={22} aria-hidden='true' />
              </ActionIcon>
              <Text
                size='xs'
                className={
                  `mt-1 font-medium w-full text-center truncate ` +
                  (isActive ? `text-${item.color}-600` : 'text-gray-500')
                }
              >
                {item.label}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

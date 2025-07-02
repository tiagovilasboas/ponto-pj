import { Container, Stack, Card, Text, Badge } from '@mantine/core';
import { IconClock, IconTarget } from '@tabler/icons-react';
import { useAppStoreWithAuth } from '@/hooks/useAppStore';
import { AppHeader } from '@/components/common/AppHeader';
import { BottomNavigation } from '@/components/common/BottomNavigation';
import { SessionStatusCard } from '@/components/home/SessionStatusCard';
import { ManualRegisterModal } from '@/components/ponto/ManualRegisterModal';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import {
  isValidSession,
  isCompleteSession,
  formatDateForDisplay,
} from '@/lib/utils';

export const Home = () => {
  const {
    session,
    formatTime,
    formatWorkedHours,
    loadUser,
    startJourney,
    endJourney,
  } = useAppStoreWithAuth();
  const { t } = useTranslation();
  const [manualModalOpen, setManualModalOpen] = useState(false);

  // Recarregar sessão quando o componente montar
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Ações rápidas (placeholders)
  const handleEdit = () => setManualModalOpen(true);

  // Status e cores
  const isComplete = isCompleteSession(session);
  const isManual = !!session?.manual_edit;
  const feedbackColor = isComplete
    ? 'text-green-600'
    : isValidSession(session)
      ? 'text-orange-600'
      : 'text-gray-500';

  // Data do registro
  const todayLabel = formatDateForDisplay(
    session?.date || new Date().toISOString().split('T')[0]
  );

  return (
    <div data-testid='home-page' className='home-page-critical'>
      {/* Círculos decorativos de fundo */}
      <div className='absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl'></div>
      <div className='absolute top-40 right-8 w-24 h-24 bg-purple-200/40 rounded-full blur-xl'></div>
      <div className='absolute bottom-40 left-8 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl'></div>

      <AppHeader
        title={t('app.title')}
        subtitle={isValidSession(session) ? todayLabel : t('app.welcome')}
        showLogout={true}
      />

      <Container data-testid='home-container' size='sm' py='md'>
        <Stack gap='xl'>
          {/* Session Status Card - Hero principal */}
          <SessionStatusCard
            session={session}
            actionLoading={false}
            onStart={startJourney}
            onEnd={endJourney}
            onManualRegister={handleEdit}
            formatTime={formatTime}
            formatWorkedHours={formatWorkedHours}
          />

          {/* Card de detalhes */}
          <Card
            data-testid='session-details-card'
            p='xl'
            className='session-card-critical'
            style={{ border: 0 }}
          >
            <Stack gap='xl'>
              {/* Linha do tempo */}
              <div data-testid='timeline' className='grid grid-cols-3 gap-6'>
                <div className='text-center'>
                  <div className='flex justify-center mb-2'>
                    <IconTarget size={24} className='text-purple-300' />
                  </div>
                  <Text size='xs' className='text-gray-500 mb-2 font-medium'>
                    {t('workSession.timeline.start')}
                  </Text>
                  <Text fw={700} size='2xl' className='text-gray-800'>
                    {session?.start_time
                      ? formatTime(session.start_time)
                      : '--:--'}
                  </Text>
                </div>
                <div className='text-center'>
                  <div className='flex justify-center mb-2'>
                    <IconTarget size={24} className='text-green-300' />
                  </div>
                  <Text size='xs' className='text-gray-500 mb-2 font-medium'>
                    {t('workSession.timeline.end')}
                  </Text>
                  <Text fw={700} size='2xl' className='text-gray-800'>
                    {session?.end_time ? formatTime(session.end_time) : '--:--'}
                  </Text>
                </div>
                <div className='text-center'>
                  <div className='flex justify-center mb-2'>
                    <IconClock size={24} className='text-blue-300' />
                  </div>
                  <Text size='xs' className='text-gray-500 mb-2 font-medium'>
                    {t('workSession.timeline.time')}
                  </Text>
                  <Text fw={700} size='2xl' className='text-gray-800'>
                    {session?.worked_time_real
                      ? formatWorkedHours(session.worked_time_real)
                      : '--'}
                  </Text>
                </div>
              </div>
              {/* Badge de registro manual */}
              {isManual && (
                <div className='flex justify-center'>
                  <Badge
                    data-testid='manual-badge'
                    size='lg'
                    className='bg-orange-100 text-orange-700 border-orange-200 px-4 py-2 rounded-full'
                  >
                    {t('workSession.feedback.manualBadge')}
                  </Badge>
                </div>
              )}
              {/* Mensagem de feedback centralizada */}
              <div
                data-testid='feedback-message'
                className='flex items-center justify-center min-h-[48px]'
              >
                <Text size='lg' fw={500} className={feedbackColor}>
                  {isComplete
                    ? t('workSession.feedback.congratulations')
                    : isValidSession(session)
                      ? t('workSession.feedback.inProgress')
                      : t('workSession.feedback.startJourney')}
                </Text>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>

      <BottomNavigation />

      <ManualRegisterModal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
      />
    </div>
  );
};

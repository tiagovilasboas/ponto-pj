import { useAppStore } from '@/hooks/useAppStore'
import { useState } from 'react'
import { Container, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ManualRegisterModal } from '@/components/ponto/ManualRegisterModal'
import { HomeHeader } from '@/components/home/HomeHeader'
import { CurrentDateCard } from '@/components/home/CurrentDateCard'
import { SessionStatusCard } from '@/components/home/SessionStatusCard'
import { UserInfoCard } from '@/components/home/UserInfoCard'
import { useTranslation } from '@/i18n/useTranslation'

export const Home = () => {
  const appStore = useAppStore()
  const [manualModalOpen, setManualModalOpen] = useState(false)
  const { t } = useTranslation()

  const handleStartJourney = async () => {
    try {
      await appStore.startJourney()
      notifications.show({
        title: t('app.success'),
        message: t('workSession.start.success'),
        color: 'green',
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('app.unknownError')
      const isConstraintError = errorMessage === 'database.constraintError'
      
      notifications.show({
        title: t('app.error'),
        message: isConstraintError ? t('database.constraintError') : t('workSession.start.error'),
        color: 'red',
      })
    }
  }

  const handleEndJourney = async () => {
    try {
      await appStore.endJourney()
      notifications.show({
        title: t('app.success'),
        message: t('workSession.end.success'),
        color: 'green',
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('app.unknownError')
      const isConstraintError = errorMessage === 'database.constraintError'
      
      notifications.show({
        title: t('app.error'),
        message: isConstraintError ? t('database.constraintError') : t('workSession.end.error'),
        color: 'red',
      })
    }
  }

  const handleLogout = async () => {
    try {
      await appStore.logout()
      notifications.show({
        title: t('app.success'),
        message: t('home.logoutSuccess'),
        color: 'green',
      })
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('home.logoutError'),
        color: 'red',
      })
    }
  }

  const handleManualRegister = () => {
    setManualModalOpen(true)
  }

  return (
    <Container size="xs" py="xl" px="md">
      <Stack gap="md">
        <HomeHeader onLogout={handleLogout} />
        <CurrentDateCard date={appStore.formatCurrentDate()} />
        <SessionStatusCard
          session={appStore.session}
          actionLoading={appStore.actionLoading}
          onStart={handleStartJourney}
          onEnd={handleEndJourney}
          onManualRegister={handleManualRegister}
          formatTime={appStore.formatTime}
          formatWorkedHours={appStore.formatWorkedHours}
        />
        <UserInfoCard user={appStore.user} />
        <ManualRegisterModal 
          open={manualModalOpen} 
          onClose={() => setManualModalOpen(false)} 
        />
      </Stack>
    </Container>
  )
} 
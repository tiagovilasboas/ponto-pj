import { Container, Stack, Card, Text, Badge, Button } from '@mantine/core'
import { IconClock, IconEdit, IconHistory, IconFileDownload, IconTrophy, IconTarget } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppStore } from '@/hooks/useAppStore'
import { AppHeader } from '@/components/common/AppHeader'
import { BottomNavigation } from '@/components/common/BottomNavigation'
import { ManualRegisterModal } from '@/components/ponto/ManualRegisterModal'
import { useState, useEffect } from 'react'
import { isValidSession, isCompleteSession, formatDateForDisplay } from '@/lib/utils'

export const Home = () => {
  const { session, formatTime, formatWorkedHours, loadUserAndSession } = useAppStore()
  const { t } = useTranslation()
  const [showManualModal, setShowManualModal] = useState(false)

  // Recarregar sessão quando o componente montar
  useEffect(() => {
    loadUserAndSession()
  }, [loadUserAndSession])

  // Ações rápidas (placeholders)
  const handleEdit = () => setShowManualModal(true)
  const handleHistory = () => window.location.href = '/history'
  const handlePDF = () => window.location.href = '/report'

  // Status e cores
  const isComplete = isCompleteSession(session)
  const isManual = !!session?.manual_edit
  const statusIcon = isComplete ? <IconTrophy size={32} className="text-white" /> : <IconClock size={32} className="text-white" />
  const statusText = isComplete ? t('workSession.status.complete') : isValidSession(session) ? t('workSession.status.incomplete') : t('workSession.status.noSession')
  const feedbackColor = isComplete ? 'text-green-600' : isValidSession(session) ? 'text-orange-600' : 'text-gray-500'

  // Data do registro
  const todayLabel = formatDateForDisplay(session?.date || new Date().toISOString().split('T')[0])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader 
        title={t('app.title')} 
        subtitle={isValidSession(session) ? todayLabel : t('app.welcome')}
        showLogout={true}
      />
      
      <Container size="sm" py="md">
        <Stack gap="6">
          {/* Card principal - Status */}
          <Card
            withBorder
            p="xl"
            className="rounded-3xl shadow-lg"
            style={{ border: 0 }}
          >
            <div className={`w-full h-40 rounded-2xl ${isComplete ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-orange-500 to-red-500'} relative overflow-hidden`}>
              {/* Padrão de fundo sutil */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/20"></div>
              </div>
              
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-white">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  {statusIcon}
                </div>
                <Text fw={700} size="xl" className="text-center">
                  {statusText}
                </Text>
                <Text size="sm" className="text-white/80 mt-2">
                  {todayLabel}
                </Text>
              </div>
            </div>
          </Card>

          {/* Card de detalhes */}
          <Card
            withBorder
            p="xl"
            className="rounded-3xl shadow-lg bg-white"
            style={{ border: 0 }}
          >
            <Stack gap="xl">
              {/* Linha do tempo */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconTarget size={16} className="text-purple-600" />
                  </div>
                  <Text size="xs" className="text-gray-500 mb-2 font-medium">{t('workSession.timeline.start')}</Text>
                  <Text fw={700} size="2xl" className="text-gray-800">
                    {session?.start_time ? formatTime(session.start_time) : '--:--'}
                  </Text>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconTarget size={16} className="text-green-600" />
                  </div>
                  <Text size="xs" className="text-gray-500 mb-2 font-medium">{t('workSession.timeline.end')}</Text>
                  <Text fw={700} size="2xl" className="text-gray-800">
                    {session?.end_time ? formatTime(session.end_time) : '--:--'}
                  </Text>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconClock size={16} className="text-blue-600" />
                  </div>
                  <Text size="xs" className="text-gray-500 mb-2 font-medium">{t('workSession.timeline.time')}</Text>
                  <Text fw={700} size="2xl" className="text-gray-800">
                    {session?.worked_time_real ? formatWorkedHours(session.worked_time_real) : '--'}
                  </Text>
                </div>
              </div>

              {/* Badge de registro manual */}
              {isManual && (
                <div className="flex justify-center">
                  <Badge 
                    size="lg" 
                    className="bg-orange-100 text-orange-700 border-orange-200 px-4 py-2 rounded-full"
                  >
                    {t('workSession.feedback.manualBadge')}
                  </Badge>
                </div>
              )}

              {/* Mensagem de feedback */}
              <div className="text-center">
                <Text size="lg" fw={500} className={feedbackColor}>
                  {isComplete
                    ? t('workSession.feedback.congratulations')
                    : isValidSession(session)
                      ? t('workSession.feedback.inProgress')
                      : t('workSession.feedback.startJourney')}
                </Text>
              </div>
            </Stack>
          </Card>

          {/* Card de ações */}
          <Card
            withBorder
            p="xl"
            className="rounded-3xl shadow-lg bg-white"
            style={{ border: 0 }}
          >
            <Stack gap="md">
              <Text fw={600} size="lg" className="text-gray-800 text-center mb-2">
                {t('workSession.actions.quickActions')}
              </Text>
              <div className="grid grid-cols-3 gap-4">
                <Button 
                  leftSection={<IconEdit size={24} />} 
                  size="lg" 
                  variant="light" 
                  color="gray" 
                  onClick={handleEdit}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 h-20 rounded-2xl text-sm font-semibold"
                >
                  {t('workSession.actions.edit')}
                </Button>
                <Button 
                  leftSection={<IconHistory size={24} />} 
                  size="lg" 
                  variant="light" 
                  color="gray" 
                  onClick={handleHistory}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 h-20 rounded-2xl text-sm font-semibold"
                >
                  {t('workSession.actions.history')}
                </Button>
                <Button 
                  leftSection={<IconFileDownload size={24} />} 
                  size="lg" 
                  variant="light" 
                  color="gray" 
                  onClick={handlePDF}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 h-20 rounded-2xl text-sm font-semibold"
                >
                  {t('workSession.actions.pdf')}
                </Button>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>

      <BottomNavigation />

      <ManualRegisterModal
        open={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
    </div>
  )
} 
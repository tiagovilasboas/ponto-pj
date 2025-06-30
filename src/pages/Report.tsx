import { useState, useEffect } from 'react'
import { Container, Stack, Card, Text, Badge, Group, Select, Button, Grid } from '@mantine/core'
import { IconCalendar, IconClock, IconDownload, IconChartBar } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppStore } from '@/hooks/useAppStore'
import { AppHeader } from '@/components/common/AppHeader'
import { BottomNavigation } from '@/components/common/BottomNavigation'
import { workSessionService } from '@/services'
import { generatePDF } from '@/lib/pdfGenerator'
import { getMonthOptionsThisYear, getCurrentMonth, formatDateForDisplay, formatMonthForDisplay } from '@/lib/utils'
import type { WorkSession } from '@/types/workSession'

export const Report = () => {
  const { t } = useTranslation()
  const { formatTime, formatWorkedHours } = useAppStore()
  const [sessions, setSessions] = useState<WorkSession[]>([])
  const [loading, setLoading] = useState(false)
  const monthOptions = getMonthOptionsThisYear()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [statistics, setStatistics] = useState({
    totalHours: 0,
    completeDays: 0,
    incompleteDays: 0,
    totalDays: 0
  })

  useEffect(() => {
    loadReport()
  }, [selectedMonth])

  const loadReport = async () => {
    setLoading(true)
    try {
      const [sessionsData, statsData] = await Promise.all([
        workSessionService.getSessionsForMonth(selectedMonth),
        workSessionService.getMonthStatistics(selectedMonth)
      ])
      setSessions(sessionsData)
      setStatistics(statsData)
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('relatorio.loadError'),
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      const monthLabel = formatMonthForDisplay(selectedMonth)

      const pdfData = {
        month: monthLabel,
        stats: {
          totalHours: statistics.totalHours,
          completeDays: statistics.completeDays,
          incompleteDays: statistics.incompleteDays
        },
        sessions: sessions.map(session => ({
          date: formatDateForDisplay(session.date),
          entry: session.start_time ? formatTime(session.start_time) : '-',
          exit: session.end_time ? formatTime(session.end_time) : '-',
          netTime: session.worked_time_real ? formatWorkedHours(session.worked_time_real) : '-',
          status: session.status === 'completa' ? t('relatorio.complete') : 
                  session.status === 'incompleta' ? t('relatorio.incomplete') : t('relatorio.noRecord')
        }))
      }

      generatePDF(pdfData)
      notifications.show({
        title: t('app.success'),
        message: t('relatorio.exportSuccess'),
        color: 'green',
      })
    } catch {
      notifications.show({
        title: t('app.error'),
        message: t('relatorio.exportError'),
        color: 'red',
      })
    }
  }

  const getStatusBadge = (session: WorkSession) => {
    const color = session.status === 'completa' ? 'green' : session.status === 'incompleta' ? 'yellow' : 'gray'
    const label = session.status === 'completa' ? t('relatorio.complete') : 
                  session.status === 'incompleta' ? t('relatorio.incomplete') : t('relatorio.noRecord')
    
    return <Badge color={color} size="sm">{label}</Badge>
  }



  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader 
        title={t('relatorio.title')} 
        showBack={true}
        subtitle={t('relatorio.selectMonth')}
      />
      
      <Container size="sm" py="md">
        <Stack gap="lg">
          {/* Month Selector */}
          <Card withBorder p="lg" className="bg-white">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <IconCalendar size={20} className="text-blue-600" />
                <Text fw={600}>{t('relatorio.selectMonth')}</Text>
              </Group>
              <Select
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value || selectedMonth)}
                data={monthOptions}
                size="sm"
                w={180}
                searchable
              />
            </Group>
          </Card>

          {/* Statistics */}
          <Card withBorder p="lg" className="bg-white">
            <Group gap="sm" mb="md">
              <IconChartBar size={20} className="text-purple-600" />
              <Text fw={600}>{t('relatorio.statistics')}</Text>
            </Group>
            
            <Grid gutter="md">
              <Grid.Col span={6}>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Text size="2xl" fw={700} c="blue.6">
                    {formatWorkedHours(statistics.totalHours)}
                  </Text>
                  <Text size="sm" c="gray.6">
                    {t('relatorio.totalHours')}
                  </Text>
                </div>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Text size="2xl" fw={700} c="green.6">
                    {statistics.completeDays}
                  </Text>
                  <Text size="sm" c="gray.6">
                    {t('relatorio.completeDays')}
                  </Text>
                </div>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Text size="2xl" fw={700} c="yellow.6">
                    {statistics.incompleteDays}
                  </Text>
                  <Text size="sm" c="gray.6">
                    {t('relatorio.incompleteDays')}
                  </Text>
                </div>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Text size="2xl" fw={700} c="gray.6">
                    {statistics.totalDays}
                  </Text>
                  <Text size="sm" c="gray.6">
                    Total
                  </Text>
                </div>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Export Button */}
          <Card withBorder p="lg" className="bg-white">
            <Button
              fullWidth
              size="lg"
              leftSection={<IconDownload size={20} />}
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {t('relatorio.exportPDF')}
            </Button>
          </Card>

          {/* Sessions List */}
          <Card withBorder p="lg" className="bg-white">
            {loading ? (
              <div className="text-center py-8">
                <Text c="gray.6">{t('app.loading')}</Text>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <IconClock size={48} className="text-gray-400 mx-auto mb-4" />
                <Text c="gray.6">{t('relatorio.noSessions')}</Text>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <Group justify="space-between" align="flex-start" mb="sm">
                      <div>
                        <Text fw={600} size="sm">
                          {formatDateForDisplay(session.date)}
                        </Text>
                        <Text size="xs" c="gray.6">
                          {session.manual_edit && t('workSession.status.manualEdit')}
                        </Text>
                      </div>
                      {getStatusBadge(session)}
                    </Group>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Text size="xs" c="gray.6" mb="xs">{t('relatorio.entry')}</Text>
                        <Text fw={500}>
                          {session.start_time ? formatTime(session.start_time) : '-'}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="gray.6" mb="xs">{t('relatorio.exit')}</Text>
                        <Text fw={500}>
                          {session.end_time ? formatTime(session.end_time) : '-'}
                        </Text>
                      </div>
                    </div>
                    
                    {session.worked_time_real && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Text size="xs" c="gray.6" mb="xs">{t('relatorio.netTime')}</Text>
                        <Text fw={600} c="blue.6">
                          {formatWorkedHours(session.worked_time_real)}
                        </Text>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Stack>
      </Container>

      <BottomNavigation />
    </div>
  )
} 
import { Container, Stack, Card, Text, Badge, Group, Select, Button, Grid } from '@mantine/core'
import { IconCalendar, IconClock, IconDownload, IconChartBar } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useAppStore } from '@/hooks/useAppStore'
import { AppHeader } from '@/components/common/AppHeader'
import { BottomNavigation } from '@/components/common/BottomNavigation'
import { generatePDF } from '@/lib/pdfGenerator'
import { formatMonthForDisplay } from '@/lib/utils'
import { SessionRecordCard } from '../components/common/SessionRecordCard'
import { useReportSessions } from '../hooks/useReportSessions'
import type { WorkSession } from '@/types/workSession'

export const Report = () => {
  const {
    sessions,
    loading,
    monthOptions,
    selectedMonth,
    setSelectedMonth,
    statistics,
    formatDateWithWeekday,
    formatWorkedHours,
    t,
  } = useReportSessions()
  const { formatTime } = useAppStore()

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
          date: formatDateWithWeekday(session.date),
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
      
      <Container size="sm" py="sm">
        <Stack gap="sm">
          {/* Month Selector */}
          <Card withBorder p="sm" className="bg-white">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <IconCalendar size={16} className="text-blue-600" />
                <Text fw={600} size="sm">{t('relatorio.selectMonth')}</Text>
              </Group>
              <Select
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value || selectedMonth)}
                data={monthOptions}
                size="xs"
                w={140}
                searchable
              />
            </Group>
          </Card>

          {/* Statistics */}
          <Card withBorder p="sm" className="bg-white">
            <Group gap="sm" mb="sm">
              <IconChartBar size={16} className="text-purple-600" />
              <Text fw={600} size="sm">{t('relatorio.statistics')}</Text>
            </Group>
            
            <Grid gutter="sm">
              <Grid.Col span={6}>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Text size="lg" fw={700} c="blue.6">
                    {formatWorkedHours(statistics.totalHours)}
                  </Text>
                  <Text size="xs" c="gray.6">
                    {t('relatorio.totalHours')}
                  </Text>
                </div>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Text size="lg" fw={700} c="green.6">
                    {statistics.completeDays}
                  </Text>
                  <Text size="xs" c="gray.6">
                    {t('relatorio.completeDays')}
                  </Text>
                </div>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Text size="lg" fw={700} c="yellow.6">
                    {statistics.incompleteDays}
                  </Text>
                  <Text size="xs" c="gray.6">
                    {t('relatorio.incompleteDays')}
                  </Text>
                </div>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Text size="lg" fw={700} c="gray.6">
                    {statistics.totalDays}
                  </Text>
                  <Text size="xs" c="gray.6">
                    Total
                  </Text>
                </div>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Export Button */}
          <Card withBorder p="sm" className="bg-white">
            <Button
              fullWidth
              size="md"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {t('relatorio.exportPDF')}
            </Button>
          </Card>

          {/* Sessions List - Same layout as History */}
          <Card withBorder p="sm" className="bg-white">
            {loading ? (
              <div className="text-center py-4">
                <Text c="gray.6" size="sm">{t('app.loading')}</Text>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-4">
                <IconClock size={24} className="text-gray-400 mx-auto mb-2" />
                <Text c="gray.6" size="sm">{t('relatorio.noSessions')}</Text>
              </div>
            ) : (
              <>
                {/* Sessions Count */}
                <div className="mb-3 pb-2 border-b border-gray-100">
                  <Text size="xs" c="gray.6">
                    {t('historico.showing')} {sessions.length} {t('historico.of')} {sessions.length} {t('historico.records')}
                  </Text>
                </div>

                <div className="space-y-1">
                  {sessions.map((session) => (
                    <SessionRecordCard
                      key={session.id}
                      date={formatDateWithWeekday(session.date)}
                      status={(session.status as 'completa' | 'incompleta' | 'pendente') || 'pendente'}
                      statusLabel={getStatusBadge(session).props.children}
                      manualEdit={!!session.manual_edit}
                      manualEditLabel={session.manual_edit ? t('workSession.status.manualEdit') : undefined}
                      startTime={session.start_time ? formatTime(session.start_time) : '-'}
                      endTime={session.end_time ? formatTime(session.end_time) : '-'}
                      netTime={session.worked_time_real ? formatWorkedHours(session.worked_time_real) : '-'}
                    />
                  ))}
                </div>
              </>
            )}
          </Card>
        </Stack>
      </Container>

      <BottomNavigation />
    </div>
  )
} 
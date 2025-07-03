import { Container, Stack, Badge, Card } from '@mantine/core';
import { useAppStore } from '@/hooks/useAppStore';
import { AppHeader } from '@/components/common/AppHeader';
import { BottomNavigation } from '@/components/common/BottomNavigation';
import { MonthSelector } from '@/components/common/MonthSelector';
import { SessionsList } from '@/components/common/SessionsList';
import { StatisticsGrid } from '@/components/common/StatisticsGrid';
import { ExportButton } from '@/components/common/ExportButton';
import type { WorkSession } from '@/types/workSession';
import { useReportSessions } from '../hooks/useReportSessions';

export const Report = () => {
  const {
    sessions,
    loading,
    currentPage,
    totalPages,
    monthOptions,
    selectedMonth,
    setSelectedMonth,
    statistics,
    handlePageChange,
    formatDateWithWeekday,
    formatWorkedHours,
    t,
  } = useReportSessions();
  const { formatTime } = useAppStore();

  // Export PDF function
  const handleExportPDF = async () => {
    // TODO: Implement export functionality
    console.log('Export PDF for month:', selectedMonth);
  };

  const getStatusBadge = (session: WorkSession) => {
    const color =
      session.status === 'completa'
        ? 'green'
        : session.status === 'incompleta'
          ? 'yellow'
          : 'gray';
    const label =
      session.status === 'completa'
        ? t('relatorio.complete')
        : session.status === 'incompleta'
          ? t('relatorio.incomplete')
          : t('relatorio.noRecord');
    return (
      <Badge color={color} size='xs'>
        {label}
      </Badge>
    );
  };

  return (
    <div data-testid='report-page' className='min-h-screen bg-gray-50 pb-20'>
      <AppHeader
        title={t('relatorio.title')}
        showBack={true}
        subtitle={t('relatorio.selectMonth')}
      />

      <Container data-testid='report-container' size='sm' py='sm'>
        <Stack gap='sm'>
          <MonthSelector
            selectedMonth={selectedMonth}
            monthOptions={monthOptions}
            onMonthChange={setSelectedMonth}
            title={t('relatorio.selectMonth')}
            testId='month-selector'
          />

          <StatisticsGrid
            statistics={statistics}
            formatWorkedHours={formatWorkedHours}
            t={t}
            testId='statistics-card'
          />

          <Card
            data-testid='export-card'
            withBorder
            p='sm'
            className='bg-white'
          >
            <ExportButton
              onExport={handleExportPDF}
              loading={false}
              disabled={false}
              t={t}
              testId='export-pdf-button'
            />
          </Card>

          <SessionsList
            sessions={sessions}
            loading={loading}
            totalSessions={sessions.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEditSession={() => {}} // Report doesn't allow editing
            onDeleteSession={() => {}} // Report doesn't allow deleting
            formatDateWithWeekday={formatDateWithWeekday}
            formatWorkedHours={formatWorkedHours}
            formatTime={formatTime}
            getStatusBadge={getStatusBadge}
            t={t}
            testId='sessions-list'
          />
        </Stack>
      </Container>

      <BottomNavigation />
    </div>
  );
};

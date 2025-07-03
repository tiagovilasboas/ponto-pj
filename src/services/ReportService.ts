import { notifications } from '@mantine/notifications';
import { workSessionService } from './workSessions';
import { SessionStatisticsService } from './SessionStatisticsService';
import type { WorkSession } from '@/types/workSession';

export interface ReportData {
  sessions: WorkSession[];
  totalPages: number;
  total: number;
  statistics: {
    totalHours: number;
    completeDays: number;
    incompleteDays: number;
    totalDays: number;
  };
}

export class ReportService {
  /**
   * Loads complete report data for a specific month
   */
  static async loadReportData(
    month: string,
    page: number,
    onError: (message: string) => void
  ): Promise<ReportData | null> {
    try {
      const [sessionsResponse, statsResponse] = await Promise.all([
        workSessionService.getSessionsForMonth(month, page),
        workSessionService.getMonthStatistics(month),
      ]);

      return {
        sessions: sessionsResponse.sessions,
        totalPages: sessionsResponse.totalPages,
        total: sessionsResponse.total,
        statistics: statsResponse,
      };
    } catch {
      onError('relatorio.loadError');
      return null;
    }
  }

  /**
   * Calculates additional statistics for sessions
   */
  static calculateAdditionalStats(sessions: WorkSession[]) {
    const baseStats = SessionStatisticsService.calculateStatistics(sessions);
    const completionRate = SessionStatisticsService.getCompletionRate(sessions);
    const workingDays = SessionStatisticsService.getWorkingDays(sessions);

    return {
      ...baseStats,
      completionRate,
      workingDays,
    };
  }

  /**
   * Validates report data integrity
   */
  static validateReportData(data: ReportData): boolean {
    if (!data.sessions || !Array.isArray(data.sessions)) return false;
    if (typeof data.totalPages !== 'number' || data.totalPages < 0)
      return false;
    if (typeof data.total !== 'number' || data.total < 0) return false;
    if (!data.statistics || typeof data.statistics !== 'object') return false;

    return true;
  }

  /**
   * Shows notification with translation key
   */
  static showNotification(
    type: 'success' | 'error',
    titleKey: string,
    messageKey: string,
    t: (key: string) => string
  ): void {
    notifications.show({
      title: t(titleKey),
      message: t(messageKey),
      color: type === 'success' ? 'green' : 'red',
    });
  }

  /**
   * Formats report data for export
   */
  static formatReportForExport(data: ReportData, month: string) {
    return {
      month,
      totalSessions: data.total,
      sessions: data.sessions,
      statistics: data.statistics,
      generatedAt: new Date().toISOString(),
    };
  }
}

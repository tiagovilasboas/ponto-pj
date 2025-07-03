import type { WorkSession } from '@/types/workSession';

export interface SessionStatistics {
  totalHours: number;
  completeDays: number;
  incompleteDays: number;
  totalDays: number;
  averageHoursPerDay: number;
}

export class SessionStatisticsService {
  /**
   * Calculates statistics from a set of work sessions
   */
  static calculateStatistics(sessions: WorkSession[]): SessionStatistics {
    const totalHours = sessions.reduce((sum, session) => {
      return sum + (session.worked_time_real || 0);
    }, 0);

    const completeDays = sessions.filter(s => s.status === 'completa').length;
    const incompleteDays = sessions.filter(
      s => s.status === 'incompleta'
    ).length;
    const totalDays = sessions.length;

    return {
      totalHours,
      completeDays,
      incompleteDays,
      totalDays,
      averageHoursPerDay: totalDays > 0 ? totalHours / totalDays : 0,
    };
  }

  /**
   * Gets completion rate percentage
   */
  static getCompletionRate(sessions: WorkSession[]): number {
    if (sessions.length === 0) return 0;
    const completeSessions = sessions.filter(
      s => s.status === 'completa'
    ).length;
    return (completeSessions / sessions.length) * 100;
  }

  /**
   * Gets total working days in a period
   */
  static getWorkingDays(sessions: WorkSession[]): number {
    return sessions.filter(s => s.start_time).length;
  }
}

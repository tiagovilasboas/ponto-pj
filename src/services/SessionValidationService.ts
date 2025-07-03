import type { WorkSession } from '@/types/workSession';

export class SessionValidationService {
  /**
   * Validates if a session is complete
   */
  static isSessionComplete(session: WorkSession): boolean {
    return (
      session.status === 'completa' &&
      !!session.start_time &&
      !!session.end_time &&
      !!session.worked_time_real
    );
  }

  /**
   * Validates if a session is incomplete
   */
  static isSessionIncomplete(session: WorkSession): boolean {
    return (
      session.status === 'incompleta' &&
      !!session.start_time &&
      !session.end_time
    );
  }

  /**
   * Determines session status based on data
   */
  static determineSessionStatus(
    startTime?: string,
    endTime?: string,
    workedTime?: number
  ): 'sem_registro' | 'completa' | 'incompleta' {
    if (!startTime) return 'sem_registro';
    if (startTime && endTime && workedTime) return 'completa';
    return 'incompleta';
  }

  /**
   * Validates session times
   */
  static validateSessionTimes(startTime: string, endTime: string): boolean {
    if (!startTime || !endTime) return false;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    return end > start;
  }

  /**
   * Validates session data integrity
   */
  static validateSessionData(session: WorkSession): boolean {
    if (!session.date || !session.user_id) return false;

    if (session.start_time && session.end_time) {
      return this.validateSessionTimes(session.start_time, session.end_time);
    }

    return true;
  }
}

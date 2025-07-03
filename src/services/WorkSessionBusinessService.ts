import { calculateWorkedHours, getMonthDateRange } from '@/lib/utils';
import { SessionValidationService } from './SessionValidationService';

export interface CreateSessionData {
  user_id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  worked_time_real?: number;
  status: 'sem_registro' | 'completa' | 'incompleta';
  manual_edit: boolean;
}

export class WorkSessionBusinessService {
  /**
   * Calculates worked time between two times
   */
  static calculateWorkedTime(startTime: string, endTime: string): number {
    return calculateWorkedHours(startTime, endTime);
  }

  /**
   * Gets month date range
   */
  static getMonthDateRange(month: string) {
    return getMonthDateRange(month);
  }

  /**
   * Formats data for session creation
   */
  static formatCreateData(
    userId: string,
    date: string,
    startTime?: string,
    endTime?: string,
    manualEdit = false
  ): CreateSessionData {
    const workedTime =
      startTime && endTime
        ? this.calculateWorkedTime(startTime, endTime)
        : undefined;

    const status = SessionValidationService.determineSessionStatus(
      startTime,
      endTime,
      workedTime
    );

    return {
      user_id: userId,
      date,
      start_time: startTime,
      end_time: endTime,
      worked_time_real: workedTime,
      status,
      manual_edit: manualEdit,
    };
  }

  /**
   * Creates session data for clock in
   */
  static createClockInData(
    userId: string,
    date: string,
    startTime: string
  ): CreateSessionData {
    return this.formatCreateData(userId, date, startTime, undefined, false);
  }

  /**
   * Creates session data for clock out
   */
  static createClockOutData(
    userId: string,
    date: string,
    startTime: string,
    endTime: string
  ): CreateSessionData {
    return this.formatCreateData(userId, date, startTime, endTime, false);
  }

  /**
   * Creates session data for manual edit
   */
  static createManualEditData(
    userId: string,
    date: string,
    startTime: string,
    endTime: string
  ): CreateSessionData {
    return this.formatCreateData(userId, date, startTime, endTime, true);
  }
}

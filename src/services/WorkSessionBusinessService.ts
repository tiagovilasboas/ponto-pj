import { calculateWorkedHours, getMonthDateRange } from '@/lib/utils';
import type { WorkSession } from '@/types/workSession';

export interface SessionStatistics {
  totalHours: number;
  completeDays: number;
  incompleteDays: number;
  totalDays: number;
  averageHoursPerDay: number;
}

export class WorkSessionBusinessService {
  /**
   * Calcula estatísticas de um conjunto de sessões
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
   * Calcula tempo trabalhado entre dois horários
   */
  static calculateWorkedTime(startTime: string, endTime: string): number {
    return calculateWorkedHours(startTime, endTime);
  }

  /**
   * Obtém range de datas do mês
   */
  static getMonthDateRange(month: string) {
    return getMonthDateRange(month);
  }

  /**
   * Valida se uma sessão está completa
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
   * Valida se uma sessão está incompleta
   */
  static isSessionIncomplete(session: WorkSession): boolean {
    return (
      session.status === 'incompleta' &&
      !!session.start_time &&
      !session.end_time
    );
  }

  /**
   * Determina o status de uma sessão baseado nos dados
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
   * Formata dados para criação de sessão
   */
  static formatCreateData(
    userId: string,
    date: string,
    startTime?: string,
    endTime?: string,
    manualEdit = false
  ) {
    const workedTime =
      startTime && endTime
        ? this.calculateWorkedTime(startTime, endTime)
        : undefined;

    const status = this.determineSessionStatus(startTime, endTime, workedTime);

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
}

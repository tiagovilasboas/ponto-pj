import { notifications } from '@mantine/notifications';
import { workSessionService } from './workSessions';
import type { WorkSession } from '@/types/workSession';

export interface HistorySessionData {
  sessions: WorkSession[];
  totalPages: number;
  total: number;
}

export interface EditSessionData {
  startTime: string;
  endTime: string;
}

export class HistoryService {
  /**
   * Loads sessions for a specific month with pagination
   */
  static async loadSessionsForMonth(
    month: string,
    page: number,
    onError: (message: string) => void
  ): Promise<HistorySessionData | null> {
    try {
      const response = await workSessionService.getSessionsForMonth(
        month,
        page
      );
      return response;
    } catch {
      onError('historico.loadError');
      return null;
    }
  }

  /**
   * Validates session times before saving
   */
  static validateSessionTimes(startTime: string, endTime: string): boolean {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return end > start;
  }

  /**
   * Updates a session with new times
   */
  static async updateSession(
    sessionDate: string,
    editData: EditSessionData,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ): Promise<boolean> {
    if (!this.validateSessionTimes(editData.startTime, editData.endTime)) {
      onError('historico.invalidTimes');
      return false;
    }

    try {
      await workSessionService.updateSession(sessionDate, {
        start_time: editData.startTime,
        end_time: editData.endTime,
        manual_edit: true,
      });
      onSuccess('historico.editSuccess');
      return true;
    } catch {
      onError('historico.editError');
      return false;
    }
  }

  /**
   * Deletes a session
   */
  static async deleteSession(
    sessionDate: string,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ): Promise<boolean> {
    try {
      await workSessionService.deleteSession(sessionDate);
      onSuccess('historico.deleteSuccess');
      return true;
    } catch {
      onError('historico.deleteError');
      return false;
    }
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
}

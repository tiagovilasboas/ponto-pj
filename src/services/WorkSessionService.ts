import { workSessionRepository } from '@/repositories/WorkSessionRepository';
import { WorkSessionBusinessService } from './WorkSessionBusinessService';
import type { WorkSession } from '@/types/workSession';

export interface SessionUpdates {
  start_time?: string;
  end_time?: string;
  worked_time_real?: number;
  status?: 'sem_registro' | 'completa' | 'incompleta';
  manual_edit?: boolean;
}

export class WorkSessionService {
  /**
   * Retorna o registro do dia especificado
   */
  async getSessionByDate(date: string): Promise<WorkSession | null> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();
      return await workSessionRepository.findByUserAndDate(userId, date);
    } catch (error) {
      console.error('Erro ao buscar sessão por data:', error);
      throw error;
    }
  }

  /**
   * Insere ou atualiza o start_time para o dia especificado
   */
  async startSession(date: string, time: string): Promise<WorkSession> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();

      const createData = WorkSessionBusinessService.formatCreateData(
        userId,
        date,
        time,
        undefined,
        false
      );

      return await workSessionRepository.upsert(createData);
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      throw error;
    }
  }

  /**
   * Atualiza o end_time, calcula worked_time_real e define status
   */
  async endSession(date: string, time: string): Promise<WorkSession> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();

      // Buscar sessão atual para calcular o tempo trabalhado
      const currentSession = await workSessionRepository.findByUserAndDate(
        userId,
        date
      );
      if (!currentSession || !currentSession.start_time) {
        throw new Error('Sessão não encontrada ou sem horário de início');
      }

      // Calcular tempo trabalhado usando business service
      const workedHours = WorkSessionBusinessService.calculateWorkedTime(
        currentSession.start_time,
        time
      );

      const updates: SessionUpdates = {
        end_time: time,
        worked_time_real: workedHours,
        status: 'completa',
      };

      return await workSessionRepository.update(userId, date, updates);
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      throw error;
    }
  }

  /**
   * Insere registro manual com manual_edit = true
   */
  async manualRegister(
    date: string,
    start: string,
    end: string
  ): Promise<WorkSession> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();

      const createData = WorkSessionBusinessService.formatCreateData(
        userId,
        date,
        start,
        end,
        true
      );

      return await workSessionRepository.upsert(createData);
    } catch (error) {
      console.error('Erro ao registrar manualmente:', error);
      throw error;
    }
  }

  /**
   * Atualiza qualquer campo da jornada
   */
  async updateSession(
    date: string,
    updates: SessionUpdates
  ): Promise<WorkSession> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();
      return await workSessionRepository.update(userId, date, updates);
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      throw error;
    }
  }

  /**
   * Retorna todos os registros do usuário no mês selecionado com paginação
   */
  async getSessionsForMonth(
    month: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    sessions: WorkSession[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();

      // Usar business service para obter range de datas do mês
      const { startDate, endDate } =
        WorkSessionBusinessService.getMonthDateRange(month);

      const { data: sessions, total } =
        await workSessionRepository.findByUserAndPeriodPaginated(
          userId,
          startDate,
          endDate,
          page,
          limit
        );

      const totalPages = Math.ceil(total / limit);

      return {
        sessions,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error('Erro ao buscar sessões do mês:', error);
      throw error;
    }
  }

  /**
   * Retorna estatísticas do mês
   */
  async getMonthStatistics(month: string): Promise<{
    totalHours: number;
    completeDays: number;
    incompleteDays: number;
    totalDays: number;
    averageHoursPerDay: number;
  }> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();

      const { startDate, endDate } =
        WorkSessionBusinessService.getMonthDateRange(month);
      const sessions = await workSessionRepository.findByUserAndPeriod(
        userId,
        startDate,
        endDate
      );

      return WorkSessionBusinessService.calculateStatistics(sessions);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do mês:', error);
      throw error;
    }
  }

  /**
   * Deleta uma sessão
   */
  async deleteSession(date: string): Promise<void> {
    try {
      const userId = await workSessionRepository.getCurrentUserId();
      await workSessionRepository.delete(userId, date);
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      throw error;
    }
  }
}

// Instância singleton do service
export const workSessionService = new WorkSessionService();

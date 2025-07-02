import { supabase } from '@/lib/supabaseClient';
import { getMonthDateRange, calculateWorkedHours } from '@/lib/utils';
import type { WorkSession } from '@/types/workSession';

interface SessionUpdates {
  start_time?: string;
  end_time?: string;
  worked_time_real?: number;
  status?: 'sem_registro' | 'completa' | 'incompleta';
  manual_edit?: boolean;
}

export class WorkSessionService {
  private async getUserId(): Promise<string> {
    const response = await supabase.auth.getUser();
    if (!response.data?.user) {
      throw new Error('Usuário não autenticado');
    }
    return response.data.user.id;
  }

  /**
   * Retorna o registro do dia especificado
   */
  async getSessionByDate(date: string): Promise<WorkSession | null> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await supabase
        .from('work_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw new Error(error.message);
      }

      return data || null;
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
      const userId = await this.getUserId();

      const { data, error } = await supabase
        .from('work_sessions')
        .upsert(
          {
            user_id: userId,
            date,
            start_time: time,
            status: 'incompleta',
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,date',
          }
        )
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      throw error;
    }
  }

  /**
   * Atualiza o end_time, calcula worked_time_real (desconta 1h) e define status
   */
  async endSession(date: string, time: string): Promise<WorkSession> {
    try {
      const userId = await this.getUserId();

      // Buscar sessão atual para calcular o tempo trabalhado
      const currentSession = await this.getSessionByDate(date);
      if (!currentSession || !currentSession.start_time) {
        throw new Error('Sessão não encontrada ou sem horário de início');
      }

      // Calcular tempo trabalhado usando função utilitária
      const workedHours = calculateWorkedHours(currentSession.start_time, time);

      const { data, error } = await supabase
        .from('work_sessions')
        .update({
          end_time: time,
          worked_time_real: workedHours,
          status: 'completa',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('date', date)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
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
      const userId = await this.getUserId();

      // Calcular tempo trabalhado usando função utilitária
      const workedHours = calculateWorkedHours(start, end);

      const { data, error } = await supabase
        .from('work_sessions')
        .upsert(
          {
            user_id: userId,
            date,
            start_time: start,
            end_time: end,
            worked_time_real: workedHours,
            status: 'completa',
            manual_edit: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,date',
          }
        )
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
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
      const userId = await this.getUserId();

      const { data, error } = await supabase
        .from('work_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('date', date)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
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
      const userId = await this.getUserId();

      // Usar utilitário para obter range de datas do mês
      const { startDate, endDate } = getMonthDateRange(month);

      // Primeiro, contar o total de registros
      const { count, error: countError } = await supabase
        .from('work_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (countError) {
        throw new Error(countError.message);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;

      // Buscar registros paginados com query mais explícita
      const { data, error } = await supabase
        .from('work_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false }) // Mais novos primeiro
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(error.message);
      }

      return {
        sessions: data || [],
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
   * Calcula estatísticas do mês
   */
  async getMonthStatistics(month: string): Promise<{
    totalHours: number;
    completeDays: number;
    incompleteDays: number;
    totalDays: number;
  }> {
    try {
      const { sessions } = await this.getSessionsForMonth(month, 1, 1000); // Buscar todas as sessões para estatísticas

      let totalHours = 0;
      let completeDays = 0;
      let incompleteDays = 0;

      sessions.forEach(session => {
        if (session.worked_time_real) {
          totalHours += session.worked_time_real;
        }

        if (session.status === 'completa') {
          completeDays++;
        } else if (session.status === 'incompleta') {
          incompleteDays++;
        }
      });

      return {
        totalHours,
        completeDays,
        incompleteDays,
        totalDays: sessions.length,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do mês:', error);
      throw error;
    }
  }

  /**
   * Deleta o registro do dia especificado
   */
  async deleteSession(date: string): Promise<void> {
    try {
      const userId = await this.getUserId();
      const { error } = await supabase
        .from('work_sessions')
        .delete()
        .eq('user_id', userId)
        .eq('date', date);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      throw error;
    }
  }
}

// Instância singleton do serviço
export const workSessionService = new WorkSessionService();

/*
EXEMPLOS DE USO:

// Buscar sessão do dia atual
const today = new Date().toISOString().split('T')[0]
const session = await workSessionService.getSessionByDate(today)

// Iniciar jornada
const now = new Date().toLocaleTimeString('pt-BR', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: false 
})
await workSessionService.startSession(today, now)

// Encerrar jornada
await workSessionService.endSession(today, now)

// Registro manual
await workSessionService.manualRegister(today, '08:00', '18:00')

// Atualizar sessão
await workSessionService.updateSession(today, {
  start_time: '09:00',
  end_time: '17:00',
  manual_edit: true
})

// Buscar sessões do mês
const sessions = await workSessionService.getSessionsForMonth('2024-01')

// Estatísticas do mês
const stats = await workSessionService.getMonthStatistics('2024-01')
*/

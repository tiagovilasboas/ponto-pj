import { supabase } from '@/lib/supabaseClient'
import type { WorkSession } from '@/types/workSession'

export interface CreateWorkSessionData {
  user_id: string
  date: string
  start_time?: string
  end_time?: string
  worked_time_real?: number
  status: 'sem_registro' | 'completa' | 'incompleta'
  manual_edit?: boolean
}

export interface UpdateWorkSessionData {
  start_time?: string
  end_time?: string
  worked_time_real?: number
  status?: 'sem_registro' | 'completa' | 'incompleta'
  manual_edit?: boolean
}

export class WorkSessionRepository {
  private tableName = 'work_sessions'

  // Buscar sessão de trabalho do dia atual
  async findByUserAndDate(userId: string, date: string): Promise<WorkSession | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Erro ao buscar sessão: ${error.message}`)
    }

    return data
  }

  // Criar nova sessão
  async create(data: CreateWorkSessionData): Promise<WorkSession> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar sessão: ${error.message}`)
    }

    return result
  }

  // Atualizar sessão existente
  async update(userId: string, date: string, data: UpdateWorkSessionData): Promise<WorkSession> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('user_id', userId)
      .eq('date', date)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar sessão: ${error.message}`)
    }

    return result
  }

  // Criar ou atualizar sessão (upsert)
  async upsert(data: CreateWorkSessionData): Promise<WorkSession> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .upsert(data, {
        onConflict: 'user_id,date'
      })
      .select()
      .single()

    if (error) {
      // Tratar erro específico de constraint única
      if (error.message.includes('there is no unique or exclusion constraint matching the ON CONFLICT specification')) {
        throw new Error('database.constraintError')
      }
      throw new Error(`Erro ao criar/atualizar sessão: ${error.message}`)
    }

    return result
  }

  // Buscar todas as sessões de um usuário
  async findByUser(userId: string, limit = 30): Promise<WorkSession[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Erro ao buscar sessões: ${error.message}`)
    }

    return data || []
  }

  // Buscar sessões por período
  async findByUserAndPeriod(userId: string, startDate: string, endDate: string): Promise<WorkSession[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar sessões por período: ${error.message}`)
    }

    return data || []
  }

  // Deletar sessão
  async delete(userId: string, date: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      throw new Error(`Erro ao deletar sessão: ${error.message}`)
    }
  }
}

// Instância singleton do repository
export const workSessionRepository = new WorkSessionRepository() 
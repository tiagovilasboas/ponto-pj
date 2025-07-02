import { CachedRepository } from './CachedRepository';
import { WorkSessionValidator } from '@/lib/validation';
import type { WorkSession } from '@/types/workSession';

export interface CreateWorkSessionData {
  user_id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  worked_time_real?: number;
  status: 'sem_registro' | 'completa' | 'incompleta';
  manual_edit?: boolean;
}

export interface UpdateWorkSessionData {
  start_time?: string;
  end_time?: string;
  worked_time_real?: number;
  status?: 'sem_registro' | 'completa' | 'incompleta';
  manual_edit?: boolean;
}

export class WorkSessionRepository extends CachedRepository {
  protected tableName = 'work_sessions';

  // Buscar sessão de trabalho do dia atual
  async findByUserAndDate(
    userId: string,
    date: string
  ): Promise<WorkSession | null> {
    const cacheKey = this.generateCacheKey('session', userId, date);

    return this.getCached(
      cacheKey,
      async () => {
        const { data, error } = await this.getSupabase()
          .from(this.tableName)
          .select('*')
          .eq('user_id', userId)
          .eq('date', date)
          .single();

        if (error && error.code !== 'PGRST116') {
          this.handleError(error, 'findByUserAndDate');
        }

        return data;
      },
      { ttl: 2 * 60 * 1000 }
    ); // 2 minutos para sessões atuais
  }

  // Criar nova sessão
  async create(data: CreateWorkSessionData): Promise<WorkSession> {
    // Validar dados de entrada
    const validation = WorkSessionValidator.validateCreateData(data);
    if (!validation.isValid) {
      throw new Error(`validation.error: ${validation.errors.join(', ')}`);
    }

    const { data: result, error } = await this.getSupabase()
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'create');
    }

    // Invalidar cache relacionado ao usuário
    this.invalidateCacheByPattern(`session:${data.user_id}`);
    this.invalidateCacheByPattern(`sessions:${data.user_id}`);

    return result!;
  }

  // Atualizar sessão existente
  async update(
    userId: string,
    date: string,
    data: UpdateWorkSessionData
  ): Promise<WorkSession> {
    // Validar dados de entrada
    const validation = WorkSessionValidator.validateUpdateData(data);
    if (!validation.isValid) {
      throw new Error(`validation.error: ${validation.errors.join(', ')}`);
    }

    const { data: result, error } = await this.getSupabase()
      .from(this.tableName)
      .update(data)
      .eq('user_id', userId)
      .eq('date', date)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'update');
    }

    // Invalidar cache relacionado ao usuário
    this.invalidateCacheByPattern(`session:${userId}`);
    this.invalidateCacheByPattern(`sessions:${userId}`);

    return result!;
  }

  // Criar ou atualizar sessão (upsert)
  async upsert(data: CreateWorkSessionData): Promise<WorkSession> {
    // Validar dados de entrada
    const validation = WorkSessionValidator.validateCreateData(data);
    if (!validation.isValid) {
      throw new Error(`validation.error: ${validation.errors.join(', ')}`);
    }

    const { data: result, error } = await this.getSupabase()
      .from(this.tableName)
      .upsert(data, {
        onConflict: 'user_id,date',
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'upsert');
    }

    // Invalidar cache relacionado ao usuário
    this.invalidateCacheByPattern(`session:${data.user_id}`);
    this.invalidateCacheByPattern(`sessions:${data.user_id}`);

    return result!;
  }

  // Buscar todas as sessões de um usuário
  async findByUser(userId: string, limit = 30): Promise<WorkSession[]> {
    const cacheKey = this.generateCacheKey('sessions', userId, limit);

    return this.getCached(
      cacheKey,
      async () => {
        const { data, error } = await this.getSupabase()
          .from(this.tableName)
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(limit);

        if (error) {
          this.handleError(error, 'findByUser');
        }

        return data || [];
      },
      { ttl: 10 * 60 * 1000 }
    ); // 10 minutos para listas
  }

  // Buscar sessões por período
  async findByUserAndPeriod(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<WorkSession[]> {
    const cacheKey = this.generateCacheKey(
      'sessions_period',
      userId,
      startDate,
      endDate
    );

    return this.getCached(
      cacheKey,
      async () => {
        const { data, error } = await this.getSupabase()
          .from(this.tableName)
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false });

        if (error) {
          this.handleError(error, 'findByUserAndPeriod');
        }

        return data || [];
      },
      { ttl: 15 * 60 * 1000 }
    ); // 15 minutos para períodos
  }

  // Contar sessões por período
  async countByUserAndPeriod(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const cacheKey = this.generateCacheKey(
      'count_period',
      userId,
      startDate,
      endDate
    );

    return this.getCached(
      cacheKey,
      async () => {
        const { count, error } = await this.getSupabase()
          .from(this.tableName)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('date', startDate)
          .lte('date', endDate);

        if (error) {
          this.handleError(error, 'countByUserAndPeriod');
        }

        return count || 0;
      },
      { ttl: 15 * 60 * 1000 }
    ); // 15 minutos para contagens
  }

  // Buscar sessões paginadas
  async findByUserAndPeriodPaginated(
    userId: string,
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: WorkSession[]; total: number }> {
    const cacheKey = this.generateCacheKey(
      'sessions_paginated',
      userId,
      startDate,
      endDate,
      page,
      limit
    );

    return this.getCached(
      cacheKey,
      async () => {
        const offset = (page - 1) * limit;

        const { data, error } = await this.getSupabase()
          .from(this.tableName)
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          this.handleError(error, 'findByUserAndPeriodPaginated');
        }

        const total = await this.countByUserAndPeriod(
          userId,
          startDate,
          endDate
        );

        return {
          data: data || [],
          total,
        };
      },
      { ttl: 10 * 60 * 1000 }
    ); // 10 minutos para paginação
  }

  // Deletar sessão
  async delete(userId: string, date: string): Promise<void> {
    const { error } = await this.getSupabase()
      .from(this.tableName)
      .delete()
      .eq('user_id', userId)
      .eq('date', date);

    if (error) {
      this.handleError(error, 'delete');
    }

    // Invalidar cache relacionado ao usuário
    this.invalidateCacheByPattern(`session:${userId}`);
    this.invalidateCacheByPattern(`sessions:${userId}`);
  }
}

// Instância singleton do repository
export const workSessionRepository = new WorkSessionRepository();

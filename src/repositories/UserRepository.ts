import { BaseRepository } from './BaseRepository';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  hourly_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  id: string;
  email: string;
  full_name: string;
  hourly_rate?: number;
}

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  hourly_rate?: number;
}

export class UserRepository extends BaseRepository {
  protected tableName = 'users';

  // Buscar perfil do usuário
  async findById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.getSupabase()
      .from(this.tableName)
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findById');
    }

    return data;
  }

  // Criar perfil do usuário
  async create(data: CreateUserData): Promise<UserProfile> {
    const { data: result, error } = await this.getSupabase()
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'create');
    }

    return result!;
  }

  // Atualizar perfil do usuário
  async update(userId: string, data: UpdateUserData): Promise<UserProfile> {
    const { data: result, error } = await this.getSupabase()
      .from(this.tableName)
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'update');
    }

    return result!;
  }

  // Criar ou atualizar perfil (upsert)
  async upsert(data: CreateUserData): Promise<UserProfile> {
    const { data: result, error } = await this.getSupabase()
      .from(this.tableName)
      .upsert(data, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'upsert');
    }

    return result!;
  }

  // Deletar perfil do usuário
  async delete(userId: string): Promise<void> {
    const { error } = await this.getSupabase()
      .from(this.tableName)
      .delete()
      .eq('id', userId);

    if (error) {
      this.handleError(error, 'delete');
    }
  }
}

// Instância singleton do repository
export const userRepository = new UserRepository();

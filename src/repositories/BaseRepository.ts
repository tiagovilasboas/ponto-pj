import { supabase } from '@/lib/supabaseClient';
import type { PostgrestError } from '@supabase/supabase-js';

export abstract class BaseRepository {
  protected abstract tableName: string;

  protected handleError(
    error: PostgrestError | null,
    operation: string
  ): never {
    if (!error) {
      throw new Error(`Erro desconhecido durante ${operation}`);
    }

    // Mapear códigos de erro específicos do Supabase
    switch (error.code) {
      case 'PGRST116': // No rows returned
        throw new Error('database.notFound');
      case '23503': // Foreign key violation
        throw new Error('database.foreignKeyViolation');
      case '23505': // Unique constraint violation
        throw new Error('database.uniqueConstraintViolation');
      case '42P01': // Table doesn't exist
        throw new Error('database.tableNotFound');
      default:
        throw new Error(`database.${operation}: ${error.message}`);
    }
  }

  protected getSupabase() {
    return supabase;
  }

  public async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error('auth.userNotAuthenticated');
    }

    return user.id;
  }
}

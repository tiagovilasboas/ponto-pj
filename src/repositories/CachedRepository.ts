import { BaseRepository } from './BaseRepository';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
}

export abstract class CachedRepository extends BaseRepository {
  protected cache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();

  /**
   * Obtém dados do cache ou executa a função de busca
   */
  protected async getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cacheKey = options.key || key;
    const ttl = options.ttl || 5 * 60 * 1000; // 5 minutos por padrão

    // Verificar se existe no cache e se ainda é válido
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }

    // Buscar dados frescos
    const data = await fetcher();

    // Armazenar no cache
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    return data;
  }

  /**
   * Invalida cache por chave
   */
  public invalidateCache(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida cache por padrão (remove todas as chaves que começam com o prefixo)
   */
  public invalidateCacheByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Limpa todo o cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obtém estatísticas do cache
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Gera chave de cache baseada em parâmetros
   */
  protected generateCacheKey(prefix: string, ...params: unknown[]): string {
    return `${prefix}:${params.map(p => String(p)).join(':')}`;
  }
}

import { useCallback } from 'react';
import { workSessionRepository } from '@/repositories/WorkSessionRepository';

export function useCacheManager() {
  const clearWorkSessionCache = useCallback(() => {
    workSessionRepository.clearCache();
  }, []);

  const getWorkSessionCacheStats = useCallback(() => {
    return workSessionRepository.getCacheStats();
  }, []);

  const invalidateUserSessions = useCallback((userId: string) => {
    workSessionRepository.invalidateCacheByPattern(`session:${userId}`);
    workSessionRepository.invalidateCacheByPattern(`sessions:${userId}`);
  }, []);

  const invalidateSessionByDate = useCallback(
    (userId: string, date: string) => {
      workSessionRepository.invalidateCache(`session:${userId}:${date}`);
    },
    []
  );

  return {
    clearWorkSessionCache,
    getWorkSessionCacheStats,
    invalidateUserSessions,
    invalidateSessionByDate,
  };
}

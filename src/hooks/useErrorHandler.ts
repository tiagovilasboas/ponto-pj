import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { ErrorHandler } from '@/lib/errorHandler';

export function useErrorHandler() {
  const handleError = useCallback((error: Error | string, context?: string) => {
    // Log do erro para debugging
    ErrorHandler.logError(error, context);

    // Mapear erro para mensagem amigável
    const userMessage = ErrorHandler.mapError(error);
    const severity = ErrorHandler.getSeverity(error);

    // Mostrar notificação apenas se for amigável ao usuário
    if (ErrorHandler.isUserFriendly(error)) {
      notifications.show({
        title:
          severity === 'error'
            ? 'Erro'
            : severity === 'warning'
              ? 'Aviso'
              : 'Informação',
        message: userMessage,
        color:
          severity === 'error'
            ? 'red'
            : severity === 'warning'
              ? 'yellow'
              : 'blue',
      });
    }

    return userMessage;
  }, []);

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: string
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error instanceof Error ? error : String(error), context);
        return null;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
  };
}

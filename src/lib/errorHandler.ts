export enum ErrorType {
  // Auth errors
  USER_NOT_AUTHENTICATED = 'auth.userNotAuthenticated',
  INVALID_CREDENTIALS = 'auth.invalidCredentials',
  EMAIL_NOT_CONFIRMED = 'auth.emailNotConfirmed',

  // Database errors
  NOT_FOUND = 'database.notFound',
  FOREIGN_KEY_VIOLATION = 'database.foreignKeyViolation',
  UNIQUE_CONSTRAINT_VIOLATION = 'database.uniqueConstraintViolation',
  TABLE_NOT_FOUND = 'database.tableNotFound',

  // Business logic errors
  SESSION_NOT_FOUND = 'business.sessionNotFound',
  SESSION_ALREADY_STARTED = 'business.sessionAlreadyStarted',
  SESSION_NOT_STARTED = 'business.sessionNotStarted',

  // Generic errors
  UNKNOWN_ERROR = 'generic.unknownError',
  NETWORK_ERROR = 'generic.networkError',
  VALIDATION_ERROR = 'generic.validationError',
}

export interface ErrorMapping {
  [key: string]: {
    message: string;
    severity: 'error' | 'warning' | 'info';
    userFriendly: boolean;
  };
}

const errorMappings: ErrorMapping = {
  [ErrorType.USER_NOT_AUTHENTICATED]: {
    message: 'Usuário não autenticado',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.INVALID_CREDENTIALS]: {
    message: 'Email ou senha incorretos',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.EMAIL_NOT_CONFIRMED]: {
    message: 'Email não confirmado. Verifique sua caixa de entrada',
    severity: 'warning',
    userFriendly: true,
  },
  [ErrorType.NOT_FOUND]: {
    message: 'Registro não encontrado',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.FOREIGN_KEY_VIOLATION]: {
    message:
      'Erro de configuração: Usuário não encontrado no sistema. Entre em contato com o administrador.',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.UNIQUE_CONSTRAINT_VIOLATION]: {
    message: 'Registro já existe',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.TABLE_NOT_FOUND]: {
    message: 'Erro interno do sistema',
    severity: 'error',
    userFriendly: false,
  },
  [ErrorType.SESSION_NOT_FOUND]: {
    message: 'Sessão não encontrada',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.SESSION_ALREADY_STARTED]: {
    message: 'Sessão já foi iniciada',
    severity: 'warning',
    userFriendly: true,
  },
  [ErrorType.SESSION_NOT_STARTED]: {
    message: 'Sessão não foi iniciada',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.UNKNOWN_ERROR]: {
    message: 'Erro desconhecido',
    severity: 'error',
    userFriendly: false,
  },
  [ErrorType.NETWORK_ERROR]: {
    message: 'Erro de conexão. Verifique sua internet',
    severity: 'error',
    userFriendly: true,
  },
  [ErrorType.VALIDATION_ERROR]: {
    message: 'Dados inválidos',
    severity: 'error',
    userFriendly: true,
  },
};

export class ErrorHandler {
  /**
   * Mapeia um erro para uma mensagem amigável
   */
  static mapError(error: Error | string): string {
    const errorMessage = typeof error === 'string' ? error : error.message;

    // Verificar se é um erro conhecido
    for (const [errorType, mapping] of Object.entries(errorMappings)) {
      if (errorMessage.includes(errorType) || errorMessage === errorType) {
        return mapping.message;
      }
    }

    // Verificar padrões específicos
    if (errorMessage.includes('23503')) {
      return errorMappings[ErrorType.FOREIGN_KEY_VIOLATION].message;
    }

    if (errorMessage.includes('23505')) {
      return errorMappings[ErrorType.UNIQUE_CONSTRAINT_VIOLATION].message;
    }

    if (errorMessage.includes('PGRST116')) {
      return errorMappings[ErrorType.NOT_FOUND].message;
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return errorMappings[ErrorType.NETWORK_ERROR].message;
    }

    // Retornar erro genérico se não for reconhecido
    return errorMappings[ErrorType.UNKNOWN_ERROR].message;
  }

  /**
   * Verifica se um erro é amigável ao usuário
   */
  static isUserFriendly(error: Error | string): boolean {
    const errorMessage = typeof error === 'string' ? error : error.message;

    for (const [errorType, mapping] of Object.entries(errorMappings)) {
      if (errorMessage.includes(errorType) || errorMessage === errorType) {
        return mapping.userFriendly;
      }
    }

    return false;
  }

  /**
   * Obtém a severidade de um erro
   */
  static getSeverity(error: Error | string): 'error' | 'warning' | 'info' {
    const errorMessage = typeof error === 'string' ? error : error.message;

    for (const [errorType, mapping] of Object.entries(errorMappings)) {
      if (errorMessage.includes(errorType) || errorMessage === errorType) {
        return mapping.severity;
      }
    }

    return 'error';
  }

  /**
   * Loga um erro para debugging
   */
  static logError(error: Error | string, context?: string): void {
    if (import.meta.env.DEV) {
      console.error(`[${context || 'ErrorHandler'}]`, error);
    }
  }
}

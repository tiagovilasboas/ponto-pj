export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export class Validator {
  /**
   * Valida se um valor não é nulo ou undefined
   */
  static required<T>(
    value: T | null | undefined,
    fieldName: string
  ): ValidationResult {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return {
        isValid: false,
        errors: [`${fieldName} é obrigatório`],
      };
    }
    return { isValid: true, errors: [] };
  }

  /**
   * Valida se uma string tem o comprimento mínimo
   */
  static minLength(
    value: string,
    minLength: number,
    fieldName: string
  ): ValidationResult {
    if (value.length < minLength) {
      return {
        isValid: false,
        errors: [`${fieldName} deve ter pelo menos ${minLength} caracteres`],
      };
    }
    return { isValid: true, errors: [] };
  }

  /**
   * Valida se uma string tem o comprimento máximo
   */
  static maxLength(
    value: string,
    maxLength: number,
    fieldName: string
  ): ValidationResult {
    if (value.length > maxLength) {
      return {
        isValid: false,
        errors: [`${fieldName} deve ter no máximo ${maxLength} caracteres`],
      };
    }
    return { isValid: true, errors: [] };
  }

  /**
   * Valida formato de email
   */
  static email(value: string, fieldName: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        isValid: false,
        errors: [`${fieldName} deve ser um email válido`],
      };
    }
    return { isValid: true, errors: [] };
  }

  /**
   * Valida se um número está dentro de um range
   */
  static range(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult {
    if (value < min || value > max) {
      return {
        isValid: false,
        errors: [`${fieldName} deve estar entre ${min} e ${max}`],
      };
    }
    return { isValid: true, errors: [] };
  }

  /**
   * Valida formato de data (YYYY-MM-DD)
   */
  static date(value: string, fieldName: string): ValidationResult {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return {
        isValid: false,
        errors: [`${fieldName} deve estar no formato YYYY-MM-DD`],
      };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        errors: [`${fieldName} deve ser uma data válida`],
      };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Valida formato de hora (HH:MM)
   */
  static time(value: string, fieldName: string): ValidationResult {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
      return {
        isValid: false,
        errors: [`${fieldName} deve estar no formato HH:MM`],
      };
    }
    return { isValid: true, errors: [] };
  }

  /**
   * Combina múltiplas validações
   */
  static combine(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap(result => result.errors);
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}

// Validadores específicos para WorkSession
export class WorkSessionValidator {
  static validateCreateData(data: {
    user_id?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    worked_time_real?: number;
    status?: string;
  }): ValidationResult {
    const results: ValidationResult[] = [];

    // Validar user_id
    results.push(Validator.required(data.user_id, 'ID do usuário'));

    // Validar date
    if (data.date) {
      results.push(Validator.date(data.date, 'Data'));
    }

    // Validar start_time
    if (data.start_time) {
      results.push(Validator.time(data.start_time, 'Horário de início'));
    }

    // Validar end_time
    if (data.end_time) {
      results.push(Validator.time(data.end_time, 'Horário de fim'));
    }

    // Validar worked_time_real
    if (data.worked_time_real !== undefined) {
      results.push(
        Validator.range(data.worked_time_real, 0, 24, 'Tempo trabalhado')
      );
    }

    // Validar status
    if (data.status) {
      const validStatuses = ['sem_registro', 'completa', 'incompleta'];
      if (!validStatuses.includes(data.status)) {
        results.push({
          isValid: false,
          errors: ['Status deve ser: sem_registro, completa ou incompleta'],
        });
      }
    }

    return Validator.combine(...results);
  }

  static validateUpdateData(data: {
    start_time?: string;
    end_time?: string;
    worked_time_real?: number;
    status?: string;
    manual_edit?: boolean;
  }): ValidationResult {
    const results: ValidationResult[] = [];

    // Validar start_time
    if (data.start_time) {
      results.push(Validator.time(data.start_time, 'Horário de início'));
    }

    // Validar end_time
    if (data.end_time) {
      results.push(Validator.time(data.end_time, 'Horário de fim'));
    }

    // Validar worked_time_real
    if (data.worked_time_real !== undefined) {
      results.push(
        Validator.range(data.worked_time_real, 0, 24, 'Tempo trabalhado')
      );
    }

    // Validar status
    if (data.status) {
      const validStatuses = ['sem_registro', 'completa', 'incompleta'];
      if (!validStatuses.includes(data.status)) {
        results.push({
          isValid: false,
          errors: ['Status deve ser: sem_registro, completa ou incompleta'],
        });
      }
    }

    return Validator.combine(...results);
  }
}

// Validadores específicos para User
export class UserValidator {
  static validateCreateData(data: {
    id?: string;
    email?: string;
    full_name?: string;
    hourly_rate?: number;
  }): ValidationResult {
    const results: ValidationResult[] = [];

    // Validar id
    results.push(Validator.required(data.id, 'ID do usuário'));

    // Validar email
    if (data.email) {
      results.push(Validator.email(data.email, 'Email'));
      results.push(Validator.maxLength(data.email, 255, 'Email'));
    }

    // Validar full_name
    if (data.full_name) {
      results.push(Validator.minLength(data.full_name, 2, 'Nome completo'));
      results.push(Validator.maxLength(data.full_name, 100, 'Nome completo'));
    }

    // Validar hourly_rate
    if (data.hourly_rate !== undefined) {
      results.push(Validator.range(data.hourly_rate, 0, 10000, 'Taxa horária'));
    }

    return Validator.combine(...results);
  }

  static validateUpdateData(data: {
    email?: string;
    full_name?: string;
    hourly_rate?: number;
  }): ValidationResult {
    const results: ValidationResult[] = [];

    // Validar email
    if (data.email) {
      results.push(Validator.email(data.email, 'Email'));
      results.push(Validator.maxLength(data.email, 255, 'Email'));
    }

    // Validar full_name
    if (data.full_name) {
      results.push(Validator.minLength(data.full_name, 2, 'Nome completo'));
      results.push(Validator.maxLength(data.full_name, 100, 'Nome completo'));
    }

    // Validar hourly_rate
    if (data.hourly_rate !== undefined) {
      results.push(Validator.range(data.hourly_rate, 0, 10000, 'Taxa horária'));
    }

    return Validator.combine(...results);
  }
}

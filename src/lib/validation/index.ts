// Input validation and sanitization utilities

/**
 * Validates input based on type with specific rules
 * @param input - String to validate
 * @param type - Type of validation to apply
 * @returns boolean indicating if input is valid
 */
export function validateInput(
  input: string,
  type: 'email' | 'password' | 'time' | 'date'
): boolean {
  switch (type) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input) && input.length <= 254;
    }

    case 'password': {
      // Flexible validation: minimum 6 characters
      return input.length >= 6 && input.length <= 128;
    }

    case 'time': {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(input);
    }

    case 'date': {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(input)) return false;
      const date = new Date(input);
      return (
        !isNaN(date.getTime()) &&
        date >= new Date('2020-01-01') &&
        date <= new Date('2030-12-31')
      );
    }

    default:
      return false;
  }
}

/**
 * Sanitizes input by removing dangerous characters and limiting length
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove dangerous characters
    .substring(0, 1000); // Limit size
}

/**
 * Validates if a string is in YYYY-MM format
 * @param monthString - String to validate
 * @returns boolean
 */
export function isValidMonthFormat(monthString: string): boolean {
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(monthString)) return false;

  const [year, month] = monthString.split('-').map(Number);
  return year >= 2020 && year <= 2030 && month >= 1 && month <= 12;
}

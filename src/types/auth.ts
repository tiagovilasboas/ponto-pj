export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED',
  GENERIC = 'GENERIC',
}

export function mapAuthError(message: string): AuthErrorType {
  if (/invalid login credentials/i.test(message)) return AuthErrorType.INVALID_CREDENTIALS
  if (/email not confirmed/i.test(message)) return AuthErrorType.EMAIL_NOT_CONFIRMED
  return AuthErrorType.GENERIC
} 
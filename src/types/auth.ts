export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED',
  GENERIC = 'GENERIC'
}

export const mapAuthError = (errorMessage: string): AuthErrorType => {
  if (errorMessage.includes('Invalid login credentials')) {
    return AuthErrorType.INVALID_CREDENTIALS
  }
  if (errorMessage.includes('Email not confirmed')) {
    return AuthErrorType.EMAIL_NOT_CONFIRMED
  }
  return AuthErrorType.GENERIC
} 
// Crypto utilities for secure token generation and validation

/**
 * Generates a secure session token using crypto.getRandomValues
 * @returns 64-character hexadecimal string
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates if a token has the correct format and length
 * @param token - Token to validate
 * @returns boolean indicating if token is valid
 */
export function validateSessionToken(token: string): boolean {
  return token.length === 64 && /^[a-f0-9]+$/i.test(token);
}

/**
 * Creates a hash of the input string using SHA-256
 * @param input - String to hash
 * @returns Promise<string> - Hexadecimal hash
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

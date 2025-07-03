// Security monitoring and rate limiting utilities

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

class SecurityMonitor {
  private static loginAttempts = new Map<
    string,
    { count: number; lastAttempt: number; blockedUntil?: number }
  >();
  private static sessionTokens = new Set<string>();

  // Rate limiting for login attempts
  static checkRateLimit(
    identifier: string,
    config: RateLimitConfig = {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
      blockDurationMs: 30 * 60 * 1000,
    }
  ): boolean {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier);

    if (!attempts) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if blocked
    if (attempts.blockedUntil && now < attempts.blockedUntil) {
      return false;
    }

    // Reset if window time passed
    if (now - attempts.lastAttempt > config.windowMs) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Increment attempts
    attempts.count++;
    attempts.lastAttempt = now;

    // Block if limit exceeded
    if (attempts.count >= config.maxAttempts) {
      attempts.blockedUntil = now + config.blockDurationMs;
      return false;
    }

    return true;
  }

  // Security event logging
  static logSecurityEvent(
    event: string,
    details: Record<string, unknown> = {}
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.warn('Security Event:', logEntry);

    // In production, send to logging service
    if (import.meta.env.PROD) {
      // TODO: Implement logging service integration
      // this.sendToLoggingService(logEntry)
    }
  }

  // Secure environment check
  static isSecureEnvironment(): boolean {
    return (
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost'
    );
  }

  // Suspicious activity detection
  static detectSuspiciousActivity(): boolean {
    // Be less restrictive in development
    if (import.meta.env.DEV) {
      return false;
    }

    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\./i,
    ];

    const currentUrl = window.location.href;
    const userInput = document.activeElement?.textContent || '';

    return suspiciousPatterns.some(
      pattern => pattern.test(currentUrl) || pattern.test(userInput)
    );
  }

  // Clear sensitive data
  static clearSensitiveData(): void {
    // Clear localStorage data
    const sensitiveKeys = ['auth_token', 'user_data', 'session_data'];
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Clear rate limiting
    this.loginAttempts.clear();
    this.sessionTokens.clear();
  }

  // Session integrity validation
  static validateSessionIntegrity(): boolean {
    // Be less restrictive in development
    if (import.meta.env.DEV) {
      return true;
    }

    // Check if token is still valid
    const token = localStorage.getItem('supabase.auth.token');
    if (!token) return false;

    try {
      const parsed = JSON.parse(token);
      const expiresAt = parsed.expires_at * 1000;
      return Date.now() < expiresAt;
    } catch {
      return false;
    }
  }
}

export { SecurityMonitor };

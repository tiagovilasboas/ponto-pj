// Utilitários de segurança para o aplicativo

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs: number
}

class SecurityUtils {
  private static loginAttempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>()
  private static sessionTokens = new Set<string>()

  // Rate limiting para tentativas de login
  static checkRateLimit(identifier: string, config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }): boolean {
    const now = Date.now()
    const attempts = this.loginAttempts.get(identifier)

    if (!attempts) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now })
      return true
    }

    // Verificar se está bloqueado
    if (attempts.blockedUntil && now < attempts.blockedUntil) {
      return false
    }

    // Resetar se passou o tempo da janela
    if (now - attempts.lastAttempt > config.windowMs) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now })
      return true
    }

    // Incrementar tentativas
    attempts.count++
    attempts.lastAttempt = now

    // Bloquear se excedeu o limite
    if (attempts.count >= config.maxAttempts) {
      attempts.blockedUntil = now + config.blockDurationMs
      return false
    }

    return true
  }

  // Validação de entrada de dados
  static validateInput(input: string, type: 'email' | 'password' | 'time' | 'date'): boolean {
    switch (type) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(input) && input.length <= 254
      }

      case 'password': {
        // Mínimo 8 caracteres, pelo menos 1 letra e 1 número
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
        return passwordRegex.test(input) && input.length <= 128
      }

      case 'time': {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        return timeRegex.test(input)
      }

      case 'date': {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(input)) return false
        const date = new Date(input)
        return !isNaN(date.getTime()) && date >= new Date('2020-01-01') && date <= new Date('2030-12-31')
      }

      default:
        return false
    }
  }

  // Sanitização de dados
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove caracteres perigosos
      .substring(0, 1000) // Limita tamanho
  }

  // Geração de token de sessão seguro
  static generateSessionToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Verificação de token de sessão
  static validateSessionToken(token: string): boolean {
    return token.length === 64 && /^[a-f0-9]+$/i.test(token)
  }

  // Log de eventos de segurança
  static logSecurityEvent(event: string, details: Record<string, unknown> = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    console.warn('Security Event:', logEntry)
    
    // Em produção, enviar para serviço de logging
    if (import.meta.env.PROD) {
      // TODO: Implementar envio para serviço de logging
      // this.sendToLoggingService(logEntry)
    }
  }

  // Verificação de ambiente seguro
  static isSecureEnvironment(): boolean {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  }

  // Detecção de atividade suspeita
  static detectSuspiciousActivity(): boolean {
    // Em desenvolvimento, ser menos restritivo
    if (import.meta.env.DEV) {
      return false
    }

    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\./i
    ]

    const currentUrl = window.location.href
    const userInput = document.activeElement?.textContent || ''

    return suspiciousPatterns.some(pattern => 
      pattern.test(currentUrl) || pattern.test(userInput)
    )
  }

  // Limpeza de dados sensíveis
  static clearSensitiveData(): void {
    // Limpar dados do localStorage
    const sensitiveKeys = ['auth_token', 'user_data', 'session_data']
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })

    // Limpar rate limiting
    this.loginAttempts.clear()
    this.sessionTokens.clear()
  }

  // Verificação de integridade da sessão
  static validateSessionIntegrity(): boolean {
    // Em desenvolvimento, ser menos restritivo
    if (import.meta.env.DEV) {
      return true
    }

    // Verificar se o token ainda é válido
    const token = localStorage.getItem('supabase.auth.token')
    if (!token) return false

    try {
      const parsed = JSON.parse(token)
      const expiresAt = parsed.expires_at * 1000
      return Date.now() < expiresAt
    } catch {
      return false
    }
  }
}

export { SecurityUtils } 
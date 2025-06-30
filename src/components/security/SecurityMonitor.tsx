import { useEffect, useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { SecurityUtils } from '@/lib/security'
import { useAppStore } from '@/hooks/useAppStore'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'

export const SecurityMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const { logout } = useAppStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSecurityViolation = useCallback(async (message: string) => {
    setIsMonitoring(false)
    
    // Log do evento
    SecurityUtils.logSecurityEvent('security_violation', { message })
    
    // Notificar o usuário
    notifications.show({
      title: t('security.alertTitle'),
      message,
      color: 'red',
      autoClose: false,
    })

    // Limpar dados sensíveis
    SecurityUtils.clearSensitiveData()
    
    // Fazer logout
    try {
      await logout()
    } catch (error) {
      console.error(t('auth.logoutError'), error)
    }
    
    // Redirecionar para login
    navigate('/login', { replace: true })
  }, [logout, navigate, t])

  useEffect(() => {
    // Em desenvolvimento, desabilitar monitoramento agressivo
    if (import.meta.env.DEV) {
      return
    }

    if (!isMonitoring) return

    // Verificar integridade da sessão a cada 5 minutos
    const sessionCheckInterval = setInterval(() => {
      if (!SecurityUtils.validateSessionIntegrity()) {
        SecurityUtils.logSecurityEvent('session_integrity_failed')
        handleSecurityViolation(t('session_integrity_failed'))
      }
    }, 5 * 60 * 1000)

    // Detectar atividade suspeita
    const suspiciousActivityCheck = setInterval(() => {
      if (SecurityUtils.detectSuspiciousActivity()) {
        SecurityUtils.logSecurityEvent('suspicious_activity_detected')
        handleSecurityViolation(t('suspicious_activity_detected'))
      }
    }, 10 * 1000)

    // Verificar se o usuário está inativo por muito tempo (30 minutos)
    let inactivityTimer: NodeJS.Timeout
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        SecurityUtils.logSecurityEvent('user_inactivity_timeout')
        handleSecurityViolation(t('user_inactivity_timeout'))
      }, 30 * 60 * 1000)
    }

    // Eventos para resetar o timer de inatividade
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true)
    })

    resetInactivityTimer()

    // Verificar mudanças na URL (possível XSS)
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      const newUrl = args[2] as string
      if (newUrl && SecurityUtils.detectSuspiciousActivity()) {
        SecurityUtils.logSecurityEvent('suspicious_url_change', { url: newUrl })
        handleSecurityViolation(t('suspicious_url_change'))
        return
      }
      return originalPushState.apply(history, args)
    }

    history.replaceState = function(...args) {
      const newUrl = args[2] as string
      if (newUrl && SecurityUtils.detectSuspiciousActivity()) {
        SecurityUtils.logSecurityEvent('suspicious_url_replace', { url: newUrl })
        handleSecurityViolation(t('suspicious_url_replace'))
        return
      }
      return originalReplaceState.apply(history, args)
    }

    // Cleanup
    return () => {
      clearInterval(sessionCheckInterval)
      clearInterval(suspiciousActivityCheck)
      clearTimeout(inactivityTimer)
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true)
      })
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [isMonitoring, t, handleSecurityViolation])

  // Componente invisível - apenas monitora
  return null
} 
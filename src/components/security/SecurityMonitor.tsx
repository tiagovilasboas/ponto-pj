import { useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { SecurityUtils } from '@/lib/security'
import { useAppStore } from '@/hooks/useAppStore'
import { useNavigate } from 'react-router-dom'

export const SecurityMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const { logout } = useAppStore()
  const navigate = useNavigate()

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
        handleSecurityViolation('Sessão inválida detectada')
      }
    }, 5 * 60 * 1000)

    // Detectar atividade suspeita
    const suspiciousActivityCheck = setInterval(() => {
      if (SecurityUtils.detectSuspiciousActivity()) {
        SecurityUtils.logSecurityEvent('suspicious_activity_detected')
        handleSecurityViolation('Atividade suspeita detectada')
      }
    }, 10 * 1000)

    // Verificar se o usuário está inativo por muito tempo (30 minutos)
    let inactivityTimer: NodeJS.Timeout
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        SecurityUtils.logSecurityEvent('user_inactivity_timeout')
        handleSecurityViolation('Sessão expirada por inatividade')
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
        handleSecurityViolation('Mudança suspeita na URL detectada')
        return
      }
      return originalPushState.apply(history, args)
    }

    history.replaceState = function(...args) {
      const newUrl = args[2] as string
      if (newUrl && SecurityUtils.detectSuspiciousActivity()) {
        SecurityUtils.logSecurityEvent('suspicious_url_replace', { url: newUrl })
        handleSecurityViolation('Substituição suspeita na URL detectada')
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
  }, [isMonitoring])

  const handleSecurityViolation = async (message: string) => {
    setIsMonitoring(false)
    
    // Log do evento
    SecurityUtils.logSecurityEvent('security_violation', { message })
    
    // Notificar o usuário
    notifications.show({
      title: 'Alerta de Segurança',
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
      console.error('Erro ao fazer logout:', error)
    }
    
    // Redirecionar para login
    navigate('/login', { replace: true })
  }

  // Componente invisível - apenas monitora
  return null
} 
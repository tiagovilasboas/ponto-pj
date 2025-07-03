import { useEffect, useState, useCallback } from 'react';
import { SecurityMonitor } from '@/lib/security';
import { useTranslation } from '@/i18n/useTranslation';

interface SecurityViolation {
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

export const useSecurityMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [violations, setViolations] = useState<SecurityViolation[]>([]);
  const { t } = useTranslation();

  const logViolation = useCallback(
    (type: string, message: string, data?: Record<string, unknown>) => {
      const violation: SecurityViolation = { type, message, data };
      setViolations(prev => [...prev, violation]);

      // Log do evento
      SecurityMonitor.logSecurityEvent(type, data);
    },
    []
  );

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    // Em desenvolvimento, desabilitar monitoramento agressivo
    if (import.meta.env.DEV) {
      return;
    }

    if (!isMonitoring) return;

    // Verificar integridade da sessão a cada 5 minutos
    const sessionCheckInterval = setInterval(
      () => {
        if (!SecurityMonitor.validateSessionIntegrity()) {
          logViolation(
            'session_integrity_failed',
            t('security.session_integrity_failed')
          );
        }
      },
      5 * 60 * 1000
    );

    // Detectar atividade suspeita
    const suspiciousActivityCheck = setInterval(() => {
      if (SecurityMonitor.detectSuspiciousActivity()) {
        logViolation(
          'suspicious_activity_detected',
          t('security.suspicious_activity_detected')
        );
      }
    }, 10 * 1000);

    // Verificar se o usuário está inativo por muito tempo (30 minutos)
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(
        () => {
          logViolation(
            'user_inactivity_timeout',
            t('security.user_inactivity_timeout')
          );
        },
        30 * 60 * 1000
      );
    };

    // Eventos para resetar o timer de inatividade
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    resetInactivityTimer();

    // Verificar mudanças na URL (possível XSS)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const newUrl = args[2] as string;
      if (newUrl && SecurityMonitor.detectSuspiciousActivity()) {
        logViolation(
          'suspicious_url_change',
          t('security.suspicious_url_change'),
          { url: newUrl }
        );
        return;
      }
      return originalPushState.apply(history, args);
    };

    history.replaceState = function (...args) {
      const newUrl = args[2] as string;
      if (newUrl && SecurityMonitor.detectSuspiciousActivity()) {
        logViolation(
          'suspicious_url_replace',
          t('security.suspicious_url_replace'),
          { url: newUrl }
        );
        return;
      }
      return originalReplaceState.apply(history, args);
    };

    // Cleanup
    return () => {
      clearInterval(sessionCheckInterval);
      clearInterval(suspiciousActivityCheck);
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isMonitoring, t, logViolation]);

  return {
    violations,
    isMonitoring,
    stopMonitoring,
    logViolation,
  };
};

import { useEffect } from 'react';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { useAppStoreWithAuth } from '@/hooks/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { notificationService } from '@/services/notifications';
import { SecurityUtils } from '@/lib/security';

export const SecurityMonitor = () => {
  const { violations, stopMonitoring } = useSecurityMonitor();
  const { logout } = useAppStoreWithAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (violations.length === 0) return;

    const handleSecurityViolation = async (message: string) => {
      // Parar monitoramento
      stopMonitoring();

      // Notificar o usuário
      notificationService.show({
        title: t('security.alertTitle'),
        message,
        type: 'error',
        autoClose: 0,
      });

      // Limpar dados sensíveis
      SecurityUtils.clearSensitiveData();

      // Fazer logout
      try {
        await logout();
      } catch (error) {
        console.error(t('auth.logoutError'), error);
      }

      // Redirecionar para login
      navigate('/login', { replace: true });
    };

    // Processar a violação mais recente
    const latestViolation = violations[violations.length - 1];
    handleSecurityViolation(latestViolation.message);
  }, [violations, stopMonitoring, logout, navigate, t]);

  // Componente invisível - apenas monitora
  return null;
};

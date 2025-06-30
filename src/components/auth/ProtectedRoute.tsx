import { Navigate } from 'react-router-dom'
import { Center, Text, Loader } from '@mantine/core'
import { useAppStore } from '@/hooks/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAppStore()
  const { t } = useTranslation()

  // Se ainda está carregando, mostra loading
  if (loading) {
    return (
      <Center h="100vh">
        <div style={{ textAlign: 'center' }}>
          <Loader size="lg" mb="md" />
          <Text c="gray.6">{t('app.loading')}</Text>
        </div>
      </Center>
    )
  }

  // Se não há usuário, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Se há usuário, mostra o conteúdo protegido
  return <>{children}</>
} 
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Center, Loader, Text } from '@mantine/core'
import { useAppStoreWithAuth } from '@/hooks/useAppStore'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, authLoading } = useAppStoreWithAuth()

  if (authLoading) {
    return (
      <Center h='100vh' className='bg-gradient-to-br from-blue-50 to-indigo-50'>
        <div className='text-center'>
          <Loader size='lg' color='blue' className='mb-4' />
          <Text size='lg' c='dimmed'>
            Carregando...
          </Text>
        </div>
      </Center>
    )
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return <>{children}</>
} 
import { Group, Title, ActionIcon, Text } from '@mantine/core'
import { IconArrowLeft, IconLogout } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/hooks/useAppStore'
import { useTranslation } from '../../i18n/useTranslation'
import { Logo } from './Logo'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'

interface AppHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  showLogout?: boolean
  subtitle?: string
}

export const AppHeader = ({ 
  title, 
  showBack = false, 
  onBack, 
  showLogout = true,
  subtitle 
}: AppHeaderProps) => {
  const navigate = useNavigate()
  const { logout } = useAppStore()
  const { t } = useTranslation()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error(t('auth.logoutError'), error)
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <Group justify="space-between" align="center">
        <Group gap="sm">
          {showBack && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handleBack}
              className="text-gray-600 hover:bg-gray-100"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          )}
          <Group gap="sm" align="center">
            <Logo size={32} />
            {title && (
              <div>
                <Title order={1} size="h5" className="text-gray-900 font-semibold">
                  {title}
                </Title>
                {subtitle && (
                  <Text size="sm" c="gray.6" className="mt-1">
                    {subtitle}
                  </Text>
                )}
              </div>
            )}
          </Group>
        </Group>
        <Group gap="xs">
          <LanguageSwitcher />
          {showLogout && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handleLogout}
              className="text-gray-600 hover:bg-red-50 hover:text-red-600"
              title={t('home.logout')}
            >
              <IconLogout size={20} />
            </ActionIcon>
          )}
        </Group>
      </Group>
    </div>
  )
} 
import { ActionIcon, Group, Text } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'

export const LanguageSwitcher = () => {
  const { changeLanguage, isPortuguese } = useTranslation()

  const handleLanguageChange = () => {
    const newLanguage = isPortuguese ? 'en-US' : 'pt-BR'
    changeLanguage(newLanguage)
  }

  return (
    <Group gap="xs">
      <ActionIcon
        variant="light"
        color="blue"
        size="sm"
        onClick={handleLanguageChange}
        aria-label={isPortuguese ? 'Switch to English' : 'Mudar para Português'}
      >
        <IconLanguage size={16} />
      </ActionIcon>
      <Text size="xs" c="gray.6">
        {isPortuguese ? 'PT' : 'EN'}
      </Text>
    </Group>
  )
} 
import { useState } from 'react'
import { ActionIcon, Menu, Text } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
import i18n from '@/i18n'

export const LanguageSwitcher = () => {
  const [opened, setOpened] = useState(false)
  const { t } = useTranslation()
  const currentLanguage = i18n.language

  const languages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' }
  ]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setOpened(false)
  }



  return (
    <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          variant="light"
          size="lg"
          aria-label={t('app.language') || 'Change language'}
        >
          <IconLanguage size={20} aria-hidden="true" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown aria-labelledby="language-switcher-label">
        <Menu.Label id="language-switcher-label">{t('app.language') || 'Language'}</Menu.Label>
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            leftSection={<span>{language.flag}</span>}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguage === language.code ? 'bg-blue-50' : ''}
          >
            <Text size="sm">{language.name}</Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
} 
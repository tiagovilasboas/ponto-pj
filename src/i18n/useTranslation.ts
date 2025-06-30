import { useTranslation as useI18nTranslation } from 'react-i18next'

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation()

  const changeLanguage = (language: 'pt-BR' | 'en-US') => {
    i18n.changeLanguage(language)
  }

  const currentLanguage = i18n.language

  return {
    t,
    changeLanguage,
    currentLanguage,
    isPortuguese: currentLanguage === 'pt-BR',
    isEnglish: currentLanguage === 'en-US'
  }
} 
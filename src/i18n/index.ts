import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Importar arquivos de tradução
import ptBR from './locales/pt-BR.json'
import enUS from './locales/en-US.json'

const resources = {
  'pt-BR': {
    translation: ptBR
  },
  'en-US': {
    translation: enUS
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React já escapa valores por padrão
    },
    
    detection: {
      // Ordem de detecção de idioma
      order: ['navigator', 'localStorage', 'cookie', 'htmlTag'],
      
      // Chave para localStorage
      lookupLocalStorage: 'i18nextLng',
      
      // Chave para cookie
      lookupCookie: 'i18nextLng',
      
      // Cache do idioma detectado
      caches: ['localStorage', 'cookie'],
    }
  })

export default i18n 
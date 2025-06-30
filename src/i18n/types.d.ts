import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: Record<string, string>
    }
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: Record<string, string>
    }
  }
}

declare module 'i18next-browser-languagedetector' {
  const LanguageDetector: unknown
  export default LanguageDetector
} 
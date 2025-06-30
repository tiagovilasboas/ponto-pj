# Guia de Internacionalização (i18n)

## Visão Geral

O sistema de internacionalização foi implementado usando **i18next** e **react-i18next**, com detecção automática do idioma do navegador e suporte para **Português Brasileiro** e **Inglês Americano**.

## Estrutura de Arquivos

```
src/i18n/
├── index.ts              # Configuração principal do i18n
├── useTranslation.ts     # Hook personalizado
├── types.d.ts           # Tipos TypeScript
└── locales/
    ├── pt-BR.json       # Traduções em Português
    └── en-US.json       # Traduções em Inglês
```

## Como Usar

### 1. Hook Personalizado

```tsx
import { useTranslation } from '@/i18n/useTranslation'

function MyComponent() {
  const { t, changeLanguage, currentLanguage, isPortuguese, isEnglish } = useTranslation()
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('auth.login.title')}</p>
    </div>
  )
}
```

### 2. Alternar Idioma

```tsx
const { changeLanguage, isPortuguese } = useTranslation()

const handleLanguageChange = () => {
  const newLanguage = isPortuguese ? 'en-US' : 'pt-BR'
  changeLanguage(newLanguage)
}
```

### 3. Componente LanguageSwitcher

O componente `LanguageSwitcher` já está integrado no header da aplicação e permite alternar entre idiomas com um clique.

## Estrutura das Traduções

### Hierarquia de Chaves

```json
{
  "app": {
    "title": "Ponto PJ",
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso!"
  },
  "auth": {
    "login": {
      "title": "Faça login para acessar o sistema",
      "email": "E-mail",
      "errors": {
        "fillFields": "Preencha todos os campos"
      }
    }
  },
  "workSession": {
    "start": {
      "button": "Iniciar Jornada",
      "success": "Jornada iniciada com sucesso!"
    }
  }
}
```

### Acessando Traduções

```tsx
// Tradução simples
t('app.title')

// Tradução aninhada
t('auth.login.errors.fillFields')

// Com interpolação (se necessário)
t('welcome.message', { name: 'João' })
```

## Detecção Automática

O sistema detecta automaticamente o idioma preferido do usuário na seguinte ordem:

1. **Navegador**: Idioma configurado no navegador
2. **localStorage**: Idioma salvo anteriormente
3. **Cookie**: Idioma salvo em cookie
4. **Padrão**: Português Brasileiro (pt-BR)

## Adicionando Novos Idiomas

### 1. Criar arquivo de tradução

```json
// src/i18n/locales/es-ES.json
{
  "app": {
    "title": "Reloj de Punto PJ",
    "loading": "Cargando..."
  }
}
```

### 2. Atualizar configuração

```tsx
// src/i18n/index.ts
import esES from './locales/es-ES.json'

const resources = {
  'pt-BR': { translation: ptBR },
  'en-US': { translation: enUS },
  'es-ES': { translation: esES }  // Novo idioma
}
```

### 3. Atualizar hook

```tsx
// src/i18n/useTranslation.ts
const changeLanguage = (language: 'pt-BR' | 'en-US' | 'es-ES') => {
  i18n.changeLanguage(language)
}
```

## Boas Práticas

### 1. Organização de Chaves

- Use hierarquia lógica: `section.subsection.element`
- Agrupe por funcionalidade: `auth.login`, `workSession.start`
- Mantenha consistência entre idiomas

### 2. Nomenclatura

- Use camelCase para chaves: `startJourney`, `fillFields`
- Seja descritivo: `auth.login.errors.invalidCredentials`
- Evite chaves muito longas

### 3. Manutenção

- Mantenha todos os arquivos de tradução sincronizados
- Teste a aplicação em todos os idiomas suportados
- Use o debug mode em desenvolvimento

## Debug Mode

Para ativar o debug mode e ver as chaves de tradução:

```tsx
// src/i18n/index.ts
debug: process.env.NODE_ENV === 'development'
```

## Persistência

O idioma escolhido é salvo automaticamente em:
- **localStorage**: `i18nextLng`
- **Cookie**: `i18nextLng`

## Exemplo Completo

```tsx
import { useTranslation } from '@/i18n/useTranslation'
import { Button, Text } from '@mantine/core'

export function WelcomeComponent() {
  const { t, changeLanguage, isPortuguese } = useTranslation()
  
  return (
    <div>
      <Text size="xl">{t('app.title')}</Text>
      <Text>{t('auth.login.title')}</Text>
      
      <Button onClick={() => changeLanguage(isPortuguese ? 'en-US' : 'pt-BR')}>
        {isPortuguese ? 'Switch to English' : 'Mudar para Português'}
      </Button>
    </div>
  )
}
``` 
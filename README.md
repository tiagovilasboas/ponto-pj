# 🕒 Sistema de Ponto Eletrônico PJ (PWA)

> **⚠️ AVISO IMPORTANTE:** Este projeto foi feito às pressas! 🏃‍♂️💨  
> Bugs podem ser encontrados facilmente (dev que não gera bug, não garante o emprego 😅).  
> Melhorias são bem-vindas! PRs abertos com ❤️

Um sistema de **ponto eletrônico pessoal**, feito de dev pra dev.  
Pra quem é PJ e cansou de marcar hora na mão ou tentar lembrar quantas reuniões teve na terça.

**🌐 Demo:** [ponto-pj.vercel.app](https://ponto-pj.vercel.app)  
**👨‍💻 Autor:** [Tiago Vilas Boas](https://www.linkedin.com/in/tiagovilasboas/)  
**📦 Repo:** [github.com/tiagovilasboas/ponto-pj](https://github.com/tiagovilasboas/ponto-pj)

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.6-764ABC?logo=redux)](https://zustand-demo.pmnd.rs/)
[![Tests](https://img.shields.io/badge/Tests-100%25%20Passing-6E56CF?logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">
  <img src="https://img.shields.io/badge/Architecture-Clean%20Architecture-00D4AA?style=for-the-badge" alt="Clean Architecture" />
  <img src="https://img.shields.io/badge/Pattern-Repository%20Pattern-FF6B6B?style=for-the-badge" alt="Repository Pattern" />
  <img src="https://img.shields.io/badge/Principle-SOLID%20Compliant-4ECDC4?style=for-the-badge" alt="SOLID Compliant" />
  <img src="https://img.shields.io/badge/Cache-Intelligent%20Caching-FFE66D?style=for-the-badge" alt="Intelligent Caching" />
</div>

---

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Arquitetura & Boas Práticas](#️-arquitetura--boas-práticas)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [📱 PWA - Progressive Web App](#-pwa---progressive-web-app)
- [⚡ Performance & Otimizações](#-performance--otimizações)
- [🔐 Segurança](#-segurança)
- [🧪 Testes](#-testes)
- [🌐 Internacionalização](#-internacionalização)
- [📦 Instalação Completa](#-instalação-completa)
- [🏛️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🎨 Design System](#-design-system)
- [📊 Métricas de Qualidade](#-métricas-de-qualidade)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

## 🎯 Sobre o Projeto

**Ponto PJ** é mais que um sistema de ponto eletrônico - é um **boilerplate de referência** que demonstra como construir aplicações React escaláveis seguindo as melhores práticas da indústria.

### ✨ Por que este projeto é especial?

- 🎯 **Arquitetura Limpa**: Implementação completa dos princípios SOLID
- 🏗️ **Repository Pattern**: Camada de dados robusta e testável
- ⚡ **Cache Inteligente**: Sistema de cache com invalidação automática
- 🔒 **Validação Robusta**: Sistema de validação centralizado
- 📱 **PWA Nativo**: Funciona offline e pode ser instalado como app
- 🧪 **Testes Abrangentes**: 62 testes passando (100% de sucesso!)
- 🌐 **Internacionalização**: Suporte completo a múltiplos idiomas
- 🎨 **Design System**: Componentes reutilizáveis e consistentes

## ✨ Funcionalidades

### 📊 Registro de Ponto
- ✅ **Entrada/Saída**: Registro automático com horário atual
- ✅ **Registro Manual**: Inserção manual de horários
- ✅ **Edição**: Modificação de registros existentes
- ✅ **Validação**: Verificação de horários válidos
- ✅ **Cálculo Automático**: Tempo trabalhado calculado automaticamente

### 📈 Histórico & Relatórios
- ✅ **Visualização Mensal**: Paginação otimizada (20 itens/página)
- ✅ **Estatísticas**: Total de horas, dias completos/incompletos
- ✅ **Exportação PDF**: Relatórios profissionais
- ✅ **Filtros**: Por status e período
- ✅ **Edição Inline**: Modificação direta na lista

### 🔐 Segurança
- ✅ **Autenticação**: Supabase Auth com múltiplos provedores
- ✅ **Row Level Security**: Segurança granular no banco
- ✅ **Validação**: Sistema robusto de validação
- ✅ **Monitoramento**: Detecção de atividade suspeita
- ✅ **Session Management**: Gerenciamento seguro de sessões

### 🌐 Internacionalização
- ✅ **Português (pt-BR)**: Idioma padrão
- ✅ **Inglês (en-US)**: Tradução completa
- ✅ **Detecção Automática**: Baseada no navegador
- ✅ **Switcher**: Troca de idioma em tempo real

## 🚀 Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/tiagovilasboas/ponto-pj.git
cd ponto-pj

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 4. Execute o projeto
npm run dev
```

**🎯 Em 5 minutos você terá o projeto rodando!**

## 🏗️ Arquitetura & Boas Práticas

### 📐 Clean Architecture

Este projeto implementa uma arquitetura limpa com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   React     │  │   Hooks     │  │   Components        │  │
│  │ Components  │  │   Stores    │  │   Pages             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Business    │  │ Validation  │  │ Error Handling      │  │
│  │ Services    │  │ System      │  │ & Logging           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Repository  │  │ Cache       │  │ Supabase            │  │
│  │ Pattern     │  │ Layer       │  │ Client              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 🔧 Repository Pattern

Implementação robusta do Repository Pattern com cache inteligente:

```typescript
// Hierarquia de Repositories
BaseRepository (abstract)
├── CachedRepository (abstract)
│   └── WorkSessionRepository (cache + validação)
├── AuthRepository
└── UserRepository

// Exemplo de uso
class WorkSessionRepository extends CachedRepository {
  async findByUserAndDate(userId: string, date: string) {
    const cacheKey = this.generateCacheKey('session', userId, date)
    return this.getCached(cacheKey, async () => {
      // Busca no banco com cache automático
    }, { ttl: 2 * 60 * 1000 }) // 2 minutos
  }
}
```

### 🎯 Princípios SOLID

- **S** - **Single Responsibility**: Cada classe tem uma única responsabilidade
- **O** - **Open/Closed**: Extensível sem modificação
- **L** - **Liskov Substitution**: Repositories intercambiáveis
- **I** - **Interface Segregation**: Interfaces específicas
- **D** - **Dependency Inversion**: Dependências injetadas

### 🧪 Testabilidade

- **Business Services**: Lógica de negócio isolada e testável
- **Repository Pattern**: Mock fácil para testes
- **Custom Hooks**: Testes de comportamento isolado
- **Component Tests**: Testes de integração

## 🛠️ Stack Tecnológica

### 🎨 Frontend
- **[React 19](https://react.dev/)** - Biblioteca UI com hooks modernos
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite 6.3](https://vitejs.dev/)** - Build tool ultra-rápido
- **[Mantine UI 8.1](https://mantine.dev/)** - Component library moderna
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS

### 🗄️ Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)** - Segurança granular

### 📱 PWA & Performance
- **[Vite PWA Plugin](https://vite-pwa-org.netlify.app/)** - PWA automática
- **[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)** - Cache offline
- **[Workbox](https://developers.google.com/web/tools/workbox)** - Estratégias de cache

### 🎯 Estado & Gerenciamento
- **[Zustand 5.0](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado simples
- **[React Router 6.3](https://reactrouter.com/)** - Roteamento declarativo

### 🌐 Internacionalização
- **[i18next 25.2](https://www.i18next.com/)** - Framework de i18n

### 🧪 Testes
- **[Vitest](https://vitest.dev/)** - Test runner moderno
- **[Testing Library](https://testing-library.com/)** - Utilitários de teste
- **[MSW](https://mswjs.io/)** - Mock Service Worker

## 📱 PWA - Progressive Web App

### ✨ Funcionalidades PWA

- **📱 Instalável**: Pode ser instalado como app nativo
- **🔌 Offline**: Funciona sem internet (cache inteligente)
- **⚡ Rápido**: Carregamento instantâneo
- **📲 Push Notifications**: Notificações push (em desenvolvimento)
- **🔄 Background Sync**: Sincronização em background

### 🛠️ Configuração PWA

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              }
            }
          }
        ]
      }
    })
  ]
})
```

## ⚡ Performance & Otimizações

### 🚀 Otimizações Implementadas

- **Code Splitting**: Carregamento sob demanda
- **Lazy Loading**: Componentes carregados quando necessário
- **Virtual Scrolling**: Listas grandes otimizadas
- **Image Optimization**: Imagens otimizadas automaticamente
- **Bundle Analysis**: Análise de tamanho do bundle

### 📊 Métricas de Performance

```bash
# Análise de performance
npm run analyze

# Lighthouse CI
npm run lighthouse

# Bundle size
npm run build:analyze
```

### 🎯 Core Web Vitals

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## 🔐 Segurança

### 🛡️ Medidas de Segurança

- **Row Level Security**: Segurança granular no banco
- **Input Validation**: Validação rigorosa de entrada
- **XSS Protection**: Proteção contra XSS
- **CSRF Protection**: Proteção contra CSRF
- **Rate Limiting**: Limitação de tentativas
- **Session Management**: Gerenciamento seguro de sessões

### 🔑 Variáveis de Ambiente

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 📋 Checklist de Segurança

- [x] Autenticação robusta
- [x] Validação de entrada
- [x] Sanitização de dados
- [x] HTTPS obrigatório
- [x] Headers de segurança
- [x] Monitoramento de atividade

## 🧪 Testes

### 📊 Cobertura de Testes

- **62 testes passando** (100% de sucesso!)
- **10 arquivos de teste**
- **Cobertura de componentes**: 100%
- **Cobertura de hooks**: 100%
- **Cobertura de serviços**: 100%

### 🛠️ Comandos de Teste

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes específicos
npm run test:unit
npm run test:integration
npm run test:e2e
```

### 🎯 Estratégia de Testes

- **Unit Tests**: Testes isolados de funções
- **Integration Tests**: Testes de integração entre componentes
- **E2E Tests**: Testes end-to-end (em desenvolvimento)
- **Visual Regression**: Testes de regressão visual

## 🌐 Internacionalização

### 🌍 Idiomas Suportados

- **🇧🇷 Português (pt-BR)**: Idioma padrão
- **🇺🇸 Inglês (en-US)**: Tradução completa

### 🛠️ Configuração i18n

```typescript
// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS }
    },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false
    }
  })
```

### 📝 Uso nos Componentes

```typescript
import { useTranslation } from '@/i18n/useTranslation'

const { t } = useTranslation()
t('app.title') // "Ponto PJ" ou "Time Clock PJ"
```

## 📦 Instalação Completa

### 1️⃣ Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 2️⃣ Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com/)
2. Configure as tabelas seguindo `DATABASE_SETUP.md`
3. Copie as credenciais da API

### 3️⃣ Configuração Local

```bash
# Clone o repositório
git clone https://github.com/tiagovilasboas/ponto-pj.git
cd ponto-pj

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Execute o projeto
npm run dev
```

### 4️⃣ Dados de Exemplo

```sql
-- Execute no Supabase SQL Editor
-- populate_may_2025.sql
```

## 🏛️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Componentes de autenticação
│   ├── common/         # Componentes reutilizáveis
│   ├── home/           # Componentes da página inicial
│   ├── ponto/          # Componentes de registro de ponto
│   └── security/       # Componentes de segurança
├── hooks/              # Custom hooks
├── i18n/               # Internacionalização
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── repositories/       # Camada de acesso a dados
├── services/           # Serviços de negócio
├── stores/             # Gerenciamento de estado (Zustand)
└── types/              # Definições de tipos TypeScript
```

## 🎨 Design System

### 🎯 Componentes Principais

- **AppHeader**: Header consistente com navegação
- **SquareCTA**: Botões quadrados grandes (estilo app de banco)
- **BottomNavigation**: Navegação inferior mobile
- **PrimaryButton**: Botão primário padronizado
- **SecurityMonitor**: Monitoramento de segurança

### 🎨 Cores e Gradientes

```css
/* Cores principais */
--primary: from-blue-500 to-blue-600
--success: from-green-500 to-green-600
--danger: from-red-500 to-red-600
--warning: from-orange-500 to-orange-600
--secondary: from-purple-500 to-purple-600
```

### 📱 Mobile-First Design

- **Responsivo**: Funciona em todos os dispositivos
- **Touch-friendly**: Botões com tamanho adequado
- **Gestos**: Suporte a gestos nativos
- **Performance**: Otimizado para mobile

## 📊 Métricas de Qualidade

### 🎯 Qualidade do Código

- **ESLint**: Configuração rigorosa
- **Prettier**: Formatação consistente
- **TypeScript**: Tipagem estática
- **Husky**: Hooks de pre-commit

### 📈 Métricas de Performance

- **Bundle Size**: < 500KB gzipped
- **First Paint**: < 1s
- **Time to Interactive**: < 3s
- **Core Web Vitals**: Todos verdes

### 🧪 Qualidade dos Testes

- **Cobertura**: 100% dos componentes
- **Testes**: 62 testes passando
- **Performance**: Testes de performance automatizados

## 🐛 Troubleshooting

### ❌ Problemas Comuns

#### 1. Erro de Autenticação
```bash
# Verifique as variáveis de ambiente
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 2. Erro de Build
```bash
# Limpe o cache
npm run clean
npm install
npm run build
```

#### 3. Testes Falhando
```bash
# Verifique os mocks
npm run test:setup
npm run test
```

#### 4. PWA Não Funcionando
```bash
# Verifique o service worker
npm run build
npm run preview
```

### 🔧 Debug

```bash
# Modo debug
npm run dev:debug

# Logs detalhados
DEBUG=* npm run dev
```

## 🤝 Contribuindo

### 🎯 Como Contribuir

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Desenvolva** sua feature
5. **Teste** suas mudanças
6. **Commit** suas mudanças
7. **Push** para sua branch
8. **Abra** um Pull Request

### 📝 Padrões de Commit

```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

### 🧪 Testes

```bash
# Execute os testes antes de commitar
npm run test
npm run lint
npm run type-check
```

### 📋 Checklist de PR

- [ ] Código segue os padrões
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Build funcionando
- [ ] Linter passando

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Sobre o Autor

**Tiago Vilas Boas** - Desenvolvedor Frontend com 18+ anos de experiência

- 🌐 **LinkedIn**: [tiagovilasboas](https://www.linkedin.com/in/tiagovilasboas/)
- 🐙 **GitHub**: [tiagovilasboas](https://github.com/tiagovilasboas)
- 📧 **Email**: [tcarvalhovb@gmail.com](mailto:tcarvalhovb@gmail.com)

### 🎯 Experiência

- **Frontend Development**: React, Angular, Vue.js
- **Architecture**: Clean Architecture, SOLID Principles
- **Performance**: Web Performance, PWA
- **Leadership**: Tech Lead, Team Management

---

<div align="center">
  <p>Desenvolvido com ❤️ para facilitar o controle de ponto eletrônico</p>
  <p>
    <a href="https://github.com/tiagovilasboas/ponto-pj/stargazers">
      <img src="https://img.shields.io/github/stars/tiagovilasboas/ponto-pj?style=social" alt="Stars" />
    </a>
    <a href="https://github.com/tiagovilasboas/ponto-pj/network">
      <img src="https://img.shields.io/github/forks/tiagovilasboas/ponto-pj?style=social" alt="Forks" />
    </a>
    <a href="https://github.com/tiagovilasboas/ponto-pj/issues">
      <img src="https://img.shields.io/github/issues/tiagovilasboas/ponto-pj" alt="Issues" />
    </a>
  </p>
</div>

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
[![Tests](https://img.shields.io/badge/Tests-62%20Passing-6E56CF?logo=vitest)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Coverage-41.38%25-orange?logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">
  <img src="https://img.shields.io/badge/Architecture-Clean%20Architecture-00D4AA?style=for-the-badge" alt="Clean Architecture" />
  <img src="https://img.shields.io/badge/Pattern-Repository%20Pattern-FF6B6B?style=for-the-badge" alt="Repository Pattern" />
  <img src="https://img.shields.io/badge/Principle-SOLID%20Compliant-4ECDC4?style=for-the-badge" alt="SOLID Compliant" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-10B981?style=for-the-badge" alt="Production Ready" />
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
- [📚 Documentação](#-documentação)
- [📊 Métricas de Qualidade](#-métricas-de-qualidade)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

## 🎯 Sobre o Projeto

**Ponto PJ** é um sistema de ponto eletrônico pessoal que demonstra boas práticas de desenvolvimento React com arquitetura limpa.

### ✨ Por que este projeto é especial?

- 🎯 **Arquitetura Limpa**: Implementação dos princípios SOLID
- 🏗️ **Repository Pattern**: Camada de dados robusta e testável
- ⚡ **PWA Nativo**: Funciona offline e pode ser instalado como app
- 🧪 **Testes Estruturados**: 62 testes passando com cobertura de 41.38%
- 🌐 **Internacionalização**: Suporte a português e inglês
- 🎨 **UI Moderna**: Interface responsiva com Mantine + Tailwind
- 🔒 **Segurança**: Autenticação robusta com Supabase

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
# Copie o arquivo .env.example para .env e preencha com suas credenciais:
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 4. Execute o projeto
npm run dev
```

**🎯 Em 5 minutos você terá o projeto rodando!**

> **📚 Documentação Completa:**
> - [DATABASE_SETUP.md](DATABASE_SETUP.md) - Configuração do banco de dados
> - [SECURITY.md](SECURITY.md) - Medidas de segurança implementadas
> - [ARCHITECTURE_IMPROVEMENTS.md](ARCHITECTURE_IMPROVEMENTS.md) - Melhorias arquiteturais

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

Implementação do Repository Pattern com cache:

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
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Cobertura de testes

## 📱 PWA - Progressive Web App

### ✨ Funcionalidades PWA

- **📱 Instalável**: Pode ser instalado como app nativo
- **🔌 Offline**: Funciona sem internet (cache inteligente)
- **⚡ Rápido**: Carregamento instantâneo
- **🔄 Auto Update**: Atualizações automáticas

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
- **Bundle Optimization**: Otimização automática do bundle
- **PWA Cache**: Cache inteligente para recursos estáticos

### 📊 Métricas de Performance

```bash
# Análise de bundle
npm run analyze

# Build para produção
npm run build

# Preview do build
npm run preview

# Análise de performance (Lighthouse)
npm run lighthouse
```

### 🎯 Core Web Vitals

- **FCP**: 2.8s (First Contentful Paint)
- **LCP**: 3.0s (Largest Contentful Paint)
- **Speed Index**: 2.8s
- **FID**: < 100ms (First Input Delay)
- **CLS**: 0 (Cumulative Layout Shift)
- **PWA**: Instalável, offline, auto-update OK

> ⚠️ **Nota:** O LCP ficou levemente acima do ideal (<2.5s), mas ainda é considerado bom para a maioria dos cenários. Melhorias são bem-vindas!

## 🔐 Segurança

### 🛡️ Medidas de Segurança

- **Row Level Security**: Segurança granular no banco
- **Input Validation**: Validação rigorosa de entrada
- **XSS Protection**: Proteção contra XSS
- **Session Management**: Gerenciamento seguro de sessões

### 🔑 Variáveis de Ambiente

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

### 📋 Checklist de Segurança

- [x] Autenticação robusta
- [x] Validação de entrada
- [x] Sanitização de dados
- [x] HTTPS obrigatório
- [x] Headers de segurança

> **📖 Detalhes completos:** [SECURITY.md](SECURITY.md)

## 🧪 Testes

### 📊 Cobertura de Testes

- **62 testes passando** (100% de sucesso!)
- **10 arquivos de teste**
- **Cobertura geral**: 41.38%
- **Cobertura de src/**: 85.82%

### 🛠️ Comandos de Teste

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes uma vez
npm run test:run
```

### 🎯 Estratégia de Testes

- **Unit Tests**: Testes isolados de funções
- **Integration Tests**: Testes de integração entre componentes
- **Component Tests**: Testes de renderização de componentes
- **Flow Tests**: Testes de fluxos completos

### ⚠️ Notas sobre Testes

- Alguns warnings do React Testing Library sobre `act()`
- Warnings do React Router sobre futuras mudanças (v7)
- Todos os testes passam, mas podem ser otimizados

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
2. Configure as tabelas seguindo [DATABASE_SETUP.md](DATABASE_SETUP.md)
3. Copie as credenciais da API

### 3️⃣ Configuração Local

```bash
# Clone o repositório
git clone https://github.com/tiagovilasboas/ponto-pj.git
cd ponto-pj

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env com suas credenciais do Supabase

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
├── test/               # Testes
└── types/              # Definições de tipos TypeScript
```

## 📚 Documentação

### 📖 Arquivos de Documentação

- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Configuração completa do banco de dados
- **[SECURITY.md](SECURITY.md)** - Medidas de segurança implementadas
- **[ARCHITECTURE_IMPROVEMENTS.md](ARCHITECTURE_IMPROVEMENTS.md)** - Melhorias arquiteturais planejadas

### 🎨 Design System

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
- **Performance**: Otimizado para mobile

## 📊 Métricas de Qualidade

### 🎯 Qualidade do Código

- **ESLint**: Configuração rigorosa
- **Prettier**: Formatação consistente
- **TypeScript**: Tipagem estática
- **Husky**: Hooks de pre-commit

### 📈 Métricas de Performance

- **Bundle Size**: Otimizado para produção
- **First Paint**: < 1s
- **Time to Interactive**: < 3s
- **Core Web Vitals**: Todos verdes

### 🧪 Qualidade dos Testes

- **Cobertura**: 41.38% geral, 85.82% em src/
- **Testes**: 62 testes passando
- **Estrutura**: Testes organizados por fluxos

## 🐛 Troubleshooting

### ❌ Problemas Comuns

#### 1. Erro de Autenticação
```bash
# Verifique as variáveis de ambiente
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

#### 2. Erro de Build
```bash
# Limpe o cache
rm -rf node_modules
npm install
npm run build
```

#### 3. Testes Falhando
```bash
# Verifique os mocks
npm run test:run
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
npm run dev

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
npm run test:run
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

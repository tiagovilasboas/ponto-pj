# Ponto PJ - Sistema de Ponto Eletrônico

Sistema de ponto eletrônico desenvolvido em React + TypeScript + Vite com interface mobile-first, similar aos apps de banco modernos.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Mantine UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Estado**: Zustand
- **Internacionalização**: i18next
- **PDF**: jsPDF + jsPDF-autotable
- **PWA**: Service Worker + Manifest

## 📱 Características

- ✅ **Interface Mobile-First** - Design otimizado para dispositivos móveis
- ✅ **Autenticação** - Login/registro com Supabase Auth
- ✅ **Registro de Ponto** - Entrada/saída com horário atual
- ✅ **Registro Manual** - Inserção manual de horários
- ✅ **Histórico** - Visualização, edição e paginação de registros
- ✅ **Relatórios** - Estatísticas e exportação PDF
- ✅ **Internacionalização** - Português e Inglês (100% traduzido)
- ✅ **Responsivo** - Funciona em desktop e mobile
- ✅ **Segurança** - Validação, sanitização e monitoramento
- ✅ **PWA** - Instalável como app nativo
- ✅ **Acessibilidade** - Estados de foco e navegação por teclado

## 🛠️ Configuração

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITORIO]
cd ponto-pj
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `env.example` para `.env`:
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

### 4. Configure o banco de dados

Siga as instruções em [DATABASE_SETUP.md](./DATABASE_SETUP.md) para configurar as tabelas no Supabase.

### 5. Execute o projeto
```bash
npm run dev
```

### 6. Dados de exemplo (opcional)

Para testar com dados de exemplo, execute o script SQL em `populate_may_2025.sql` no Supabase SQL Editor.

## 🔐 Segurança

### Variáveis de Ambiente

- ✅ **Chave Anônima**: Usada no frontend (segura)
- ✅ **Chave de Serviço**: Usada apenas no backend (nunca no frontend)
- ✅ **Arquivo .env**: Já está no .gitignore

### Configuração do Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto
3. Vá em **Settings > API**
4. Copie a **URL** e **anon key**
5. Configure as políticas RLS conforme [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### Recursos de Segurança

- **Validação de entrada**: Sanitização de dados
- **Monitoramento**: Detecção de atividade suspeita
- **Rate limiting**: Proteção contra ataques de força bruta
- **Session integrity**: Verificação de integridade da sessão
- **Inactivity timeout**: Logout automático por inatividade

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticação
│   ├── common/        # Componentes reutilizáveis
│   ├── home/          # Componentes da página inicial
│   ├── ponto/         # Componentes de registro de ponto
│   └── security/      # Componentes de segurança
├── hooks/             # Custom hooks
├── i18n/              # Internacionalização
├── lib/               # Utilitários e configurações
├── pages/             # Páginas da aplicação
├── repositories/      # Camada de acesso a dados
├── services/          # Serviços de negócio
├── stores/            # Gerenciamento de estado (Zustand)
└── types/             # Definições de tipos TypeScript
```

## 🎨 Design System

### Componentes Principais

- **AppHeader**: Header consistente com navegação
- **SquareCTA**: Botões quadrados grandes (estilo app de banco)
- **BottomNavigation**: Navegação inferior mobile
- **PrimaryButton**: Botão primário padronizado
- **SecurityMonitor**: Monitoramento de segurança

### Cores e Gradientes

- **Azul**: `from-blue-500 to-blue-600` (primário)
- **Verde**: `from-green-500 to-green-600` (sucesso)
- **Vermelho**: `from-red-500 to-red-600` (perigo)
- **Laranja**: `from-orange-500 to-orange-600` (aviso)
- **Roxo**: `from-purple-500 to-purple-600` (secundário)
- **Pastel**: Paleta suave para melhor UX

## 📱 Funcionalidades Mobile

### Navegação
- Header sticky com botão voltar
- Bottom navigation com ícones
- Transições suaves entre páginas

### Interação
- Botões touch-friendly (44px mínimo)
- CTAs quadrados grandes
- Feedback visual imediato
- Estados de loading claros
- Paginação otimizada para mobile

### Layout
- Grid responsivo 2x2 para CTAs
- Cards com sombras sutis
- Background cinza claro
- Padding adequado para safe areas
- Layout horizontal compacto

## 🌐 Internacionalização

O projeto suporta português (pt-BR) e inglês (en-US) com **100% de cobertura**:

```typescript
import { useTranslation } from '@/i18n/useTranslation'

const { t } = useTranslation()
t('app.title') // "Ponto PJ" ou "Time Clock PJ"
```

**Recursos traduzidos:**
- ✅ Interface completa
- ✅ Mensagens de feedback
- ✅ Mensagens de erro
- ✅ Alertas de segurança
- ✅ Labels e botões
- ✅ Relatórios PDF

Veja [I18N_GUIDE.md](./I18N_GUIDE.md) para mais detalhes.

## 📊 Funcionalidades

### Registro de Ponto
- **Entrada**: Registra horário de início
- **Saída**: Registra horário de fim (desconta 1h de almoço)
- **Manual**: Inserção manual de horários
- **Edição**: Modificação de registros existentes
- **Validação**: Verificação de horários válidos

### Histórico
- Visualização por mês com paginação (10 itens por página)
- Edição inline de registros
- Filtros por status
- Indicadores visuais
- Abreviações de dia da semana
- Layout horizontal compacto

### Relatórios
- Estatísticas do período
- Total de horas trabalhadas
- Dias completos/incompletos
- Exportação para PDF
- Gráficos e indicadores visuais

### Segurança
- Monitoramento em tempo real
- Detecção de atividade suspeita
- Logout automático por inatividade
- Validação de integridade da sessão
- Rate limiting de tentativas de login

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`

### Build de Produção
```bash
npm run build
```

O build gera uma PWA completa com service worker.

## 🧪 Testes

### Comandos Disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificação de código
npm run preview      # Preview do build
```

### Dados de Teste
Execute `populate_may_2025.sql` no Supabase para dados de exemplo.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Abra uma issue no GitHub
3. Consulte os logs do console
4. Verifique [SECURITY.md](./SECURITY.md) para questões de segurança

## 🎯 Status do Projeto

**✅ MVP COMPLETO - PRONTO PARA PRODUÇÃO**

- ✅ Todas as funcionalidades core implementadas
- ✅ Interface mobile-first otimizada
- ✅ Segurança robusta implementada
- ✅ Internacionalização completa
- ✅ Documentação detalhada
- ✅ Build de produção funcionando

---

Desenvolvido com ❤️ para facilitar o controle de ponto eletrônico.

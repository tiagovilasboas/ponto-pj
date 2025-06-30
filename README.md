# Ponto PJ - Sistema de Ponto Eletrônico

Sistema de ponto eletrônico desenvolvido em React + TypeScript + Vite com interface mobile-first, similar aos apps de banco modernos.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Mantine UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Estado**: Zustand
- **Internacionalização**: i18next
- **PDF**: jsPDF + jsPDF-autotable

## 📱 Características

- ✅ **Interface Mobile-First** - Design otimizado para dispositivos móveis
- ✅ **Autenticação** - Login/registro com Supabase Auth
- ✅ **Registro de Ponto** - Entrada/saída com horário atual
- ✅ **Registro Manual** - Inserção manual de horários
- ✅ **Histórico** - Visualização e edição de registros
- ✅ **Relatórios** - Estatísticas e exportação PDF
- ✅ **Internacionalização** - Português e Inglês
- ✅ **Responsivo** - Funciona em desktop e mobile

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

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticação
│   ├── common/        # Componentes reutilizáveis
│   ├── home/          # Componentes da página inicial
│   └── ponto/         # Componentes de registro de ponto
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

### Cores e Gradientes

- **Azul**: `from-blue-500 to-blue-600` (primário)
- **Verde**: `from-green-500 to-green-600` (sucesso)
- **Vermelho**: `from-red-500 to-red-600` (perigo)
- **Laranja**: `from-orange-500 to-orange-600` (aviso)
- **Roxo**: `from-purple-500 to-purple-600` (secundário)

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

### Layout
- Grid responsivo 2x2 para CTAs
- Cards com sombras sutis
- Background cinza claro
- Padding adequado para safe areas

## 🌐 Internacionalização

O projeto suporta português (pt-BR) e inglês (en-US):

```typescript
import { useTranslation } from '@/i18n/useTranslation'

const { t } = useTranslation()
t('app.title') // "Ponto PJ" ou "Time Clock PJ"
```

Veja [I18N_GUIDE.md](./I18N_GUIDE.md) para mais detalhes.

## 📊 Funcionalidades

### Registro de Ponto
- **Entrada**: Registra horário de início
- **Saída**: Registra horário de fim (desconta 1h de almoço)
- **Manual**: Inserção manual de horários
- **Edição**: Modificação de registros existentes

### Histórico
- Visualização por mês
- Edição inline de registros
- Filtros por status
- Indicadores visuais

### Relatórios
- Estatísticas do período
- Total de horas trabalhadas
- Dias completos/incompletos
- Exportação para PDF

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Abra uma issue no GitHub
3. Consulte os logs do console

---

Desenvolvido com ❤️ para facilitar o controle de ponto eletrônico.

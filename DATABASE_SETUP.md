# Configuração do Banco de Dados

## Tabelas Necessárias

### 1. Tabela `users`

Execute o seguinte comando SQL no Supabase SQL Editor para criar a tabela `users`:

```sql
-- Criar a tabela users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários inserirem seu próprio perfil
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Política para usuários deletarem seu próprio perfil
CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE USING (auth.uid() = id);
```

### 2. Tabela `work_sessions`

Execute o seguinte comando SQL no Supabase SQL Editor para criar a tabela `work_sessions`:

```sql
-- Criar a tabela work_sessions
CREATE TABLE IF NOT EXISTS work_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  worked_time_real DECIMAL(5,2),
  status TEXT CHECK (status IN ('sem_registro', 'completa', 'incompleta')) DEFAULT 'sem_registro',
  manual_edit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint única para evitar registros duplicados por usuário/dia
  UNIQUE(user_id, date)
);

-- Habilitar RLS
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias sessões
CREATE POLICY "Users can view own work sessions" ON work_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem suas próprias sessões
CREATE POLICY "Users can insert own work sessions" ON work_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias sessões
CREATE POLICY "Users can update own work sessions" ON work_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias sessões
CREATE POLICY "Users can delete own work sessions" ON work_sessions
  FOR DELETE USING (auth.uid() = user_id);
```

## Problemas Comuns

### Problema: Constraint Única Ausente

Se você está recebendo o erro:
```
there is no unique or exclusion constraint matching the ON CONFLICT specification
```

Isso significa que a tabela `work_sessions` não possui uma constraint única para as colunas `user_id` e `date`.

### Problema: Foreign Key Constraint

Se você está recebendo o erro:
```
insert or update on table "work_sessions" violates foreign key constraint "work_sessions_user_id_fkey"
```

Isso significa que o `user_id` que está sendo inserido não existe na tabela `auth.users`. Isso pode acontecer se:

1. O usuário não foi criado corretamente no Supabase Auth
2. A tabela `work_sessions` está referenciando a tabela errada
3. O usuário foi deletado mas ainda há referências

## Soluções

### 1. Verificar e Corrigir a Estrutura da Tabela

Execute o seguinte comando SQL no Supabase SQL Editor para recriar a tabela corretamente:

```sql
-- Dropar a tabela existente (se existir)
DROP TABLE IF EXISTS work_sessions;

-- Criar a tabela com a estrutura correta
CREATE TABLE work_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  worked_time_real DECIMAL(5,2),
  status TEXT CHECK (status IN ('sem_registro', 'completa', 'incompleta')) DEFAULT 'sem_registro',
  manual_edit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint única para evitar registros duplicados por usuário/dia
  UNIQUE(user_id, date)
);
```

### 2. Verificar se o Usuário Existe

Execute este comando para verificar se o usuário existe na tabela `auth.users`:

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE id = 'SEU_USER_ID_AQUI';
```

### 3. Criar Trigger para Sincronizar Usuários (Opcional)

Se você quiser garantir que todos os usuários registrados sejam automaticamente inseridos na tabela `auth.users`, crie este trigger:

```sql
-- Função para inserir usuário na tabela auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO auth.users (id, email, created_at)
  VALUES (new.id, new.email, new.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando um usuário se registra
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
``` 
# Configuração do Banco de Dados

## Problema: Constraint Única Ausente

Se você está recebendo o erro:
```
there is no unique or exclusion constraint matching the ON CONFLICT specification
```

Isso significa que a tabela `work_sessions` não possui uma constraint única para as colunas `user_id` e `date`.

## Solução

Execute o seguinte comando SQL no Supabase SQL Editor:

```sql
ALTER TABLE work_sessions 
ADD CONSTRAINT work_sessions_user_id_date_key 
UNIQUE (user_id, date);
```

## Estrutura da Tabela

A tabela `work_sessions` deve ter a seguinte estrutura:

```sql
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

## Políticas de Segurança (RLS)

Certifique-se de que as políticas de segurança estão configuradas:

```sql
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
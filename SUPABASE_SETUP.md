# Configuração do Supabase - Ponto PJ

Este documento descreve as configurações necessárias no Supabase para o funcionamento completo do sistema de autenticação.

## 🔧 Configurações Obrigatórias

### 1. Configuração de Email

#### 1.1 Acesse o Dashboard do Supabase
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto

#### 1.2 Configure o Provedor de Email
1. No menu lateral, vá para **Authentication** → **Settings**
2. Na seção **Email Templates**, configure:

**Template: Reset Password**
```
Subject: Redefinir sua senha - Ponto PJ
Content:
<h2>Olá!</h2>
<p>Você solicitou a redefinição da sua senha no Ponto PJ.</p>
<p>Clique no link abaixo para definir uma nova senha:</p>
<a href="{{ .ConfirmationURL }}">Redefinir Senha</a>
<p>Este link expira em 24 horas.</p>
<p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
<p>Atenciosamente,<br>Equipe Ponto PJ</p>
```

**Template: Confirm Signup**
```
Subject: Confirme sua conta - Ponto PJ
Content:
<h2>Bem-vindo ao Ponto PJ!</h2>
<p>Para ativar sua conta, clique no link abaixo:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Conta</a>
<p>Este link expira em 24 horas.</p>
<p>Atenciosamente,<br>Equipe Ponto PJ</p>
```

#### 1.3 Configure o Provedor de Email
1. Na seção **SMTP Settings**:
   - **Host**: Configure seu servidor SMTP (ex: smtp.gmail.com)
   - **Port**: 587 (TLS) ou 465 (SSL)
   - **User**: Seu e-mail
   - **Pass**: Sua senha de app
   - **Sender Name**: Ponto PJ
   - **Sender Email**: noreply@ponto-pj.com

**Exemplo para Gmail:**
```
Host: smtp.gmail.com
Port: 587
User: seu-email@gmail.com
Pass: sua-senha-de-app
Sender Name: Ponto PJ
Sender Email: noreply@ponto-pj.com
```

### 2. Configuração de URLs

#### 2.1 Site URL
1. Em **Authentication** → **Settings** → **General**
2. Configure **Site URL**:
   - Desenvolvimento: `http://localhost:5173`
   - Produção: `https://seu-dominio.com`

#### 2.2 Redirect URLs
1. Em **Authentication** → **Settings** → **URL Configuration**
2. Adicione as URLs de redirecionamento:

**Desenvolvimento:**
```
http://localhost:5173/login
http://localhost:5173/register
http://localhost:5173/reset-password
```

**Produção:**
```
https://seu-dominio.com/login
https://seu-dominio.com/register
https://seu-dominio.com/reset-password
```

### 3. Configuração de Autenticação

#### 3.1 Habilitar Email Auth
1. Em **Authentication** → **Providers**
2. Certifique-se que **Email** está habilitado
3. Configure as opções:
   - ✅ **Enable email confirmations**
   - ✅ **Enable secure email change**
   - ✅ **Enable double confirm changes**

#### 3.2 Configurações de Segurança
1. Em **Authentication** → **Settings** → **Security**
2. Configure:
   - **JWT Expiry**: 3600 (1 hora)
   - **Refresh Token Rotation**: Habilitado
   - **Refresh Token Reuse Interval**: 10 segundos

### 4. Configuração de Políticas de Senha

#### 4.1 Password Policy
1. Em **Authentication** → **Settings** → **Password Policy**
2. Configure:
   - **Minimum Length**: 6 caracteres
   - **Require Uppercase**: Opcional
   - **Require Lowercase**: Opcional
   - **Require Numbers**: Opcional
   - **Require Special Characters**: Opcional

## 🧪 Testando a Configuração

### 1. Teste de Registro
1. Acesse a aplicação
2. Tente registrar um novo usuário
3. Verifique se o e-mail de confirmação é enviado
4. Clique no link de confirmação

### 2. Teste de Reset de Senha
1. Na página de login, clique em "Esqueci minha senha"
2. Digite um e-mail válido
3. Verifique se o e-mail de reset é enviado
4. Clique no link e teste a redefinição

### 3. Verificar Logs
1. No Dashboard do Supabase, vá para **Logs**
2. Verifique se há erros relacionados a e-mail
3. Monitore as tentativas de autenticação

## 🚨 Problemas Comuns

### 1. E-mails não são enviados
**Possíveis causas:**
- SMTP não configurado
- Credenciais SMTP incorretas
- Firewall bloqueando porta SMTP
- Provedor de e-mail bloqueando

**Solução:**
1. Verifique as configurações SMTP
2. Teste com outro provedor (SendGrid, Mailgun)
3. Verifique os logs do Supabase

### 2. Links de reset não funcionam
**Possíveis causas:**
- URLs de redirecionamento não configuradas
- Site URL incorreta
- Tokens expirados

**Solução:**
1. Verifique as URLs de redirecionamento
2. Configure o Site URL corretamente
3. Teste com tokens válidos

### 3. Erro de CORS
**Possíveis causas:**
- Domínio não autorizado
- Headers CORS incorretos

**Solução:**
1. Adicione o domínio nas configurações
2. Verifique os headers CORS
3. Configure o proxy corretamente

## 📋 Checklist de Configuração

- [ ] SMTP configurado
- [ ] Templates de e-mail criados
- [ ] Site URL configurada
- [ ] Redirect URLs adicionadas
- [ ] Email auth habilitado
- [ ] Políticas de senha configuradas
- [ ] Teste de registro funcionando
- [ ] Teste de reset funcionando
- [ ] Logs verificados

## 🔒 Configurações de Segurança

### Rate Limiting
O Supabase já possui rate limiting configurado por padrão:
- 5 tentativas de login por 15 minutos
- Bloqueio automático após exceder limite

### Row Level Security (RLS)
Certifique-se que as políticas RLS estão ativas:
```sql
-- Verificar se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Consulte a [documentação oficial](https://supabase.com/docs)
3. Abra uma issue no repositório

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0 
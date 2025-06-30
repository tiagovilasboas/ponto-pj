import { supabase } from '@/lib/supabaseClient'
import type { User, AuthError } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
}

export interface SignInData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}

export class AuthRepository {
  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        // Se o erro for relacionado à sessão ausente, retornar null silenciosamente
        if (error.message.includes('Auth session missing') || error.message.includes('Invalid JWT')) {
          return null
        }
        throw new Error(`Erro ao obter usuário: ${error.message}`)
      }

      return user
    } catch (error) {
      // Se for erro de sessão ausente, retornar null
      if (error instanceof Error && error.message.includes('Auth session missing')) {
        return null
      }
      throw error
    }
  }

  // Fazer login
  async signIn(data: SignInData): Promise<{ user: User | null; error: AuthError | null }> {
    const { data: result, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    return {
      user: result.user,
      error
    }
  }

  // Fazer cadastro
  async signUp(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    return {
      user: result.user,
      error
    }
  }

  // Fazer logout
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Redefinir senha
  async resetPassword(data: ResetPasswordData): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    return { error }
  }

  // Atualizar senha
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    return { error }
  }

  // Atualizar perfil do usuário
  async updateProfile(updates: { email?: string; data?: Record<string, unknown> }): Promise<{ user: User | null; error: AuthError | null }> {
    const { data: result, error } = await supabase.auth.updateUser(updates)

    return {
      user: result.user,
      error
    }
  }

  // Escutar mudanças de autenticação
  onAuthStateChange(callback: (event: string, session: { user: User | null; access_token: string; refresh_token: string } | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Obter sessão atual
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new Error(`Erro ao obter sessão: ${error.message}`)
    }

    return session
  }
}

// Instância singleton do repository
export const authRepository = new AuthRepository() 
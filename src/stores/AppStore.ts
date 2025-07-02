import { create } from 'zustand'
import { AuthRepository } from '@/repositories/AuthRepository'
import { WorkSessionRepository } from '@/repositories/WorkSessionRepository'
import type { User } from '@supabase/supabase-js'
import type { WorkSession } from '@/types/workSession'
import { getCurrentDate } from '@/lib/utils'

interface AppState {
  // State
  user: User | null
  session: WorkSession | null
  loading: boolean
  actionLoading: boolean
  error: string | null
  userLoaded: boolean // Flag para controlar se o usuário já foi carregado

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: WorkSession | null) => void
  setLoading: (loading: boolean) => void
  setActionLoading: (actionLoading: boolean) => void
  setError: (error: string | null) => void
  setUserLoaded: (loaded: boolean) => void

  // Auth actions
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loadUserAndSession: () => Promise<void>

  // Work session actions
  startJourney: () => Promise<void>
  endJourney: () => Promise<void>
  registerManual: (startTime: string, endTime: string) => Promise<void>

  // Utility functions
  formatCurrentDate: () => string
  formatTime: (time: string) => string
  formatWorkedHours: (hours: number) => string
}

// Repositories
const authRepository = new AuthRepository()
const workSessionRepository = new WorkSessionRepository()

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  loading: true,
  actionLoading: false,
  error: null,
  userLoaded: false,

  // State setters
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setActionLoading: (actionLoading) => set({ actionLoading }),
  setError: (error) => set({ error }),
  setUserLoaded: (loaded) => set({ userLoaded: loaded }),

  // Auth actions
  login: async (email: string, password: string) => {
    // Validação mínima: campos obrigatórios
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email e senha são obrigatórios')
    }

    set({ actionLoading: true })
    try {
      const { user, error } = await authRepository.signIn({ email, password })
      if (error) {
        throw new Error(error.message)
      }
      if (user) {
        set({ user })
        await get().loadUserAndSession()
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      throw new Error(errorMessage)
    } finally {
      set({ actionLoading: false })
    }
  },

  logout: async () => {
    set({ actionLoading: true, error: null })
    try {
      await authRepository.signOut()
      set({ user: null, session: null, userLoaded: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      throw new Error(errorMessage)
    } finally {
      set({ actionLoading: false })
    }
  },

  loadUserAndSession: async () => {
    const { userLoaded } = get()
    
    // Se já foi carregado, não executar novamente
    if (userLoaded) {
      return
    }

    set({ loading: true, error: null })
    try {
      const user = await authRepository.getCurrentUser()
      if (user) {
        set({ user })
        
        // Carregar sessão do dia diretamente
        const today = getCurrentDate()
        const session = await workSessionRepository.findByUserAndDate(user.id, today)
        set({ session, userLoaded: true })
      } else {
        set({ user: null, session: null, userLoaded: true })
      }
    } catch (error: unknown) {
      // Tratar silenciosamente erros de autenticação
      // Não bloquear a aplicação com tela de erro
      set({ user: null, session: null, error: null, userLoaded: true })
      // Log silencioso apenas em desenvolvimento
      if (import.meta.env.DEV) {
        console.error('Error loading user and session:', error)
      }
    } finally {
      set({ loading: false })
    }
  },

  // Work session actions
  startJourney: async () => {
    set({ actionLoading: true, error: null })
    try {
      const { user } = get()
      if (!user) throw new Error('Usuário não autenticado')

      const today = getCurrentDate()
      const now = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })

      const session = await workSessionRepository.upsert({
        user_id: user.id,
        date: today,
        start_time: now,
        status: 'incompleta'
      })

      set({ session })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      // Tratar erro específico de foreign key
      if (errorMessage.includes('Usuário não encontrado no sistema') || errorMessage.includes('23503')) {
        throw new Error('Erro de configuração: Usuário não encontrado no sistema. Entre em contato com o administrador.')
      }
      
      throw new Error(errorMessage)
    } finally {
      set({ actionLoading: false })
    }
  },

  endJourney: async () => {
    set({ actionLoading: true, error: null })
    try {
      const { user, session } = get()
      if (!user || !session) throw new Error('Usuário ou sessão não encontrada')

      const now = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })

      // Calculate worked time
      const startTime = new Date(`2000-01-01T${session.start_time}`)
      const endTime = new Date(`2000-01-01T${now}`)
      const workedHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

      const updatedSession = await workSessionRepository.update(user.id, session.date, {
        end_time: now,
        worked_time_real: workedHours,
        status: 'completa'
      })

      set({ session: updatedSession })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      // Tratar erro específico de foreign key
      if (errorMessage.includes('Usuário não encontrado no sistema') || errorMessage.includes('23503')) {
        throw new Error('Erro de configuração: Usuário não encontrado no sistema. Entre em contato com o administrador.')
      }
      
      throw new Error(errorMessage)
    } finally {
      set({ actionLoading: false })
    }
  },

  registerManual: async (startTime: string, endTime: string) => {
    set({ actionLoading: true, error: null })
    try {
      const { user } = get()
      if (!user) throw new Error('Usuário não autenticado')

      const today = getCurrentDate()

      // Calculate worked time
      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)
      const workedHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

      const session = await workSessionRepository.upsert({
        user_id: user.id,
        date: today,
        start_time: startTime,
        end_time: endTime,
        worked_time_real: workedHours,
        status: 'completa',
        manual_edit: true
      })

      set({ session })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      // Tratar erro específico de foreign key
      if (errorMessage.includes('Usuário não encontrado no sistema') || errorMessage.includes('23503')) {
        throw new Error('Erro de configuração: Usuário não encontrado no sistema. Entre em contato com o administrador.')
      }
      
      throw new Error(errorMessage)
    } finally {
      set({ actionLoading: false })
    }
  },

  // Utility functions
  formatCurrentDate: () => {
    const now = new Date()
    return now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  formatTime: (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  formatWorkedHours: (hours: number) => {
    const hoursInt = Math.floor(hours)
    const minutes = Math.round((hours - hoursInt) * 60)
    return `${hoursInt}h ${minutes}min`
  }
})) 
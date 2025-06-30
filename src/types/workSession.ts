export interface WorkSession {
  id?: string
  user_id: string
  date: string
  start_time?: string
  end_time?: string
  worked_time_real?: number
  status: 'sem_registro' | 'completa' | 'incompleta'
  manual_edit?: boolean
  created_at?: string
  updated_at?: string
} 
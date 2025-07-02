import { describe, it, expect } from 'vitest'
import { 
  getCurrentDate, 
  formatDateWithWeekday, 
  calculateWorkedHours,
  isValidSession,
  isCompleteSession 
} from './utils'

describe('Utils - Critical Functions', () => {
  describe('getCurrentDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = getCurrentDate()
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('formatDateWithWeekday', () => {
    it('should format date with weekday (abbreviated or full)', () => {
      const formatted = formatDateWithWeekday('2024-01-14') // sunday
      // Accepts abbreviation or full name
      const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
      expect(dias.some(dia => formatted.toLowerCase().includes(dia.toLowerCase()))).toBe(true)
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  describe('calculateWorkedHours', () => {
    it('should calculate worked hours correctly', () => {
      const hours = calculateWorkedHours('08:00', '17:00')
      expect(hours).toBe(8) // 9 hours - 1 hour lunch break
    })

    it('should calculate worked hours without lunch discount for short shifts', () => {
      const hours = calculateWorkedHours('08:00', '09:00')
      expect(hours).toBe(1) // 1 hour, no discount
    })

    it('should throw error for invalid time', () => {
      expect(() => calculateWorkedHours('17:00', '08:00')).toThrow()
    })
  })

  describe('isValidSession', () => {
    it('should return true for valid session', () => {
      const session = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-15',
        start_time: '08:00',
        end_time: '17:00',
        status: 'completa'
      }
      expect(isValidSession(session)).toBe(true)
    })

    it('should return false for session without start_time', () => {
      const session = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-15',
        start_time: undefined,
        end_time: '17:00',
        status: 'incompleta'
      }
      expect(isValidSession(session)).toBe(false)
    })
  })

  describe('isCompleteSession', () => {
    it('should return true for complete session', () => {
      const session = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-15',
        start_time: '08:00',
        end_time: '17:00',
        status: 'completa'
      }
      expect(isCompleteSession(session)).toBe(true)
    })

    it('should return false for incomplete session', () => {
      const session = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-15',
        start_time: '08:00',
        end_time: undefined,
        status: 'incompleta'
      }
      expect(isCompleteSession(session)).toBe(false)
    })
  })
}) 
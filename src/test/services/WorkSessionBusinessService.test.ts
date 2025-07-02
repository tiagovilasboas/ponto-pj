import { describe, it, expect } from 'vitest'
import { WorkSessionBusinessService } from '@/services/WorkSessionBusinessService'
import type { WorkSession } from '@/types/workSession'

describe('WorkSessionBusinessService', () => {
  describe('calculateStatistics', () => {
    it('should calculate statistics correctly for empty sessions', () => {
      const sessions: WorkSession[] = []
      const stats = WorkSessionBusinessService.calculateStatistics(sessions)

      expect(stats).toEqual({
        totalHours: 0,
        completeDays: 0,
        incompleteDays: 0,
        totalDays: 0,
        averageHoursPerDay: 0
      })
    })

    it('should calculate statistics correctly for mixed sessions', () => {
      const sessions: WorkSession[] = [
        {
          id: '1',
          user_id: 'user1',
          date: '2024-01-01',
          start_time: '09:00',
          end_time: '17:00',
          worked_time_real: 8,
          status: 'completa',
          manual_edit: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          user_id: 'user1',
          date: '2024-01-02',
          start_time: '09:00',
          end_time: undefined,
          worked_time_real: undefined,
          status: 'incompleta',
          manual_edit: false,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          user_id: 'user1',
          date: '2024-01-03',
          start_time: '08:00',
          end_time: '16:00',
          worked_time_real: 7.5,
          status: 'completa',
          manual_edit: true,
          created_at: '2024-01-03T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z'
        }
      ]

      const stats = WorkSessionBusinessService.calculateStatistics(sessions)

      expect(stats).toEqual({
        totalHours: 15.5,
        completeDays: 2,
        incompleteDays: 1,
        totalDays: 3,
        averageHoursPerDay: 5.17
      })
    })
  })

  describe('calculateWorkedTime', () => {
    it('should calculate worked time correctly', () => {
      const startTime = '09:00'
      const endTime = '17:00'
      const workedTime = WorkSessionBusinessService.calculateWorkedTime(startTime, endTime)

      expect(workedTime).toBe(8)
    })

    it('should handle overnight shifts', () => {
      const startTime = '22:00'
      const endTime = '06:00'
      const workedTime = WorkSessionBusinessService.calculateWorkedTime(startTime, endTime)

      expect(workedTime).toBe(8)
    })

    it('should handle partial hours', () => {
      const startTime = '09:30'
      const endTime = '17:45'
      const workedTime = WorkSessionBusinessService.calculateWorkedTime(startTime, endTime)

      expect(workedTime).toBe(8.25)
    })
  })

  describe('isSessionComplete', () => {
    it('should return true for complete session', () => {
      const session: WorkSession = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-01',
        start_time: '09:00',
        end_time: '17:00',
        worked_time_real: 8,
        status: 'completa',
        manual_edit: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      expect(WorkSessionBusinessService.isSessionComplete(session)).toBe(true)
    })

    it('should return false for incomplete session', () => {
      const session: WorkSession = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-01',
        start_time: '09:00',
        end_time: undefined,
        worked_time_real: undefined,
        status: 'incompleta',
        manual_edit: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      expect(WorkSessionBusinessService.isSessionComplete(session)).toBe(false)
    })
  })

  describe('isSessionIncomplete', () => {
    it('should return true for incomplete session', () => {
      const session: WorkSession = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-01',
        start_time: '09:00',
        end_time: undefined,
        worked_time_real: undefined,
        status: 'incompleta',
        manual_edit: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      expect(WorkSessionBusinessService.isSessionIncomplete(session)).toBe(true)
    })

    it('should return false for complete session', () => {
      const session: WorkSession = {
        id: '1',
        user_id: 'user1',
        date: '2024-01-01',
        start_time: '09:00',
        end_time: '17:00',
        worked_time_real: 8,
        status: 'completa',
        manual_edit: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      expect(WorkSessionBusinessService.isSessionIncomplete(session)).toBe(false)
    })
  })

  describe('determineSessionStatus', () => {
    it('should return sem_registro when no start time', () => {
      const status = WorkSessionBusinessService.determineSessionStatus()
      expect(status).toBe('sem_registro')
    })

    it('should return incompleta when only start time', () => {
      const status = WorkSessionBusinessService.determineSessionStatus('09:00')
      expect(status).toBe('incompleta')
    })

    it('should return completa when all data is present', () => {
      const status = WorkSessionBusinessService.determineSessionStatus('09:00', '17:00', 8)
      expect(status).toBe('completa')
    })
  })

  describe('formatCreateData', () => {
    it('should format data correctly for start session', () => {
      const data = WorkSessionBusinessService.formatCreateData(
        'user1',
        '2024-01-01',
        '09:00',
        undefined,
        false
      )

      expect(data).toEqual({
        user_id: 'user1',
        date: '2024-01-01',
        start_time: '09:00',
        end_time: undefined,
        worked_time_real: undefined,
        status: 'incompleta',
        manual_edit: false
      })
    })

    it('should format data correctly for complete session', () => {
      const data = WorkSessionBusinessService.formatCreateData(
        'user1',
        '2024-01-01',
        '09:00',
        '17:00',
        true
      )

      expect(data).toEqual({
        user_id: 'user1',
        date: '2024-01-01',
        start_time: '09:00',
        end_time: '17:00',
        worked_time_real: 8,
        status: 'completa',
        manual_edit: true
      })
    })
  })
}) 
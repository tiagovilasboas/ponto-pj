import { type ClassValue, clsx } from 'clsx';
import type { WorkSession } from '@/types/workSession';
import {
  getCurrentMonth,
  getMonthDateRange,
  compareMonths,
  getCurrentDate,
} from './date';
import {
  formatMonthForDisplay,
  formatDateWithWeekday,
  formatDateForDisplay,
  formatWorkedHours,
  formatTime,
} from './format';
import { isValidMonthFormat } from './validation/index';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ===== MONTH OPTIONS UTILITIES =====

/**
 * Generates month options from current year back to specified years
 * @param yearsBack - How many years back to include (default: 0 = current year only)
 * @returns Array of options { value: 'YYYY-MM', label: 'Month Year' }
 */
export function getMonthOptionsThisYear(yearsBack = 0) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const options = [];

  for (let y = currentYear; y >= currentYear - yearsBack; y--) {
    const startMonth = y === currentYear ? currentMonth : 12;
    const endMonth = y === currentYear - yearsBack ? 1 : 1;

    // Order from month 1 to 12 (or up to current month)
    for (let m = endMonth; m <= startMonth; m++) {
      const value = `${y}-${String(m).padStart(2, '0')}`;
      const label = `${new Date(y, m - 1, 1).toLocaleString('pt-BR', { month: 'long' })} ${y}`;
      options.push({
        value,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      });
    }
  }

  return options;
}

/**
 * Gets last N months options for dropdown
 * @param months - Number of months to include (default: 12)
 * @returns Array of month options
 */
export function getLastNMonthsOptions(months = 12) {
  const options = [];
  const currentMonth = getCurrentMonth();
  const [currentYear, currentMonthNum] = currentMonth.split('-').map(Number);

  for (let i = 0; i < months; i++) {
    let year = currentYear;
    let month = currentMonthNum - i;

    // Adjust year if month goes below 1
    while (month < 1) {
      month += 12;
      year--;
    }

    const value = `${year}-${String(month).padStart(2, '0')}`;
    const label = formatMonthForDisplay(value);

    options.push({ value, label });
  }

  return options;
}

// ===== WORK SESSION UTILITIES =====

/**
 * Calculates worked hours with lunch break deduction
 * @param startTime - Start time (HH:MM)
 * @param endTime - End time (HH:MM)
 * @param lunchBreak - Lunch hours to deduct (default: 1)
 * @returns Worked hours in decimal format
 */
export function calculateWorkedHours(
  startTime: string,
  endTime: string,
  lunchBreak = 1
): number {
  // Validate that end time is after start time
  if (endTime <= startTime) {
    throw new Error('End time must be after start time');
  }

  // Calculate total time
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  // Deduct lunch only if worked more than lunch time
  return totalHours > lunchBreak
    ? Math.max(0, totalHours - lunchBreak)
    : totalHours;
}

/**
 * Validates if a work session is valid
 * @param session - Work session to validate
 * @returns boolean indicating if session is valid
 */
export function isValidSession(session: WorkSession | null): boolean {
  return (
    session !== null &&
    session.id !== undefined &&
    session.user_id !== undefined &&
    session.start_time !== undefined &&
    session.start_time !== null
  );
}

/**
 * Checks if a work session is complete (has both start and end times)
 * @param session - Work session to check
 * @returns boolean indicating if session is complete
 */
export function isCompleteSession(session: WorkSession | null): boolean {
  return (
    isValidSession(session) &&
    session!.end_time !== undefined &&
    session!.end_time !== null
  );
}

// ===== LAZY LOADING UTILITIES =====

/**
 * Lazy loads PDF generator
 * @returns Promise that resolves to PDF generator function
 */
export const getPdfGenerator = () =>
  import('./pdfGenerator').then(m => m.generatePDF);

/**
 * Lazy loads html2canvas
 * @returns Promise that resolves to html2canvas default export
 */
export const getHtml2Canvas = () => import('html2canvas').then(m => m.default);

// Re-export commonly used functions for backward compatibility
export {
  getCurrentMonth,
  getMonthDateRange,
  compareMonths,
  getCurrentDate,
  formatMonthForDisplay,
  formatDateWithWeekday,
  formatDateForDisplay,
  formatWorkedHours,
  formatTime,
  isValidMonthFormat,
};

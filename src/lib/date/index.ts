// Date manipulation and formatting utilities

/**
 * Gets current month in YYYY-MM format
 * @returns String in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Gets current date in YYYY-MM-DD format
 * @returns String in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Converts YYYY-MM string to safe Date object
 * @param monthString - String in YYYY-MM format
 * @returns Date object
 */
export function parseMonthString(monthString: string): Date {
  const [year, month] = monthString.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Gets first and last day of month
 * @param monthString - String in YYYY-MM format
 * @returns Object with startDate and endDate in YYYY-MM-DD format
 */
export function getMonthDateRange(monthString: string) {
  const [year, month] = monthString.split('-').map(Number);

  // Validate input
  if (!year || !month || month < 1 || month > 12) {
    throw new Error(`Invalid month: ${monthString}`);
  }

  const startDate = `${monthString}-01`;

  // Calculate last day of month more robustly
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${monthString}-${String(lastDay).padStart(2, '0')}`;

  return { startDate, endDate };
}

/**
 * Compares two months (YYYY-MM)
 * @param month1 - First month
 * @param month2 - Second month
 * @returns -1 if month1 < month2, 0 if equal, 1 if month1 > month2
 */
export function compareMonths(month1: string, month2: string): number {
  const date1 = parseMonthString(month1);
  const date2 = parseMonthString(month2);
  return date1.getTime() - date2.getTime();
}

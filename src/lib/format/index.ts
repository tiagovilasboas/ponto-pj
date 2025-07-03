// Formatting utilities for dates, times, and other display elements

/**
 * Formats month for display (e.g., "June 2025")
 * @param monthString - String in YYYY-MM format
 * @param locale - Locale for formatting (default: 'pt-BR')
 * @returns Formatted string
 */
export function formatMonthForDisplay(
  monthString: string,
  locale = 'pt-BR'
): string {
  const date = new Date(monthString + '-01');
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Formats date for display with weekday (e.g., "30/06/2025 (Mon)")
 * @param dateString - Date string (YYYY-MM-DD)
 * @param locale - Locale for formatting (default: 'pt-BR')
 * @returns Formatted string with weekday
 */
export function formatDateWithWeekday(
  dateString: string,
  locale = 'pt-BR'
): string {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

  // Weekday abbreviations
  const weekdayAbbr = {
    0: 'Dom', // Sunday
    1: 'Seg', // Monday
    2: 'Ter', // Tuesday
    3: 'Qua', // Wednesday
    4: 'Qui', // Thursday
    5: 'Sex', // Friday
    6: 'Sáb', // Saturday
  };

  const formattedDate = date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${formattedDate} (${weekdayAbbr[dayOfWeek as keyof typeof weekdayAbbr]})`;
}

/**
 * Formats date for display (e.g., "30/06/2025")
 * @param dateString - Date string (YYYY-MM-DD)
 * @param locale - Locale for formatting (default: 'pt-BR')
 * @returns Formatted string
 */
export function formatDateForDisplay(
  dateString: string,
  locale = 'pt-BR'
): string {
  return new Date(dateString).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats worked hours to display format (e.g., "8.5" -> "8h 30min")
 * @param hours - Hours as decimal number
 * @returns Formatted string
 */
export function formatWorkedHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}min`;
}

/**
 * Formats time string for display
 * @param timeString - Time string (HH:MM)
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  return timeString;
}

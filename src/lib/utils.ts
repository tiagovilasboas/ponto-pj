import { type ClassValue, clsx } from 'clsx';
import type { WorkSession } from '@/types/workSession';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ===== UTILITÁRIOS DE DATA =====

/**
 * Gera opções de meses do ano atual até o mês atual
 * @param yearsBack - Quantos anos para trás incluir (padrão: 0 = apenas ano atual)
 * @returns Array de opções { value: 'YYYY-MM', label: 'Mês Ano' }
 */
export function getMonthOptionsThisYear(yearsBack = 0) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const options = [];

  for (let y = currentYear; y >= currentYear - yearsBack; y--) {
    const startMonth = y === currentYear ? currentMonth : 12;
    const endMonth = y === currentYear - yearsBack ? 1 : 1;

    // Ordenar do mês 1 ao 12 (ou até o mês atual)
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
 * Obtém o mês atual no formato 'YYYY-MM'
 * @returns String no formato 'YYYY-MM'
 */
export function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Converte string 'YYYY-MM' para objeto Date seguro
 * @param monthString - String no formato 'YYYY-MM'
 * @returns Date object
 */
export function parseMonthString(monthString: string): Date {
  const [year, month] = monthString.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Formata mês para exibição (ex: "Junho 2025")
 * @param monthString - String no formato 'YYYY-MM'
 * @param locale - Locale para formatação (padrão: 'pt-BR')
 * @returns String formatada
 */
export function formatMonthForDisplay(
  monthString: string,
  locale = 'pt-BR'
): string {
  const date = parseMonthString(monthString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Formata data para exibição com dia da semana (ex: "30/06/2025 (Seg)")
 * @param dateString - String de data (YYYY-MM-DD)
 * @param locale - Locale para formatação (padrão: 'pt-BR')
 * @returns String formatada com dia da semana
 */
export function formatDateWithWeekday(
  dateString: string,
  locale = 'pt-BR'
): string {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado

  // Abreviações dos dias da semana
  const weekdayAbbr = {
    0: 'Dom', // Domingo
    1: 'Seg', // Segunda
    2: 'Ter', // Terça
    3: 'Qua', // Quarta
    4: 'Qui', // Quinta
    5: 'Sex', // Sexta
    6: 'Sáb', // Sábado
  };

  const formattedDate = date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${formattedDate} (${weekdayAbbr[dayOfWeek as keyof typeof weekdayAbbr]})`;
}

/**
 * Formata data para exibição (ex: "30/06/2025")
 * @param dateString - String de data (YYYY-MM-DD)
 * @param locale - Locale para formatação (padrão: 'pt-BR')
 * @returns String formatada
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
 * Obtém o primeiro e último dia do mês
 * @param monthString - String no formato 'YYYY-MM'
 * @returns Objeto com startDate e endDate no formato 'YYYY-MM-DD'
 */
export function getMonthDateRange(monthString: string) {
  const [year, month] = monthString.split('-').map(Number);

  // Validar entrada
  if (!year || !month || month < 1 || month > 12) {
    throw new Error(`Mês inválido: ${monthString}`);
  }

  const startDate = `${monthString}-01`;

  // Calcular último dia do mês de forma mais robusta
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${monthString}-${String(lastDay).padStart(2, '0')}`;

  return { startDate, endDate };
}

/**
 * Valida se uma string está no formato 'YYYY-MM'
 * @param monthString - String para validar
 * @returns boolean
 */
export function isValidMonthFormat(monthString: string): boolean {
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(monthString)) return false;

  const [year, month] = monthString.split('-').map(Number);
  return year >= 2020 && year <= 2030 && month >= 1 && month <= 12;
}

/**
 * Compara dois meses (YYYY-MM)
 * @param month1 - Primeiro mês
 * @param month2 - Segundo mês
 * @returns -1 se month1 < month2, 0 se iguais, 1 se month1 > month2
 */
export function compareMonths(month1: string, month2: string): number {
  const date1 = parseMonthString(month1);
  const date2 = parseMonthString(month2);
  return date1.getTime() - date2.getTime();
}

/**
 * Calcula tempo trabalhado com desconto de almoço
 * @param startTime - Horário de início (HH:MM)
 * @param endTime - Horário de fim (HH:MM)
 * @param lunchBreak - Horas de almoço para descontar (padrão: 1)
 * @returns Tempo trabalhado em horas (número decimal)
 */
export function calculateWorkedHours(
  startTime: string,
  endTime: string,
  lunchBreak = 1
): number {
  // Validar se o horário de fim é posterior ao início
  if (endTime <= startTime) {
    throw new Error('Horário de fim deve ser posterior ao horário de início');
  }

  // Calcular tempo total
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  // Descontar almoço apenas se trabalhou mais que o tempo de almoço
  return totalHours > lunchBreak
    ? Math.max(0, totalHours - lunchBreak)
    : totalHours;
}

/**
 * Formata horas para exibição (ex: "8h 30min")
 * @param hours - Horas em decimal
 * @returns String formatada
 */
export function formatWorkedHours(hours: number): string {
  const hoursInt = Math.floor(hours);
  const minutes = Math.round((hours - hoursInt) * 60);
  return `${hoursInt}h ${minutes}min`;
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns String no formato YYYY-MM-DD
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Verifica se uma sessão é válida (tem pelo menos start_time)
 * @param session - Sessão para verificar
 * @returns boolean
 */
export function isValidSession(session: WorkSession | null): boolean {
  return !!(session && session.start_time);
}

/**
 * Verifica se uma sessão está completa (tem start_time e end_time)
 * @param session - Sessão para verificar
 * @returns boolean
 */
export function isCompleteSession(session: WorkSession | null): boolean {
  return !!(session && session.start_time && session.end_time);
}

/**
 * Gera opções dos últimos N meses (ex: últimos 12 meses)
 * @param n - Quantidade de meses (padrão: 12)
 * @returns Array de opções { value: 'YYYY-MM', label: 'Mês Ano' }
 */
export function getLastNMonthsOptions() {
  const options = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  for (let m = 1; m <= 12; m++) {
    const date = new Date(currentYear, m - 1, 1);
    const value = `${currentYear}-${String(m).padStart(2, '0')}`;
    const label = `${date.toLocaleString('pt-BR', { month: 'long' })}`;
    options.push({
      value,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    });
  }
  return options;
}

/**
 * Formata horário para exibição (ex: "08:30")
 * @param timeString - String de horário (HH:MM)
 * @returns String formatada
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '-';

  // Se já está no formato HH:MM, retorna como está
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }

  // Se é um timestamp ISO, extrai apenas o horário
  if (timeString.includes('T')) {
    const time = timeString.split('T')[1];
    return time.substring(0, 5); // Pega apenas HH:MM
  }

  return timeString;
}

// Lazy loading para funções pesadas que não são necessárias no primeiro render
export const getPdfGenerator = () =>
  import('./pdfGenerator').then(m => m.generatePDF);
export const getHtml2Canvas = () => import('html2canvas').then(m => m.default);

import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns';

export function safeParseISO(value) {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function todayISODate() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function toISODate(date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatISODate(value) {
  const parsed = safeParseISO(value);
  return parsed ? format(parsed, 'MMM d, yyyy') : '—';
}

export function formatDateTime(value) {
  const parsed = safeParseISO(value);
  return parsed ? format(parsed, 'MMM d, HH:mm') : '—';
}

export function daysUntil(dateISO, baseDate = new Date()) {
  const target = safeParseISO(dateISO);
  if (!target) return null;
  return differenceInCalendarDays(target, baseDate);
}

export function getCurrentWeekDays(baseDate = new Date()) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function isSameISODate(a, b) {
  return a === b;
}

export function getSessionDateISO(session) {
  if (!session) return '';
  if (session.sessionDate) return session.sessionDate;

  const parsedStart = safeParseISO(session.startTime);
  if (parsedStart) return toISODate(parsedStart);

  const parsedEnd = safeParseISO(session.endTime);
  if (parsedEnd) return toISODate(parsedEnd);

  return '';
}

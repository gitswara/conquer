import { differenceInCalendarDays } from 'date-fns';
import { safeParseISO, todayISODate } from './dateUtils';

export function reconcileStreakForNewDay(streak) {
  const today = todayISODate();
  if (!streak?.lastStudyDate) return streak;
  const last = safeParseISO(streak.lastStudyDate);
  if (!last) return streak;

  const diff = differenceInCalendarDays(new Date(today), last);
  if (diff <= 1) return streak;

  return {
    ...streak,
    currentStreak: 0
  };
}

export function applySessionToStreak(streak, durationMinutes, sessionDateISO) {
  const dateISO = sessionDateISO || todayISODate();
  if (durationMinutes < 30) {
    return { streak, countedForStreak: false };
  }

  const alreadyCounted = streak.streakHistory.includes(dateISO);
  if (alreadyCounted) {
    return {
      streak: {
        ...streak,
        lastStudyDate: dateISO
      },
      countedForStreak: false
    };
  }

  const updatedCurrent = streak.currentStreak + 1;
  const updatedLongest = Math.max(streak.longestStreak, updatedCurrent);

  return {
    streak: {
      ...streak,
      currentStreak: updatedCurrent,
      longestStreak: updatedLongest,
      lastStudyDate: dateISO,
      streakHistory: [...streak.streakHistory, dateISO]
    },
    countedForStreak: true
  };
}

import { differenceInCalendarDays, parseISO } from 'date-fns';
import { getSessionDateISO, safeParseISO, todayISODate } from './dateUtils';

export function reconcileStreakForNewDay(streak) {
  const today = todayISODate();
  if (!streak) return streak;

  const streakNotifiedDate = streak.streakNotifiedDate === today ? today : '';
  if (!streak?.lastStudyDate) {
    return {
      ...streak,
      streakNotifiedDate
    };
  }

  const last = safeParseISO(streak.lastStudyDate);
  if (!last) {
    return {
      ...streak,
      streakNotifiedDate
    };
  }

  const diff = differenceInCalendarDays(new Date(today), last);
  if (diff <= 1) {
    return {
      ...streak,
      streakNotifiedDate
    };
  }

  return {
    ...streak,
    currentStreak: 0,
    streakNotifiedDate
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

function numericDuration(minutes) {
  return Math.max(0, Number(minutes) || 0);
}

function sessionSortKey(session, fallback = 0) {
  const parsed = new Date(session.endTime || session.startTime || '').getTime();
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function recalculateStreakFromSessions(previousStreak, sessions) {
  const today = todayISODate();
  const normalizedSessions = Array.isArray(sessions) ? sessions : [];

  const totalsByDay = new Map();
  const sessionsByDay = new Map();
  normalizedSessions.forEach((session, index) => {
    const day = getSessionDateISO(session);
    if (!day) return;

    totalsByDay.set(day, (totalsByDay.get(day) || 0) + numericDuration(session.durationMinutes));
    if (!sessionsByDay.has(day)) {
      sessionsByDay.set(day, []);
    }
    sessionsByDay.get(day).push({ session, index });
  });

  const qualifyingDays = [...totalsByDay.entries()]
    .filter(([, minutes]) => minutes >= 30)
    .map(([day]) => day)
    .sort();

  const qualifyingDaySet = new Set(qualifyingDays);
  const firstCountedSessionByDay = new Map();
  qualifyingDays.forEach((day) => {
    const ordered = [...(sessionsByDay.get(day) || [])].sort(
      (a, b) => sessionSortKey(a.session, a.index) - sessionSortKey(b.session, b.index)
    );
    if (ordered[0]?.session?.id) {
      firstCountedSessionByDay.set(day, ordered[0].session.id);
    }
  });

  const sessionsWithCountedFlag = normalizedSessions.map((session) => {
    const day = getSessionDateISO(session);
    const shouldCount = Boolean(day && qualifyingDaySet.has(day) && firstCountedSessionByDay.get(day) === session.id);
    if (Boolean(session.countedForStreak) === shouldCount) {
      return session;
    }
    return {
      ...session,
      countedForStreak: shouldCount
    };
  });

  let longestStreak = 0;
  let runningStreak = 0;
  let previousDay = '';
  qualifyingDays.forEach((day) => {
    if (
      previousDay
      && differenceInCalendarDays(parseISO(day), parseISO(previousDay)) === 1
    ) {
      runningStreak += 1;
    } else {
      runningStreak = 1;
    }
    longestStreak = Math.max(longestStreak, runningStreak);
    previousDay = day;
  });

  let trailingStreak = 0;
  if (qualifyingDays.length) {
    trailingStreak = 1;
    for (let index = qualifyingDays.length - 1; index > 0; index -= 1) {
      const current = qualifyingDays[index];
      const previous = qualifyingDays[index - 1];
      if (differenceInCalendarDays(parseISO(current), parseISO(previous)) === 1) {
        trailingStreak += 1;
      } else {
        break;
      }
    }
  }

  const lastStudyDate = qualifyingDays[qualifyingDays.length - 1] || '';
  const gapFromToday = lastStudyDate
    ? differenceInCalendarDays(parseISO(today), parseISO(lastStudyDate))
    : Number.POSITIVE_INFINITY;
  const currentStreak = gapFromToday <= 1 ? trailingStreak : 0;

  const streak = {
    ...(previousStreak || {}),
    currentStreak,
    longestStreak,
    lastStudyDate,
    streakHistory: qualifyingDays,
    streakNotifiedDate: previousStreak?.streakNotifiedDate === today ? today : ''
  };

  return {
    streak,
    sessions: sessionsWithCountedFlag
  };
}

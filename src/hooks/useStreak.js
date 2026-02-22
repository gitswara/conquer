import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { todayISODate } from '../utils/dateUtils';

export function useStreak() {
  const streak = useAppStore((state) => state.streak);

  return useMemo(() => {
    const today = todayISODate();
    const studiedToday = streak.streakHistory.includes(today);
    return {
      ...streak,
      studiedToday
    };
  }, [streak]);
}

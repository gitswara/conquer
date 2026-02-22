import PixelCard from '../ui/PixelCard';
import { useStreak } from '../../hooks/useStreak';

export default function StreakWidget() {
  const streak = useStreak();

  const status = streak.currentStreak === 0
    ? <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>START YOUR STREAK!</span>
    : streak.studiedToday
      ? <span style={{ color: 'var(--success)' }}>✅ STREAK SAFE TODAY</span>
      : <span style={{ color: 'var(--warning)' }}>⚠️ STUDY TODAY TO KEEP STREAK</span>;

  return (
    <PixelCard title="STUDY STREAK">
      <div style={{ fontSize: 24, fontFamily: 'Press Start 2P, monospace' }}>{streak.currentStreak} DAYS</div>
      <div className="muted" style={{ marginTop: 6 }}>
        BEST: {streak.longestStreak} DAYS
      </div>
      <div style={{ marginTop: 8 }}>{status}</div>
    </PixelCard>
  );
}

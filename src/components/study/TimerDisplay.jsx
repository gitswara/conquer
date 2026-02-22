import PixelCard from '../ui/PixelCard';
import { formatHHMMSS } from '../../utils/timeUtils';

function getTimerColor({ running, paused, elapsedSeconds }) {
  if (paused) return 'var(--accent-primary)';
  if (!running) return 'var(--text-dim)';
  if (elapsedSeconds >= 1800) return 'var(--success)';
  return 'var(--warning)';
}

export default function TimerDisplay({ elapsedSeconds, running, paused, targetMinutes }) {
  const color = getTimerColor({ running, paused, elapsedSeconds });
  const active = running || paused;
  const effectiveTargetMinutes = targetMinutes > 0 ? targetMinutes : 60;
  const progressPct = Math.min(100, (elapsedSeconds / 60 / effectiveTargetMinutes) * 100);

  return (
    <PixelCard
      title="SESSION TIMER"
      className={active ? 'study-timer-card expanded' : 'study-timer-card'}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '20px 12px',
          border: '2px solid var(--border-bright)',
          boxShadow: running ? '0 0 12px #a855f7' : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, rgba(192,132,252,0.32) ${progressPct}%, rgba(192,132,252,0.06) ${progressPct}%)`
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, fontSize: 35, color, fontFamily: 'Press Start 2P, monospace' }}>
          {formatHHMMSS(elapsedSeconds)}
        </div>
      </div>
      {paused ? (
        <div style={{ marginTop: 8, color: 'var(--accent-primary)', textAlign: 'center' }}>SESSION PAUSED</div>
      ) : null}
      {elapsedSeconds >= 1800 && running ? (
        <div style={{ marginTop: 8, color: 'var(--success)', textAlign: 'center' }}>🔥 STREAK SECURED!</div>
      ) : null}
    </PixelCard>
  );
}

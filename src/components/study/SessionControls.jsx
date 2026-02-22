import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';

export default function SessionControls({
  canStart,
  running,
  paused,
  targetMinutes,
  onTargetChange,
  onStart,
  onPause,
  onResume,
  onEnd
}) {
  return (
    <PixelCard title="CONTROLS">
      <div style={{ display: 'grid', gap: 10 }}>
        <label htmlFor="targetMinutes" className="pixel-label" style={{ fontSize: 10 }}>
          SET DURATION TARGET (OPTIONAL)
        </label>
        <input
          id="targetMinutes"
          type="number"
          min="0"
          step="5"
          value={targetMinutes}
          onChange={(e) => onTargetChange(e.target.value)}
          disabled={running || paused}
          className="pixel-input-cursor"
        />

        <div style={{ color: 'var(--warning)', fontSize: 12 }}>⚡ MIN 30 MIN TO COUNT FOR STREAK</div>

        <div className="row-wrap">
          <PixelButton onClick={onStart} disabled={!canStart || running || paused}>
            ▶ START
          </PixelButton>
          <PixelButton onClick={onPause} disabled={!running} variant="warning">
            ⏸ PAUSE
          </PixelButton>
          <PixelButton onClick={onResume} disabled={!paused}>
            ▶ RESUME
          </PixelButton>
          <PixelButton onClick={onEnd} disabled={!running && !paused} variant="danger">
            ⏹ END SESSION
          </PixelButton>
        </div>
      </div>
    </PixelCard>
  );
}

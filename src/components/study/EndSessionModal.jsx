import { useMemo, useState } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';
import { formatMinutes } from '../../utils/timeUtils';

export default function EndSessionModal({ open, elapsedSeconds, subtopicName, onCancel, onConfirm }) {
  const [markCompleted, setMarkCompleted] = useState(false);

  const durationMinutes = useMemo(() => Math.max(1, Math.floor(elapsedSeconds / 60)), [elapsedSeconds]);
  const qualifies = durationMinutes >= 30;

  return (
    <PixelModal
      open={open}
      onClose={onCancel}
      title="SESSION COMPLETE!"
      footer={
        <div className="row-wrap">
          <PixelButton onClick={() => onConfirm(markCompleted)} variant={qualifies ? 'success' : 'warning'}>
            YES, SAVE
          </PixelButton>
          <PixelButton onClick={onCancel}>NO</PixelButton>
        </div>
      }
    >
      <p style={{ marginTop: 0 }}>TARGET: {subtopicName || '[DELETED]'}</p>
      <p>DURATION: {formatMinutes(durationMinutes)}</p>

      {!qualifies ? (
        <p style={{ color: 'var(--warning)' }}>⚠️ SESSION TOO SHORT FOR STREAK — Save anyway?</p>
      ) : (
        <p style={{ color: 'var(--success)' }}>✅ {durationMinutes}m SESSION SAVED! STREAK MAINTAINED!</p>
      )}

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={markCompleted}
          onChange={(e) => setMarkCompleted(e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
        Mark {subtopicName || 'subtopic'} as completed?
      </label>
    </PixelModal>
  );
}

import { useEffect, useMemo, useState } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';
import { formatMinutes } from '../../utils/timeUtils';

const COMPLETE_TOPIC_VALUE = '__TOPIC__';

export default function EndSessionModal({
  open,
  elapsedSeconds,
  topicName,
  subtopicName,
  hasSelectedSubtopic,
  topicSubtopics = [],
  onCancel,
  onConfirm
}) {
  const [markCompleted, setMarkCompleted] = useState(false);
  const [completionTarget, setCompletionTarget] = useState(COMPLETE_TOPIC_VALUE);

  const durationMinutes = useMemo(() => Math.max(1, Math.floor(elapsedSeconds / 60)), [elapsedSeconds]);
  const qualifies = durationMinutes >= 30;
  const hasSubtopics = topicSubtopics.length > 0;

  useEffect(() => {
    if (!open) return;
    setMarkCompleted(false);
    if (!hasSelectedSubtopic && hasSubtopics) {
      setCompletionTarget(topicSubtopics[0].id);
      return;
    }
    setCompletionTarget(COMPLETE_TOPIC_VALUE);
  }, [open, hasSelectedSubtopic, hasSubtopics, topicSubtopics]);

  return (
    <PixelModal
      open={open}
      onClose={onCancel}
      title="SESSION COMPLETE!"
      footer={
        <div className="row-wrap">
          <PixelButton
            onClick={() =>
              onConfirm({
                markCompleted,
                completionSubtopicId:
                  markCompleted && !hasSelectedSubtopic && hasSubtopics && completionTarget !== COMPLETE_TOPIC_VALUE
                    ? completionTarget
                    : '',
                markWholeTopicCompleted:
                  markCompleted && !hasSelectedSubtopic && (!hasSubtopics || completionTarget === COMPLETE_TOPIC_VALUE)
              })
            }
            variant={qualifies ? 'success' : 'warning'}
          >
            YES, SAVE
          </PixelButton>
          <PixelButton onClick={onCancel}>NO</PixelButton>
        </div>
      }
    >
      <p style={{ marginTop: 0 }}>
        TARGET: {hasSelectedSubtopic ? `${topicName || '[DELETED]'} › ${subtopicName || '[DELETED]'}` : topicName || '[DELETED]'}
      </p>
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
        {hasSelectedSubtopic ? `Mark ${subtopicName || 'subtopic'} as completed?` : 'Mark study target as completed?'}
      </label>

      {markCompleted && !hasSelectedSubtopic ? (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
          <label htmlFor="completionTarget" className="pixel-label" style={{ fontSize: 10 }}>
            COMPLETE THIS
          </label>
          {hasSubtopics ? (
            <select
              id="completionTarget"
              value={completionTarget}
              onChange={(e) => setCompletionTarget(e.target.value)}
            >
              <option value={COMPLETE_TOPIC_VALUE}>Entire topic</option>
              {topicSubtopics.map((subtopic) => (
                <option key={subtopic.id} value={subtopic.id}>
                  {subtopic.completed ? '✅ ' : ''}
                  {subtopic.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="muted">No subtopics found. This will be saved as a topic-level completion.</div>
          )}
        </div>
      ) : null}
    </PixelModal>
  );
}

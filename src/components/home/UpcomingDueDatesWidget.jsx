import { useMemo } from 'react';
import PixelCard from '../ui/PixelCard';
import { daysUntil, formatISODate } from '../../utils/dateUtils';

function topicIsComplete(topic) {
  if (!topic?.subtopics?.length) return Boolean(topic?.completed);
  return topic.subtopics.every((subtopic) => subtopic.completed);
}

function dueLabel(dueDate) {
  const delta = daysUntil(dueDate);
  if (delta === null) return '—';
  if (delta < 0) return `OVERDUE (${Math.abs(delta)}d)`;
  if (delta === 0) return 'TODAY';
  if (delta === 1) return 'tomorrow';
  return `in ${delta} days`;
}

function dueTone(dueDate) {
  const delta = daysUntil(dueDate);
  if (delta === null) return 'var(--text-dim)';
  if (delta < 0) return 'var(--danger)';
  if (delta <= 7) return 'var(--warning)';
  return 'var(--text-primary)';
}

export default function UpcomingDueDatesWidget({ topics, onOpenTopic }) {
  const upcoming = useMemo(
    () =>
      topics
        .filter((topic) => topic.dueDate && !topicIsComplete(topic))
        .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
        .slice(0, 5),
    [topics]
  );

  if (!upcoming.length) return null;

  return (
    <PixelCard title="UPCOMING DUE DATES">
      <div style={{ display: 'grid', gap: 8 }}>
        {upcoming.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className="table-action"
            onClick={() => onOpenTopic(topic.id)}
            style={{
              display: 'grid',
              gap: 2,
              width: '100%',
              textAlign: 'left',
              padding: '8px 10px',
              border: '1px solid var(--table-border)',
              borderRadius: 6,
              background: '#fff'
            }}
          >
            <div style={{ fontWeight: 700 }}>{topic.topicName}</div>
            <div className="muted" style={{ fontSize: 12 }}>{topic.subject}</div>
            <div style={{ color: dueTone(topic.dueDate), fontSize: 12 }}>
              {formatISODate(topic.dueDate)} · {dueLabel(topic.dueDate)}
            </div>
          </button>
        ))}
      </div>
    </PixelCard>
  );
}

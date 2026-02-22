import PixelCard from '../ui/PixelCard';
import { daysUntil } from '../../utils/dateUtils';

function colorByDays(days) {
  if (days === null) return 'var(--text-dim)';
  if (days < 30) return 'var(--danger)';
  if (days <= 60) return 'var(--warning)';
  return 'var(--accent-primary)';
}

export default function DaysRemainingWidget({ config }) {
  if (!config) {
    return (
      <PixelCard title="DAYS TO EXAM">
        <div className="muted">Set exam config in PLANNER.</div>
      </PixelCard>
    );
  }

  const daysExam = daysUntil(config.examDate);
  const daysSyllabus = daysUntil(config.syllabusDeadline);
  const isExamPassed = daysExam !== null && daysExam < 0;

  return (
    <PixelCard title="DAYS TO EXAM">
      {isExamPassed ? (
        <div>
          <div style={{ fontSize: 26, fontFamily: 'Press Start 2P, monospace', color: 'var(--danger)' }}>EXAM PASSED</div>
          <div className="muted" style={{ marginTop: 8 }}>
            Review final stats below.
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: 34,
              color: colorByDays(daysExam),
              fontFamily: 'Press Start 2P, monospace',
              lineHeight: 1.2,
              fontWeight: daysExam < 30 ? 700 : 400
            }}
          >
            {daysExam}
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            DAYS REMAINING
          </div>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            SYLLABUS DUE IN: <strong>{daysSyllabus}</strong> DAYS
            {daysSyllabus < 0 ? <span style={{ color: 'var(--danger)' }}> (SYLLABUS OVERDUE)</span> : null}
          </div>
        </>
      )}
    </PixelCard>
  );
}

import { useEffect, useMemo, useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import PixelModal from '../ui/PixelModal';
import { daysUntil, formatISODate } from '../../utils/dateUtils';

function percentElapsed(startISO, endISO) {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO);
  const end = new Date(endISO);
  const now = new Date();
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round(((now.getTime() - start.getTime()) / total) * 100)));
}

export default function ScheduleTab({ config, onUpdateConfig }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(config);

  useEffect(() => {
    setDraft(config);
  }, [config, editing]);

  const examCountdown = daysUntil(config?.examDate);
  const syllabusCountdown = daysUntil(config?.syllabusDeadline);
  const elapsed = useMemo(
    () => percentElapsed(config?.createdAt || new Date().toISOString(), config?.syllabusDeadline),
    [config]
  );

  if (!config) {
    return <PixelCard title="SCHEDULE">No exam config yet.</PixelCard>;
  }

  return (
    <div className="section-stack">
      <PixelCard title="SCHEDULE OVERVIEW" right={<PixelButton onClick={() => setEditing(true)}>✏️ EDIT CONFIG</PixelButton>}>
        <p style={{ margin: '4px 0' }}>
          <strong>EXAM:</strong> {config.examName} ({formatISODate(config.examDate)})
        </p>
        <p style={{ margin: '4px 0' }}><strong>COUNTDOWN:</strong> {examCountdown} days</p>
        <p style={{ margin: '4px 0' }}>
          <strong>SYLLABUS DEADLINE:</strong> {formatISODate(config.syllabusDeadline)} ({syllabusCountdown} days)
        </p>
        <p style={{ margin: '4px 0' }}><strong>TIME ELAPSED TO DEADLINE:</strong> {elapsed}%</p>
      </PixelCard>

      <PixelCard title="REVISION PERIODS">
        {!config.revisionPeriods?.length ? (
          <div className="muted">No revision periods configured.</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {config.revisionPeriods.map((period) => (
              <li key={period.id}>
                {period.label || 'Untitled'} | {formatISODate(period.startDate)} - {formatISODate(period.endDate)}
              </li>
            ))}
          </ul>
        )}
      </PixelCard>

      <PixelModal
        open={editing}
        onClose={() => setEditing(false)}
        title="EDIT CONFIG"
        footer={
          <div className="row-wrap">
            <PixelButton
              onClick={() => {
                if (!draft.syllabusDeadline || !draft.examDate || draft.syllabusDeadline > draft.examDate) return;
                onUpdateConfig(draft);
                setEditing(false);
              }}
            >
              SAVE
            </PixelButton>
            <PixelButton onClick={() => setEditing(false)}>CANCEL</PixelButton>
          </div>
        }
      >
        <div className="section-stack">
          <label className="pixel-label" style={{ fontSize: 10 }}>EXAM NAME</label>
          <input
            value={draft.examName}
            onChange={(e) => setDraft((prev) => ({ ...prev, examName: e.target.value }))}
          />
          <label className="pixel-label" style={{ fontSize: 10 }}>EXAM DATE</label>
          <input
            type="date"
            value={draft.examDate}
            onChange={(e) => setDraft((prev) => ({ ...prev, examDate: e.target.value }))}
          />
          <label className="pixel-label" style={{ fontSize: 10 }}>SYLLABUS DEADLINE</label>
          <input
            type="date"
            value={draft.syllabusDeadline}
            onChange={(e) => setDraft((prev) => ({ ...prev, syllabusDeadline: e.target.value }))}
          />

          <div className="section-stack">
            <div className="pixel-label" style={{ fontSize: 10 }}>REVISION PERIODS</div>
            {(draft.revisionPeriods || []).map((period) => (
              <div key={period.id} className="pixel-card" style={{ padding: 10 }}>
                <input
                  value={period.label}
                  placeholder="Label"
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      revisionPeriods: prev.revisionPeriods.map((item) =>
                        item.id === period.id ? { ...item, label: e.target.value } : item
                      )
                    }))
                  }
                />
                <div className="row-wrap" style={{ marginTop: 8 }}>
                  <input
                    type="date"
                    value={period.startDate}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        revisionPeriods: prev.revisionPeriods.map((item) =>
                          item.id === period.id ? { ...item, startDate: e.target.value } : item
                        )
                      }))
                    }
                  />
                  <input
                    type="date"
                    value={period.endDate}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        revisionPeriods: prev.revisionPeriods.map((item) =>
                          item.id === period.id ? { ...item, endDate: e.target.value } : item
                        )
                      }))
                    }
                  />
                  <PixelButton
                    variant="danger"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        revisionPeriods: prev.revisionPeriods.filter((item) => item.id !== period.id)
                      }))
                    }
                  >
                    DELETE
                  </PixelButton>
                </div>
              </div>
            ))}
            <PixelButton
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  revisionPeriods: [
                    ...(prev.revisionPeriods || []),
                    { id: crypto.randomUUID?.() || String(Date.now()), label: '', startDate: '', endDate: '' }
                  ].slice(0, 5)
                }))
              }
            >
              + ADD REVISION PERIOD
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  );
}

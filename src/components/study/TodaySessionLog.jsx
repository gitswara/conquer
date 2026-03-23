import { useMemo, useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import { formatDateTime, getSessionDateISO, todayISODate } from '../../utils/dateUtils';
import { formatMinutes } from '../../utils/timeUtils';

function nameFromIds(topics, topicId, subtopicId) {
  const topic = topics.find((item) => item.id === topicId);
  const subtopic = topic?.subtopics.find((item) => item.id === subtopicId);
  if (!topic) return '[DELETED]';
  if (!subtopicId) return `${topic.topicName} › [TOPIC]`;
  if (!subtopic) return `${topic.topicName} › [DELETED]`;
  return `${topic.topicName} › ${subtopic.name}`;
}

function dailyTotalsMap(sessions) {
  const map = new Map();
  sessions.forEach((session) => {
    const day = getSessionDateISO(session);
    if (!day) return;
    map.set(day, (map.get(day) || 0) + (Number(session.durationMinutes) || 0));
  });
  return map;
}

export default function TodaySessionLog({
  sessions,
  topics,
  onDeleteSession,
  onUpdateSessionDuration
}) {
  const today = todayISODate();
  const [showHistory, setShowHistory] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState('');
  const [editingDuration, setEditingDuration] = useState('');

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) =>
          new Date(b.endTime || b.startTime || '').getTime() - new Date(a.endTime || a.startTime || '').getTime()
      ),
    [sessions]
  );

  const todaySessions = useMemo(
    () => sortedSessions.filter((session) => getSessionDateISO(session) === today),
    [sortedSessions, today]
  );

  const totalToday = todaySessions.reduce((acc, session) => acc + session.durationMinutes, 0);
  const totalsByDay = useMemo(() => dailyTotalsMap(sortedSessions), [sortedSessions]);

  function warnIfBreaksStreak(day, nextTotalMinutes) {
    const previousTotal = totalsByDay.get(day) || 0;
    return previousTotal >= 30 && nextTotalMinutes < 30;
  }

  function confirmDelete(session) {
    const day = getSessionDateISO(session);
    const nextTotal = Math.max(0, (totalsByDay.get(day) || 0) - (Number(session.durationMinutes) || 0));
    const warning = warnIfBreaksStreak(day, nextTotal)
      ? `\n\n⚠️ This will break your streak for ${day}. Continue?`
      : '';

    const ok = window.confirm(`Delete this session (${formatMinutes(session.durationMinutes)})?${warning}`);
    if (!ok) return;
    onDeleteSession(session.id);
    if (editingSessionId === session.id) {
      setEditingSessionId('');
      setEditingDuration('');
    }
  }

  function startEdit(session) {
    setEditingSessionId(session.id);
    setEditingDuration(String(session.durationMinutes || ''));
  }

  function confirmEdit(session) {
    const parsed = Math.max(1, Number(editingDuration) || 0);
    if (!parsed) return;

    const day = getSessionDateISO(session);
    const nextTotal = (totalsByDay.get(day) || 0) - (Number(session.durationMinutes) || 0) + parsed;
    const warning = warnIfBreaksStreak(day, nextTotal)
      ? `\n\n⚠️ This will break your streak for ${day}. Continue?`
      : '';

    const ok = window.confirm(
      `Update duration from ${formatMinutes(session.durationMinutes)} to ${formatMinutes(parsed)}?${warning}`
    );
    if (!ok) return;

    onUpdateSessionDuration(session.id, parsed);
    setEditingSessionId('');
    setEditingDuration('');
  }

  function renderTableRows(list) {
    return list.map((session, index) => {
      const isEditing = editingSessionId === session.id;
      return (
        <tr key={session.id}>
          <td>{index + 1}</td>
          <td>{nameFromIds(topics, session.topicId, session.subtopicId)}</td>
          <td>{formatDateTime(session.endTime || session.startTime)}</td>
          <td>
            {isEditing ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  value={editingDuration}
                  onChange={(event) => setEditingDuration(event.target.value)}
                  style={{ width: 84 }}
                />
                <button type="button" className="table-action" onClick={() => confirmEdit(session)}>SAVE</button>
                <button
                  type="button"
                  className="table-action"
                  onClick={() => {
                    setEditingSessionId('');
                    setEditingDuration('');
                  }}
                >
                  CANCEL
                </button>
              </div>
            ) : (
              formatMinutes(session.durationMinutes)
            )}
          </td>
          <td>{session.countedForStreak ? '✅' : '—'}</td>
          <td>
            <div className="row-wrap">
              {!isEditing ? (
                <button type="button" className="table-action" onClick={() => startEdit(session)}>EDIT</button>
              ) : null}
              <button type="button" className="table-action" onClick={() => confirmDelete(session)}>DELETE</button>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <PixelCard
      title="TODAY'S SESSIONS"
      right={(
        <div className="row-wrap">
          <PixelButton onClick={() => setShowHistory((prev) => !prev)}>
            {showHistory ? 'HIDE HISTORY' : 'SHOW HISTORY'}
          </PixelButton>
        </div>
      )}
    >
      {!todaySessions.length ? (
        <div className="muted">No sessions logged today.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th align="left">#</th>
                <th align="left">SUBTOPIC</th>
                <th align="left">ENDED</th>
                <th align="left">DURATION</th>
                <th align="left">STREAK</th>
                <th align="left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(todaySessions)}</tbody>
          </table>
        </div>
      )}
      <div style={{ marginTop: 10 }}>TODAY TOTAL: {formatMinutes(totalToday)}</div>

      {showHistory ? (
        <div style={{ marginTop: 14 }}>
          <div className="field-label" style={{ marginBottom: 6 }}>SESSION HISTORY</div>
          {!sortedSessions.length ? (
            <div className="muted">No sessions yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th align="left">#</th>
                    <th align="left">SUBTOPIC</th>
                    <th align="left">ENDED</th>
                    <th align="left">DURATION</th>
                    <th align="left">STREAK</th>
                    <th align="left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows(sortedSessions)}</tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </PixelCard>
  );
}

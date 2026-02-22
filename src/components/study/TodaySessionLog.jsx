import PixelCard from '../ui/PixelCard';
import { todayISODate } from '../../utils/dateUtils';
import { formatMinutes } from '../../utils/timeUtils';

function nameFromIds(topics, topicId, subtopicId) {
  const topic = topics.find((item) => item.id === topicId);
  const subtopic = topic?.subtopics.find((item) => item.id === subtopicId);
  if (!topic) return '[DELETED]';
  if (!subtopic) return `${topic.topicName} › [DELETED]`;
  return `${topic.topicName} › ${subtopic.name}`;
}

export default function TodaySessionLog({ sessions, topics }) {
  const today = todayISODate();
  const todaySessions = sessions.filter((session) => session.startTime?.slice(0, 10) === today);
  const total = todaySessions.reduce((acc, session) => acc + session.durationMinutes, 0);

  return (
    <PixelCard title="TODAY'S SESSIONS">
      {!todaySessions.length ? (
        <div className="muted">No sessions logged today.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th align="left">#</th>
                <th align="left">SUBTOPIC</th>
                <th align="left">DURATION</th>
                <th align="left">STREAK</th>
              </tr>
            </thead>
            <tbody>
              {todaySessions.map((session, index) => (
                <tr key={session.id}>
                  <td>{index + 1}</td>
                  <td>{nameFromIds(topics, session.topicId, session.subtopicId)}</td>
                  <td>{formatMinutes(session.durationMinutes)}</td>
                  <td>{session.countedForStreak ? '✅' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ marginTop: 10 }}>TODAY TOTAL: {formatMinutes(total)}</div>
    </PixelCard>
  );
}

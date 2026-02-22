import { formatMinutes } from '../../utils/timeUtils';

export default function SubjectGroup({
  subject,
  color,
  stats,
  onAddTopic,
  onDeleteSubject
}) {
  return (
    <tr style={{ borderTop: '2px solid #d5bef6', background: '#f6f0ff' }}>
      <td colSpan={8}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 14, display: 'inline-block', background: color || '#c084fc' }} />
            <strong>{subject}</strong>
            <span className="muted">| {formatMinutes(stats.minutes)} | {stats.completion}% complete</span>
          </div>
          <div className="row-wrap">
            <button className="table-action" onClick={onAddTopic} aria-label="Add topic">Add Topic</button>
            <button className="table-action danger" onClick={onDeleteSubject} aria-label="Delete subject">Delete Subject</button>
          </div>
        </div>
      </td>
    </tr>
  );
}

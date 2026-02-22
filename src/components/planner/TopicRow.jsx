import { formatMinutes } from '../../utils/timeUtils';

export default function TopicRow({ topic, stats, onDelete, onAddSubtopic }) {
  return (
    <tr style={{ borderTop: '1px solid #e3d3fa', background: '#fcfaff' }}>
      <td colSpan={8}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div>
            <strong>{topic.topicName}</strong>
            <span className="muted"> | {formatMinutes(stats.minutes)} | {stats.completed}/{stats.total} done</span>
          </div>
          <div className="row-wrap">
            <button className="table-action" onClick={onAddSubtopic} aria-label="Add subtopic">Add Subtopic</button>
            <button className="table-action danger" onClick={onDelete} aria-label="Delete topic">Delete Topic</button>
          </div>
        </div>
      </td>
    </tr>
  );
}

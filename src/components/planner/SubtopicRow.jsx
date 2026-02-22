import { useState } from 'react';
import { formatISODate } from '../../utils/dateUtils';
import { formatMinutes } from '../../utils/timeUtils';

export default function SubtopicRow({
  topic,
  subtopic,
  onToggleComplete,
  onRename,
  onUpdateNotes,
  onDelete
}) {
  const [editingName, setEditingName] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [draftName, setDraftName] = useState(subtopic.name);
  const [draftNotes, setDraftNotes] = useState(subtopic.notes || '');

  return (
    <tr style={{ borderTop: '1px solid #eadcfb' }}>
      <td>
        <input
          type="checkbox"
          checked={subtopic.completed}
          onChange={(e) => onToggleComplete(e.target.checked)}
          aria-label={`Mark ${subtopic.name} complete`}
          style={{ width: 18, height: 18 }}
        />
      </td>
      <td className="muted">{topic.subject}</td>
      <td>{topic.topicName}</td>
      <td>
        {editingName ? (
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={() => {
              onRename(draftName);
              setEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onRename(draftName);
                setEditingName(false);
              }
            }}
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            style={{
              border: 0,
              background: 'transparent',
              color: 'inherit',
              padding: 0,
              textAlign: 'left',
              cursor: 'text'
            }}
          >
            {subtopic.name}
          </button>
        )}
      </td>
      <td>{formatMinutes(subtopic.timeSpentMinutes || 0)}</td>
      <td>{subtopic.completedAt ? formatISODate(subtopic.completedAt) : '—'}</td>
      <td>
        {editingNotes ? (
          <textarea
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            onBlur={() => {
              onUpdateNotes(draftNotes);
              setEditingNotes(false);
            }}
            autoFocus
            rows={2}
          />
        ) : (
          <button
            onClick={() => setEditingNotes(true)}
            style={{
              border: 0,
              background: 'transparent',
              color: 'inherit',
              padding: 0,
              textAlign: 'left',
              cursor: 'text'
            }}
          >
            {subtopic.notes || '—'}
          </button>
        )}
      </td>
      <td>
        <button className="table-action danger" onClick={onDelete} aria-label="Delete subtopic">Delete Subtopic</button>
      </td>
    </tr>
  );
}

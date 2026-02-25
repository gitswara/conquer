import { useState } from 'react';
import { formatISODate } from '../../utils/dateUtils';
import { formatMinutes } from '../../utils/timeUtils';
import InlineEditableName from './InlineEditableName';

export default function SubtopicRow({
  subtopic,
  number,
  onToggleComplete,
  onRename,
  onDelete
}) {
  const [editingSignal, setEditingSignal] = useState(0);

  return (
    <tr style={{ borderTop: '1px solid var(--table-subtopic-border)' }}>
      <td className="syllabus-number">{number}</td>
      <td>
        <input
          type="checkbox"
          checked={subtopic.completed}
          onChange={(event) => {
            event.stopPropagation();
            onToggleComplete(event.target.checked);
          }}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Mark ${subtopic.name} complete`}
          style={{ width: 18, height: 18 }}
        />
      </td>
      <td className="syllabus-name-cell level-subtopic">
        <InlineEditableName
          value={subtopic.name}
          onSave={onRename}
          ariaLabel={`Rename subtopic ${subtopic.name}`}
          editingSignal={editingSignal}
        />
      </td>
      <td>{formatMinutes(subtopic.timeSpentMinutes || 0)}</td>
      <td>{subtopic.completedAt ? formatISODate(subtopic.completedAt) : '—'}</td>
      <td>
        <div className="syllabus-actions hover-desktop">
          <button
            className="icon-action rename"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setEditingSignal((prev) => prev + 1);
            }}
            aria-label={`Rename subtopic ${subtopic.name}`}
          >
            ✎
          </button>
          <button
            className="icon-action trash"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            aria-label={`Delete subtopic ${subtopic.name}`}
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
}

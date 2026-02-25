import { useState } from 'react';
import { formatMinutes } from '../../utils/timeUtils';
import { formatISODate } from '../../utils/dateUtils';
import InlineEditableName from './InlineEditableName';

export default function SubjectGroup({
  subject,
  stats,
  number,
  onRowToggle,
  showCompletionCheckbox,
  completed,
  completedOn,
  onToggleComplete,
  onAddTopic,
  onDeleteSubject,
  onRenameSubject
}) {
  const [editingSignal, setEditingSignal] = useState(0);

  return (
    <tr
      className="syllabus-row-toggle subject-row"
      style={{ borderTop: '2px solid var(--table-border)', background: 'var(--table-subject-bg)' }}
      onClick={onRowToggle}
    >
      <td className="syllabus-number">{number}</td>
      <td>
        {showCompletionCheckbox ? (
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => {
              event.stopPropagation();
              onToggleComplete(event.target.checked);
            }}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Mark subject ${subject} complete`}
            style={{ width: 18, height: 18 }}
          />
        ) : null}
      </td>
      <td className="syllabus-name-cell level-subject">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <InlineEditableName
            value={subject}
            onSave={onRenameSubject}
            ariaLabel={`Rename subject ${subject}`}
            editOn="doubleClick"
            editingSignal={editingSignal}
          />
          <span className="muted">
            ({stats.topicCompleted}/{stats.topicTotal} topics)
          </span>
        </div>
      </td>
      <td>{formatMinutes(stats.minutes)}</td>
      <td>
        {completedOn ? formatISODate(completedOn) : '—'}
      </td>
      <td>
        <div className="syllabus-actions hover-desktop">
          <button
            className="icon-action rename"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setEditingSignal((prev) => prev + 1);
            }}
            aria-label={`Rename subject ${subject}`}
          >
            ✎
          </button>
          <button
            className="icon-action plus"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddTopic();
            }}
            aria-label={`Add topic under ${subject}`}
          >
            ＋
          </button>
          <button
            className="icon-action trash"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDeleteSubject();
            }}
            aria-label={`Delete subject ${subject}`}
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
}

import { useState } from 'react';
import { formatMinutes } from '../../utils/timeUtils';
import { formatISODate } from '../../utils/dateUtils';
import InlineEditableName from './InlineEditableName';

export default function TopicRow({
  topic,
  stats,
  number,
  onRowToggle,
  showCompletionCheckbox,
  completed,
  completedOn,
  onToggleComplete,
  onAddSubtopic,
  onDelete,
  onRename
}) {
  const [editingSignal, setEditingSignal] = useState(0);

  return (
    <tr
      className="syllabus-row-toggle topic-row"
      style={{ borderTop: '1px solid var(--table-border)', background: 'var(--table-topic-bg)' }}
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
            aria-label={`Mark topic ${topic.topicName} complete`}
            style={{ width: 18, height: 18 }}
          />
        ) : null}
      </td>
      <td className="syllabus-name-cell level-topic">
        <InlineEditableName
          value={topic.topicName}
          onSave={onRename}
          ariaLabel={`Rename topic ${topic.topicName}`}
          editOn="doubleClick"
          editingSignal={editingSignal}
        />
        <span className="muted" style={{ marginLeft: 8 }}>
          ({stats.subtopicCompleted}/{stats.subtopicTotal} subtopics)
        </span>
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
            aria-label={`Rename topic ${topic.topicName}`}
          >
            ✎
          </button>
          <button
            className="icon-action plus"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddSubtopic();
            }}
            aria-label={`Add subtopic under ${topic.topicName}`}
          >
            ＋
          </button>
          <button
            className="icon-action trash"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            aria-label={`Delete topic ${topic.topicName}`}
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
}

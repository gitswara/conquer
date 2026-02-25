import { useEffect, useRef, useState } from 'react';

export default function InlineEditableName({
  value,
  onSave,
  ariaLabel,
  editOn = 'click',
  editingSignal
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [invalid, setInvalid] = useState(false);
  const closeTimerRef = useRef(0);
  const lastSignalRef = useRef(editingSignal);

  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (editingSignal === undefined) return;
    if (editingSignal === lastSignalRef.current) return;
    lastSignalRef.current = editingSignal;
    setEditing(true);
  }, [editingSignal]);

  function closeAfterShake() {
    setInvalid(true);
    closeTimerRef.current = window.setTimeout(() => {
      setInvalid(false);
      setEditing(false);
    }, 180);
  }

  function saveDraft() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(value);
      closeAfterShake();
      return;
    }

    onSave(trimmed);
    setEditing(false);
  }

  function cancelEdit() {
    setInvalid(false);
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        className={`syllabus-name-input ${invalid ? 'invalid' : ''}`.trim()}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onClick={(event) => event.stopPropagation()}
        onBlur={saveDraft}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === 'Enter') {
            event.preventDefault();
            saveDraft();
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            cancelEdit();
          }
        }}
        aria-label={ariaLabel}
        autoFocus
      />
    );
  }

  return (
    <button
      type="button"
      className="syllabus-name-button"
      onClick={(event) => {
        if (editOn !== 'click') return;
        event.stopPropagation();
        setEditing(true);
      }}
      onDoubleClick={(event) => {
        if (editOn !== 'doubleClick') return;
        event.stopPropagation();
        setEditing(true);
      }}
      aria-label={ariaLabel}
    >
      {value}
    </button>
  );
}

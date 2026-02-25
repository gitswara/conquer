import { useEffect, useMemo, useRef, useState } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';

export default function AddTopicModal({ open, onClose, onSubmit, topics, subjects = [], defaultSubject = '' }) {
  const [subject, setSubject] = useState(defaultSubject);
  const [topicName, setTopicName] = useState('');
  const topicNameRef = useRef(null);

  const subjectNames = useMemo(
    () => [...new Set([...subjects.map((item) => item.name), ...topics.map((topic) => topic.subject)])],
    [subjects, topics]
  );

  useEffect(() => {
    setSubject(defaultSubject || '');
  }, [defaultSubject, open]);

  useEffect(() => {
    if (!open) return;
    topicNameRef.current?.focus();
  }, [open]);

  function handleSave() {
    if (!subject || !topicName.trim()) return;
    const color = subjects.find((entry) => entry.name === subject)?.color
      || topics.find((topic) => topic.subject === subject)?.color
      || '#c084fc';
    onSubmit({ subject, topicName: topicName.trim(), color });
    setTopicName('');
  }

  return (
    <PixelModal
      open={open}
      onClose={onClose}
      title="+ ADD TOPIC"
      footer={
        <div className="row-wrap">
          <PixelButton onClick={handleSave}>
            SAVE
          </PixelButton>
          <PixelButton onClick={onClose}>CANCEL</PixelButton>
        </div>
      }
    >
      <label className="pixel-label" htmlFor="topicSubject" style={{ fontSize: 10 }}>
        SUBJECT
      </label>
      <select
        id="topicSubject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          handleSave();
        }}
      >
        <option value="">SELECT SUBJECT</option>
        {subjectNames.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <label className="pixel-label" htmlFor="topicNameInput" style={{ fontSize: 10, marginTop: 10, display: 'block' }}>
        TOPIC NAME
      </label>
      <input
        id="topicNameInput"
        ref={topicNameRef}
        value={topicName}
        onChange={(e) => setTopicName(e.target.value)}
        className="pixel-input-cursor"
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          handleSave();
        }}
      />
    </PixelModal>
  );
}

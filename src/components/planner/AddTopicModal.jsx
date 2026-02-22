import { useEffect, useMemo, useState } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';

export default function AddTopicModal({ open, onClose, onSubmit, topics, defaultSubject = '' }) {
  const [subject, setSubject] = useState(defaultSubject);
  const [topicName, setTopicName] = useState('');

  const subjects = useMemo(() => [...new Set(topics.map((topic) => topic.subject))], [topics]);

  useEffect(() => {
    setSubject(defaultSubject || '');
  }, [defaultSubject, open]);

  return (
    <PixelModal
      open={open}
      onClose={onClose}
      title="+ ADD TOPIC"
      footer={
        <div className="row-wrap">
          <PixelButton
            onClick={() => {
              if (!subject || !topicName.trim()) return;
              const color = topics.find((topic) => topic.subject === subject)?.color || '#c084fc';
              onSubmit({ subject, topicName: topicName.trim(), color });
              setTopicName('');
            }}
          >
            SAVE
          </PixelButton>
          <PixelButton onClick={onClose}>CANCEL</PixelButton>
        </div>
      }
    >
      <label className="pixel-label" htmlFor="topicSubject" style={{ fontSize: 10 }}>
        SUBJECT
      </label>
      <select id="topicSubject" value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">SELECT SUBJECT</option>
        {subjects.map((item) => (
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
        value={topicName}
        onChange={(e) => setTopicName(e.target.value)}
        className="pixel-input-cursor"
      />
    </PixelModal>
  );
}

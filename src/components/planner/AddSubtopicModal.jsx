import { useEffect, useMemo, useState } from 'react';
import PixelModal from '../ui/PixelModal';
import PixelButton from '../ui/PixelButton';

export default function AddSubtopicModal({ open, onClose, onSubmit, topics, defaultTopicId = '' }) {
  const [topicId, setTopicId] = useState(defaultTopicId);
  const [name, setName] = useState('');

  const ordered = useMemo(
    () => [...topics].sort((a, b) => a.subject.localeCompare(b.subject) || a.order - b.order),
    [topics]
  );

  useEffect(() => {
    setTopicId(defaultTopicId || '');
  }, [defaultTopicId, open]);

  return (
    <PixelModal
      open={open}
      onClose={onClose}
      title="+ ADD SUBTOPIC"
      footer={
        <div className="row-wrap">
          <PixelButton
            onClick={() => {
              if (!topicId || !name.trim()) return;
              onSubmit({ topicId, name: name.trim() });
              setName('');
            }}
          >
            SAVE
          </PixelButton>
          <PixelButton onClick={onClose}>CANCEL</PixelButton>
        </div>
      }
    >
      <label className="pixel-label" htmlFor="subtopicTopic" style={{ fontSize: 10 }}>
        TOPIC
      </label>
      <select id="subtopicTopic" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
        <option value="">SELECT TOPIC</option>
        {ordered.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.subject} › {topic.topicName}
          </option>
        ))}
      </select>
      <label className="pixel-label" htmlFor="subtopicNameInput" style={{ fontSize: 10, marginTop: 10, display: 'block' }}>
        SUBTOPIC NAME
      </label>
      <input
        id="subtopicNameInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="pixel-input-cursor"
      />
    </PixelModal>
  );
}

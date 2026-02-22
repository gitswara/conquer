import { useMemo } from 'react';
import PixelCard from '../ui/PixelCard';
import { formatMinutes } from '../../utils/timeUtils';

export default function TopicSelector({ topics, selectedTopicId, selectedSubtopicId, onSelectTopic, onSelectSubtopic }) {
  const selectedTopic = useMemo(() => topics.find((topic) => topic.id === selectedTopicId) || null, [topics, selectedTopicId]);
  const selectedSubtopic = useMemo(
    () => selectedTopic?.subtopics.find((subtopic) => subtopic.id === selectedSubtopicId) || null,
    [selectedTopic, selectedSubtopicId]
  );

  if (!topics.length) {
    return (
      <PixelCard title="SELECT MISSION TARGET">
        <p style={{ color: 'var(--warning)', margin: 0 }}>⚠️ NO TOPICS FOUND — GO TO PLANNER.</p>
      </PixelCard>
    );
  }

  const sortedTopics = [...topics].sort((a, b) => a.subject.localeCompare(b.subject) || a.order - b.order);

  return (
    <PixelCard title="SELECT MISSION TARGET">
      <div style={{ display: 'grid', gap: 8 }}>
        <select aria-label="Select topic" value={selectedTopicId || ''} onChange={(e) => onSelectTopic(e.target.value)}>
          <option value="">SELECT TOPIC</option>
          {sortedTopics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.subject} › {topic.topicName}
            </option>
          ))}
        </select>

        <select
          aria-label="Select subtopic"
          value={selectedSubtopicId || ''}
          onChange={(e) => onSelectSubtopic(e.target.value)}
          disabled={!selectedTopic}
        >
          <option value="">SELECT SUBTOPIC</option>
          {(selectedTopic?.subtopics || [])
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((subtopic) => (
              <option key={subtopic.id} value={subtopic.id}>
                {subtopic.completed ? '✅ ' : ''}
                {subtopic.name}
              </option>
            ))}
        </select>
      </div>

      {selectedTopic && selectedSubtopic ? (
        <div
          style={{
            marginTop: 10,
            border: `2px solid ${selectedTopic.color || 'var(--border-dim)'}`,
            padding: 10,
            background: 'rgba(168, 85, 247, 0.08)'
          }}
        >
          <div style={{ fontSize: 12 }}>{selectedTopic.subject} › {selectedTopic.topicName} › {selectedSubtopic.name}</div>
          <div className="muted" style={{ marginTop: 6 }}>
            TIME ON TARGET: {formatMinutes(selectedSubtopic.timeSpentMinutes || 0)}
          </div>
        </div>
      ) : null}
    </PixelCard>
  );
}

import { Fragment, useMemo, useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import PixelModal from '../ui/PixelModal';
import AddSubjectModal from './AddSubjectModal';
import AddTopicModal from './AddTopicModal';
import AddSubtopicModal from './AddSubtopicModal';
import SubjectGroup from './SubjectGroup';
import TopicRow from './TopicRow';
import SubtopicRow from './SubtopicRow';
import { completionPercent } from '../../utils/progressUtils';
import { formatMinutes } from '../../utils/timeUtils';

function topicStats(topic) {
  const total = topic.subtopics.length;
  const completed = topic.subtopics.filter((subtopic) => subtopic.completed).length;
  const minutes = topic.subtopics.reduce((acc, subtopic) => acc + (subtopic.timeSpentMinutes || 0), 0);
  return { total, completed, minutes };
}

function subjectStats(topics) {
  const allSubtopics = topics.flatMap((topic) => topic.subtopics);
  const total = allSubtopics.length;
  const completed = allSubtopics.filter((subtopic) => subtopic.completed).length;
  const minutes = allSubtopics.reduce((acc, subtopic) => acc + (subtopic.timeSpentMinutes || 0), 0);
  return {
    total,
    completed,
    minutes,
    completion: completionPercent(completed, total)
  };
}

export default function SyllabusTable({
  topics,
  onAddSubject,
  onAddTopic,
  onAddSubtopic,
  onUpdateSubtopic,
  onToggleSubtopic,
  onDeleteSubject,
  onDeleteTopic,
  onDeleteSubtopic
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);
  const [topicModalSubject, setTopicModalSubject] = useState('');
  const [subtopicModalTopicId, setSubtopicModalTopicId] = useState('');

  const [deleteState, setDeleteState] = useState(null);

  const grouped = useMemo(() => {
    const map = new Map();
    topics.forEach((topic) => {
      if (!map.has(topic.subject)) map.set(topic.subject, []);
      map.get(topic.subject).push(topic);
    });

    return [...map.entries()]
      .map(([subject, subjectTopics]) => ({
        subject,
        color: subjectTopics[0]?.color,
        topics: [...subjectTopics].sort((a, b) => a.order - b.order)
      }))
      .sort((a, b) => a.subject.localeCompare(b.subject));
  }, [topics]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    function statusAllowed(subtopic) {
      if (statusFilter === 'COMPLETE') return subtopic.completed;
      if (statusFilter === 'INCOMPLETE') return !subtopic.completed;
      return true;
    }

    return grouped
      .map((group) => {
        const subjectMatch = group.subject.toLowerCase().includes(normalizedQuery);

        const visibleTopics = group.topics
          .map((topic) => {
            const topicMatch = topic.topicName.toLowerCase().includes(normalizedQuery);
            const sorted = [...topic.subtopics].sort((a, b) => a.order - b.order).filter(statusAllowed);
            const subtopicFiltered =
              normalizedQuery && !subjectMatch && !topicMatch
                ? sorted.filter((subtopic) => subtopic.name.toLowerCase().includes(normalizedQuery))
                : sorted;

            return {
              ...topic,
              visibleSubtopics: subtopicFiltered
            };
          })
          .filter((topic) => {
            if (!normalizedQuery) return true;
            const topicMatch = topic.topicName.toLowerCase().includes(normalizedQuery);
            return subjectMatch || topicMatch || topic.visibleSubtopics.length > 0;
          });

        return {
          ...group,
          topics: visibleTopics
        };
      })
      .filter((group) => group.topics.length > 0 || group.subject.toLowerCase().includes(normalizedQuery));
  }, [grouped, normalizedQuery, statusFilter]);

  const totals = useMemo(() => {
    const subjectCount = new Set(topics.map((topic) => topic.subject)).size;
    const topicCount = topics.length;
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);
    const subtopicCount = allSubtopics.length;
    const completedCount = allSubtopics.filter((subtopic) => subtopic.completed).length;
    const minutes = allSubtopics.reduce((acc, subtopic) => acc + (subtopic.timeSpentMinutes || 0), 0);
    return {
      subjectCount,
      topicCount,
      subtopicCount,
      percent: completionPercent(completedCount, subtopicCount),
      minutes
    };
  }, [topics]);

  if (!topics.length) {
    return (
      <PixelCard title="SYLLABUS">
        <p>No topics yet. Start by adding a subject.</p>
        <PixelButton onClick={() => setShowSubjectModal(true)}>+ ADD SUBJECT</PixelButton>

        <AddSubjectModal
          open={showSubjectModal}
          onClose={() => setShowSubjectModal(false)}
          onSubmit={(payload) => {
            onAddSubject(payload);
            setShowSubjectModal(false);
          }}
        />
      </PixelCard>
    );
  }

  return (
    <div className="section-stack">
      <PixelCard title="SYLLABUS" right={<span>{totals.percent}% COMPLETE</span>}>
        <div className="control-grid">
          <div>
            <label className="field-label" htmlFor="syllabusSearch">SEARCH</label>
            <input
              id="syllabusSearch"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subject, topic, or subtopic"
              aria-label="Search syllabus"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="syllabusFilter">STATUS FILTER</label>
            <select
              id="syllabusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter completion status"
            >
              <option value="ALL">ALL</option>
              <option value="INCOMPLETE">INCOMPLETE</option>
              <option value="COMPLETE">COMPLETE</option>
            </select>
          </div>
        </div>

        <div className="toolbar-panel" style={{ marginBottom: 12 }}>
          <div className="field-label">ADD ITEMS</div>
          <div className="row-wrap">
            <PixelButton onClick={() => setShowSubjectModal(true)}>+ ADD SUBJECT</PixelButton>
            <PixelButton
              onClick={() => {
                setTopicModalSubject('');
                setShowTopicModal(true);
              }}
            >
              + ADD TOPIC
            </PixelButton>
            <PixelButton
              onClick={() => {
                setSubtopicModalTopicId('');
                setShowSubtopicModal(true);
              }}
            >
              + ADD SUBTOPIC
            </PixelButton>
          </div>
        </div>

        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table className="planner-table readable-table" style={{ minWidth: 1080, width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-dim)' }}>
                <th align="left"></th>
                <th align="left">SUBJECT</th>
                <th align="left">TOPIC</th>
                <th align="left">SUBTOPIC</th>
                <th align="left">TIME SPENT</th>
                <th align="left">COMPLETED ON</th>
                <th align="left">NOTES</th>
                <th align="left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => {
                const fullGroupTopics = grouped.find((entry) => entry.subject === group.subject)?.topics || [];
                const groupStats = subjectStats(fullGroupTopics);

                return (
                  <Fragment key={group.subject}>
                    <SubjectGroup
                      key={`${group.subject}-header`}
                      subject={group.subject}
                      color={group.color}
                      stats={groupStats}
                      onAddTopic={() => {
                        setTopicModalSubject(group.subject);
                        setShowTopicModal(true);
                      }}
                      onDeleteSubject={() =>
                        setDeleteState({
                          type: 'subject',
                          subject: group.subject,
                          name: group.subject
                        })
                      }
                    />

                    {group.topics.map((topic) => {
                      const stats = topicStats(topic);
                      return (
                        <Fragment key={topic.id}>
                          <TopicRow
                            topic={topic}
                            stats={stats}
                            onAddSubtopic={() => {
                              setSubtopicModalTopicId(topic.id);
                              setShowSubtopicModal(true);
                            }}
                            onDelete={() =>
                              setDeleteState({
                                type: 'topic',
                                topicId: topic.id,
                                name: topic.topicName
                              })
                            }
                          />

                          {topic.visibleSubtopics.map((subtopic) => (
                            <SubtopicRow
                              key={`${topic.id}-${subtopic.id}`}
                              topic={topic}
                              subtopic={subtopic}
                              onToggleComplete={(checked) => onToggleSubtopic(topic.id, subtopic.id, checked)}
                              onRename={(name) => {
                                if (!name.trim()) return;
                                onUpdateSubtopic(topic.id, subtopic.id, { name: name.trim() });
                              }}
                              onUpdateNotes={(notes) => onUpdateSubtopic(topic.id, subtopic.id, { notes })}
                              onDelete={() =>
                                setDeleteState({
                                  type: 'subtopic',
                                  topicId: topic.id,
                                  subtopicId: subtopic.id,
                                  name: subtopic.name
                                })
                              }
                            />
                          ))}
                        </Fragment>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ position: 'sticky', bottom: 0, borderTop: '2px solid var(--border-bright)' }}>
                <td colSpan={8}>
                  TOTAL: {totals.subjectCount} subjects | {totals.topicCount} topics | {totals.subtopicCount} subtopics |
                  {' '}{totals.percent}% complete | {formatMinutes(totals.minutes)} studied
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </PixelCard>

      <AddSubjectModal
        open={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        onSubmit={(payload) => {
          onAddSubject(payload);
          setShowSubjectModal(false);
        }}
      />
      <AddTopicModal
        open={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        topics={topics}
        defaultSubject={topicModalSubject}
        onSubmit={(payload) => {
          onAddTopic(payload);
          setShowTopicModal(false);
        }}
      />
      <AddSubtopicModal
        open={showSubtopicModal}
        onClose={() => setShowSubtopicModal(false)}
        topics={topics}
        defaultTopicId={subtopicModalTopicId}
        onSubmit={({ topicId, name }) => {
          onAddSubtopic(topicId, name);
          setShowSubtopicModal(false);
        }}
      />

      <PixelModal
        open={Boolean(deleteState)}
        onClose={() => setDeleteState(null)}
        title={`DELETE ${deleteState?.name || ''}?`}
        footer={
          <div className="row-wrap">
            <PixelButton
              variant="danger"
              onClick={() => {
                if (!deleteState) return;
                if (deleteState.type === 'subject') {
                  onDeleteSubject(deleteState.subject);
                } else if (deleteState.type === 'topic') {
                  onDeleteTopic(deleteState.topicId);
                } else if (deleteState.type === 'subtopic') {
                  onDeleteSubtopic(deleteState.topicId, deleteState.subtopicId);
                }
                setDeleteState(null);
              }}
            >
              YES
            </PixelButton>
            <PixelButton onClick={() => setDeleteState(null)}>NO</PixelButton>
          </div>
        }
      >
        <p>ALL DATA WILL BE LOST.</p>
      </PixelModal>
    </div>
  );
}

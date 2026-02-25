import { Fragment, useEffect, useMemo, useState } from 'react';
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
  const subtopicTotal = topic.subtopics.length;
  const subtopicCompleted = topic.subtopics.filter((subtopic) => subtopic.completed).length;

  if (!topic.subtopics.length) {
    return {
      total: 1,
      completed: topic.completed ? 1 : 0,
      minutes: 0,
      hasSubtopics: false,
      completedAt: topic.completed ? topic.completedAt : null,
      subtopicTotal,
      subtopicCompleted
    };
  }

  const total = topic.subtopics.length;
  const completed = topic.subtopics.filter((subtopic) => subtopic.completed).length;
  const minutes = topic.subtopics.reduce((acc, subtopic) => acc + (subtopic.timeSpentMinutes || 0), 0);
  const completedDates = topic.subtopics
    .map((subtopic) => subtopic.completedAt)
    .filter(Boolean)
    .sort();
  return {
    total,
    completed,
    minutes,
    hasSubtopics: true,
    completedAt: completed === total ? completedDates[completedDates.length - 1] || null : null,
    subtopicTotal,
    subtopicCompleted
  };
}

function subjectStats(topics) {
  let totalUnits = 0;
  let completedUnits = 0;
  let minutes = 0;
  const completionDates = [];
  let hasSubtopics = false;
  let topicTotal = topics.length;
  let topicCompleted = 0;

  topics.forEach((topic) => {
    const completedAtTopicLevel = topic.subtopics.length
      ? topic.subtopics.length > 0 && topic.subtopics.every((subtopic) => subtopic.completed)
      : Boolean(topic.completed);
    if (completedAtTopicLevel) topicCompleted += 1;

    if (!topic.subtopics.length) {
      totalUnits += 1;
      if (topic.completed) {
        completedUnits += 1;
        if (topic.completedAt) completionDates.push(topic.completedAt);
      }
      return;
    }

    hasSubtopics = true;
    totalUnits += topic.subtopics.length;
    topic.subtopics.forEach((subtopic) => {
      minutes += subtopic.timeSpentMinutes || 0;
      if (subtopic.completed) {
        completedUnits += 1;
        if (subtopic.completedAt) completionDates.push(subtopic.completedAt);
      }
    });
  });

  completionDates.sort();
  return {
    totalUnits,
    completedUnits,
    minutes,
    completion: completionPercent(completedUnits, totalUnits),
    hasSubtopics,
    completedAt: completedUnits === totalUnits ? completionDates[completionDates.length - 1] || null : null,
    topicTotal,
    topicCompleted
  };
}

export default function SyllabusTable({
  subjects = [],
  topics,
  onAddSubject,
  onAddTopic,
  onAddSubtopic,
  onRenameSubject,
  onUpdateTopic,
  onUpdateSubtopic,
  onToggleSubtopic,
  onToggleTopic,
  onToggleSubject,
  onDeleteSubject,
  onDeleteTopic,
  onDeleteSubtopic
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [subjectExpanded, setSubjectExpanded] = useState({});
  const [topicExpanded, setTopicExpanded] = useState({});

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);
  const [topicModalSubject, setTopicModalSubject] = useState('');
  const [subtopicModalTopicId, setSubtopicModalTopicId] = useState('');

  const [deleteState, setDeleteState] = useState(null);

  const grouped = useMemo(() => {
    const map = new Map();
    const orderedSubjects = [...subjects].sort((a, b) => (a.order || 0) - (b.order || 0));

    orderedSubjects.forEach((subject, index) => {
      map.set(subject.name, {
        subject: subject.name,
        color: subject.color || '#c084fc',
        topics: [],
        sortKey: subject.order || index + 1,
        completed: Boolean(subject.completed),
        completedAt: subject.completedAt || null
      });
    });

    topics.forEach((topic, index) => {
      if (!map.has(topic.subject)) {
        map.set(topic.subject, {
          subject: topic.subject,
          color: topic.color || '#c084fc',
          topics: [],
          sortKey: 10_000 + index,
          completed: false,
          completedAt: null
        });
      }

      const group = map.get(topic.subject);
      group.topics.push(topic);
      if (!group.color && topic.color) group.color = topic.color;
    });

    return [...map.values()]
      .sort((a, b) => a.sortKey - b.sortKey || a.subject.localeCompare(b.subject))
      .map((group) => ({
        subject: group.subject,
        color: group.color,
        completed: group.completed,
        completedAt: group.completedAt,
        topics: [...group.topics].sort((a, b) => a.order - b.order)
      }));
  }, [subjects, topics]);

  useEffect(() => {
    setSubjectExpanded((previous) => {
      const next = {};
      grouped.forEach((group) => {
        next[group.subject] = previous[group.subject] ?? true;
      });
      return next;
    });
  }, [grouped]);

  useEffect(() => {
    setTopicExpanded((previous) => {
      const next = {};
      grouped.forEach((group) => {
        group.topics.forEach((topic) => {
          next[topic.id] = previous[topic.id] ?? false;
        });
      });
      return next;
    });
  }, [grouped]);

  const numbering = useMemo(() => {
    const subjectNumbers = new Map();
    const topicNumbers = new Map();
    const subtopicNumbers = new Map();

    grouped.forEach((group, subjectIndex) => {
      const subjectNumber = `${subjectIndex + 1}.`;
      subjectNumbers.set(group.subject, subjectNumber);

      group.topics.forEach((topic, topicIndex) => {
        const topicNumber = `${subjectIndex + 1}.${topicIndex + 1}`;
        topicNumbers.set(topic.id, topicNumber);

        [...topic.subtopics]
          .sort((a, b) => a.order - b.order)
          .forEach((subtopic, subtopicIndex) => {
            subtopicNumbers.set(`${topic.id}:${subtopic.id}`, `${topicNumber}.${subtopicIndex + 1}`);
          });
      });
    });

    return { subjectNumbers, topicNumbers, subtopicNumbers };
  }, [grouped]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    function statusAllowedSubtopic(subtopic) {
      if (statusFilter === 'COMPLETE') return subtopic.completed;
      if (statusFilter === 'INCOMPLETE') return !subtopic.completed;
      return true;
    }

    function topicStatusMatch(topic) {
      if (statusFilter === 'ALL') return true;
      if (!topic.subtopics.length) {
        return statusFilter === 'COMPLETE' ? Boolean(topic.completed) : !topic.completed;
      }
      if (statusFilter === 'COMPLETE') {
        return topic.subtopics.some((subtopic) => subtopic.completed);
      }
      return topic.subtopics.some((subtopic) => !subtopic.completed);
    }

    return grouped
      .map((group) => {
        const subjectMatch = group.subject.toLowerCase().includes(normalizedQuery);

        const visibleTopics = group.topics
          .map((topic) => {
            const topicMatch = topic.topicName.toLowerCase().includes(normalizedQuery);
            const sortedSubtopics = [...topic.subtopics].sort((a, b) => a.order - b.order);
            const statusFilteredSubtopics = sortedSubtopics.filter(statusAllowedSubtopic);
            const visibleSubtopics = normalizedQuery && !subjectMatch && !topicMatch
              ? statusFilteredSubtopics.filter((subtopic) => subtopic.name.toLowerCase().includes(normalizedQuery))
              : statusFilteredSubtopics;

            return {
              ...topic,
              topicStatusMatch: topicStatusMatch(topic),
              visibleSubtopics
            };
          })
          .filter((topic) => {
            if (!topic.topicStatusMatch) return false;
            if (!normalizedQuery) return true;
            const topicMatch = topic.topicName.toLowerCase().includes(normalizedQuery);
            return subjectMatch || topicMatch || topic.visibleSubtopics.length > 0;
          });

        const subjectStatusMatch = statusFilter === 'ALL'
          ? true
          : (statusFilter === 'COMPLETE' ? group.completed : !group.completed);

        const groupStatusMatch = group.topics.length ? visibleTopics.length > 0 : subjectStatusMatch;
        const groupQueryMatch = !normalizedQuery || subjectMatch || visibleTopics.length > 0;

        return {
          ...group,
          topics: visibleTopics,
          groupStatusMatch,
          groupQueryMatch
        };
      })
      .filter((group) => group.groupStatusMatch && group.groupQueryMatch);
  }, [grouped, normalizedQuery, statusFilter]);

  const totals = useMemo(() => {
    const subjectCount = subjects.length || new Set(topics.map((topic) => topic.subject)).size;
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
  }, [subjects, topics]);

  function handleExpandAll() {
    setSubjectExpanded(Object.fromEntries(grouped.map((group) => [group.subject, true])));
    setTopicExpanded(Object.fromEntries(grouped.flatMap((group) => group.topics.map((topic) => [topic.id, true]))));
  }

  function handleCollapseAll() {
    setSubjectExpanded(Object.fromEntries(grouped.map((group) => [group.subject, false])));
    setTopicExpanded(Object.fromEntries(grouped.flatMap((group) => group.topics.map((topic) => [topic.id, false]))));
  }

  if (!grouped.length) {
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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subject, topic, or subtopic"
              aria-label="Search syllabus"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="syllabusFilter">STATUS FILTER</label>
            <select
              id="syllabusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
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
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
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

            <div className="row-wrap">
              <button type="button" className="table-action" onClick={handleExpandAll}>⊞ EXPAND ALL</button>
              <button type="button" className="table-action" onClick={handleCollapseAll}>⊟ COLLAPSE ALL</button>
            </div>
          </div>
        </div>

        <div className="stats-strip" style={{ marginBottom: 12 }}>
          TOTAL: {totals.subjectCount} subjects | {totals.topicCount} topics | {totals.subtopicCount} subtopics |
          {' '}{totals.percent}% complete | {formatMinutes(totals.minutes)} studied
        </div>

        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table
            className="planner-table readable-table"
            style={{
              minWidth: 760,
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              tableLayout: 'fixed'
            }}
          >
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '42%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '12%' }} />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-dim)' }}>
                <th align="left">#</th>
                <th align="left">✓</th>
                <th align="left">NAME</th>
                <th align="left">TIME SPENT</th>
                <th align="left">COMPLETED ON</th>
                <th align="left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => {
                const fullGroupTopics = grouped.find((entry) => entry.subject === group.subject)?.topics || [];
                const groupStats = subjectStats(fullGroupTopics);
                const isSubjectExpanded = subjectExpanded[group.subject] ?? true;
                const canDirectlyToggleSubject = fullGroupTopics.length === 0;
                const isSubjectCompleted = canDirectlyToggleSubject
                  ? Boolean(group.completed)
                  : fullGroupTopics.every((topic) =>
                      topic.subtopics.length
                        ? topic.subtopics.every((subtopic) => subtopic.completed)
                        : Boolean(topic.completed)
                    );

                return (
                  <Fragment key={group.subject}>
                    <SubjectGroup
                      subject={group.subject}
                      stats={groupStats}
                      number={numbering.subjectNumbers.get(group.subject) || '—'}
                      onRowToggle={() =>
                        setSubjectExpanded((previous) => ({
                          ...previous,
                          [group.subject]: !isSubjectExpanded
                        }))
                      }
                      showCompletionCheckbox={canDirectlyToggleSubject}
                      completed={isSubjectCompleted}
                      completedOn={fullGroupTopics.length ? groupStats.completedAt : (group.completedAt || null)}
                      onToggleComplete={(checked) => onToggleSubject(group.subject, checked)}
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
                      onRenameSubject={(name) => {
                        if (name === group.subject) return;
                        onRenameSubject(group.subject, name);
                      }}
                    />

                    {isSubjectExpanded
                      ? group.topics.map((topic) => {
                          const stats = topicStats(topic);
                          const isTopicExpanded = topicExpanded[topic.id] ?? false;
                          return (
                            <Fragment key={topic.id}>
                              <TopicRow
                                topic={topic}
                                stats={stats}
                                number={numbering.topicNumbers.get(topic.id) || '—'}
                                onRowToggle={() =>
                                  setTopicExpanded((previous) => ({
                                    ...previous,
                                    [topic.id]: !isTopicExpanded
                                  }))
                                }
                                showCompletionCheckbox={!topic.subtopics.length}
                                completed={Boolean(topic.completed)}
                                completedOn={stats.completedAt}
                                onToggleComplete={(checked) => onToggleTopic(topic.id, checked)}
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
                                onRename={(name) => {
                                  if (name === topic.topicName) return;
                                  onUpdateTopic(topic.id, { topicName: name });
                                }}
                              />

                              {isTopicExpanded
                                ? topic.visibleSubtopics.map((subtopic) => (
                                    <SubtopicRow
                                      key={`${topic.id}-${subtopic.id}`}
                                      subtopic={subtopic}
                                      number={numbering.subtopicNumbers.get(`${topic.id}:${subtopic.id}`) || '—'}
                                      onToggleComplete={(checked) => onToggleSubtopic(topic.id, subtopic.id, checked)}
                                      onRename={(name) => {
                                        if (name === subtopic.name) return;
                                        onUpdateSubtopic(topic.id, subtopic.id, { name });
                                      }}
                                      onDelete={() =>
                                        setDeleteState({
                                          type: 'subtopic',
                                          topicId: topic.id,
                                          subtopicId: subtopic.id,
                                          name: subtopic.name
                                        })
                                      }
                                    />
                                  ))
                                : null}
                            </Fragment>
                          );
                        })
                      : null}
                  </Fragment>
                );
              })}
            </tbody>
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
        subjects={subjects}
        topics={topics}
        defaultSubject={topicModalSubject}
        onSubmit={(payload) => {
          onAddTopic(payload);
          setSubjectExpanded((previous) => ({
            ...previous,
            [payload.subject]: true
          }));
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
          setTopicExpanded((previous) => ({
            ...previous,
            [topicId]: true
          }));
          const parentSubject = topics.find((topic) => topic.id === topicId)?.subject;
          if (parentSubject) {
            setSubjectExpanded((previous) => ({
              ...previous,
              [parentSubject]: true
            }));
          }
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

import { getLevelFromProgress } from '../constants/levels';

export function flattenSubtopics(topics) {
  return topics.flatMap((topic) => topic.subtopics.map((subtopic) => ({ ...subtopic, topicId: topic.id })));
}

export function flattenProgressUnits(subjects = [], topics = []) {
  const units = [];
  const topicBySubject = topics.reduce((acc, topic) => {
    if (!acc[topic.subject]) acc[topic.subject] = [];
    acc[topic.subject].push(topic);
    return acc;
  }, {});

  const subjectNames = [
    ...new Set([
      ...subjects.map((subject) => subject.name),
      ...topics.map((topic) => topic.subject)
    ])
  ];

  subjectNames.forEach((subjectName) => {
    const subjectRecord = subjects.find((subject) => subject.name === subjectName);
    const subjectTopics = topicBySubject[subjectName] || [];

    if (!subjectTopics.length) {
      units.push({
        type: 'subject',
        subject: subjectName,
        completed: Boolean(subjectRecord?.completed)
      });
      return;
    }

    subjectTopics.forEach((topic) => {
      if (!topic.subtopics.length) {
        units.push({
          type: 'topic',
          topicId: topic.id,
          completed: Boolean(topic.completed)
        });
        return;
      }

      topic.subtopics.forEach((subtopic) => {
        units.push({
          type: 'subtopic',
          topicId: topic.id,
          subtopicId: subtopic.id,
          completed: Boolean(subtopic.completed)
        });
      });
    });
  });

  return units;
}

export function getProgressStats(subjects = [], topics = []) {
  const units = flattenProgressUnits(subjects, topics);
  const total = units.length;
  const completed = units.filter((unit) => unit.completed).length;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  const level = getLevelFromProgress(progress);
  return { total, completed, progress, level };
}

export function groupTopicsBySubject(topics) {
  return topics.reduce((acc, topic) => {
    if (!acc[topic.subject]) acc[topic.subject] = [];
    acc[topic.subject].push(topic);
    return acc;
  }, {});
}

export function completionPercent(completed, total) {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
}

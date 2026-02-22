import { getLevelFromProgress } from '../constants/levels';

export function flattenSubtopics(topics) {
  return topics.flatMap((topic) => topic.subtopics.map((subtopic) => ({ ...subtopic, topicId: topic.id })));
}

export function getProgressStats(topics) {
  const subtopics = flattenSubtopics(topics);
  const total = subtopics.length;
  const completed = subtopics.filter((s) => s.completed).length;
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

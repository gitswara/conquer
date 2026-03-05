import { differenceInCalendarDays } from 'date-fns';
import { getLevelFromProgress } from '../constants/levels';
import { safeParseISO, todayISODate, toISODate } from './dateUtils';

export function getSubtopicCompletion(topics = []) {
  const subtopics = topics.flatMap((topic) => topic.subtopics || []);
  const total = subtopics.length;
  const completed = subtopics.filter((subtopic) => subtopic.completed).length;
  return {
    total,
    completed,
    allComplete: total > 0 && completed === total
  };
}

export function isExamDateReached(examDateISO, currentDateISO = todayISODate()) {
  if (!examDateISO) return false;
  return currentDateISO >= examDateISO;
}

export function isQuestCompletedForData({ config, topics }, currentDateISO = todayISODate()) {
  const subtopicCompletion = getSubtopicCompletion(topics || []);
  return subtopicCompletion.allComplete && isExamDateReached(config?.examDate, currentDateISO);
}

export function getQuestLootStats({
  config,
  topics = [],
  sessions = [],
  createdAt
}) {
  const subtopicCompletion = getSubtopicCompletion(topics);
  const totalMinutes = sessions.reduce((acc, session) => acc + (Number(session.durationMinutes) || 0), 0);

  const examDate = safeParseISO(config?.examDate);
  const planStart = safeParseISO(createdAt || config?.createdAt);
  const avgMinutesPerDay = (() => {
    if (!examDate || !planStart) return totalMinutes;
    const examISO = toISODate(examDate);
    const startISO = toISODate(planStart);
    const daySpan = Math.max(1, differenceInCalendarDays(safeParseISO(examISO), safeParseISO(startISO)) + 1);
    return Math.round(totalMinutes / daySpan);
  })();

  const progress = subtopicCompletion.total > 0
    ? (subtopicCompletion.completed / subtopicCompletion.total) * 100
    : 0;

  const finalLevel = subtopicCompletion.allComplete
    ? 'Lv.MAX Legend'
    : getLevelFromProgress(progress).label;

  return {
    unitsCompleted: subtopicCompletion.completed,
    totalSubtopics: subtopicCompletion.total,
    totalMinutes,
    avgMinutesPerDay,
    finalLevel
  };
}

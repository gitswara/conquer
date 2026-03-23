import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '../utils/id';
import { recalculateStreakFromSessions, reconcileStreakForNewDay } from '../utils/streakUtils';
import { todayISODate } from '../utils/dateUtils';

const initialStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  streakHistory: [],
  streakNotifiedDate: ''
};

const initialState = {
  config: null,
  subjects: [],
  topics: [],
  sessions: [],
  questCompletedSeen: false,
  streak: initialStreak,
  activeSession: null,
  ui: {
    tab: 'HOME',
    plannerSubtab: 'SYLLABUS',
    plannerFocusTopicId: ''
  }
};

function nextOrder(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.order || 0)) + 1;
}

function normalizeSubjectName(subject) {
  return String(subject || '').trim();
}

function normalizeDueDate(value) {
  return value ? String(value) : '';
}

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function rebuildSubtopicMinutesFromSessions(topics, sessions) {
  const minutesBySubtopic = new Map();

  sessions.forEach((session) => {
    if (!session.topicId || !session.subtopicId) return;
    const key = `${session.topicId}:${session.subtopicId}`;
    minutesBySubtopic.set(key, (minutesBySubtopic.get(key) || 0) + (Number(session.durationMinutes) || 0));
  });

  return topics.map((topic) => ({
    ...topic,
    subtopics: topic.subtopics.map((subtopic) => ({
      ...subtopic,
      timeSpentMinutes: minutesBySubtopic.get(`${topic.id}:${subtopic.id}`) || 0
    }))
  }));
}

function deriveSubjectsFromTopics(topics) {
  const map = new Map();
  topics.forEach((topic, index) => {
    const name = normalizeSubjectName(topic.subject);
    if (!name) return;
    if (map.has(name)) return;
    map.set(name, {
      id: uid('subject'),
      name,
      color: topic.color || '#c084fc',
      completed: false,
      completedAt: null,
      order: index + 1
    });
  });
  return [...map.values()].sort((a, b) => a.order - b.order);
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      hydrateForToday: () => {
        const streak = reconcileStreakForNewDay(get().streak);
        set({ streak });
      },

      setTab: (tab) => set((state) => ({ ui: { ...state.ui, tab } })),
      setPlannerSubtab: (plannerSubtab) => set((state) => ({ ui: { ...state.ui, plannerSubtab } })),
      setPlannerFocusTopic: (plannerFocusTopicId) =>
        set((state) => ({ ui: { ...state.ui, plannerFocusTopicId: plannerFocusTopicId || '' } })),
      setQuestCompletedSeen: (questCompletedSeen) => set({ questCompletedSeen: Boolean(questCompletedSeen) }),
      setStreakNotifiedDate: (dateISO) =>
        set((state) => ({
          streak: {
            ...state.streak,
            streakNotifiedDate: dateISO || ''
          }
        })),

      setConfig: (config) =>
        set({
          config: {
            ...config,
            createdAt: config.createdAt || new Date().toISOString()
          }
        }),

      updateConfig: (patch) =>
        set((state) => ({
          config: {
            ...state.config,
            ...patch
          }
        })),

      addRevisionPeriod: (period) =>
        set((state) => {
          if (!state.config) return state;
          return {
            config: {
              ...state.config,
              revisionPeriods: [...(state.config.revisionPeriods || []), { id: uid('rev'), ...period }]
            }
          };
        }),

      updateRevisionPeriod: (periodId, patch) =>
        set((state) => {
          if (!state.config) return state;
          return {
            config: {
              ...state.config,
              revisionPeriods: (state.config.revisionPeriods || []).map((period) =>
                period.id === periodId ? { ...period, ...patch } : period
              )
            }
          };
        }),

      removeRevisionPeriod: (periodId) =>
        set((state) => {
          if (!state.config) return state;
          return {
            config: {
              ...state.config,
              revisionPeriods: (state.config.revisionPeriods || []).filter((period) => period.id !== periodId)
            }
          };
        }),

      addSubject: ({ subjectName, color }) =>
        set((state) => {
          const normalized = normalizeSubjectName(subjectName);
          if (!normalized) return state;
          if (state.subjects.some((subject) => subject.name === normalized)) return state;
          return {
            subjects: [
              ...state.subjects,
              {
                id: uid('subject'),
                name: normalized,
                color: color || '#c084fc',
                completed: false,
                completedAt: null,
                order: nextOrder(state.subjects)
              }
            ]
          };
        }),

      addTopic: ({ subject, color, topicName }) =>
        set((state) => {
          const normalizedSubject = normalizeSubjectName(subject);
          if (!normalizedSubject) return state;
          const subjectTopics = state.topics.filter((topic) => topic.subject === normalizedSubject);
          const topic = {
            id: uid('topic'),
            subject: normalizedSubject,
            topicName,
            subtopics: [],
            completed: false,
            completedAt: null,
            order: nextOrder(subjectTopics),
            color: color || '#c084fc',
            dueDate: ''
          };
          const hasSubject = state.subjects.some((entry) => entry.name === normalizedSubject);
          return {
            topics: [...state.topics, topic],
            subjects: hasSubject
              ? state.subjects
              : [
                  ...state.subjects,
                  {
                    id: uid('subject'),
                    name: normalizedSubject,
                    color: color || '#c084fc',
                    completed: false,
                    completedAt: null,
                    order: nextOrder(state.subjects)
                  }
                ]
          };
        }),

      addSubtopic: (topicId, name) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            const subtopic = {
              id: uid('sub'),
              name,
              completed: false,
              completedAt: null,
              timeSpentMinutes: 0,
              notes: '',
              order: nextOrder(topic.subtopics)
            };
            return {
              ...topic,
              completed: false,
              completedAt: null,
              subtopics: [...topic.subtopics, subtopic]
            };
          })
        })),

      updateTopic: (topicId, patch) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  ...patch,
                  dueDate: Object.prototype.hasOwnProperty.call(patch || {}, 'dueDate')
                    ? normalizeDueDate(patch.dueDate)
                    : topic.dueDate || ''
                }
              : topic
          )
        })),

      renameSubject: (previousSubject, nextSubject) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.name === previousSubject ? { ...subject, name: nextSubject } : subject
          ),
          topics: state.topics.map((topic) =>
            topic.subject === previousSubject ? { ...topic, subject: nextSubject } : topic
          )
        })),

      updateSubtopic: (topicId, subtopicId, patch) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.id === subtopicId ? { ...subtopic, ...patch } : subtopic
              )
            };
          })
        })),

      toggleSubtopicCompleted: (topicId, subtopicId, completed) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) => {
                if (subtopic.id !== subtopicId) return subtopic;
                return {
                  ...subtopic,
                  completed,
                  completedAt: completed ? new Date().toISOString() : null
                };
              })
            };
          })
        })),

      toggleTopicCompleted: (topicId, completed) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              completed: Boolean(completed),
              completedAt: completed ? new Date().toISOString() : null
            };
          })
        })),

      toggleSubjectCompleted: (subject, completed) =>
        set((state) => ({
          subjects: state.subjects.map((entry) =>
            entry.name !== subject
              ? entry
              : {
                  ...entry,
                  completed: Boolean(completed),
                  completedAt: completed ? new Date().toISOString() : null
                }
          ),
          topics: state.topics.map((topic) => {
            if (topic.subject !== subject || topic.subtopics.length > 0) return topic;
            return {
              ...topic,
              completed: Boolean(completed),
              completedAt: completed ? new Date().toISOString() : null
            };
          })
        })),

      deleteTopic: (topicId) =>
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== topicId)
        })),

      deleteSubject: (subject) =>
        set((state) => ({
          subjects: state.subjects.filter((entry) => entry.name !== subject),
          topics: state.topics.filter((topic) => topic.subject !== subject)
        })),

      deleteSubtopic: (topicId, subtopicId) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subtopics: topic.subtopics.filter((subtopic) => subtopic.id !== subtopicId)
            };
          })
        })),

      moveTopic: (topicId, direction) =>
        set((state) => {
          const topic = state.topics.find((entry) => entry.id === topicId);
          if (!topic) return state;

          const subjectTopics = state.topics
            .filter((entry) => entry.subject === topic.subject)
            .sort((a, b) => a.order - b.order);
          const index = subjectTopics.findIndex((entry) => entry.id === topicId);
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= subjectTopics.length) return state;

          const target = subjectTopics[targetIndex];
          return {
            topics: state.topics.map((entry) => {
              if (entry.id === topicId) return { ...entry, order: target.order };
              if (entry.id === target.id) return { ...entry, order: topic.order };
              return entry;
            })
          };
        }),

      moveSubtopic: (topicId, subtopicId, direction) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            const ordered = [...topic.subtopics].sort((a, b) => a.order - b.order);
            const index = ordered.findIndex((entry) => entry.id === subtopicId);
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= ordered.length) return topic;

            const current = ordered[index];
            const target = ordered[targetIndex];
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) => {
                if (subtopic.id === current.id) return { ...subtopic, order: target.order };
                if (subtopic.id === target.id) return { ...subtopic, order: current.order };
                return subtopic;
              })
            };
          })
        })),

      reorderSubjects: (orderedSubjectNames) =>
        set((state) => {
          const orderMap = new Map((orderedSubjectNames || []).map((name, index) => [name, index + 1]));
          return {
            subjects: state.subjects.map((subject) =>
              orderMap.has(subject.name)
                ? {
                    ...subject,
                    order: orderMap.get(subject.name)
                  }
                : subject
            )
          };
        }),

      reorderTopics: (subject, orderedTopicIds) =>
        set((state) => {
          const orderMap = new Map((orderedTopicIds || []).map((id, index) => [id, index + 1]));
          return {
            topics: state.topics.map((topic) => {
              if (topic.subject !== subject || !orderMap.has(topic.id)) return topic;
              return {
                ...topic,
                order: orderMap.get(topic.id)
              };
            })
          };
        }),

      reorderSubtopics: (topicId, orderedSubtopicIds) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            const orderMap = new Map((orderedSubtopicIds || []).map((id, index) => [id, index + 1]));
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                orderMap.has(subtopic.id)
                  ? {
                      ...subtopic,
                      order: orderMap.get(subtopic.id)
                    }
                  : subtopic
              )
            };
          })
        })),

      startSession: ({ topicId, subtopicId, targetMinutes }) => {
        const now = Date.now();
        const topic = get().topics.find((entry) => entry.id === topicId);
        const resolvedSubtopicId = subtopicId
          || sortByOrder(topic?.subtopics || [])[0]?.id
          || '';
        set({
          activeSession: {
            id: uid('active'),
            topicId,
            subtopicId: resolvedSubtopicId,
            startTime: new Date(now).toISOString(),
            lastResumedAt: now,
            elapsedSecondsBeforePause: 0,
            running: true,
            targetMinutes: Number(targetMinutes) || 0
          }
        });
      },

      pauseSession: () =>
        set((state) => {
          if (!state.activeSession?.running) return state;
          const now = Date.now();
          const elapsedChunk = Math.floor((now - state.activeSession.lastResumedAt) / 1000);
          return {
            activeSession: {
              ...state.activeSession,
              running: false,
              elapsedSecondsBeforePause: state.activeSession.elapsedSecondsBeforePause + elapsedChunk
            }
          };
        }),

      resumeSession: () =>
        set((state) => {
          if (!state.activeSession || state.activeSession.running) return state;
          return {
            activeSession: {
              ...state.activeSession,
              running: true,
              lastResumedAt: Date.now()
            }
          };
        }),

      clearActiveSession: () => set({ activeSession: null }),

      commitSession: ({ markCompleted = false, completionSubtopicId = '', markWholeTopicCompleted = false } = {}) => {
        const state = get();
        const active = state.activeSession;
        if (!active) return null;

        const now = Date.now();
        const elapsedRunning = active.running ? Math.floor((now - active.lastResumedAt) / 1000) : 0;
        const totalSeconds = active.elapsedSecondsBeforePause + elapsedRunning;
        const durationMinutes = Math.max(1, Math.floor(totalSeconds / 60));

        const sessionDate = todayISODate();
        const completionTimestamp = new Date(now).toISOString();
        const activeTopic = state.topics.find((topic) => topic.id === active.topicId);
        const fallbackSubtopicId = sortByOrder(activeTopic?.subtopics || [])[0]?.id || '';
        const targetSubtopicId = active.subtopicId || completionSubtopicId || fallbackSubtopicId || '';
        const completeEntireTopic = Boolean(markCompleted && markWholeTopicCompleted);

        const session = {
          id: uid('session'),
          topicId: active.topicId,
          subtopicId: targetSubtopicId,
          startTime: active.startTime,
          endTime: completionTimestamp,
          sessionDate,
          durationMinutes,
          countedForStreak: false
        };

        const nextSessions = [...state.sessions, session];
        const streakBase = reconcileStreakForNewDay(state.streak);
        const recalculated = recalculateStreakFromSessions(streakBase, nextSessions);
        const recalculatedSession = recalculated.sessions.find((entry) => entry.id === session.id) || session;

        const topicCompletionApplied = state.topics.map((topic) => {
          if (topic.id !== active.topicId) return topic;
          return {
            ...topic,
            completed: completeEntireTopic && topic.subtopics.length === 0 ? true : topic.completed,
            completedAt: completeEntireTopic && topic.subtopics.length === 0
              ? completionTimestamp
              : topic.completedAt,
            subtopics: topic.subtopics.map((subtopic) => {
              const isTargetSubtopic = Boolean(targetSubtopicId) && subtopic.id === targetSubtopicId;
              const shouldMarkCompleted = completeEntireTopic || (markCompleted && isTargetSubtopic);
              return {
                ...subtopic,
                completed: shouldMarkCompleted ? true : subtopic.completed,
                completedAt: shouldMarkCompleted ? completionTimestamp : subtopic.completedAt
              };
            })
          };
        });

        const topicsWithMinutes = rebuildSubtopicMinutesFromSessions(topicCompletionApplied, recalculated.sessions);

        set({
          sessions: recalculated.sessions,
          streak: recalculated.streak,
          topics: topicsWithMinutes,
          activeSession: null
        });

        return {
          durationMinutes,
          countedForStreak: Boolean(recalculatedSession.countedForStreak),
          session: recalculatedSession
        };
      },

      deleteSession: (sessionId) =>
        set((state) => {
          const nextSessions = state.sessions.filter((session) => session.id !== sessionId);
          const streakBase = reconcileStreakForNewDay(state.streak);
          const recalculated = recalculateStreakFromSessions(streakBase, nextSessions);
          return {
            sessions: recalculated.sessions,
            streak: recalculated.streak,
            topics: rebuildSubtopicMinutesFromSessions(state.topics, recalculated.sessions)
          };
        }),

      updateSessionDuration: (sessionId, durationMinutes) =>
        set((state) => {
          const nextDuration = Math.max(1, Number(durationMinutes) || 0);
          const nextSessions = state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  durationMinutes: nextDuration
                }
              : session
          );
          const streakBase = reconcileStreakForNewDay(state.streak);
          const recalculated = recalculateStreakFromSessions(streakBase, nextSessions);
          return {
            sessions: recalculated.sessions,
            streak: recalculated.streak,
            topics: rebuildSubtopicMinutesFromSessions(state.topics, recalculated.sessions)
          };
        }),

      importData: (payload) => {
        const fallbackSubjects = deriveSubjectsFromTopics(payload?.topics || []);
        const payloadSubjects = Array.isArray(payload?.subjects) ? payload.subjects : [];
        const mergedSubjects = payloadSubjects.length
          ? payloadSubjects.map((subject, index) => ({
              id: subject.id || uid('subject'),
              name: normalizeSubjectName(subject.name),
              color: subject.color || '#c084fc',
              completed: Boolean(subject.completed),
              completedAt: subject.completedAt || null,
              order: subject.order || index + 1
            })).filter((subject) => subject.name)
          : fallbackSubjects;

        const payloadTopics = Array.isArray(payload?.topics) ? payload.topics : [];
        const mergedTopics = payloadTopics.map((topic, topicIndex) => ({
          id: topic.id || uid('topic'),
          subject: normalizeSubjectName(topic.subject),
          topicName: topic.topicName || 'Untitled Topic',
          subtopics: Array.isArray(topic.subtopics)
            ? topic.subtopics.map((subtopic, subtopicIndex) => ({
                id: subtopic.id || uid('sub'),
                name: subtopic.name || 'Untitled Subtopic',
                completed: Boolean(subtopic.completed),
                completedAt: subtopic.completedAt || null,
                timeSpentMinutes: Number(subtopic.timeSpentMinutes) || 0,
                notes: subtopic.notes || '',
                order: subtopic.order || subtopicIndex + 1
              }))
            : [],
          completed: Boolean(topic.completed),
          completedAt: topic.completedAt || null,
          order: topic.order || topicIndex + 1,
          color: topic.color || '#c084fc',
          dueDate: normalizeDueDate(topic.dueDate)
        }));

        const merged = {
          ...initialState,
          ...payload,
          subjects: mergedSubjects,
          topics: mergedTopics,
          streak: {
            ...initialStreak,
            ...(payload?.streak || {})
          },
          ui: {
            ...initialState.ui,
            ...(payload?.ui || {})
          }
        };
        set(merged);
      },

      resetAllData: () => set(initialState)
    }),
    {
      name: 'examquest_data',
      version: 1
    }
  )
);

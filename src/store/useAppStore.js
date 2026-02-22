import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '../utils/id';
import { applySessionToStreak, reconcileStreakForNewDay } from '../utils/streakUtils';
import { todayISODate } from '../utils/dateUtils';

const initialStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  streakHistory: []
};

const initialState = {
  config: null,
  topics: [],
  sessions: [],
  streak: initialStreak,
  activeSession: null,
  ui: {
    tab: 'HOME',
    plannerSubtab: 'SYLLABUS'
  }
};

function nextOrder(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.order || 0)) + 1;
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
          const subjectTopics = state.topics.filter((topic) => topic.subject === subjectName);
          const topic = {
            id: uid('topic'),
            subject: subjectName,
            topicName: 'New Topic',
            subtopics: [],
            order: nextOrder(subjectTopics),
            color
          };
          return { topics: [...state.topics, topic] };
        }),

      addTopic: ({ subject, color, topicName }) =>
        set((state) => {
          const subjectTopics = state.topics.filter((topic) => topic.subject === subject);
          const topic = {
            id: uid('topic'),
            subject,
            topicName,
            subtopics: [],
            order: nextOrder(subjectTopics),
            color
          };
          return { topics: [...state.topics, topic] };
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
              subtopics: [...topic.subtopics, subtopic]
            };
          })
        })),

      updateTopic: (topicId, patch) =>
        set((state) => ({
          topics: state.topics.map((topic) => (topic.id === topicId ? { ...topic, ...patch } : topic))
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

      deleteTopic: (topicId) =>
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== topicId)
        })),

      deleteSubject: (subject) =>
        set((state) => ({
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

      startSession: ({ topicId, subtopicId, targetMinutes }) => {
        const now = Date.now();
        set({
          activeSession: {
            id: uid('active'),
            topicId,
            subtopicId,
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

      commitSession: ({ markCompleted = false } = {}) => {
        const state = get();
        const active = state.activeSession;
        if (!active) return null;

        const now = Date.now();
        const elapsedRunning = active.running ? Math.floor((now - active.lastResumedAt) / 1000) : 0;
        const totalSeconds = active.elapsedSecondsBeforePause + elapsedRunning;
        const durationMinutes = Math.max(1, Math.floor(totalSeconds / 60));

        const sessionDate = todayISODate();
        const streakBase = reconcileStreakForNewDay(state.streak);
        const streakResult = applySessionToStreak(streakBase, durationMinutes, sessionDate);

        const session = {
          id: uid('session'),
          topicId: active.topicId,
          subtopicId: active.subtopicId,
          startTime: active.startTime,
          endTime: new Date(now).toISOString(),
          durationMinutes,
          countedForStreak: streakResult.countedForStreak
        };

        set({
          sessions: [...state.sessions, session],
          streak: streakResult.streak,
          topics: state.topics.map((topic) => {
            if (topic.id !== active.topicId) return topic;
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) => {
                if (subtopic.id !== active.subtopicId) return subtopic;
                return {
                  ...subtopic,
                  timeSpentMinutes: (subtopic.timeSpentMinutes || 0) + durationMinutes,
                  completed: markCompleted ? true : subtopic.completed,
                  completedAt: markCompleted ? new Date().toISOString() : subtopic.completedAt
                };
              })
            };
          }),
          activeSession: null
        });

        return {
          durationMinutes,
          countedForStreak: streakResult.countedForStreak,
          session
        };
      },

      importData: (payload) => {
        const merged = {
          ...initialState,
          ...payload,
          streak: {
            ...initialStreak,
            ...(payload?.streak || {})
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

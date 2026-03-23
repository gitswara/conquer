import { useEffect, useMemo, useState } from 'react';
import TopicSelector from './TopicSelector';
import TimerDisplay from './TimerDisplay';
import SessionControls from './SessionControls';
import EndSessionModal from './EndSessionModal';
import TodaySessionLog from './TodaySessionLog';
import { todayISODate } from '../../utils/dateUtils';

function elapsedFromActive(activeSession) {
  if (!activeSession) return 0;
  const runningChunk = activeSession.running
    ? Math.floor((Date.now() - activeSession.lastResumedAt) / 1000)
    : 0;
  return activeSession.elapsedSecondsBeforePause + runningChunk;
}

export default function StudyTab({
  topics,
  sessions,
  activeSession,
  streak,
  onStart,
  onPause,
  onResume,
  onCommit,
  onDeleteSession,
  onUpdateSessionDuration,
  onStreakSecuredNotified
}) {
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState('');
  const [targetMinutes, setTargetMinutes] = useState(45);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showStreakSecuredBanner, setShowStreakSecuredBanner] = useState(false);

  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }

    setSelectedTopicId(activeSession.topicId);
    setSelectedSubtopicId(activeSession.subtopicId);
    setElapsedSeconds(elapsedFromActive(activeSession));

    const id = window.setInterval(() => {
      setElapsedSeconds(elapsedFromActive(activeSession));
    }, 1000);

    return () => window.clearInterval(id);
  }, [activeSession]);

  const activeTopic = useMemo(
    () => topics.find((item) => item.id === (activeSession?.topicId || selectedTopicId)) || null,
    [activeSession, topics, selectedTopicId]
  );
  const activeSubtopic = useMemo(
    () => activeTopic?.subtopics.find((item) => item.id === (activeSession?.subtopicId || selectedSubtopicId)) || null,
    [activeSession, activeTopic, selectedSubtopicId]
  );
  const selectedTopicName = activeTopic ? `${activeTopic.subject} › ${activeTopic.topicName}` : '';
  const selectedSubtopicName = activeSubtopic?.name || '';

  const running = Boolean(activeSession?.running);
  const paused = Boolean(activeSession && !activeSession.running);
  const today = todayISODate();
  const alreadyNotifiedToday = streak?.streakNotifiedDate === today;

  useEffect(() => {
    if (!running || elapsedSeconds < 1800 || alreadyNotifiedToday) return;
    onStreakSecuredNotified(today);
    setShowStreakSecuredBanner(true);

    const timer = window.setTimeout(() => {
      setShowStreakSecuredBanner(false);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [alreadyNotifiedToday, elapsedSeconds, onStreakSecuredNotified, running, today]);

  useEffect(() => {
    if (!activeSession) {
      setShowStreakSecuredBanner(false);
    }
  }, [activeSession]);

  return (
    <div className="section-stack">
      <TopicSelector
        topics={topics}
        selectedTopicId={selectedTopicId}
        selectedSubtopicId={selectedSubtopicId}
        onSelectTopic={(id) => {
          setSelectedTopicId(id);
          setSelectedSubtopicId('');
        }}
        onSelectSubtopic={setSelectedSubtopicId}
      />

      <SessionControls
        canStart={Boolean(selectedTopicId)}
        running={running}
        paused={paused}
        targetMinutes={targetMinutes}
        onTargetChange={setTargetMinutes}
        onStart={() =>
          onStart({
            topicId: selectedTopicId,
            subtopicId: selectedSubtopicId || '',
            targetMinutes: Number(targetMinutes) || 0
          })
        }
        onPause={onPause}
        onResume={onResume}
        onEnd={() => setShowEndModal(true)}
      />

      <TimerDisplay
        elapsedSeconds={elapsedSeconds}
        running={running}
        paused={paused}
        targetMinutes={activeSession?.targetMinutes || Number(targetMinutes) || 0}
        showStreakSecuredBanner={showStreakSecuredBanner}
      />

      <TodaySessionLog
        sessions={sessions}
        topics={topics}
        onDeleteSession={onDeleteSession}
        onUpdateSessionDuration={onUpdateSessionDuration}
      />

      <EndSessionModal
        open={showEndModal}
        elapsedSeconds={elapsedSeconds}
        topicName={selectedTopicName}
        subtopicName={selectedSubtopicName}
        hasSelectedSubtopic={Boolean(activeSession?.subtopicId)}
        topicSubtopics={activeTopic?.subtopics || []}
        onCancel={() => setShowEndModal(false)}
        onConfirm={(payload) => {
          onCommit(payload);
          setShowEndModal(false);
        }}
      />
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import HomeDashboard from './components/home/HomeDashboard';
import StudyTab from './components/study/StudyTab';
import PlannerTab from './components/planner/PlannerTab';
import SettingsPanel from './components/settings/SettingsPanel';
import TrainingCompleteBanner from './components/home/TrainingCompleteBanner';
import QuestCompletedModal from './components/home/QuestCompletedModal';
import LandingPage from './components/auth/LandingPage';
import PlanHub from './components/auth/PlanHub';
import PixelButton from './components/ui/PixelButton';
import { useAppStore } from './store/useAppStore';
import { uid } from './utils/id';
import { todayISODate } from './utils/dateUtils';
import { getQuestLootStats, getSubtopicCompletion, isQuestCompletedForData } from './utils/questUtils';

const AUTH_STORAGE_KEY = 'examquest_accounts';
const ACTIVE_PLAN_STORAGE_KEY = 'examquest_active_plan';

function emptyPlanData() {
  return {
    config: null,
    subjects: [],
    topics: [],
    sessions: [],
    questCompletedSeen: false,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: '',
      streakHistory: []
    },
    activeSession: null,
    ui: {
      tab: 'HOME',
      plannerSubtab: 'SYLLABUS'
    }
  };
}

function readAuthStore() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { users: [], currentUserId: null };
    }

    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed?.users) ? parsed.users : [],
      currentUserId: parsed?.currentUserId || null
    };
  } catch {
    return { users: [], currentUserId: null };
  }
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isDesktop;
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const isDesktop = useIsDesktop();

  const config = useAppStore((state) => state.config);
  const subjects = useAppStore((state) => state.subjects);
  const topics = useAppStore((state) => state.topics);
  const sessions = useAppStore((state) => state.sessions);
  const questCompletedSeen = useAppStore((state) => state.questCompletedSeen);
  const streak = useAppStore((state) => state.streak);
  const activeSession = useAppStore((state) => state.activeSession);
  const ui = useAppStore((state) => state.ui);

  const hydrateForToday = useAppStore((state) => state.hydrateForToday);
  const setTab = useAppStore((state) => state.setTab);
  const setPlannerSubtab = useAppStore((state) => state.setPlannerSubtab);
  const setQuestCompletedSeen = useAppStore((state) => state.setQuestCompletedSeen);

  const setConfig = useAppStore((state) => state.setConfig);
  const updateConfig = useAppStore((state) => state.updateConfig);

  const addSubject = useAppStore((state) => state.addSubject);
  const addTopic = useAppStore((state) => state.addTopic);
  const addSubtopic = useAppStore((state) => state.addSubtopic);
  const renameSubject = useAppStore((state) => state.renameSubject);
  const updateTopic = useAppStore((state) => state.updateTopic);
  const updateSubtopic = useAppStore((state) => state.updateSubtopic);
  const toggleSubtopicCompleted = useAppStore((state) => state.toggleSubtopicCompleted);
  const toggleTopicCompleted = useAppStore((state) => state.toggleTopicCompleted);
  const toggleSubjectCompleted = useAppStore((state) => state.toggleSubjectCompleted);
  const deleteTopic = useAppStore((state) => state.deleteTopic);
  const deleteSubject = useAppStore((state) => state.deleteSubject);
  const deleteSubtopic = useAppStore((state) => state.deleteSubtopic);

  const startSession = useAppStore((state) => state.startSession);
  const pauseSession = useAppStore((state) => state.pauseSession);
  const resumeSession = useAppStore((state) => state.resumeSession);
  const commitSession = useAppStore((state) => state.commitSession);

  const importData = useAppStore((state) => state.importData);
  const resetAllData = useAppStore((state) => state.resetAllData);

  const [quoteSeed, setQuoteSeed] = useState(0);
  const [authStore, setAuthStore] = useState(() => readAuthStore());
  const [activePlanId, setActivePlanId] = useState(() => window.localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY) || '');
  const [showTrainingCompleteBanner, setShowTrainingCompleteBanner] = useState(false);
  const [showQuestCompletedModal, setShowQuestCompletedModal] = useState(false);
  const [questModalDefaultOpened, setQuestModalDefaultOpened] = useState(false);

  const pausePlanSyncRef = useRef(false);
  const hydratedPlanKeyRef = useRef('');
  const previousSubtopicCompletionRef = useRef({ planId: '', completed: 0, total: 0, allComplete: false });
  const lastQuestDailyCheckRef = useRef('');

  const currentUser = useMemo(
    () => authStore.users.find((user) => user.id === authStore.currentUserId) || null,
    [authStore]
  );

  const activePlan = useMemo(
    () => currentUser?.plans?.find((plan) => plan.id === activePlanId) || null,
    [currentUser, activePlanId]
  );

  const workspaceData = useMemo(
    () => ({ config, subjects, topics, sessions, questCompletedSeen, streak, activeSession, ui }),
    [config, subjects, topics, sessions, questCompletedSeen, streak, activeSession, ui]
  );

  const workspaceSerialized = useMemo(() => JSON.stringify(workspaceData), [workspaceData]);

  const subtopicCompletion = useMemo(() => getSubtopicCompletion(topics), [topics]);
  const questCompleted = useMemo(
    () => isQuestCompletedForData({ config, topics }),
    [config, topics]
  );
  const lootStats = useMemo(
    () =>
      getQuestLootStats({
        config,
        topics,
        sessions,
        createdAt: activePlan?.createdAt
      }),
    [config, topics, sessions, activePlan?.createdAt]
  );

  useEffect(() => {
    hydrateForToday();
  }, [hydrateForToday]);

  useEffect(() => {
    if (!config && ui.tab !== 'SETTINGS') {
      setTab('PLANNER');
    }
  }, [config, setTab, ui.tab]);

  useEffect(() => {
    setQuoteSeed((prev) => prev + 1);
  }, [ui.tab]);

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore));
  }, [authStore]);

  useEffect(() => {
    if (!currentUser) {
      hydratedPlanKeyRef.current = '';
      if (activePlanId) {
        setActivePlanId('');
        window.localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
      }
      return;
    }

    if (activePlanId && !currentUser.plans.some((plan) => plan.id === activePlanId)) {
      setActivePlanId('');
      window.localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
      hydratedPlanKeyRef.current = '';
    }
  }, [currentUser, activePlanId]);

  useEffect(() => {
    if (!currentUser || !activePlanId) {
      hydratedPlanKeyRef.current = '';
      setShowTrainingCompleteBanner(false);
      setShowQuestCompletedModal(false);
      setQuestModalDefaultOpened(false);
      previousSubtopicCompletionRef.current = { planId: '', completed: 0, total: 0, allComplete: false };
      lastQuestDailyCheckRef.current = '';
      return;
    }

    const key = `${currentUser.id}:${activePlanId}`;
    if (hydratedPlanKeyRef.current === key) return;

    const plan = currentUser.plans.find((entry) => entry.id === activePlanId);
    if (!plan) return;

    pausePlanSyncRef.current = true;
    importData(plan.data || emptyPlanData());
    hydratedPlanKeyRef.current = key;

    const timer = window.setTimeout(() => {
      pausePlanSyncRef.current = false;
    }, 0);

    return () => window.clearTimeout(timer);
  }, [currentUser, activePlanId, importData]);

  useEffect(() => {
    if (!currentUser || !activePlanId || pausePlanSyncRef.current) return;

    setAuthStore((prev) => {
      const userIndex = prev.users.findIndex((user) => user.id === prev.currentUserId);
      if (userIndex < 0) return prev;

      const planIndex = prev.users[userIndex].plans.findIndex((plan) => plan.id === activePlanId);
      if (planIndex < 0) return prev;

      const existingPlan = prev.users[userIndex].plans[planIndex];
      const existingSerialized = JSON.stringify(existingPlan.data || emptyPlanData());
      if (existingSerialized === workspaceSerialized) return prev;

      const updatedPlan = {
        ...existingPlan,
        data: workspaceData,
        updatedAt: new Date().toISOString()
      };

      const users = [...prev.users];
      const user = { ...users[userIndex] };
      user.plans = [...user.plans];
      user.plans[planIndex] = updatedPlan;
      users[userIndex] = user;

      return {
        ...prev,
        users
      };
    });
  }, [currentUser, activePlanId, workspaceSerialized, workspaceData]);

  useEffect(() => {
    if (!activePlanId) return;

    const previous = previousSubtopicCompletionRef.current;
    const current = {
      planId: activePlanId,
      completed: subtopicCompletion.completed,
      total: subtopicCompletion.total,
      allComplete: subtopicCompletion.allComplete
    };

    if (previous.planId !== activePlanId) {
      previousSubtopicCompletionRef.current = current;
      return;
    }

    const becameFullyComplete = current.total > 0
      && current.allComplete
      && !previous.allComplete
      && current.completed > previous.completed;
    if (becameFullyComplete) {
      setShowTrainingCompleteBanner(true);
    }

    previousSubtopicCompletionRef.current = current;
  }, [activePlanId, subtopicCompletion]);

  useEffect(() => {
    if (!activePlanId) return;
    if (questCompletedSeen && subtopicCompletion.completed === 0) {
      setQuestCompletedSeen(false);
    }
  }, [activePlanId, questCompletedSeen, subtopicCompletion.completed, setQuestCompletedSeen]);

  useEffect(() => {
    if (!activePlanId) return;
    if (questCompleted && !questCompletedSeen) {
      setQuestModalDefaultOpened(false);
      setShowQuestCompletedModal(true);
    }
  }, [activePlanId, questCompleted, questCompletedSeen]);

  useEffect(() => {
    if (!activePlanId) return undefined;

    function maybeAutoCheckQuest() {
      if (document.visibilityState === 'hidden') return;
      const today = todayISODate();
      if (lastQuestDailyCheckRef.current === today) return;
      lastQuestDailyCheckRef.current = today;

      const questCompletedToday = isQuestCompletedForData({ config, topics }, today);
      if (questCompletedToday && !questCompletedSeen) {
        setQuestModalDefaultOpened(false);
        setShowQuestCompletedModal(true);
      }
    }

    maybeAutoCheckQuest();
    window.addEventListener('focus', maybeAutoCheckQuest);
    document.addEventListener('visibilitychange', maybeAutoCheckQuest);

    return () => {
      window.removeEventListener('focus', maybeAutoCheckQuest);
      document.removeEventListener('visibilitychange', maybeAutoCheckQuest);
    };
  }, [activePlanId, config, topics, questCompletedSeen]);

  useEffect(() => {
    if (questCompleted) return;
    setShowQuestCompletedModal(false);
  }, [questCompleted]);

  function handleLogin({ email, password }) {
    const found = authStore.users.find((user) => user.email === email);
    if (!found || found.password !== password) {
      return { ok: false, message: 'Invalid email or password.' };
    }

    setAuthStore((prev) => ({ ...prev, currentUserId: found.id }));
    setActivePlanId('');
    window.localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
    return { ok: true };
  }

  function handleSignup({ name, email, password }) {
    if (authStore.users.some((user) => user.email === email)) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const user = {
      id: uid('user'),
      name,
      email,
      password,
      plans: []
    };

    setAuthStore((prev) => ({
      ...prev,
      users: [...prev.users, user],
      currentUserId: user.id
    }));

    setActivePlanId('');
    window.localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
    return { ok: true };
  }

  function handleLogout() {
    setAuthStore((prev) => ({ ...prev, currentUserId: null }));
    setActivePlanId('');
    window.localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
    resetAllData();
  }

  function handleCreatePlan(name) {
    if (!currentUser) {
      return { ok: false, message: 'Please log in first.' };
    }

    const now = new Date().toISOString();
    const plan = {
      id: uid('plan'),
      name,
      createdAt: now,
      updatedAt: now,
      data: emptyPlanData()
    };

    setAuthStore((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === prev.currentUserId
          ? {
              ...user,
              plans: [...user.plans, plan]
            }
          : user
      )
    }));

    return { ok: true, plan };
  }

  function handleOpenPlan(planId) {
    if (!currentUser) return;

    const plan = currentUser.plans.find((entry) => entry.id === planId);
    if (!plan) return;

    pausePlanSyncRef.current = true;
    importData(plan.data || emptyPlanData());

    setActivePlanId(plan.id);
    window.localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, plan.id);

    window.setTimeout(() => {
      pausePlanSyncRef.current = false;
    }, 0);
  }

  function handleBackToPlans() {
    setActivePlanId('');
    window.localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
    hydratedPlanKeyRef.current = '';
  }

  function handleExportPlan(planId) {
    if (!currentUser) return;
    const plan = currentUser.plans.find((entry) => entry.id === planId);
    if (!plan) return;
    const payload = plan.data || emptyPlanData();
    downloadJSON(`${plan.name.replace(/\s+/g, '_').toLowerCase()}_backup.json`, payload);
  }

  function handleResetPlan(planId) {
    if (!currentUser) return;
    const plan = currentUser.plans.find((entry) => entry.id === planId);
    if (!plan) return;
    if (!window.confirm(`RESET PLAN DATA FOR \"${plan.name}\"?`)) return;
    if (!window.confirm('CONFIRM AGAIN: THIS WILL CLEAR THIS PLAN.')) return;

    const now = new Date().toISOString();
    setAuthStore((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id !== prev.currentUserId
          ? user
          : {
              ...user,
              plans: user.plans.map((entry) =>
                entry.id !== planId
                  ? entry
                  : {
                      ...entry,
                      data: emptyPlanData(),
                      updatedAt: now
                    }
              )
            }
      )
    }));
  }

  function handleDeletePlan(planId) {
    if (!currentUser) return;
    const plan = currentUser.plans.find((entry) => entry.id === planId);
    if (!plan) return;
    if (!window.confirm(`DELETE PLAN \"${plan.name}\"?`)) return;
    if (!window.confirm('CONFIRM AGAIN: THIS CANNOT BE UNDONE.')) return;

    setAuthStore((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id !== prev.currentUserId
          ? user
          : {
              ...user,
              plans: user.plans.filter((entry) => entry.id !== planId)
            }
      )
    }));

    if (activePlanId === planId) {
      setActivePlanId('');
      window.localStorage.removeItem(ACTIVE_PLAN_STORAGE_KEY);
      hydratedPlanKeyRef.current = '';
      resetAllData();
    }
  }

  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (!activePlan) {
    return (
      <PlanHub
        user={currentUser}
        onCreatePlan={handleCreatePlan}
        onOpenPlan={handleOpenPlan}
        onExportPlan={handleExportPlan}
        onResetPlan={handleResetPlan}
        onDeletePlan={handleDeletePlan}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="app-shell">
      <div className={isDesktop ? 'layout-grid' : ''}>
        {isDesktop ? <Sidebar activeTab={ui.tab} onSelect={setTab} /> : null}

        <main>
          <Header
            examName={config?.examName || activePlan.name}
            conquered={questCompleted}
            extraActions={
              <>
                <PixelButton onClick={handleBackToPlans}>PLANS</PixelButton>
                <PixelButton variant="danger" onClick={handleLogout}>LOGOUT</PixelButton>
              </>
            }
          />

          {ui.tab === 'HOME' ? (
            <HomeDashboard
              config={config}
              subjects={subjects}
              topics={topics}
              sessions={sessions}
              quoteSeed={quoteSeed}
              showViewLootButton={questCompleted}
              onViewLoot={() => {
                setQuestModalDefaultOpened(questCompletedSeen);
                setShowQuestCompletedModal(true);
              }}
            />
          ) : null}

          {ui.tab === 'STUDY' ? (
            <StudyTab
              topics={topics}
              sessions={sessions}
              activeSession={activeSession}
              onStart={startSession}
              onPause={pauseSession}
              onResume={resumeSession}
              onCommit={commitSession}
            />
          ) : null}

          {ui.tab === 'PLANNER' ? (
            <PlannerTab
              config={config}
              subjects={subjects}
              topics={topics}
              plannerSubtab={ui.plannerSubtab}
              onSetSubtab={setPlannerSubtab}
              onSetConfig={setConfig}
              onUpdateConfig={updateConfig}
              onAddSubject={addSubject}
              onAddTopic={addTopic}
              onAddSubtopic={addSubtopic}
              onRenameSubject={renameSubject}
              onUpdateTopic={updateTopic}
              onUpdateSubtopic={updateSubtopic}
              onToggleSubtopic={toggleSubtopicCompleted}
              onToggleTopic={toggleTopicCompleted}
              onToggleSubject={toggleSubjectCompleted}
              onDeleteSubject={deleteSubject}
              onDeleteTopic={deleteTopic}
              onDeleteSubtopic={deleteSubtopic}
              onFinishSetup={() => setTab('HOME')}
            />
          ) : null}

          {ui.tab === 'SETTINGS' ? <SettingsPanel /> : null}
        </main>
      </div>

      {!isDesktop ? <BottomNav activeTab={ui.tab} onSelect={setTab} /> : null}

      <TrainingCompleteBanner
        open={showTrainingCompleteBanner}
        onDone={() => setShowTrainingCompleteBanner(false)}
      />
      <QuestCompletedModal
        open={showQuestCompletedModal}
        defaultOpened={questModalDefaultOpened}
        lootStats={lootStats}
        onChestOpen={() => {
          if (!questCompletedSeen) {
            setQuestCompletedSeen(true);
          }
        }}
        onClose={() => setShowQuestCompletedModal(false)}
      />
    </div>
  );
}

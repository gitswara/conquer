import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import HomeDashboard from './components/home/HomeDashboard';
import StudyTab from './components/study/StudyTab';
import PlannerTab from './components/planner/PlannerTab';
import LandingPage from './components/auth/LandingPage';
import PlanHub from './components/auth/PlanHub';
import PixelButton from './components/ui/PixelButton';
import { useAppStore } from './store/useAppStore';
import { uid } from './utils/id';

const AUTH_STORAGE_KEY = 'examquest_accounts';
const ACTIVE_PLAN_STORAGE_KEY = 'examquest_active_plan';

function emptyPlanData() {
  return {
    config: null,
    topics: [],
    sessions: [],
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
  const topics = useAppStore((state) => state.topics);
  const sessions = useAppStore((state) => state.sessions);
  const streak = useAppStore((state) => state.streak);
  const activeSession = useAppStore((state) => state.activeSession);
  const ui = useAppStore((state) => state.ui);

  const hydrateForToday = useAppStore((state) => state.hydrateForToday);
  const setTab = useAppStore((state) => state.setTab);
  const setPlannerSubtab = useAppStore((state) => state.setPlannerSubtab);

  const setConfig = useAppStore((state) => state.setConfig);
  const updateConfig = useAppStore((state) => state.updateConfig);

  const addSubject = useAppStore((state) => state.addSubject);
  const addTopic = useAppStore((state) => state.addTopic);
  const addSubtopic = useAppStore((state) => state.addSubtopic);
  const updateSubtopic = useAppStore((state) => state.updateSubtopic);
  const toggleSubtopicCompleted = useAppStore((state) => state.toggleSubtopicCompleted);
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

  const pausePlanSyncRef = useRef(false);
  const hydratedPlanKeyRef = useRef('');

  const currentUser = useMemo(
    () => authStore.users.find((user) => user.id === authStore.currentUserId) || null,
    [authStore]
  );

  const activePlan = useMemo(
    () => currentUser?.plans?.find((plan) => plan.id === activePlanId) || null,
    [currentUser, activePlanId]
  );

  const workspaceData = useMemo(
    () => ({ config, topics, sessions, streak, activeSession, ui }),
    [config, topics, sessions, streak, activeSession, ui]
  );

  const workspaceSerialized = useMemo(() => JSON.stringify(workspaceData), [workspaceData]);

  useEffect(() => {
    hydrateForToday();
  }, [hydrateForToday]);

  useEffect(() => {
    if (!config) {
      setTab('PLANNER');
    }
  }, [config, setTab]);

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
            extraActions={
              <>
                <PixelButton onClick={handleBackToPlans}>PLANS</PixelButton>
                <PixelButton variant="danger" onClick={handleLogout}>LOGOUT</PixelButton>
              </>
            }
          />

          {ui.tab === 'HOME' ? <HomeDashboard config={config} topics={topics} sessions={sessions} quoteSeed={quoteSeed} /> : null}

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
              topics={topics}
              plannerSubtab={ui.plannerSubtab}
              onSetSubtab={setPlannerSubtab}
              onSetConfig={setConfig}
              onUpdateConfig={updateConfig}
              onAddSubject={addSubject}
              onAddTopic={addTopic}
              onAddSubtopic={addSubtopic}
              onUpdateSubtopic={updateSubtopic}
              onToggleSubtopic={toggleSubtopicCompleted}
              onDeleteSubject={deleteSubject}
              onDeleteTopic={deleteTopic}
              onDeleteSubtopic={deleteSubtopic}
              onFinishSetup={() => setTab('HOME')}
            />
          ) : null}
        </main>
      </div>

      {!isDesktop ? <BottomNav activeTab={ui.tab} onSelect={setTab} /> : null}
    </div>
  );
}

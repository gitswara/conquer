import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import { useState } from 'react';

function prettyDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
}

export default function PlanHub({ user, onCreatePlan, onOpenPlan, onExportPlan, onResetPlan, onLogout }) {
  const [planName, setPlanName] = useState('');
  const [error, setError] = useState('');

  function createPlan() {
    setError('');
    const trimmed = planName.trim();
    if (!trimmed) {
      setError('Plan name is required.');
      return;
    }
    const result = onCreatePlan(trimmed);
    if (!result?.ok) {
      setError(result?.message || 'Could not create plan.');
      return;
    }
    setPlanName('');
  }

  return (
    <div className="landing-root">
      <div style={{ width: 'min(1120px, 100%)' }} className="section-stack">
        <PixelCard
          title="PLAN SELECT"
          right={
            <div className="row-wrap">
              <span className="inline-chip">{user.name}</span>
              <PixelButton variant="danger" onClick={onLogout}>LOGOUT</PixelButton>
            </div>
          }
        >
          <p style={{ marginTop: 0, marginBottom: 8 }}>Choose a plan to continue, or create a new one.</p>
          <div className="row-wrap">
            <input
              placeholder="New plan name (e.g. UPSC 2027)"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="pixel-input-cursor"
              style={{ maxWidth: 360 }}
            />
            <PixelButton onClick={createPlan}>+ CREATE NEW PLAN</PixelButton>
          </div>
          {error ? <div style={{ marginTop: 8, color: 'var(--danger)', fontSize: 13 }}>{error}</div> : null}
        </PixelCard>

        <div className="hub-grid">
          {user.plans.length ? (
            user.plans
              .slice()
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((plan) => (
                <PixelCard
                  key={plan.id}
                  title={plan.name}
                  right={<span className="muted" style={{ fontSize: 12 }}>UPDATED {prettyDate(plan.updatedAt)}</span>}
                >
                  <div className="row-wrap">
                    <PixelButton variant="success" onClick={() => onOpenPlan(plan.id)}>
                      OPEN PLAN
                    </PixelButton>
                    <PixelButton onClick={() => onExportPlan(plan.id)}>
                      EXPORT
                    </PixelButton>
                    <PixelButton variant="danger" onClick={() => onResetPlan(plan.id)}>
                      RESET
                    </PixelButton>
                  </div>
                </PixelCard>
              ))
          ) : (
            <PixelCard title="NO PLANS YET">
              <p style={{ margin: 0 }}>Create your first study plan to begin your quest.</p>
            </PixelCard>
          )}
        </div>
      </div>
    </div>
  );
}

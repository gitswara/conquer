import { useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';

export default function LandingPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState('LOGIN');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const name = form.name.trim();

    if (!email || !password || (mode === 'SIGNUP' && !name)) {
      setError('Please complete all required fields.');
      return;
    }

    const result =
      mode === 'LOGIN'
        ? await onLogin({ email, password })
        : await onSignup({ name, email, password });

    if (!result?.ok) {
      setError(result?.message || 'Unable to continue.');
    }
  }

  return (
    <div className="landing-root quest-landing">
      <div className="quest-stars-layer" aria-hidden="true">
        <span className="quest-star s1">✦</span>
        <span className="quest-star s2">✧</span>
        <span className="quest-star s3">✦</span>
        <span className="quest-star s4">✧</span>
        <span className="quest-star s5">✦</span>
        <span className="quest-star s6">✧</span>
        <span className="quest-star s7">✦</span>
        <span className="quest-star s8">✧</span>
      </div>
      <div className="quest-bottom-border" aria-hidden="true" />

      <div className="quest-content">
        <h1 className="quest-title">⚔️ CONQUER</h1>
        <p className="quest-subtitle">A study RPG for serious exam prep.</p>

        <div className="quest-feature-grid">
          <div className="quest-feature-card">
            <h3>PLAN</h3>
            <p>Break your syllabus into subjects, topics, and subtopics.</p>
          </div>
          <div className="quest-feature-card">
            <h3>GRIND</h3>
            <p>Run timed sessions and secure streaks with daily consistency.</p>
          </div>
          <div className="quest-feature-card">
            <h3>LEVEL UP</h3>
            <p>Track weekly progress and continue across multiple plans.</p>
          </div>
        </div>

        <div className="row-wrap quest-auth-switch" style={{ justifyContent: 'center' }}>
          <PixelButton className={mode === 'LOGIN' ? 'tab-active' : ''} onClick={() => setMode('LOGIN')}>
            LOGIN
          </PixelButton>
          <PixelButton className={mode === 'SIGNUP' ? 'tab-active' : ''} onClick={() => setMode('SIGNUP')}>
            SIGN UP
          </PixelButton>
        </div>

        <PixelCard title={mode === 'LOGIN' ? 'LOGIN' : 'SIGN UP'} className="quest-auth-card">
          <form onSubmit={submit} className="section-stack" style={{ gap: 12 }}>
            {mode === 'SIGNUP' ? (
              <div>
                <label className="field-label" htmlFor="auth-name">NAME</label>
                <input
                  id="auth-name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="pixel-input-cursor"
                />
              </div>
            ) : null}

            <div>
              <label className="field-label" htmlFor="auth-email">EMAIL</label>
              <input
                id="auth-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="pixel-input-cursor"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="auth-password">PASSWORD</label>
              <input
                id="auth-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="pixel-input-cursor"
              />
            </div>

            {error ? <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div> : null}

            <PixelButton type="submit" variant="success">
              {mode === 'LOGIN' ? 'ENTER QUEST' : 'CREATE ACCOUNT'}
            </PixelButton>
          </form>
        </PixelCard>
      </div>
    </div>
  );
}

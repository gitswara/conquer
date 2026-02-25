const TABS = [
  { id: 'HOME', label: '🏠 HOME' },
  { id: 'STUDY', label: '⏱️ STUDY' },
  { id: 'PLANNER', label: '📋 PLANNER' },
  { id: 'SETTINGS', label: '⚙️ SETTINGS' }
];

export default function BottomNav({ activeTab, onSelect }) {
  return (
    <nav
      aria-label="Bottom navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--nav-bg)',
        borderTop: '2px solid var(--nav-border)',
        display: 'grid',
        gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
        zIndex: 20
      }}
    >
      {TABS.map((tab, index) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              border: 0,
              borderRight: index < TABS.length - 1 ? '1px solid var(--nav-border)' : 'none',
              background: 'transparent',
              color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
              padding: '12px 8px',
              fontSize: 10,
              fontFamily: 'Press Start 2P, monospace',
              textTransform: 'uppercase'
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: 9, marginTop: 6, color: active ? 'var(--accent-primary)' : 'transparent' }}>
              {active ? 'SELECTED' : ' '}
            </div>
          </button>
        );
      })}
    </nav>
  );
}

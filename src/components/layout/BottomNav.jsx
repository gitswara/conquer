const TABS = [
  { id: 'HOME', label: '🏠 HOME' },
  { id: 'STUDY', label: '⏱️ STUDY' },
  { id: 'PLANNER', label: '📋 PLANNER' }
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
        background: '#f7f1ff',
        borderTop: '2px solid #c4a5f5',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        zIndex: 20
      }}
    >
      {TABS.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              border: 0,
              borderRight: '1px solid #d5bdf4',
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

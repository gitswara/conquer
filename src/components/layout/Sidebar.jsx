import PixelButton from '../ui/PixelButton';

const TABS = [
  { id: 'HOME', label: '🏠 HOME' },
  { id: 'STUDY', label: '⏱️ STUDY' },
  { id: 'PLANNER', label: '📋 PLANNER' },
  { id: 'SETTINGS', label: '⚙️ SETTINGS' }
];

export default function Sidebar({ activeTab, onSelect }) {
  return (
    <aside
      style={{
        borderRight: '2px solid var(--nav-border)',
        background: 'var(--nav-bg)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}
    >
      <h2 style={{ fontSize: 11, margin: '6px 0 10px 0' }}>⚔️ CONQUER</h2>
      {TABS.map((tab) => (
        <PixelButton
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={tab.id === activeTab ? 'nav-active' : ''}
          aria-label={`Open ${tab.label}`}
        >
          {tab.label}
        </PixelButton>
      ))}
    </aside>
  );
}

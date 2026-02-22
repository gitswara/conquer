export default function Header({ examName, extraActions }) {
  const title = examName ? `⚔️ CONQUER ${examName.toUpperCase()}` : '⚔️ CONQUER';

  return (
    <header
      className="pixel-card"
      style={{
        marginBottom: 18,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap'
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 15, lineHeight: 1.35 }}>{title}</h1>
        {!examName ? (
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--accent-primary)' }}>
            <span>CONFIGURE YOUR CONQUEST IN PLANNER →</span>
          </div>
        ) : null}
      </div>

      <div className="row-wrap">
        {extraActions}
      </div>
    </header>
  );
}

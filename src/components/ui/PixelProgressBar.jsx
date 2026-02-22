export default function PixelProgressBar({ progress = 0, segments = 20 }) {
  const pct = Math.max(0, Math.min(100, progress));
  const filled = Math.floor((pct / 100) * segments);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${segments}, 1fr)`, gap: 2 }}>
      {Array.from({ length: segments }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          style={{
            height: 16,
            border: '1px solid var(--border-dim)',
            background: index < filled ? 'var(--graph-bar)' : 'transparent'
          }}
        />
      ))}
    </div>
  );
}

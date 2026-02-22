export default function PixelCard({ title, right, children, className = '' }) {
  return (
    <section className={`pixel-card ${className}`.trim()}>
      {(title || right) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          {title ? <h3 style={{ margin: 0, fontSize: 13 }}>{title}</h3> : <span />}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

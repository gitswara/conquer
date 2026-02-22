import { useEffect } from 'react';
import PixelButton from './PixelButton';

export default function PixelModal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return;
    const handler = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="retro-modal-overlay" role="dialog" aria-modal="true" aria-label={title || 'Modal'}>
      <div className="retro-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 13 }}>{title}</h3>
          <PixelButton aria-label="Close modal" onClick={onClose}>
            X
          </PixelButton>
        </div>
        <div>{children}</div>
        {footer ? <div style={{ marginTop: 12 }}>{footer}</div> : null}
      </div>
    </div>
  );
}

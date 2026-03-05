import { useEffect } from 'react';

export default function TrainingCompleteBanner({ open, onDone }) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      onDone?.();
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [open, onDone]);

  if (!open) return null;

  return (
    <div className="training-complete-banner" role="status" aria-live="polite">
      TRAINING COMPLETE
    </div>
  );
}

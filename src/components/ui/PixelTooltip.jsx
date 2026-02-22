import { useState } from 'react';

export default function PixelTooltip({ label, children }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffff',
            border: '1px solid var(--border-bright)',
            padding: '6px 8px',
            whiteSpace: 'normal',
            fontSize: 11,
            textAlign: 'center',
            minWidth: 120,
            zIndex: 10
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
}

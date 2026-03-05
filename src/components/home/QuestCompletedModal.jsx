import { useEffect, useMemo, useRef, useState } from 'react';
import PixelButton from '../ui/PixelButton';
import { minutesToHoursMinutes } from '../../utils/timeUtils';

const LOOT_LINE_STAGGER_MS = 150;

function formatHM(totalMinutes) {
  const { h, m } = minutesToHoursMinutes(totalMinutes);
  return `${h}h ${m}m`;
}

export default function QuestCompletedModal({
  open,
  onClose,
  onChestOpen,
  lootStats,
  defaultOpened = false
}) {
  const [phase, setPhase] = useState(defaultOpened ? 'opened' : 'closed');
  const [openBurstKey, setOpenBurstKey] = useState(0);
  const timerRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    setPhase(defaultOpened ? 'opened' : 'closed');
    setOpenBurstKey((value) => value + 1);
  }, [open, defaultOpened]);

  useEffect(() => () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  function handleOpenChest() {
    if (phase !== 'closed') return;
    setPhase('opening');
    onChestOpen?.();
    timerRef.current = window.setTimeout(() => {
      setPhase('opened');
    }, 600);
  }

  const lootRows = useMemo(
    () => [
      { label: 'UNITS COMPLETED', value: `${lootStats.unitsCompleted} subtopics` },
      { label: 'TIME SPENT', value: formatHM(lootStats.totalMinutes) },
      { label: 'AVG TIME / DAY', value: formatHM(lootStats.avgMinutesPerDay) },
      { label: 'FINAL LEVEL', value: lootStats.finalLevel }
    ],
    [lootStats]
  );

  if (!open) return null;

  return (
    <div className="quest-modal-overlay" role="dialog" aria-modal="true" aria-label="Quest completed">
      <div className="quest-modal-shell">
        <div className="quest-modal-header">
          <h2>⚔️ QUEST COMPLETED ⚔️</h2>
          <h3>EXAM CONQUERED.</h3>
        </div>

        {phase !== 'opened' ? (
          <div className="quest-chest-panel">
            <button
              type="button"
              className={`quest-chest-button ${phase}`}
              onClick={handleOpenChest}
              aria-label="Open treasure chest"
            >
              <svg viewBox="0 0 160 140" className="quest-chest-svg" aria-hidden="true">
                <rect x="20" y="58" width="120" height="64" rx="6" fill="#92400e" stroke="#3f1a06" strokeWidth="4" />
                <rect x="20" y="82" width="120" height="12" fill="#b45309" />
                <rect className="quest-chest-lid" x="20" y="28" width="120" height="40" rx="12" fill="#b45309" stroke="#3f1a06" strokeWidth="4" />
                <rect className="quest-chest-lid-band" x="20" y="52" width="120" height="8" fill="#fbbf24" />
                <rect x="72" y="78" width="16" height="20" rx="3" fill="#fbbf24" stroke="#3f1a06" strokeWidth="3" />
                <circle cx="36" cy="96" r="4" fill="#fbbf24" />
                <circle cx="124" cy="96" r="4" fill="#fbbf24" />
              </svg>
              {phase === 'opening' ? (
                <div className="quest-spark-burst" key={openBurstKey} aria-hidden="true">
                  {Array.from({ length: 14 }, (_, i) => (
                    <span key={`spark-${i}`} style={{ animationDelay: `${i * 35}ms` }} />
                  ))}
                </div>
              ) : null}
            </button>
            <p className="quest-claim-text">CLAIM YOUR LOOT</p>
          </div>
        ) : (
          <div className="quest-loot-panel">
            <div className="quest-loot-title">✨ LOOT CLAIMED ✨</div>
            {lootRows.map((row, index) => (
              <div
                key={row.label}
                className="quest-loot-row"
                style={{ animationDelay: `${index * LOOT_LINE_STAGGER_MS}ms` }}
              >
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
            <div className="quest-loot-actions">
              <PixelButton onClick={onClose}>CLOSE</PixelButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelProgressBar from '../ui/PixelProgressBar';
import { getProgressStats } from '../../utils/progressUtils';

const LEVEL_CHARACTER_ASSETS = {
  'Lv.1 Novice': '',
  'Lv.2 Apprentice': '',
  'Lv.3 Adept': '',
  'Lv.4 Expert': '',
  'Lv.5 Master': '',
  'Lv.6 Champion': '',
  'Lv.MAX Legend': ''
};

function formatLevelLabel(levelLabel) {
  if (!levelLabel) return 'Level 1. Novice';
  if (levelLabel.startsWith('Lv.MAX')) {
    const title = levelLabel.replace('Lv.MAX', '').trim() || 'Legend';
    return `Level MAX. ${title}`;
  }

  const match = levelLabel.match(/^Lv\.(\d+)\s+(.+)$/);
  if (!match) return levelLabel;
  return `Level ${match[1]}. ${match[2]}`;
}

const CONFETTI_COLORS = ['#f87171', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6'];

function createConfettiPieces(count) {
  return Array.from({ length: count }, (_, index) => {
    const phase = (index * 23) % 100;
    return {
      id: `piece-${index}`,
      left: (phase + (index % 7) * 2.7) % 100,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      size: 6 + (index % 4),
      delay: `${(index % 12) * 60}ms`,
      duration: `${1700 + (index % 6) * 160}ms`
    };
  });
}

export default function SyllabusProgressBar({ subjects, topics }) {
  const stats = getProgressStats(subjects, topics);
  const levelText = formatLevelLabel(stats.level.label);
  const levelCharacterSrc = LEVEL_CHARACTER_ASSETS[stats.level.label] || '';
  const isQuestCompleted = stats.total > 0 && stats.completed === stats.total;

  const previousCompletedRef = useRef(false);
  const [confettiBurst, setConfettiBurst] = useState(0);

  useEffect(() => {
    if (isQuestCompleted && !previousCompletedRef.current) {
      setConfettiBurst((value) => value + 1);
    }
    previousCompletedRef.current = isQuestCompleted;
  }, [isQuestCompleted]);

  const confettiPieces = useMemo(() => createConfettiPieces(48), [confettiBurst]);

  return (
    <>
      {isQuestCompleted ? (
        <div className="pixel-confetti-screen" aria-hidden="true" key={confettiBurst}>
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="pixel-confetti-piece"
              style={{
                left: `${piece.left}%`,
                background: piece.color,
                width: piece.size,
                height: piece.size,
                animationDelay: piece.delay,
                animationDuration: piece.duration
              }}
            />
          ))}
        </div>
      ) : null}

      <div
        className="syllabus-progress-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(230px, 280px) minmax(0, 1fr)',
          gap: 14
        }}
      >
        <PixelCard title="LEVEL STATUS">
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              gap: 10,
              padding: 6,
              textAlign: 'center'
            }}
          >
            {levelCharacterSrc ? (
              <img src={levelCharacterSrc} alt={levelText} style={{ width: 56, height: 56, imageRendering: 'pixelated' }} />
            ) : (
              <span className="muted" style={{ fontSize: 11 }}>CHARACTER SLOT</span>
            )}
            <div
              style={{
                fontSize: 12,
                fontFamily: 'Press Start 2P, monospace',
                letterSpacing: '0.01em',
                lineHeight: 1.4
              }}
            >
              {levelText}
            </div>
          </div>
        </PixelCard>

        <PixelCard title="SYLLABUS PROGRESS" right={<strong>{Math.round(stats.progress)}%</strong>}>
          <PixelProgressBar progress={stats.progress} segments={20} />
          <p style={{ marginTop: 10, marginBottom: 0, fontSize: 12 }}>
            {stats.completed} / {stats.total} UNITS DONE
          </p>
          {isQuestCompleted ? (
            <p style={{ marginTop: 10, color: 'var(--success)' }}>QUEST COMPLETED!</p>
          ) : null}
        </PixelCard>
      </div>
    </>
  );
}

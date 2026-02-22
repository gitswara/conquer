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

export default function SyllabusProgressBar({ topics }) {
  const stats = getProgressStats(topics);
  const levelText = formatLevelLabel(stats.level.label);
  const levelCharacterSrc = LEVEL_CHARACTER_ASSETS[stats.level.label] || '';

  return (
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
          {stats.completed} / {stats.total} SUBTOPICS DONE
        </p>
        {stats.total > 0 && stats.completed === stats.total ? (
          <p style={{ marginTop: 10, color: 'var(--success)' }}>SYLLABUS COMPLETE! PIXEL FIREWORKS ACTIVATED.</p>
        ) : null}
      </PixelCard>
    </div>
  );
}

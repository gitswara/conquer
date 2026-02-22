export const LEVELS = [
  { min: 0, max: 9, label: 'Lv.1 Novice' },
  { min: 10, max: 24, label: 'Lv.2 Apprentice' },
  { min: 25, max: 49, label: 'Lv.3 Adept' },
  { min: 50, max: 74, label: 'Lv.4 Expert' },
  { min: 75, max: 89, label: 'Lv.5 Master' },
  { min: 90, max: 99, label: 'Lv.6 Champion' },
  { min: 100, max: 100, label: 'Lv.MAX Legend' }
];

export function getLevelFromProgress(progress) {
  const pct = Math.max(0, Math.min(100, Math.floor(progress)));
  return LEVELS.find((level) => pct >= level.min && pct <= level.max) || LEVELS[0];
}

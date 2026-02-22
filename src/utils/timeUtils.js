export function minutesToHoursMinutes(totalMinutes) {
  const minutes = Math.max(0, Math.floor(totalMinutes || 0));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return { h, m };
}

export function formatMinutes(totalMinutes) {
  const { h, m } = minutesToHoursMinutes(totalMinutes);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatHHMMSS(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

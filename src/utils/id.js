export function uid(prefix = 'id') {
  const rand = Math.random().toString(36).slice(2, 10);
  const stamp = Date.now().toString(36);
  return `${prefix}_${stamp}_${rand}`;
}

const UNITS = [
  ['T', 1e12],
  ['B', 1e9],
  ['M', 1e6],
  ['k', 1e3],
];

/** 187600 -> "187.60k" */
export function formatNumber(value) {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  if (abs < 1000) {
    if (abs < 10 && n % 1 !== 0) return n.toFixed(1);
    return String(Math.round(n));
  }
  for (const [suffix, size] of UNITS) {
    if (abs >= size) {
      const v = n / size;
      return `${abs >= 100 * size ? v.toFixed(0) : v.toFixed(2)}${suffix}`;
    }
  }
  return String(Math.round(n));
}

/** 1_234_567 -> "20:34" */
export function formatDuration(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function percentDiff(comparison: number, baseline: number): number {
  return ((comparison / baseline) - 1) * 100;
}

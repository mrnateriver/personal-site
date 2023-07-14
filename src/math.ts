/**
 * Clamps a value between a lower and upper bound.
 *
 * @param value
 * @param lower
 * @param upper
 *
 * @returns
 */
export function clamp(value: number, lower: number, upper: number): number {
  return Math.min(Math.max(value, lower), upper);
}

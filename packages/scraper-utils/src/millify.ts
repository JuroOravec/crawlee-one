const UNITS = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
const BASE = 1000;

export interface MillifyOptions {
  precision?: number;
  lowercase?: boolean;
  space?: boolean;
}

/**
 * Convert a large number to a human-readable string.
 *
 * ```ts
 * millify(1_200)       // '1.2K'
 * millify(1_200_000)   // '1.2M'
 * millify(42)          // '42'
 * ```
 *
 * Replaces the `millify` npm package — the logic is small enough to own.
 */
export function millify(
  value: number,
  { precision = 1, lowercase = false, space = false }: MillifyOptions = {}
): string {
  const abs = Math.abs(value);
  const prefix = value < 0 ? '-' : '';

  let reduced = abs;
  let unitIndex = 0;

  while (reduced >= BASE && unitIndex < UNITS.length - 1) {
    reduced /= BASE;
    unitIndex += 1;
  }

  const rounded = parseFloat(reduced.toFixed(precision));
  const unit = lowercase ? UNITS[unitIndex].toLowerCase() : UNITS[unitIndex];
  const gap = space ? ' ' : '';

  return `${prefix}${rounded}${gap}${unit}`;
}

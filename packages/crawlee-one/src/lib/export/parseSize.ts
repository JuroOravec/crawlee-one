/**
 * Parse human-readable size strings (e.g. "30MB", "4GB") into bytes.
 */
const SIZE_REGEX = /^(\d+(?:\.\d+)?)\s*([kmg]?b)$/i;

const UNITS: Record<string, number> = {
  b: 1,
  kb: 1024,
  mb: 1024 * 1024,
  gb: 1024 * 1024 * 1024,
};

/**
 * Parse a size string like "30MB", "20mb", "4GB" into bytes.
 *
 * @param input - Size string (e.g. "30MB", "4GB")
 * @returns Size in bytes, or null if invalid
 */
export function parseSize(input: string | undefined): number | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  const match = trimmed.match(SIZE_REGEX);
  if (!match) return null;
  const value = Number.parseFloat(match[1]);
  const unit = (match[2] || 'b').toLowerCase();
  const multiplier = UNITS[unit] ?? 1;
  return Math.floor(value * multiplier);
}

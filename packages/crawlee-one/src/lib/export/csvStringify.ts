/**
 * Escape a CSV field value. Wraps in quotes if contains comma, newline, or quote.
 *
 * Per RFC 4180, double-quotes inside a quoted field are escaped by doubling
 * them (`"` → `""`), not by backslash (`\"`). Most CSV parsers expect this.
 */
function escapeCsvField(value: string | number | boolean | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Build a CSV row from a flat record. Uses all keys; order may vary by row.
 */
export function rowToCsv(
  row: Record<string, string | number | boolean | null>,
  headers: string[]
): string {
  return headers.map((h) => escapeCsvField(row[h] ?? '')).join(',');
}

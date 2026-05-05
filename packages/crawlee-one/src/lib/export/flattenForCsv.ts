/**
 * Flatten an object for CSV export.
 *
 * - Nested objects: use dot notation
 * - Array values: do NOT flatten indices; serialize entire field with JSON.stringify()
 *
 * Examples:
 * - `{ data: { name: "John" } }` → `{ "data.name": "John" }`
 * - `{ tags: ['a', 'b', 'c'] }` → `{ tags: '["a","b","c"]' }`
 */
export function flattenForCsv(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string | number | boolean | null> {
  const result: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[path] = null;
    } else if (Array.isArray(value)) {
      result[path] = JSON.stringify(value);
    } else if (isPlainObject(value)) {
      Object.assign(result, flattenForCsv(value, path));
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      result[path] = value;
    } else {
      result[path] = String(value);
    }
  }

  return result;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

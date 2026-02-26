import get from 'lodash-es/get.js';
import set from 'lodash-es/set.js';
import unset from 'lodash-es/unset.js';

/**
 * Check if obj has a value at path (including undefined explicitly set).
 */
function hasAt(obj: object, path: string): boolean {
  const keys = path.split('.');
  let current: unknown = obj;
  for (let i = 0; i < keys.length; i++) {
    if (current == null || typeof current !== 'object') return false;
    const key = keys[i];
    if (!(key in (current as object))) return false;
    current = (current as Record<string, unknown>)[key];
  }
  return true;
}

/**
 * Pick only the given dot-notation paths from an object.
 * Preserves nested structure (e.g. path "nested.prop" yields { nested: { prop: value } }).
 */
export function pickFields<T extends object>(obj: T, paths: string[]): Partial<T> {
  if (paths.length === 0) return obj as Partial<T>;
  const result: Record<string, unknown> = {};
  for (const path of paths) {
    // Get value at dot-notation path. Returns undefined if path doesn't exist.
    const value = get(obj, path);
    if (value !== undefined || hasAt(obj, path)) {
      set(result, path, value);
    }
  }
  return result as Partial<T>;
}

/**
 * Omit the given dot-notation paths from an object.
 * Mutates a clone - use on copies.
 */
export function omitFields<T extends object>(obj: T, paths: string[]): Partial<T> {
  if (paths.length === 0) return { ...obj };
  const result = JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
  for (const path of paths) {
    unset(result, path);
  }
  return result as Partial<T>;
}

/** Options for applyFieldFilter */
export interface ApplyFieldFilterOpts<T extends object = object> {
  obj: T;
  pickPaths?: string[];
  omitPaths?: string[];
}

/**
 * Apply field selection: first pick (if paths given), then omit.
 * Both use dot notation (e.g. "nested.prop").
 */
export function applyFieldFilter<T extends object>(opts: ApplyFieldFilterOpts<T>): Partial<T> {
  const { obj, pickPaths, omitPaths } = opts;
  let result: Partial<T> = obj as Partial<T>;
  if (pickPaths?.length) {
    result = pickFields(obj, pickPaths);
  }
  if (omitPaths?.length) {
    result = omitFields(result as object, omitPaths) as Partial<T>;
  }
  return result;
}

/**
 * Parse comma-separated field list into trimmed array.
 */
export function parseFieldList(input: string | undefined): string[] {
  if (!input || typeof input !== 'string') return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

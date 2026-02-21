export const strOrNull = (s: string | null, allowEmpty?: boolean) => s ? s : typeof s === 'string' && allowEmpty ? s : null; // prettier-ignore

/** Unicode whitespace to replace with ASCII space: NBSP, en/em space, narrow NBSP, etc. */
const UNICODE_WHITESPACE = /[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g;

/**
 * Replace stray Unicode whitespace (NBSP, en space, etc.) with ASCII space,
 * collapse runs to single space, and trim.
 */
export const normalizeWhitespace = (s: string): string =>
  s.replace(UNICODE_WHITESPACE, ' ').replace(/\s+/g, ' ').trim();

/**
 * Recursively normalize string values in a plain object.
 * Used by createEntry to clean scraped data before validation.
 */
export function normalizeWhitespaceDeep<T>(obj: T): T {
  if (typeof obj === 'string') {
    return normalizeWhitespace(obj) as T;
  }
  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = normalizeWhitespaceDeep(v);
    }
    return out as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((v) => normalizeWhitespaceDeep(v)) as unknown as T;
  }
  return obj;
}

export interface StrAsNumOptions {
  allowEmpty?: boolean;
  removeWhitespace?: boolean;
  mode: 'int' | 'float';
  separator?: string;
  decimal?: string;
}

export const strAsNumber = (s: string | null, options?: StrAsNumOptions): number | null => {
  const { removeWhitespace, allowEmpty, separator, decimal, mode = 'float' } = options || {};
  let content = removeWhitespace ? (s?.replace(/\s+/g, '') ?? null) : s;
  content = strOrNull(content, allowEmpty);
  if (content === null) return null;

  content = separator ? (content?.replace(new RegExp(separator, 'g'), '') ?? null) : content;
  content = decimal ? (content?.replace(new RegExp(decimal, 'g'), '.') ?? null) : content;
  const num = mode === 'int' ? Number.parseInt(content) : Number.parseFloat(content);
  return Number.isNaN(num) ? null : num;
};

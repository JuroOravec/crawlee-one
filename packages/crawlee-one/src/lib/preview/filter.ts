/**
 * Filter entries using a JavaScript expression.
 *
 * Security: The expression is evaluated on the server via Function(). For local
 * preview only; never expose this to untrusted users. Consider migrating to
 * a sandboxed expression language (e.g. jexl) for safer evaluation if this
 * preview is ever exposed beyond localhost.
 *
 * @param userScript - JS expression receiving `obj` (the entry's data object).
 *   E.g. obj.name === 'Alice' or obj.metadata?.actorRunUrl?.includes('x')
 * @returns Filter function for entries, or throws on syntax error.
 */
export function createFilterFn(
  userScript: string
): (entry: { id: string; data: object }) => boolean {
  const trimmed = userScript.trim();
  if (!trimmed) {
    return () => true; // empty = no filter
  }

  const body = `"use strict"; return !!(${trimmed})`;
  const fn = new Function('obj', body);
  return (entry: { id: string; data: object }) => {
    try {
      return Boolean(fn(entry.data));
    } catch {
      return false; // runtime error = exclude entry
    }
  };
}

/**
 * Validate filter script (syntax check). Returns error message or null if valid.
 */
export function validateFilterScript(userScript: string): string | null {
  const trimmed = userScript.trim();
  if (!trimmed) return null;

  try {
    new Function('obj', `"use strict"; return !!(${trimmed})`);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

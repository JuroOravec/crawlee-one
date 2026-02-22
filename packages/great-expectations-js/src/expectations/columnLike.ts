import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { buildColumnResult, getColumnValues } from '../utils.js';

/**
 * Convert a SQL LIKE pattern to a JavaScript RegExp.
 * `%` matches any sequence of characters, `_` matches any single character.
 * Characters are escaped for regex safety.
 */
export function likeToRegex(pattern: string): RegExp {
  let regex = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '\\' && i + 1 < pattern.length) {
      regex += '\\' + pattern[++i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    } else if (ch === '%') {
      regex += '.*';
    } else if (ch === '_') {
      regex += '.';
    } else {
      regex += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${regex}$`, 's');
}

export function expectColumnValuesToMatchLikePattern(
  dataset: Dataset,
  column: string,
  like_pattern: string,
  options?: MostlyOptions
): ExpectationResult {
  const re = likeToRegex(like_pattern);
  return buildColumnResult(
    getColumnValues(dataset, column),
    (v) => v != null && re.test(String(v)),
    options
  );
}

export function expectColumnValuesToNotMatchLikePattern(
  dataset: Dataset,
  column: string,
  like_pattern: string,
  options?: MostlyOptions
): ExpectationResult {
  const re = likeToRegex(like_pattern);
  return buildColumnResult(
    getColumnValues(dataset, column),
    (v) => v == null || !re.test(String(v)),
    options
  );
}

export function expectColumnValuesToMatchLikePatternList(
  dataset: Dataset,
  column: string,
  like_pattern_list: string[],
  options?: MostlyOptions & { match_on?: 'any' | 'all' }
): ExpectationResult {
  const regexes = like_pattern_list.map(likeToRegex);
  const matchOn = options?.match_on ?? 'any';
  return buildColumnResult(
    getColumnValues(dataset, column),
    (v) => {
      if (v == null) return false;
      const s = String(v);
      return matchOn === 'any'
        ? regexes.some((re) => re.test(s))
        : regexes.every((re) => re.test(s));
    },
    options
  );
}

export function expectColumnValuesToNotMatchLikePatternList(
  dataset: Dataset,
  column: string,
  like_pattern_list: string[],
  options?: MostlyOptions
): ExpectationResult {
  const regexes = like_pattern_list.map(likeToRegex);
  return buildColumnResult(
    getColumnValues(dataset, column),
    (v) => {
      if (v == null) return true;
      const s = String(v);
      return regexes.every((re) => !re.test(s));
    },
    options
  );
}

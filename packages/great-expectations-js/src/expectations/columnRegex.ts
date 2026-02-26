import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { buildColumnResult, getColumnValues } from '../utils.js';

export function expectColumnValuesToMatchRegex(
  dataset: Dataset,
  column: string,
  regex: string | RegExp,
  options?: MostlyOptions
): ExpectationResult {
  const re = regex instanceof RegExp ? regex : new RegExp(regex);
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => v != null && re.test(String(v)), options);
}

export function expectColumnValuesToNotMatchRegex(
  dataset: Dataset,
  column: string,
  regex: string | RegExp,
  options?: MostlyOptions
): ExpectationResult {
  const re = regex instanceof RegExp ? regex : new RegExp(regex);
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => v == null || !re.test(String(v)), options);
}

export function expectColumnValuesToMatchRegexList(
  dataset: Dataset,
  column: string,
  regexList: (string | RegExp)[],
  options?: MostlyOptions & { match_on?: 'any' | 'all' }
): ExpectationResult {
  const patterns = regexList.map((r) => (r instanceof RegExp ? r : new RegExp(r)));
  const matchOn = options?.match_on ?? 'any';
  const values = getColumnValues(dataset, column);
  return buildColumnResult(
    values,
    (v) => {
      if (v == null) return false;
      const s = String(v);
      return matchOn === 'any'
        ? patterns.some((re) => re.test(s))
        : patterns.every((re) => re.test(s));
    },
    options
  );
}

export function expectColumnValuesToNotMatchRegexList(
  dataset: Dataset,
  column: string,
  regexList: (string | RegExp)[],
  options?: MostlyOptions
): ExpectationResult {
  const patterns = regexList.map((r) => (r instanceof RegExp ? r : new RegExp(r)));
  const values = getColumnValues(dataset, column);
  return buildColumnResult(
    values,
    (v) => {
      if (v == null) return true;
      const s = String(v);
      return patterns.every((re) => !re.test(s));
    },
    options
  );
}

export function expectColumnValuesToBeJsonParseable(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(
    values,
    (v) => {
      if (v == null) return false;
      try {
        JSON.parse(String(v));
        return true;
      } catch {
        return false;
      }
    },
    options
  );
}

export function expectColumnValuesToBeDateutilParseable(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(
    values,
    (v) => {
      if (v == null) return false;
      return !Number.isNaN(new Date(String(v)).getTime());
    },
    options
  );
}

export function expectColumnValuesToMatchStrftimeFormat(
  dataset: Dataset,
  column: string,
  strftimeFormat: string,
  options?: MostlyOptions
): ExpectationResult {
  const regex = strftimeToRegex(strftimeFormat);
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => v != null && regex.test(String(v)), options);
}

/** Convert a Python strftime format string to an approximate regex. */
function strftimeToRegex(format: string): RegExp {
  const replacements: Record<string, string> = {
    '%Y': '\\d{4}',
    '%m': '\\d{2}',
    '%d': '\\d{2}',
    '%H': '\\d{2}',
    '%M': '\\d{2}',
    '%S': '\\d{2}',
    '%f': '\\d+',
    '%y': '\\d{2}',
    '%I': '\\d{2}',
    '%p': '(?:AM|PM|am|pm)',
    '%z': '[+-]\\d{4}',
    '%Z': '[A-Z]{3,4}',
    '%j': '\\d{3}',
    '%U': '\\d{2}',
    '%W': '\\d{2}',
    '%%': '%',
  };
  let pattern = format;
  for (const [token, replacement] of Object.entries(replacements)) {
    pattern = pattern.replaceAll(token, replacement);
  }
  return new RegExp(`^${pattern}$`);
}

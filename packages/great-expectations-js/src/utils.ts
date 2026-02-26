import type { Dataset, ExpectationResult, MostlyOptions } from './types.js';

export const MAX_UNEXPECTED_SAMPLE = 20;

/** Extract the values of a single column from every row. */
export function getColumnValues(dataset: Dataset, column: string): unknown[] {
  return dataset.map((row) => row[column]);
}

/** Collect all column names that appear across any row in the dataset. */
export function getColumnNames(dataset: Dataset): string[] {
  const names = new Set<string>();
  for (const row of dataset) {
    for (const key of Object.keys(row)) {
      names.add(key);
    }
  }
  return [...names];
}

/**
 * Build an ExpectationResult by testing each value against a predicate.
 * Values where the predicate returns false are "unexpected".
 */
export function buildColumnResult(
  values: unknown[],
  predicate: (value: unknown, index: number) => boolean,
  options?: MostlyOptions
): ExpectationResult {
  const unexpected: unknown[] = [];
  for (let i = 0; i < values.length; i++) {
    if (!predicate(values[i], i)) {
      unexpected.push(values[i]);
    }
  }
  const total = values.length;
  const unexpectedCount = unexpected.length;
  const unexpectedPercent = total === 0 ? 0 : unexpectedCount / total;
  const mostly = options?.mostly ?? 1;
  const successPercent = total === 0 ? 1 : 1 - unexpectedPercent;

  return {
    success: successPercent >= mostly,
    unexpected_count: unexpectedCount,
    unexpected_percent: unexpectedPercent,
    unexpected_values: unexpected.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

/** Build a simple pass/fail result for table-level or aggregate expectations. */
export function buildTableResult(success: boolean, observedValue?: unknown): ExpectationResult {
  return {
    success,
    unexpected_count: success ? 0 : 1,
    unexpected_percent: success ? 0 : 1,
    unexpected_values: success ? [] : observedValue !== undefined ? [observedValue] : [],
  };
}

/**
 * Build an ExpectationResult by testing each row against a predicate.
 * Rows where the predicate returns false are "unexpected".
 */
export function buildRowResult(
  dataset: Dataset,
  predicate: (row: Record<string, unknown>, index: number) => boolean,
  options?: MostlyOptions
): ExpectationResult {
  const unexpected: Record<string, unknown>[] = [];
  for (let i = 0; i < dataset.length; i++) {
    if (!predicate(dataset[i], i)) {
      unexpected.push(dataset[i]);
    }
  }
  const total = dataset.length;
  const unexpectedCount = unexpected.length;
  const unexpectedPercent = total === 0 ? 0 : unexpectedCount / total;
  const mostly = options?.mostly ?? 1;
  const successPercent = total === 0 ? 1 : 1 - unexpectedPercent;

  return {
    success: successPercent >= mostly,
    unexpected_count: unexpectedCount,
    unexpected_percent: unexpectedPercent,
    unexpected_values: unexpected.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

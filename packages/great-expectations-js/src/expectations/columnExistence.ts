import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import {
  MAX_UNEXPECTED_SAMPLE,
  buildColumnResult,
  getColumnNames,
  getColumnValues,
} from '../utils.js';

export function expectColumnToExist(dataset: Dataset, column: string): ExpectationResult {
  const exists = getColumnNames(dataset).includes(column);
  return {
    success: exists,
    unexpected_count: exists ? 0 : 1,
    unexpected_percent: exists ? 0 : 1,
    unexpected_values: exists ? [] : [column],
  };
}

export function expectColumnValuesToBeNull(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => v == null, options);
}

export function expectColumnValuesToNotBeNull(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => v != null, options);
}

export function expectColumnValuesToBeUnique(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  const seen = new Set<unknown>();
  const unexpected: unknown[] = [];
  for (const v of values) {
    if (seen.has(v)) {
      unexpected.push(v);
    }
    seen.add(v);
  }
  const total = values.length;
  const unexpectedPercent = total === 0 ? 0 : unexpected.length / total;
  const mostly = options?.mostly ?? 1;
  const successPercent = total === 0 ? 1 : 1 - unexpectedPercent;
  return {
    success: successPercent >= mostly,
    unexpected_count: unexpected.length,
    unexpected_percent: unexpectedPercent,
    unexpected_values: unexpected.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

export function expectCompoundColumnsToBeUnique(
  dataset: Dataset,
  columns: string[]
): ExpectationResult {
  const seen = new Set<string>();
  const unexpected: Record<string, unknown>[] = [];
  for (const row of dataset) {
    const key = JSON.stringify(columns.map((c) => row[c]));
    if (seen.has(key)) {
      unexpected.push(row);
    }
    seen.add(key);
  }
  const total = dataset.length;
  return {
    success: unexpected.length === 0,
    unexpected_count: unexpected.length,
    unexpected_percent: total === 0 ? 0 : unexpected.length / total,
    unexpected_values: unexpected.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

/** Alias for expectCompoundColumnsToBeUnique. */
export const expectMulticolumnValuesToBeUnique = expectCompoundColumnsToBeUnique;

export function expectSelectColumnValuesToBeUniqueWithinRecord(
  dataset: Dataset,
  columns: string[],
  options?: MostlyOptions
): ExpectationResult {
  const unexpected: Record<string, unknown>[] = [];
  for (const row of dataset) {
    const values = columns.map((c) => row[c]);
    if (new Set(values).size !== values.length) {
      unexpected.push(row);
    }
  }
  const total = dataset.length;
  const unexpectedPercent = total === 0 ? 0 : unexpected.length / total;
  const mostly = options?.mostly ?? 1;
  const successPercent = total === 0 ? 1 : 1 - unexpectedPercent;
  return {
    success: successPercent >= mostly,
    unexpected_count: unexpected.length,
    unexpected_percent: unexpectedPercent,
    unexpected_values: unexpected.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

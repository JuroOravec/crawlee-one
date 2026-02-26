import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { buildColumnResult, getColumnValues, MAX_UNEXPECTED_SAMPLE } from '../utils.js';

export function expectColumnValuesToBeInSet(
  dataset: Dataset,
  column: string,
  valueSet: unknown[],
  options?: MostlyOptions
): ExpectationResult {
  const allowed = new Set(valueSet);
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => allowed.has(v), options);
}

export function expectColumnValuesToNotBeInSet(
  dataset: Dataset,
  column: string,
  valueSet: unknown[],
  options?: MostlyOptions
): ExpectationResult {
  const forbidden = new Set(valueSet);
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => !forbidden.has(v), options);
}

export function expectColumnDistinctValuesToBeInSet(
  dataset: Dataset,
  column: string,
  valueSet: unknown[]
): ExpectationResult {
  const allowed = new Set(valueSet);
  const distinct = new Set(getColumnValues(dataset, column));
  const unexpected = [...distinct].filter((v) => !allowed.has(v));
  return {
    success: unexpected.length === 0,
    unexpected_count: unexpected.length,
    unexpected_percent: distinct.size === 0 ? 0 : unexpected.length / distinct.size,
    unexpected_values: unexpected.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

export function expectColumnDistinctValuesToContainSet(
  dataset: Dataset,
  column: string,
  valueSet: unknown[]
): ExpectationResult {
  const distinct = new Set(getColumnValues(dataset, column));
  const missing = valueSet.filter((v) => !distinct.has(v));
  return {
    success: missing.length === 0,
    unexpected_count: missing.length,
    unexpected_percent: valueSet.length === 0 ? 0 : missing.length / valueSet.length,
    unexpected_values: missing.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

export function expectColumnDistinctValuesToEqualSet(
  dataset: Dataset,
  column: string,
  valueSet: unknown[]
): ExpectationResult {
  const distinct = new Set(getColumnValues(dataset, column));
  const expected = new Set(valueSet);
  const extra = [...distinct].filter((v) => !expected.has(v));
  const missing = [...expected].filter((v) => !distinct.has(v));
  const unexpected = [...extra, ...missing];
  return {
    success: unexpected.length === 0,
    unexpected_count: unexpected.length,
    unexpected_percent: 0,
    unexpected_values: unexpected.slice(0, MAX_UNEXPECTED_SAMPLE),
  };
}

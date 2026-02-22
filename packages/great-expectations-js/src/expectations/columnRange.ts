import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { MAX_UNEXPECTED_SAMPLE, buildColumnResult, getColumnValues } from '../utils.js';

export interface BetweenOptions extends MostlyOptions {
  min_value?: number;
  max_value?: number;
  strict_min?: boolean;
  strict_max?: boolean;
}

export function expectColumnValuesToBeBetween(
  dataset: Dataset,
  column: string,
  options: BetweenOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(
    values,
    (v) => {
      if (v == null) return false;
      const num = Number(v);
      if (Number.isNaN(num)) return false;
      if (
        options.min_value != null &&
        (options.strict_min ? num <= options.min_value : num < options.min_value)
      )
        return false;
      if (
        options.max_value != null &&
        (options.strict_max ? num >= options.max_value : num > options.max_value)
      )
        return false;
      return true;
    },
    options
  );
}

export function expectColumnValuesToBeIncreasing(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions & { strictly?: boolean }
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  const strictly = options?.strictly ?? false;
  const unexpected: unknown[] = [];
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1] as number;
    const curr = values[i] as number;
    if (strictly ? curr <= prev : curr < prev) {
      unexpected.push(curr);
    }
  }
  const total = Math.max(values.length - 1, 0);
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

export function expectColumnValuesToBeDecreasing(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions & { strictly?: boolean }
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  const strictly = options?.strictly ?? false;
  const unexpected: unknown[] = [];
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1] as number;
    const curr = values[i] as number;
    if (strictly ? curr >= prev : curr > prev) {
      unexpected.push(curr);
    }
  }
  const total = Math.max(values.length - 1, 0);
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

export function expectColumnValueLengthsToBeBetween(
  dataset: Dataset,
  column: string,
  options: BetweenOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(
    values,
    (v) => {
      if (v == null) return false;
      const len = String(v).length;
      if (
        options.min_value != null &&
        (options.strict_min ? len <= options.min_value : len < options.min_value)
      )
        return false;
      if (
        options.max_value != null &&
        (options.strict_max ? len >= options.max_value : len > options.max_value)
      )
        return false;
      return true;
    },
    options
  );
}

export function expectColumnValueLengthsToEqual(
  dataset: Dataset,
  column: string,
  value: number,
  options?: MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => v != null && String(v).length === value, options);
}

export function expectColumnValuesToBeOfType(
  dataset: Dataset,
  column: string,
  typeStr: string,
  options?: MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => typeof v === typeStr, options);
}

export function expectColumnValuesToBeInTypeList(
  dataset: Dataset,
  column: string,
  typeList: string[],
  options?: MostlyOptions
): ExpectationResult {
  const allowed = new Set(typeList);
  const values = getColumnValues(dataset, column);
  return buildColumnResult(values, (v) => allowed.has(typeof v), options);
}

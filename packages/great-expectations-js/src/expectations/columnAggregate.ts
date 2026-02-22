import type { Dataset, ExpectationResult } from '../types.js';
import { buildTableResult, getColumnValues } from '../utils.js';

function numericValues(dataset: Dataset, column: string): number[] {
  return getColumnValues(dataset, column)
    .filter((v) => v != null)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function expectColumnMaxToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const nums = numericValues(dataset, column);
  if (nums.length === 0) return buildTableResult(false);
  const max = Math.max(...nums);
  const ok =
    (options.min_value == null || max >= options.min_value) &&
    (options.max_value == null || max <= options.max_value);
  return buildTableResult(ok, max);
}

export function expectColumnMinToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const nums = numericValues(dataset, column);
  if (nums.length === 0) return buildTableResult(false);
  const min = Math.min(...nums);
  const ok =
    (options.min_value == null || min >= options.min_value) &&
    (options.max_value == null || min <= options.max_value);
  return buildTableResult(ok, min);
}

export function expectColumnMeanToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const nums = numericValues(dataset, column);
  if (nums.length === 0) return buildTableResult(false);
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const ok =
    (options.min_value == null || mean >= options.min_value) &&
    (options.max_value == null || mean <= options.max_value);
  return buildTableResult(ok, mean);
}

export function expectColumnMedianToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const nums = numericValues(dataset, column).sort((a, b) => a - b);
  if (nums.length === 0) return buildTableResult(false);
  const mid = Math.floor(nums.length / 2);
  const median = nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
  const ok =
    (options.min_value == null || median >= options.min_value) &&
    (options.max_value == null || median <= options.max_value);
  return buildTableResult(ok, median);
}

export function expectColumnSumToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const nums = numericValues(dataset, column);
  const sum = nums.reduce((a, b) => a + b, 0);
  const ok =
    (options.min_value == null || sum >= options.min_value) &&
    (options.max_value == null || sum <= options.max_value);
  return buildTableResult(ok, sum);
}

export function expectColumnStdevToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const nums = numericValues(dataset, column);
  if (nums.length === 0) return buildTableResult(false);
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / nums.length;
  const stdev = Math.sqrt(variance);
  const ok =
    (options.min_value == null || stdev >= options.min_value) &&
    (options.max_value == null || stdev <= options.max_value);
  return buildTableResult(ok, stdev);
}

export function expectColumnUniqueValueCountToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const count = new Set(getColumnValues(dataset, column)).size;
  const ok =
    (options.min_value == null || count >= options.min_value) &&
    (options.max_value == null || count <= options.max_value);
  return buildTableResult(ok, count);
}

export function expectColumnMostCommonValueToBeInSet(
  dataset: Dataset,
  column: string,
  valueSet: unknown[]
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  const freq = new Map<unknown, number>();
  for (const v of values) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  let mostCommon: unknown = undefined;
  let maxCount = 0;
  for (const [v, count] of freq) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = v;
    }
  }
  return buildTableResult(new Set(valueSet).has(mostCommon), mostCommon);
}

export function expectColumnProportionOfNonNullValuesToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  if (values.length === 0) return buildTableResult(true);
  const nonNull = values.filter((v) => v != null).length;
  const proportion = nonNull / values.length;
  const ok =
    (options.min_value == null || proportion >= options.min_value) &&
    (options.max_value == null || proportion <= options.max_value);
  return buildTableResult(ok, proportion);
}

export function expectColumnProportionOfUniqueValuesToBeBetween(
  dataset: Dataset,
  column: string,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  if (values.length === 0) return buildTableResult(true);
  const proportion = new Set(values).size / values.length;
  const ok =
    (options.min_value == null || proportion >= options.min_value) &&
    (options.max_value == null || proportion <= options.max_value);
  return buildTableResult(ok, proportion);
}

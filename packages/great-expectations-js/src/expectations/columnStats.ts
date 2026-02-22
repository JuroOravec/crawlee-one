import type { Dataset, ExpectationResult, MostlyOptions, QuantileResult } from '../types.js';
import { buildColumnResult, getColumnValues } from '../utils.js';

function numericValues(dataset: Dataset, column: string): number[] {
  return getColumnValues(dataset, column)
    .filter((v) => v != null)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

function interpolateQuantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  if (q <= 0) return sorted[0];
  if (q >= 1) return sorted[sorted.length - 1];
  const pos = q * (sorted.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (pos - lo) * (sorted[hi] - sorted[lo]);
}

export interface QuantileRanges {
  quantiles: number[];
  value_ranges: [number | null, number | null][];
}

export function expectColumnQuantileValuesToBeBetween(
  dataset: Dataset,
  column: string,
  quantile_ranges: QuantileRanges
): QuantileResult {
  const sorted = numericValues(dataset, column).sort((a, b) => a - b);
  const { quantiles, value_ranges } = quantile_ranges;

  const observedValues: number[] = quantiles.map((q) => interpolateQuantile(sorted, q));

  const successDetails = observedValues.map((val, i) => {
    const [lo, hi] = value_ranges[i];
    const lower = lo ?? -Infinity;
    const upper = hi ?? Infinity;
    return val >= lower && val <= upper;
  });

  const allPass = successDetails.every(Boolean);

  return {
    success: allPass,
    unexpected_count: successDetails.filter((s) => !s).length,
    unexpected_percent:
      successDetails.length === 0
        ? 0
        : successDetails.filter((s) => !s).length / successDetails.length,
    unexpected_values: observedValues.filter((_, i) => !successDetails[i]),
    observed_value: { quantiles, values: observedValues },
    details: { success_details: successDetails },
  };
}

export function expectColumnValueZScoresToBeLessThan(
  dataset: Dataset,
  column: string,
  options: { threshold: number; double_sided: boolean } & MostlyOptions
): ExpectationResult {
  const values = getColumnValues(dataset, column);
  const nums = values
    .filter((v) => v != null)
    .map(Number)
    .filter((n) => !Number.isNaN(n));

  if (nums.length === 0) {
    return { success: true, unexpected_count: 0, unexpected_percent: 0, unexpected_values: [] };
  }

  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / nums.length;
  const stdev = Math.sqrt(variance);

  return buildColumnResult(
    values,
    (v) => {
      if (v == null) return true;
      const n = Number(v);
      if (Number.isNaN(n)) return true;
      if (stdev === 0) return true;
      const z = (n - mean) / stdev;
      return options.double_sided ? Math.abs(z) < options.threshold : z < options.threshold;
    },
    options
  );
}

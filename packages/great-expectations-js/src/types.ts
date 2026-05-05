/** A dataset is an array of records (rows) where each record maps column names to values. */
export type Dataset = Record<string, unknown>[];

/** Result returned by every expectation function. */
export interface ExpectationResult {
  success: boolean;
  unexpected_count: number;
  unexpected_percent: number;
  /** Sample of values that didn't meet the expectation (capped at 20). */
  unexpected_values: unknown[];
}

/** Options for the `mostly` threshold — "at least X fraction must pass". */
export interface MostlyOptions {
  /** Fraction of values that must pass (0 to 1). Defaults to 1 (all must pass). */
  mostly?: number;
}

/**
 * Richer result for `expectColumnQuantileValuesToBeBetween`.
 * Compatible with ExpectationResult (extends it with per-quantile detail).
 */
export interface QuantileResult extends ExpectationResult {
  observed_value: { quantiles: number[]; values: number[] };
  details: { success_details: boolean[] };
}

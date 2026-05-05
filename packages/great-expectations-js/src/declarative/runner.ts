/**
 * Run declared expectations against a dataset.
 *
 * Example:
 *
 * ```ts
 * interface MyRow { offerId: string; offerUrl: string; supplierUrl: string }
 *
 * const expectations: DatasetExpectations<MyRow> = {
 *   field: [
 *     { expectation: "expectColumnValuesToBeUnique", params: { column: "offerId" } },
 *     { expectation: "expectColumnValuesToBeValidUrls", params: { column: "supplierUrl" } }
 *   ]
 * };
 * const results = runExpectations(dataset, expectations);
 * console.log(results);
 * ```
 *
 * ```json
 * [
 *   {
 *     "level": "field",
 *     "expectation": "expectColumnValuesToBeUnique",
 *     "result": { "success": true, "unexpected_count": 0, "unexpected_percent": 0, "unexpected_values": [] }
 *   },
 *   {
 *     "level": "field",
 *     "expectation": "expectColumnValuesToBeValidUrls",
 *     "result": { "success": true, "unexpected_count": 0, "unexpected_percent": 0, "unexpected_values": [] }
 *   }
 * ]
 */

import type { Dataset, ExpectationResult } from '../types.js';
import type { DatasetExpectations, ExpectationLevel } from './declaredExpectations.js';
import { EXPECTATION_REGISTRY } from './registry.js';

/** Typed expectations input. Alias for DatasetExpectations (default TRow). */
export type DatasetExpectationsInput = DatasetExpectations;

export interface RunExpectationResult {
  level: ExpectationLevel;
  expectation: string;
  result: ExpectationResult;
}

export interface RunExpectationsOptions {
  /** If true, continue running after a single expectation throws. Default: false. */
  continueOnError?: boolean;
}

/**
 * Run all declared expectations against a dataset.
 *
 * @param dataset - The dataset to validate (array of object rows)
 * @param expectations - Expectations grouped by level
 * @param options - Optional runner options
 * @returns Array of results, one per expectation run
 */
export function runExpectations<TRow extends object = Record<string, unknown>>(
  dataset: object[],
  expectations: DatasetExpectations<TRow>,
  options: RunExpectationsOptions = {}
): RunExpectationResult[] {
  const results: RunExpectationResult[] = [];
  const continueOnError = options.continueOnError ?? false;

  // Process levels in fixed order: dataset → field → multi-field → row → other.
  // This ensures consistent execution order across runs.
  const levels: ExpectationLevel[] = ['dataset', 'field', 'multi-field', 'row', 'other'];

  for (const level of levels) {
    const list = expectations[level];
    if (!list || list.length === 0) continue;

    for (const item of list) {
      // Each item is a DeclaredExpectation variant (expectation name + typed params).
      const decl = item as { expectation: string; params: Record<string, unknown> };
      const name = decl.expectation;
      const params = decl.params ?? {};

      const entry = EXPECTATION_REGISTRY[name];
      if (!entry) {
        const err = new Error(`Unknown expectation: ${name}`);
        if (continueOnError) {
          // Record the error as a failed result instead of throwing.
          results.push({
            level,
            expectation: name,
            result: {
              success: false,
              unexpected_count: 1,
              unexpected_percent: 1,
              unexpected_values: [String(err.message)],
            },
          });
          continue;
        }
        throw err;
      }

      try {
        const result = entry.invoke(dataset as Dataset, params);
        results.push({ level, expectation: name, result });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (continueOnError) {
          // Capture thrown errors as failed results so other expectations still run.
          results.push({
            level,
            expectation: name,
            result: {
              success: false,
              unexpected_count: dataset.length,
              unexpected_percent: 1,
              unexpected_values: [msg],
            },
          });
        } else {
          throw err;
        }
      }
    }
  }

  return results;
}

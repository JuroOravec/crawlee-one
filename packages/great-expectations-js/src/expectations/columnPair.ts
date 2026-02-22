import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { buildRowResult } from '../utils.js';

export function expectColumnPairValuesToBeEqual(
  dataset: Dataset,
  columnA: string,
  columnB: string,
  options?: MostlyOptions
): ExpectationResult {
  return buildRowResult(dataset, (row) => row[columnA] === row[columnB], options);
}

export function expectColumnPairValuesAToBeGreaterThanB(
  dataset: Dataset,
  columnA: string,
  columnB: string,
  options?: MostlyOptions & { or_equal?: boolean }
): ExpectationResult {
  const orEqual = options?.or_equal ?? false;
  return buildRowResult(
    dataset,
    (row) => {
      const a = Number(row[columnA]);
      const b = Number(row[columnB]);
      return orEqual ? a >= b : a > b;
    },
    options
  );
}

export function expectColumnPairValuesToBeInSet(
  dataset: Dataset,
  columnA: string,
  columnB: string,
  pairSet: [unknown, unknown][],
  options?: MostlyOptions
): ExpectationResult {
  const allowed = new Set(pairSet.map(([a, b]) => JSON.stringify([a, b])));
  return buildRowResult(
    dataset,
    (row) => allowed.has(JSON.stringify([row[columnA], row[columnB]])),
    options
  );
}

export function expectMulticolumnSumToEqual(
  dataset: Dataset,
  columns: string[],
  sumTotal: number,
  options?: MostlyOptions
): ExpectationResult {
  return buildRowResult(
    dataset,
    (row) => {
      const sum = columns.reduce((acc, col) => acc + Number(row[col] ?? 0), 0);
      return sum === sumTotal;
    },
    options
  );
}

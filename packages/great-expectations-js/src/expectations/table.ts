import type { Dataset, ExpectationResult } from '../types.js';
import { buildTableResult, getColumnNames } from '../utils.js';

export function expectTableRowCountToEqual(dataset: Dataset, value: number): ExpectationResult {
  return buildTableResult(dataset.length === value, dataset.length);
}

export function expectTableRowCountToBeBetween(
  dataset: Dataset,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const count = dataset.length;
  const aboveMin = options.min_value == null || count >= options.min_value;
  const belowMax = options.max_value == null || count <= options.max_value;
  return buildTableResult(aboveMin && belowMax, count);
}

export function expectTableColumnCountToEqual(dataset: Dataset, value: number): ExpectationResult {
  const count = getColumnNames(dataset).length;
  return buildTableResult(count === value, count);
}

export function expectTableColumnCountToBeBetween(
  dataset: Dataset,
  options: { min_value?: number; max_value?: number }
): ExpectationResult {
  const count = getColumnNames(dataset).length;
  const aboveMin = options.min_value == null || count >= options.min_value;
  const belowMax = options.max_value == null || count <= options.max_value;
  return buildTableResult(aboveMin && belowMax, count);
}

export function expectTableColumnsToMatchOrderedList(
  dataset: Dataset,
  columnList: string[]
): ExpectationResult {
  const actual = getColumnNames(dataset);
  const matches =
    actual.length === columnList.length && actual.every((name, i) => name === columnList[i]);
  return buildTableResult(matches, actual);
}

export function expectTableColumnsToMatchSet(
  dataset: Dataset,
  columnSet: string[]
): ExpectationResult {
  const actual = new Set(getColumnNames(dataset));
  const expected = new Set(columnSet);
  const matches = actual.size === expected.size && [...expected].every((c) => actual.has(c));
  return buildTableResult(matches, [...actual]);
}

export function expectTableRowCountToEqualOtherTable(
  dataset: Dataset,
  otherDataset: Dataset
): ExpectationResult {
  return buildTableResult(dataset.length === otherDataset.length, dataset.length);
}

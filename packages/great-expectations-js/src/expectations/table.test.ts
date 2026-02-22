import { describe, expect, it } from 'vitest';
import {
  expectTableRowCountToEqual,
  expectTableRowCountToBeBetween,
  expectTableColumnCountToEqual,
  expectTableColumnCountToBeBetween,
  expectTableColumnsToMatchOrderedList,
  expectTableColumnsToMatchSet,
  expectTableRowCountToEqualOtherTable,
} from './table.js';

const data = [
  { a: 1, b: 'x' },
  { a: 2, b: 'y' },
  { a: 3, b: 'z' },
];

describe('expectTableRowCountToEqual', () => {
  it('passes when count matches', () => {
    expect(expectTableRowCountToEqual(data, 3).success).toBe(true);
  });
  it('fails when count differs', () => {
    const r = expectTableRowCountToEqual(data, 5);
    expect(r.success).toBe(false);
    expect(r.unexpected_values).toEqual([3]);
  });
  it('handles empty dataset', () => {
    expect(expectTableRowCountToEqual([], 0).success).toBe(true);
  });
});

describe('expectTableRowCountToBeBetween', () => {
  it('passes within range', () => {
    expect(expectTableRowCountToBeBetween(data, { min_value: 1, max_value: 5 }).success).toBe(true);
  });
  it('fails below min', () => {
    expect(expectTableRowCountToBeBetween(data, { min_value: 10 }).success).toBe(false);
  });
  it('fails above max', () => {
    expect(expectTableRowCountToBeBetween(data, { max_value: 1 }).success).toBe(false);
  });
  it('open-ended range', () => {
    expect(expectTableRowCountToBeBetween(data, { min_value: 2 }).success).toBe(true);
  });
});

describe('expectTableColumnCountToEqual', () => {
  it('passes when count matches', () => {
    expect(expectTableColumnCountToEqual(data, 2).success).toBe(true);
  });
  it('fails when count differs', () => {
    expect(expectTableColumnCountToEqual(data, 5).success).toBe(false);
  });
  it('handles empty dataset', () => {
    expect(expectTableColumnCountToEqual([], 0).success).toBe(true);
  });
});

describe('expectTableColumnCountToBeBetween', () => {
  it('passes within range', () => {
    expect(expectTableColumnCountToBeBetween(data, { min_value: 1, max_value: 3 }).success).toBe(
      true
    );
  });
  it('fails out of range', () => {
    expect(expectTableColumnCountToBeBetween(data, { min_value: 5 }).success).toBe(false);
  });
});

describe('expectTableColumnsToMatchOrderedList', () => {
  it('passes for correct order', () => {
    expect(expectTableColumnsToMatchOrderedList(data, ['a', 'b']).success).toBe(true);
  });
  it('fails for wrong order', () => {
    expect(expectTableColumnsToMatchOrderedList(data, ['b', 'a']).success).toBe(false);
  });
  it('fails for missing column', () => {
    expect(expectTableColumnsToMatchOrderedList(data, ['a']).success).toBe(false);
  });
  it('handles empty', () => {
    expect(expectTableColumnsToMatchOrderedList([], []).success).toBe(true);
  });
});

describe('expectTableColumnsToMatchSet', () => {
  it('passes for matching set', () => {
    expect(expectTableColumnsToMatchSet(data, ['b', 'a']).success).toBe(true);
  });
  it('fails for extra column', () => {
    expect(expectTableColumnsToMatchSet(data, ['a']).success).toBe(false);
  });
  it('fails for missing column', () => {
    expect(expectTableColumnsToMatchSet(data, ['a', 'b', 'c']).success).toBe(false);
  });
});

describe('expectTableRowCountToEqualOtherTable', () => {
  it('passes when row counts match', () => {
    const other = [{ x: 1 }, { x: 2 }, { x: 3 }];
    expect(expectTableRowCountToEqualOtherTable(data, other).success).toBe(true);
  });

  it('fails when row counts differ', () => {
    const other = [{ x: 1 }];
    expect(expectTableRowCountToEqualOtherTable(data, other).success).toBe(false);
  });
});

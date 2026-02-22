import { describe, expect, it } from 'vitest';
import {
  expectColumnMaxToBeBetween,
  expectColumnMinToBeBetween,
  expectColumnMeanToBeBetween,
  expectColumnMedianToBeBetween,
  expectColumnSumToBeBetween,
  expectColumnStdevToBeBetween,
  expectColumnUniqueValueCountToBeBetween,
  expectColumnMostCommonValueToBeInSet,
  expectColumnProportionOfNonNullValuesToBeBetween,
  expectColumnProportionOfUniqueValuesToBeBetween,
} from './columnAggregate.js';

const data = [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }];

describe('expectColumnMaxToBeBetween', () => {
  it('passes when max in range', () => {
    expect(expectColumnMaxToBeBetween(data, 'v', { min_value: 4, max_value: 6 }).success).toBe(
      true
    );
  });
  it('fails when max out of range', () => {
    const r = expectColumnMaxToBeBetween(data, 'v', { max_value: 4 });
    expect(r.success).toBe(false);
    expect(r.unexpected_values).toEqual([5]);
  });
  it('fails on empty numeric column', () => {
    expect(expectColumnMaxToBeBetween([], 'v', {}).success).toBe(false);
  });
});

describe('expectColumnMinToBeBetween', () => {
  it('passes when min in range', () => {
    expect(expectColumnMinToBeBetween(data, 'v', { min_value: 0, max_value: 2 }).success).toBe(
      true
    );
  });
  it('fails when min out of range', () => {
    expect(expectColumnMinToBeBetween(data, 'v', { min_value: 2 }).success).toBe(false);
  });
});

describe('expectColumnMeanToBeBetween', () => {
  it('passes when mean in range', () => {
    expect(expectColumnMeanToBeBetween(data, 'v', { min_value: 2, max_value: 4 }).success).toBe(
      true
    );
  });
  it('observed value is the mean', () => {
    const r = expectColumnMeanToBeBetween(data, 'v', { max_value: 2 });
    expect(r.unexpected_values).toEqual([3]);
  });
});

describe('expectColumnMedianToBeBetween', () => {
  it('passes for odd-length dataset', () => {
    expect(expectColumnMedianToBeBetween(data, 'v', { min_value: 3, max_value: 3 }).success).toBe(
      true
    );
  });
  it('computes correct median for even-length', () => {
    const d = [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }];
    const r = expectColumnMedianToBeBetween(d, 'v', { min_value: 2.5, max_value: 2.5 });
    expect(r.success).toBe(true);
  });
});

describe('expectColumnSumToBeBetween', () => {
  it('passes when sum in range', () => {
    expect(expectColumnSumToBeBetween(data, 'v', { min_value: 15, max_value: 15 }).success).toBe(
      true
    );
  });
  it('fails when sum out of range', () => {
    expect(expectColumnSumToBeBetween(data, 'v', { max_value: 10 }).success).toBe(false);
  });
  it('empty dataset sums to 0', () => {
    expect(expectColumnSumToBeBetween([], 'v', { min_value: 0, max_value: 0 }).success).toBe(true);
  });
});

describe('expectColumnStdevToBeBetween', () => {
  it('passes for constant values (stdev=0)', () => {
    const d = [{ v: 5 }, { v: 5 }, { v: 5 }];
    expect(expectColumnStdevToBeBetween(d, 'v', { min_value: 0, max_value: 0 }).success).toBe(true);
  });
  it('computes population stdev correctly', () => {
    const d = [{ v: 2 }, { v: 4 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 5 }, { v: 7 }, { v: 9 }];
    const r = expectColumnStdevToBeBetween(d, 'v', { min_value: 1, max_value: 3 });
    expect(r.success).toBe(true);
  });
});

describe('expectColumnUniqueValueCountToBeBetween', () => {
  it('passes when count in range', () => {
    expect(
      expectColumnUniqueValueCountToBeBetween(data, 'v', { min_value: 5, max_value: 5 }).success
    ).toBe(true);
  });
  it('counts duplicates correctly', () => {
    const d = [{ v: 'a' }, { v: 'a' }, { v: 'b' }];
    expect(
      expectColumnUniqueValueCountToBeBetween(d, 'v', { min_value: 2, max_value: 2 }).success
    ).toBe(true);
  });
});

describe('expectColumnMostCommonValueToBeInSet', () => {
  it('passes when mode is in set', () => {
    const d = [{ v: 'a' }, { v: 'b' }, { v: 'a' }];
    expect(expectColumnMostCommonValueToBeInSet(d, 'v', ['a', 'c']).success).toBe(true);
  });
  it('fails when mode is not in set', () => {
    const d = [{ v: 'a' }, { v: 'b' }, { v: 'a' }];
    expect(expectColumnMostCommonValueToBeInSet(d, 'v', ['b', 'c']).success).toBe(false);
  });
});

describe('expectColumnProportionOfNonNullValuesToBeBetween', () => {
  it('passes when proportion in range', () => {
    const d = [{ v: 1 }, { v: null }, { v: 3 }, { v: null }];
    expect(
      expectColumnProportionOfNonNullValuesToBeBetween(d, 'v', { min_value: 0.5, max_value: 0.5 })
        .success
    ).toBe(true);
  });
  it('1.0 when all non-null', () => {
    expect(
      expectColumnProportionOfNonNullValuesToBeBetween(data, 'v', { min_value: 1, max_value: 1 })
        .success
    ).toBe(true);
  });
  it('handles empty dataset', () => {
    expect(expectColumnProportionOfNonNullValuesToBeBetween([], 'v', {}).success).toBe(true);
  });
});

describe('expectColumnProportionOfUniqueValuesToBeBetween', () => {
  it('1.0 when all unique', () => {
    expect(
      expectColumnProportionOfUniqueValuesToBeBetween(data, 'v', { min_value: 1, max_value: 1 })
        .success
    ).toBe(true);
  });
  it('less than 1 with duplicates', () => {
    const d = [{ v: 'a' }, { v: 'a' }, { v: 'b' }, { v: 'b' }];
    expect(
      expectColumnProportionOfUniqueValuesToBeBetween(d, 'v', { min_value: 0.5, max_value: 0.5 })
        .success
    ).toBe(true);
  });
});

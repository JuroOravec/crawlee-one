import { describe, expect, it } from 'vitest';

import {
  expectColumnValueLengthsToBeBetween,
  expectColumnValueLengthsToEqual,
  expectColumnValuesToBeBetween,
  expectColumnValuesToBeDecreasing,
  expectColumnValuesToBeIncreasing,
  expectColumnValuesToBeInTypeList,
  expectColumnValuesToBeOfType,
} from './columnRange.js';

const numData = [{ v: 1 }, { v: 5 }, { v: 10 }, { v: 15 }];

describe('expectColumnValuesToBeBetween', () => {
  it('passes when all in range', () => {
    expect(
      expectColumnValuesToBeBetween(numData, 'v', { min_value: 1, max_value: 15 }).success
    ).toBe(true);
  });
  it('fails when out of range', () => {
    const r = expectColumnValuesToBeBetween(numData, 'v', { min_value: 2, max_value: 14 });
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(2);
  });
  it('supports strict bounds', () => {
    const r = expectColumnValuesToBeBetween(numData, 'v', {
      min_value: 1,
      max_value: 15,
      strict_min: true,
      strict_max: true,
    });
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(2);
  });
  it('supports mostly', () => {
    expect(
      expectColumnValuesToBeBetween(numData, 'v', { min_value: 2, max_value: 14, mostly: 0.5 })
        .success
    ).toBe(true);
  });
  it('handles null values', () => {
    const d = [{ v: 5 }, { v: null }];
    expect(expectColumnValuesToBeBetween(d, 'v', { min_value: 1, max_value: 10 }).success).toBe(
      false
    );
  });
});

describe('expectColumnValuesToBeIncreasing', () => {
  it('passes for increasing sequence', () => {
    expect(expectColumnValuesToBeIncreasing(numData, 'v').success).toBe(true);
  });
  it('fails for non-increasing sequence', () => {
    const d = [{ v: 1 }, { v: 5 }, { v: 3 }];
    expect(expectColumnValuesToBeIncreasing(d, 'v').success).toBe(false);
  });
  it('allows equal values by default', () => {
    const d = [{ v: 1 }, { v: 1 }, { v: 2 }];
    expect(expectColumnValuesToBeIncreasing(d, 'v').success).toBe(true);
  });
  it('rejects equal values when strictly', () => {
    const d = [{ v: 1 }, { v: 1 }, { v: 2 }];
    expect(expectColumnValuesToBeIncreasing(d, 'v', { strictly: true }).success).toBe(false);
  });
  it('handles empty and single-row datasets', () => {
    expect(expectColumnValuesToBeIncreasing([], 'v').success).toBe(true);
    expect(expectColumnValuesToBeIncreasing([{ v: 1 }], 'v').success).toBe(true);
  });
});

describe('expectColumnValuesToBeDecreasing', () => {
  it('passes for decreasing sequence', () => {
    const d = [{ v: 10 }, { v: 5 }, { v: 1 }];
    expect(expectColumnValuesToBeDecreasing(d, 'v').success).toBe(true);
  });
  it('fails for non-decreasing', () => {
    expect(expectColumnValuesToBeDecreasing(numData, 'v').success).toBe(false);
  });
});

describe('expectColumnValueLengthsToBeBetween', () => {
  it('passes when lengths in range', () => {
    const d = [{ s: 'ab' }, { s: 'abc' }, { s: 'abcd' }];
    expect(
      expectColumnValueLengthsToBeBetween(d, 's', { min_value: 2, max_value: 4 }).success
    ).toBe(true);
  });
  it('fails when lengths out of range', () => {
    const d = [{ s: 'a' }, { s: 'abcde' }];
    const r = expectColumnValueLengthsToBeBetween(d, 's', { min_value: 2, max_value: 4 });
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(2);
  });
});

describe('expectColumnValueLengthsToEqual', () => {
  it('passes when all lengths match', () => {
    const d = [{ s: 'ab' }, { s: 'cd' }, { s: 'ef' }];
    expect(expectColumnValueLengthsToEqual(d, 's', 2).success).toBe(true);
  });
  it('fails when lengths differ', () => {
    const d = [{ s: 'ab' }, { s: 'cde' }];
    expect(expectColumnValueLengthsToEqual(d, 's', 2).success).toBe(false);
  });
});

describe('expectColumnValuesToBeOfType', () => {
  it('passes for matching type', () => {
    expect(expectColumnValuesToBeOfType(numData, 'v', 'number').success).toBe(true);
  });
  it('fails for wrong type', () => {
    expect(expectColumnValuesToBeOfType(numData, 'v', 'string').success).toBe(false);
  });
});

describe('expectColumnValuesToBeInTypeList', () => {
  it('passes when all types in list', () => {
    const d = [{ v: 1 }, { v: 'a' }, { v: true }];
    expect(expectColumnValuesToBeInTypeList(d, 'v', ['number', 'string', 'boolean']).success).toBe(
      true
    );
  });
  it('fails when type not in list', () => {
    const d = [{ v: 1 }, { v: 'a' }];
    expect(expectColumnValuesToBeInTypeList(d, 'v', ['number']).success).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import {
  expectColumnPairValuesToBeEqual,
  expectColumnPairValuesAToBeGreaterThanB,
  expectColumnPairValuesToBeInSet,
  expectMulticolumnSumToEqual,
} from './columnPair.js';

describe('expectColumnPairValuesToBeEqual', () => {
  it('passes when pairs are equal', () => {
    const d = [
      { a: 1, b: 1 },
      { a: 'x', b: 'x' },
    ];
    expect(expectColumnPairValuesToBeEqual(d, 'a', 'b').success).toBe(true);
  });
  it('fails when pairs differ', () => {
    const d = [
      { a: 1, b: 1 },
      { a: 2, b: 3 },
    ];
    const r = expectColumnPairValuesToBeEqual(d, 'a', 'b');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });
  it('supports mostly', () => {
    const d = [
      { a: 1, b: 1 },
      { a: 2, b: 2 },
      { a: 3, b: 99 },
    ];
    expect(expectColumnPairValuesToBeEqual(d, 'a', 'b', { mostly: 0.6 }).success).toBe(true);
  });
});

describe('expectColumnPairValuesAToBeGreaterThanB', () => {
  it('passes when A > B', () => {
    const d = [
      { a: 10, b: 5 },
      { a: 20, b: 15 },
    ];
    expect(expectColumnPairValuesAToBeGreaterThanB(d, 'a', 'b').success).toBe(true);
  });
  it('fails when A <= B', () => {
    const d = [{ a: 5, b: 10 }];
    expect(expectColumnPairValuesAToBeGreaterThanB(d, 'a', 'b').success).toBe(false);
  });
  it('or_equal allows A == B', () => {
    const d = [{ a: 5, b: 5 }];
    expect(expectColumnPairValuesAToBeGreaterThanB(d, 'a', 'b', { or_equal: true }).success).toBe(
      true
    );
  });
});

describe('expectColumnPairValuesToBeInSet', () => {
  it('passes when all pairs in set', () => {
    const d = [
      { a: 1, b: 'x' },
      { a: 2, b: 'y' },
    ];
    const pairs: [unknown, unknown][] = [
      [1, 'x'],
      [2, 'y'],
      [3, 'z'],
    ];
    expect(expectColumnPairValuesToBeInSet(d, 'a', 'b', pairs).success).toBe(true);
  });
  it('fails when pair not in set', () => {
    const d = [
      { a: 1, b: 'x' },
      { a: 99, b: 'missing' },
    ];
    expect(expectColumnPairValuesToBeInSet(d, 'a', 'b', [[1, 'x']]).success).toBe(false);
  });
});

describe('expectMulticolumnSumToEqual', () => {
  it('passes when row sums match', () => {
    const d = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: -3 },
    ];
    expect(expectMulticolumnSumToEqual(d, ['a', 'b', 'c'], 6).success).toBe(true);
  });
  it('fails when row sums do not match', () => {
    const d = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ];
    const r = expectMulticolumnSumToEqual(d, ['a', 'b'], 3);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });
});

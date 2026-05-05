import { describe, expect, it } from 'vitest';

import {
  expectColumnToExist,
  expectColumnValuesToBeNull,
  expectColumnValuesToBeUnique,
  expectColumnValuesToNotBeNull,
  expectCompoundColumnsToBeUnique,
  expectMulticolumnValuesToBeUnique,
  expectSelectColumnValuesToBeUniqueWithinRecord,
} from './columnExistence.js';

const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: null },
  { name: 'Carol', age: 25 },
];

describe('expectColumnToExist', () => {
  it('passes for existing column', () => {
    expect(expectColumnToExist(data, 'name').success).toBe(true);
  });
  it('fails for missing column', () => {
    const r = expectColumnToExist(data, 'email');
    expect(r.success).toBe(false);
    expect(r.unexpected_values).toEqual(['email']);
  });
  it('handles empty dataset', () => {
    expect(expectColumnToExist([], 'name').success).toBe(false);
  });
});

describe('expectColumnValuesToBeNull', () => {
  it('passes when all null', () => {
    const d = [{ x: null }, { x: undefined }, { x: null }];
    expect(expectColumnValuesToBeNull(d, 'x').success).toBe(true);
  });
  it('fails when some are not null', () => {
    const r = expectColumnValuesToBeNull(data, 'name');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(3);
  });
});

describe('expectColumnValuesToNotBeNull', () => {
  it('passes when no nulls', () => {
    expect(expectColumnValuesToNotBeNull(data, 'name').success).toBe(true);
  });
  it('fails when some null', () => {
    const r = expectColumnValuesToNotBeNull(data, 'age');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });
  it('supports mostly', () => {
    expect(expectColumnValuesToNotBeNull(data, 'age', { mostly: 0.6 }).success).toBe(true);
  });
  it('handles empty dataset', () => {
    expect(expectColumnValuesToNotBeNull([], 'x').success).toBe(true);
  });
});

describe('expectColumnValuesToBeUnique', () => {
  it('passes for unique values', () => {
    expect(expectColumnValuesToBeUnique(data, 'name').success).toBe(true);
  });
  it('fails for duplicates', () => {
    const d = [{ x: 1 }, { x: 2 }, { x: 1 }];
    const r = expectColumnValuesToBeUnique(d, 'x');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
    expect(r.unexpected_values).toEqual([1]);
  });
  it('supports mostly', () => {
    const d = [{ x: 1 }, { x: 2 }, { x: 1 }, { x: 3 }, { x: 4 }];
    expect(expectColumnValuesToBeUnique(d, 'x', { mostly: 0.7 }).success).toBe(true);
  });
});

describe('expectCompoundColumnsToBeUnique', () => {
  it('passes for unique compound keys', () => {
    const d = [
      { a: 1, b: 'x' },
      { a: 1, b: 'y' },
      { a: 2, b: 'x' },
    ];
    expect(expectCompoundColumnsToBeUnique(d, ['a', 'b']).success).toBe(true);
  });
  it('fails for duplicate compound keys', () => {
    const d = [
      { a: 1, b: 'x' },
      { a: 1, b: 'x' },
    ];
    expect(expectCompoundColumnsToBeUnique(d, ['a', 'b']).success).toBe(false);
  });
});

describe('expectMulticolumnValuesToBeUnique', () => {
  it('is an alias for expectCompoundColumnsToBeUnique', () => {
    expect(expectMulticolumnValuesToBeUnique).toBe(expectCompoundColumnsToBeUnique);
  });
});

describe('expectSelectColumnValuesToBeUniqueWithinRecord', () => {
  it('passes when values are unique per row', () => {
    const d = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    expect(expectSelectColumnValuesToBeUniqueWithinRecord(d, ['a', 'b', 'c']).success).toBe(true);
  });
  it('fails when values repeat within a row', () => {
    const d = [
      { a: 1, b: 1, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const r = expectSelectColumnValuesToBeUniqueWithinRecord(d, ['a', 'b', 'c']);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });
});

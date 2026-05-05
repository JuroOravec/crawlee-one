import { describe, expect, it } from 'vitest';

import {
  expectColumnDistinctValuesToBeInSet,
  expectColumnDistinctValuesToContainSet,
  expectColumnDistinctValuesToEqualSet,
  expectColumnValuesToBeInSet,
  expectColumnValuesToNotBeInSet,
} from './columnSet.js';

const data = [{ color: 'red' }, { color: 'green' }, { color: 'blue' }, { color: 'red' }];

describe('expectColumnValuesToBeInSet', () => {
  it('passes when all in set', () => {
    expect(expectColumnValuesToBeInSet(data, 'color', ['red', 'green', 'blue']).success).toBe(true);
  });
  it('fails when some not in set', () => {
    const r = expectColumnValuesToBeInSet(data, 'color', ['red', 'green']);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
    expect(r.unexpected_values).toEqual(['blue']);
  });
  it('supports mostly', () => {
    expect(
      expectColumnValuesToBeInSet(data, 'color', ['red', 'green'], { mostly: 0.7 }).success
    ).toBe(true);
  });
});

describe('expectColumnValuesToNotBeInSet', () => {
  it('passes when none in forbidden set', () => {
    expect(expectColumnValuesToNotBeInSet(data, 'color', ['yellow', 'purple']).success).toBe(true);
  });
  it('fails when some in forbidden set', () => {
    const r = expectColumnValuesToNotBeInSet(data, 'color', ['red']);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(2);
  });
});

describe('expectColumnDistinctValuesToBeInSet', () => {
  it('passes when all distinct values are in set', () => {
    expect(
      expectColumnDistinctValuesToBeInSet(data, 'color', ['red', 'green', 'blue', 'yellow']).success
    ).toBe(true);
  });
  it('fails when distinct values fall outside set', () => {
    const r = expectColumnDistinctValuesToBeInSet(data, 'color', ['red', 'green']);
    expect(r.success).toBe(false);
    expect(r.unexpected_values).toEqual(['blue']);
  });
});

describe('expectColumnDistinctValuesToContainSet', () => {
  it('passes when distinct values contain the set', () => {
    expect(expectColumnDistinctValuesToContainSet(data, 'color', ['red', 'blue']).success).toBe(
      true
    );
  });
  it('fails when missing expected values', () => {
    const r = expectColumnDistinctValuesToContainSet(data, 'color', ['red', 'yellow']);
    expect(r.success).toBe(false);
    expect(r.unexpected_values).toEqual(['yellow']);
  });
});

describe('expectColumnDistinctValuesToEqualSet', () => {
  it('passes when sets are equal', () => {
    expect(
      expectColumnDistinctValuesToEqualSet(data, 'color', ['red', 'green', 'blue']).success
    ).toBe(true);
  });
  it('fails when sets differ', () => {
    const r = expectColumnDistinctValuesToEqualSet(data, 'color', ['red', 'green']);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });
  it('detects both extra and missing values', () => {
    const r = expectColumnDistinctValuesToEqualSet(data, 'color', ['red', 'green', 'yellow']);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(2);
  });
});

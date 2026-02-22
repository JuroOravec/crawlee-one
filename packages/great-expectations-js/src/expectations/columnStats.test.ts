import { describe, it, expect } from 'vitest';
import {
  expectColumnQuantileValuesToBeBetween,
  expectColumnValueZScoresToBeLessThan,
} from './columnStats.js';

describe('expectColumnQuantileValuesToBeBetween', () => {
  const data = [{ v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }, { v: 3 }, { v: 3 }, { v: 4 }];

  it('passes when all quantiles in range', () => {
    const r = expectColumnQuantileValuesToBeBetween(data, 'v', {
      quantiles: [0, 0.5, 1],
      value_ranges: [
        [0, 2],
        [2, 3],
        [3, 5],
      ],
    });
    expect(r.success).toBe(true);
    expect(r.details.success_details).toEqual([true, true, true]);
    expect(r.observed_value.quantiles).toEqual([0, 0.5, 1]);
    expect(r.observed_value.values).toHaveLength(3);
  });

  it('fails when a quantile is out of range', () => {
    const r = expectColumnQuantileValuesToBeBetween(data, 'v', {
      quantiles: [0, 1],
      value_ranges: [
        [0, 1],
        [2, 3],
      ],
    });
    expect(r.success).toBe(false);
    expect(r.details.success_details[1]).toBe(false);
  });

  it('handles null bounds as infinity', () => {
    const r = expectColumnQuantileValuesToBeBetween(data, 'v', {
      quantiles: [0, 1],
      value_ranges: [
        [null, null],
        [null, null],
      ],
    });
    expect(r.success).toBe(true);
  });

  it('returns QuantileResult compatible with ExpectationResult', () => {
    const r = expectColumnQuantileValuesToBeBetween(data, 'v', {
      quantiles: [0.5],
      value_ranges: [[0, 10]],
    });
    expect(typeof r.success).toBe('boolean');
    expect(typeof r.unexpected_count).toBe('number');
    expect(typeof r.unexpected_percent).toBe('number');
    expect(Array.isArray(r.unexpected_values)).toBe(true);
  });
});

describe('expectColumnValueZScoresToBeLessThan', () => {
  const data = [{ v: 1 }, { v: 1 }, { v: 1 }, { v: 3 }, { v: 3 }];

  it('passes when all z-scores within threshold (double_sided)', () => {
    const r = expectColumnValueZScoresToBeLessThan(data, 'v', {
      threshold: 2,
      double_sided: true,
    });
    expect(r.success).toBe(true);
  });

  it('fails when a z-score exceeds threshold', () => {
    const d = [{ v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }, { v: 100 }];
    const r = expectColumnValueZScoresToBeLessThan(d, 'v', {
      threshold: 1,
      double_sided: true,
    });
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBeGreaterThan(0);
  });

  it('handles single-sided mode', () => {
    const d = [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }, { v: 100 }];
    const r = expectColumnValueZScoresToBeLessThan(d, 'v', {
      threshold: 1,
      double_sided: false,
    });
    expect(r.success).toBe(false);
  });

  it('supports mostly', () => {
    const d = [{ v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }, { v: 100 }];
    const r = expectColumnValueZScoresToBeLessThan(d, 'v', {
      threshold: 1,
      double_sided: true,
      mostly: 0.5,
    });
    expect(r.success).toBe(true);
  });

  it('handles zero stdev', () => {
    const d = [{ v: 5 }, { v: 5 }, { v: 5 }];
    const r = expectColumnValueZScoresToBeLessThan(d, 'v', {
      threshold: 1,
      double_sided: true,
    });
    expect(r.success).toBe(true);
  });
});

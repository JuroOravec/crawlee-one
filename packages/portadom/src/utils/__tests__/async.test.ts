import { describe, expect, it } from 'vitest';

import {
  serialAsyncMap,
  parallelAsyncMap,
  serialAsyncFilter,
  parallelAsyncFilter,
  serialAsyncFind,
  serialAsyncForEach,
  parallelAsyncForEach,
} from '../async.js';

describe('serialAsyncMap', () => {
  it('maps items sequentially', async () => {
    const order: number[] = [];
    const result = await serialAsyncMap([1, 2, 3], async (item, index) => {
      order.push(index);
      return item * 2;
    });
    expect(result).toEqual([2, 4, 6]);
    expect(order).toEqual([0, 1, 2]);
  });

  it('returns empty array for empty input', async () => {
    const result = await serialAsyncMap([], async (x) => x);
    expect(result).toEqual([]);
  });
});

describe('parallelAsyncMap', () => {
  it('maps items in parallel', async () => {
    const result = await parallelAsyncMap([1, 2, 3], async (item) => item * 2);
    expect(result).toEqual([2, 4, 6]);
  });
});

describe('serialAsyncFilter', () => {
  it('filters items sequentially', async () => {
    const result = await serialAsyncFilter([1, 2, 3, 4, 5], async (item) => item % 2 === 0);
    expect(result).toEqual([2, 4]);
  });
});

describe('parallelAsyncFilter', () => {
  it('filters items in parallel', async () => {
    const result = await parallelAsyncFilter([1, 2, 3, 4, 5], async (item) => item > 3);
    expect(result).toEqual([4, 5]);
  });
});

describe('serialAsyncFind', () => {
  it('finds first matching item', async () => {
    const result = await serialAsyncFind([1, 2, 3, 4], async (item) => item > 2);
    expect(result).toBe(3);
  });

  it('returns undefined when nothing matches', async () => {
    const result = await serialAsyncFind([1, 2, 3], async (item) => item > 10);
    expect(result).toBeUndefined();
  });
});

describe('serialAsyncForEach', () => {
  it('iterates items sequentially', async () => {
    const collected: number[] = [];
    await serialAsyncForEach([10, 20, 30], async (item) => {
      collected.push(item);
    });
    expect(collected).toEqual([10, 20, 30]);
  });
});

describe('parallelAsyncForEach', () => {
  it('iterates items in parallel', async () => {
    const collected: number[] = [];
    await parallelAsyncForEach([10, 20, 30], async (item) => {
      collected.push(item);
    });
    // All items should be visited, order may vary
    expect(collected.sort()).toEqual([10, 20, 30]);
  });
});

import { describe, it, expect } from 'vitest';

import { serialAsyncMap, serialAsyncFind, wait } from './async.js';

describe('serialAsyncMap', () => {
  it('maps items sequentially', async () => {
    const order: number[] = [];
    const result = await serialAsyncMap([1, 2, 3], async (item) => {
      order.push(item);
      return item * 2;
    });
    expect(result).toEqual([2, 4, 6]);
    expect(order).toEqual([1, 2, 3]);
  });

  it('passes index to the callback', async () => {
    const indices: number[] = [];
    await serialAsyncMap(['a', 'b', 'c'], async (_, index) => {
      indices.push(index);
    });
    expect(indices).toEqual([0, 1, 2]);
  });

  it('works with synchronous functions', async () => {
    const result = await serialAsyncMap([10, 20], (item) => item + 1);
    expect(result).toEqual([11, 21]);
  });

  it('returns empty array for empty input', async () => {
    const result = await serialAsyncMap([], async (item) => item);
    expect(result).toEqual([]);
  });
});

describe('serialAsyncFind', () => {
  it('returns first matching item', async () => {
    const result = await serialAsyncFind([1, 2, 3, 4], async (item) => item > 2);
    expect(result).toBe(3);
  });

  it('returns undefined when no match', async () => {
    const result = await serialAsyncFind([1, 2, 3], async () => false);
    expect(result).toBeUndefined();
  });

  it('stops at first match', async () => {
    const visited: number[] = [];
    await serialAsyncFind([1, 2, 3, 4], async (item) => {
      visited.push(item);
      return item === 2;
    });
    expect(visited).toEqual([1, 2]);
  });

  it('passes index to the callback', async () => {
    const result = await serialAsyncFind(['a', 'b', 'c'], async (_, index) => index === 1);
    expect(result).toBe('b');
  });
});

describe('wait', () => {
  it('resolves after the specified delay', async () => {
    const start = Date.now();
    await wait(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // Allow some timing slack
  });

  it('resolves immediately with no argument', async () => {
    const start = Date.now();
    await wait();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });
});

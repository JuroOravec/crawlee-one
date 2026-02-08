import { describe, it, expect, vi } from 'vitest';

import { serialAsyncMap, serialAsyncFilter, serialAsyncFind, wait, retryAsync } from './async.js';

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

describe('serialAsyncFilter', () => {
  it('filters items with async predicate', async () => {
    const result = await serialAsyncFilter([1, 2, 3, 4, 5], async (item) => item % 2 === 0);
    expect(result).toEqual([2, 4]);
  });

  it('preserves order', async () => {
    const result = await serialAsyncFilter([5, 3, 1, 4, 2], async (item) => item > 2);
    expect(result).toEqual([5, 3, 4]);
  });

  it('passes index to the callback', async () => {
    const result = await serialAsyncFilter([10, 20, 30], async (_, index) => index !== 1);
    expect(result).toEqual([10, 30]);
  });

  it('returns empty array when nothing matches', async () => {
    const result = await serialAsyncFilter([1, 2, 3], async () => false);
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

describe('retryAsync', () => {
  it('returns result on first success', async () => {
    const { result, errors } = await retryAsync(async () => 42);
    expect(result).toBe(42);
    expect(errors).toEqual([]);
  });

  it('retries on failure and returns result on eventual success', async () => {
    let attempt = 0;
    const { result, errors } = await retryAsync(
      async () => {
        attempt++;
        if (attempt < 2) throw new Error('fail');
        return 'ok';
      },
      { maxRetries: 3, delay: 0 }
    );
    expect(result).toBe('ok');
    expect(errors).toHaveLength(1);
  });

  it('collects all errors when all retries fail', async () => {
    const { result, errors } = await retryAsync(
      async (retries) => {
        throw new Error(`fail-${retries}`);
      },
      { maxRetries: 2, delay: 0 }
    );
    expect(result).toBeNull();
    expect(errors).toHaveLength(3); // initial + 2 retries
    expect((errors[0] as Error).message).toBe('fail-0');
    expect((errors[2] as Error).message).toBe('fail-2');
  });

  it('calls onError callback for each failure', async () => {
    const onError = vi.fn();
    await retryAsync(
      async () => {
        throw new Error('fail');
      },
      { maxRetries: 2, delay: 0, onError }
    );
    expect(onError).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 0);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 2);
  });

  it('respects maxRetries = 0 (no retries)', async () => {
    let attempts = 0;
    await retryAsync(
      async () => {
        attempts++;
        throw new Error('fail');
      },
      { maxRetries: 0, delay: 0 }
    );
    expect(attempts).toBe(1);
  });

  it('throws on invalid maxRetries', async () => {
    await expect(retryAsync(async () => 1, { maxRetries: -1 })).rejects.toThrow(
      'Invalid input for maxRetries'
    );
  });

  it('passes retry count to the function', async () => {
    const retryCounts: number[] = [];
    await retryAsync(
      async (retries) => {
        retryCounts.push(retries);
        throw new Error('fail');
      },
      { maxRetries: 2, delay: 0 }
    );
    expect(retryCounts).toEqual([0, 1, 2]);
  });
});

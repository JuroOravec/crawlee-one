import { describe, expect, it, vi } from 'vitest';
import {
  wait,
  retryAsync,
  serialAsyncMap,
  serialAsyncFilter,
  serialAsyncFind,
  deferredPromise,
} from '../async.js';

describe('wait', () => {
  it('resolves after the specified delay', async () => {
    const start = Date.now();
    await wait(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // allow small timing variance
  });

  it('resolves immediately when called without arguments', async () => {
    const start = Date.now();
    await wait();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });
});

describe('retryAsync', () => {
  it('returns the result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const { result, errors } = await retryAsync(fn);
    expect(result).toBe('ok');
    expect(errors).toHaveLength(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds on retry', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('fail1')).mockResolvedValue('ok');
    const { result, errors } = await retryAsync(fn, { maxRetries: 2 });
    expect(result).toBe('ok');
    expect(errors).toHaveLength(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('collects all errors when all attempts fail', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    const { result, errors } = await retryAsync(fn, { maxRetries: 2 });
    expect(result).toBeNull();
    expect(errors).toHaveLength(3); // initial + 2 retries
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('calls onError callback with each error', async () => {
    const onError = vi.fn();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('e1'))
      .mockRejectedValueOnce(new Error('e2'))
      .mockResolvedValue('ok');
    await retryAsync(fn, { maxRetries: 2, onError });
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 0);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 1);
  });

  it('throws on invalid maxRetries', async () => {
    const fn = vi.fn();
    await expect(retryAsync(fn, { maxRetries: -1 })).rejects.toThrow('Invalid input');
  });

  it('passes retry index to the function', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('ok');
    await retryAsync(fn, { maxRetries: 1 });
    expect(fn).toHaveBeenCalledWith(0);
    expect(fn).toHaveBeenCalledWith(1);
  });
});

describe('serialAsyncMap', () => {
  it('maps values sequentially', async () => {
    const result = await serialAsyncMap([1, 2, 3], async (x) => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('returns empty array for empty input', async () => {
    const result = await serialAsyncMap([], async (x) => x);
    expect(result).toEqual([]);
  });

  it('passes index to the callback', async () => {
    const result = await serialAsyncMap(['a', 'b'], async (_item, index) => index);
    expect(result).toEqual([0, 1]);
  });

  it('executes serially (not in parallel)', async () => {
    const order: number[] = [];
    await serialAsyncMap([1, 2, 3], async (x) => {
      order.push(x);
      return x;
    });
    expect(order).toEqual([1, 2, 3]);
  });
});

describe('serialAsyncFilter', () => {
  it('filters values sequentially', async () => {
    const result = await serialAsyncFilter([1, 2, 3, 4], async (x) => x % 2 === 0);
    expect(result).toEqual([2, 4]);
  });

  it('returns empty array when nothing matches', async () => {
    const result = await serialAsyncFilter([1, 3, 5], async (x) => x % 2 === 0);
    expect(result).toEqual([]);
  });

  it('returns all items when all match', async () => {
    const result = await serialAsyncFilter([2, 4, 6], async (x) => x % 2 === 0);
    expect(result).toEqual([2, 4, 6]);
  });

  it('returns empty array for empty input', async () => {
    const result = await serialAsyncFilter([], async () => true);
    expect(result).toEqual([]);
  });
});

describe('serialAsyncFind', () => {
  it('returns the first matching item', async () => {
    const result = await serialAsyncFind([1, 2, 3], async (x) => x > 1);
    expect(result).toBe(2);
  });

  it('returns undefined when no item matches', async () => {
    const result = await serialAsyncFind([1, 2, 3], async (x) => x > 10);
    expect(result).toBeUndefined();
  });

  it('returns undefined for empty input', async () => {
    const result = await serialAsyncFind([], async () => true);
    expect(result).toBeUndefined();
  });

  it('stops at the first match (does not process remaining items)', async () => {
    const processed: number[] = [];
    await serialAsyncFind([1, 2, 3], async (x) => {
      processed.push(x);
      return x === 2;
    });
    expect(processed).toEqual([1, 2]);
  });
});

describe('deferredPromise', () => {
  it('resolves when resolve is called', async () => {
    const { resolve, promise } = deferredPromise<string>();
    resolve('hello');
    await expect(promise).resolves.toBe('hello');
  });

  it('rejects when reject is called', async () => {
    const { reject, promise } = deferredPromise<string>();
    reject(new Error('boom'));
    await expect(promise).rejects.toThrow('boom');
  });
});

import { describe, it, expect, vi } from 'vitest';

import { createValueMonitor, createSizeMonitor } from './valueMonitor.js';

describe('createValueMonitor', () => {
  it('fetches value on first access', async () => {
    const fetcher = vi.fn().mockResolvedValue(10);
    const monitor = createValueMonitor(fetcher);
    const value = await monitor.value();
    expect(value).toBe(10);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('returns cached value within TTL', async () => {
    const fetcher = vi.fn().mockResolvedValue(10);
    const monitor = createValueMonitor(fetcher, { ttlInMs: 10_000 });

    await monitor.value();
    const value2 = monitor.value(); // Should return cached (not a promise)
    expect(value2).toBe(10);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('re-fetches value when stale', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockResolvedValue(10);
    const monitor = createValueMonitor(fetcher, { ttlInMs: 100 });

    await monitor.value();
    expect(fetcher).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(150);

    expect(monitor.isStale()).toBe(true);
    await monitor.value();
    expect(fetcher).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('isStale returns true before first fetch', () => {
    const monitor = createValueMonitor(vi.fn().mockResolvedValue(1));
    expect(monitor.isStale()).toBe(true);
  });

  it('triggers callbacks on refresh', async () => {
    const fetcher = vi.fn().mockResolvedValue(5);
    const monitor = createValueMonitor(fetcher);
    const callback = vi.fn();
    monitor.onValue(callback);

    await monitor.refresh();
    expect(callback).toHaveBeenCalledWith(5, null);

    fetcher.mockResolvedValue(10);
    await monitor.refresh();
    expect(callback).toHaveBeenCalledWith(10, 5);
  });

  it('deregisters callbacks', async () => {
    const fetcher = vi.fn().mockResolvedValue(1);
    const monitor = createValueMonitor(fetcher);
    const callback = vi.fn();
    const deregister = monitor.onValue(callback);

    await monitor.refresh();
    expect(callback).toHaveBeenCalledTimes(1);

    deregister();
    await monitor.refresh();
    expect(callback).toHaveBeenCalledTimes(1); // Not called again
  });
});

describe('createSizeMonitor', () => {
  it('isFull returns false when under capacity', async () => {
    const sizeGetter = vi.fn().mockResolvedValue(5);
    const onMaxReached = vi.fn();
    const monitor = createSizeMonitor(10, sizeGetter, onMaxReached);

    expect(await monitor.isFull()).toBe(false);
  });

  it('isFull returns true when at capacity', async () => {
    const sizeGetter = vi.fn().mockResolvedValue(10);
    const onMaxReached = vi.fn();
    const monitor = createSizeMonitor(10, sizeGetter, onMaxReached);

    expect(await monitor.isFull()).toBe(true);
  });

  it('shortenToSize trims array to remaining capacity', async () => {
    const sizeGetter = vi.fn().mockResolvedValue(7);
    const onMaxReached = vi.fn();
    const monitor = createSizeMonitor(10, sizeGetter, onMaxReached);

    const result = await monitor.shortenToSize([1, 2, 3, 4, 5]);
    expect(result).toEqual([1, 2, 3]); // 10 - 7 = 3 remaining
  });

  it('returns empty array when already at capacity', async () => {
    const sizeGetter = vi.fn().mockResolvedValue(10);
    const onMaxReached = vi.fn();
    const monitor = createSizeMonitor(10, sizeGetter, onMaxReached);

    const result = await monitor.shortenToSize([1, 2, 3]);
    expect(result).toEqual([]);
  });

  it('calls onMaxSizeReached when size meets max', async () => {
    const sizeGetter = vi.fn().mockResolvedValue(10);
    const onMaxReached = vi.fn();
    const monitor = createSizeMonitor(10, sizeGetter, onMaxReached);

    await monitor.refresh();
    expect(onMaxReached).toHaveBeenCalledTimes(1);
  });

  it('does not call onMaxSizeReached when under capacity', async () => {
    const sizeGetter = vi.fn().mockResolvedValue(5);
    const onMaxReached = vi.fn();
    const monitor = createSizeMonitor(10, sizeGetter, onMaxReached);

    await monitor.refresh();
    expect(onMaxReached).not.toHaveBeenCalled();
  });
});

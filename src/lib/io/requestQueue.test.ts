import { describe, it, expect, vi } from 'vitest';

import { requestQueueSizeMonitor } from './requestQueue';
import type { CrawleeOneIO, CrawleeOneRequestQueue } from '../integrations/types';

const createMockRequestQueue = (
  overrides?: Partial<CrawleeOneRequestQueue>
): CrawleeOneRequestQueue => ({
  addRequests: vi.fn(),
  markRequestHandled: vi.fn(),
  fetchNextRequest: vi.fn().mockResolvedValue(null),
  reclaimRequest: vi.fn(),
  isFinished: vi.fn().mockResolvedValue(true),
  drop: vi.fn(),
  clear: vi.fn(),
  handledCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

const createMockIO = (overrides?: {
  reqQueue?: CrawleeOneRequestQueue;
}): CrawleeOneIO<any, any, any> => {
  const reqQueue = overrides?.reqQueue ?? createMockRequestQueue();

  return {
    openDataset: vi.fn().mockResolvedValue({
      pushData: vi.fn(),
      getItems: vi.fn().mockResolvedValue([]),
      getItemCount: vi.fn().mockResolvedValue(0),
    }),
    openRequestQueue: vi.fn().mockResolvedValue(reqQueue),
    openKeyValueStore: vi.fn().mockResolvedValue({
      getValue: vi.fn(),
      setValue: vi.fn(),
      drop: vi.fn(),
      clear: vi.fn(),
    }),
    getInput: vi.fn().mockResolvedValue(null),
    runInContext: vi.fn(),
    triggerDownstreamCrawler: vi.fn(),
    createDefaultProxyConfiguration: vi.fn().mockResolvedValue(undefined),
    isTelemetryEnabled: vi.fn().mockReturnValue(false),
    generateErrorReport: vi.fn().mockResolvedValue({}),
    generateEntryMetadata: vi.fn().mockResolvedValue({}),
  } as any;
};

describe('requestQueueSizeMonitor', () => {
  it('isFull returns false when queue handled count is under max', async () => {
    const reqQueue = createMockRequestQueue({ handledCount: vi.fn().mockResolvedValue(5) });
    const io = createMockIO({ reqQueue });

    const monitor = requestQueueSizeMonitor(10, { io });
    expect(await monitor.isFull()).toBe(false);
  });

  it('isFull returns true when queue handled count equals max', async () => {
    const reqQueue = createMockRequestQueue({ handledCount: vi.fn().mockResolvedValue(10) });
    const io = createMockIO({ reqQueue });

    const monitor = requestQueueSizeMonitor(10, { io });
    expect(await monitor.isFull()).toBe(true);
  });

  it('shortenToSize trims array based on remaining capacity', async () => {
    const reqQueue = createMockRequestQueue({ handledCount: vi.fn().mockResolvedValue(8) });
    const io = createMockIO({ reqQueue });

    const monitor = requestQueueSizeMonitor(10, { io });
    const result = await monitor.shortenToSize(['a', 'b', 'c', 'd', 'e']);
    expect(result).toEqual(['a', 'b']);
  });

  it('clears queue when max size is reached', async () => {
    const reqQueue = createMockRequestQueue({ handledCount: vi.fn().mockResolvedValue(10) });
    const io = createMockIO({ reqQueue });

    const monitor = requestQueueSizeMonitor(10, { io });
    await monitor.refresh();

    expect(reqQueue.clear).toHaveBeenCalled();
  });

  it('opens named queue when requestQueueId is provided', async () => {
    const reqQueue = createMockRequestQueue({ handledCount: vi.fn().mockResolvedValue(0) });
    const io = createMockIO({ reqQueue });

    const monitor = requestQueueSizeMonitor(10, { io, requestQueueId: 'my-queue' });
    await monitor.isFull();

    expect(io.openRequestQueue).toHaveBeenCalledWith('my-queue');
  });
});

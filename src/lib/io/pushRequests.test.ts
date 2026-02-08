import { describe, it, expect, vi } from 'vitest';

import { pushRequests } from './pushRequests.js';
import type { CrawleeOneIO, CrawleeOneRequestQueue } from '../integrations/types.js';

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

describe('pushRequests', () => {
  it('pushes requests to the queue', async () => {
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ reqQueue });

    const requests = [
      { url: 'https://example.com/1', uniqueKey: '1' },
      { url: 'https://example.com/2', uniqueKey: '2' },
    ];

    await pushRequests(requests as any, { io });

    expect(reqQueue.addRequests).toHaveBeenCalledTimes(1);
    expect(reqQueue.addRequests).toHaveBeenCalledWith(requests, undefined);
  });

  it('converts single item to array', async () => {
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ reqQueue });

    const request = { url: 'https://example.com', uniqueKey: '1' };
    await pushRequests(request as any, { io });

    expect(reqQueue.addRequests).toHaveBeenCalledWith([request], undefined);
  });

  it('applies transform function', async () => {
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ reqQueue });

    const requests = [{ url: 'https://example.com', uniqueKey: '1' }];
    await pushRequests(requests as any, {
      io,
      transform: (req: any) => ({ ...req, userData: { label: 'DETAIL' } }),
    });

    expect(reqQueue.addRequests).toHaveBeenCalledWith(
      [{ url: 'https://example.com', uniqueKey: '1', userData: { label: 'DETAIL' } }],
      undefined
    );
  });

  it('applies filter function', async () => {
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ reqQueue });

    const requests = [
      { url: 'https://example.com/1', uniqueKey: '1' },
      { url: 'https://example.com/2', uniqueKey: '2' },
      { url: 'https://example.com/3', uniqueKey: '3' },
    ];

    await pushRequests(requests as any, {
      io,
      filter: (req: any) => req.url.endsWith('/2'),
    });

    expect(reqQueue.addRequests).toHaveBeenCalledWith(
      [{ url: 'https://example.com/2', uniqueKey: '2' }],
      undefined
    );
  });

  it('opens named request queue when requestQueueId is provided', async () => {
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ reqQueue });

    await pushRequests([{ url: 'https://example.com', uniqueKey: '1' }] as any, {
      io,
      requestQueueId: 'my-queue',
    });

    expect(io.openRequestQueue).toHaveBeenCalledWith('my-queue');
  });

  it('passes queueOptions through', async () => {
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ reqQueue });

    await pushRequests([{ url: 'https://example.com', uniqueKey: '1' }] as any, {
      io,
      queueOptions: { forefront: true } as any,
    });

    expect(reqQueue.addRequests).toHaveBeenCalledWith(expect.any(Array), { forefront: true });
  });

  it('returns adjusted items', async () => {
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ reqQueue });

    const result = await pushRequests(
      [
        { url: 'https://example.com/1', uniqueKey: '1' },
        { url: 'https://example.com/2', uniqueKey: '2' },
      ] as any,
      {
        io,
        filter: (req: any) => req.url.endsWith('/1'),
      }
    );

    expect(result).toEqual([{ url: 'https://example.com/1', uniqueKey: '1' }]);
  });
});

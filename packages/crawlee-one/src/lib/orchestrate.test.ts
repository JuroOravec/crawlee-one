import { describe, expect, it, vi } from 'vitest';

import type { CrawleeOneRequestQueue } from './integrations/types.js';
import { orchestrate, type OrchestratedCrawler } from './orchestrate.js';

const createMockQueue = (overrides?: Partial<CrawleeOneRequestQueue>): CrawleeOneRequestQueue => ({
  addRequest: vi.fn(),
  addRequests: vi.fn(),
  getRequest: vi.fn().mockResolvedValue(null),
  markRequestHandled: vi.fn(),
  fetchNextRequest: vi.fn().mockResolvedValue(null),
  reclaimRequest: vi.fn(),
  isFinished: vi.fn().mockResolvedValue(true),
  drop: vi.fn(),
  clear: vi.fn(),
  handledCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

const createMockIoAndLog = (overrides?: {
  mainQueue?: CrawleeOneRequestQueue;
  llmQueue?: CrawleeOneRequestQueue;
}) => {
  const mainQueue = overrides?.mainQueue ?? createMockQueue();
  const llmQueue = overrides?.llmQueue ?? createMockQueue();

  const io = {
    openRequestQueue: vi.fn().mockImplementation((id?: string | null) => {
      if (id === 'llm-queue' || id === 'llm') return Promise.resolve(llmQueue);
      return Promise.resolve(mainQueue);
    }),
  } as any;
  const log = { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() } as any;
  return { io, log };
};

describe('orchestrate', () => {
  it('exits when all queues are empty (no keep-alive crawlers)', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const { io, log } = createMockIoAndLog({ mainQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
    ];

    await orchestrate({ log, io, crawlers, checkIntervalMs: 0 });

    expect(runMain).toHaveBeenCalledTimes(1);
    expect(io.openRequestQueue).toHaveBeenCalledWith('main');
  });

  it('exits when all queues are empty (with keep-alive crawlers)', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const llmQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const { io, log } = createMockIoAndLog({ mainQueue, llmQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const runLlm = vi
      .fn()
      .mockImplementation(() => new Promise<void>((resolve) => setTimeout(resolve, 10)));
    const stopLlm = vi.fn();

    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
      { crawler: { run: runLlm, stop: stopLlm }, queueId: 'llm-queue', isKeepAlive: true },
    ];

    await orchestrate({ log, io, crawlers, checkIntervalMs: 0 });

    expect(runMain).toHaveBeenCalledTimes(1);
    expect(runLlm).toHaveBeenCalledTimes(1);
    expect(stopLlm).toHaveBeenCalledTimes(1);
  });

  it('re-starts non-keep-alive crawler when its queue has pending after first run', async () => {
    const mainQueue = createMockQueue({
      isFinished: vi
        .fn()
        .mockResolvedValueOnce(false) // after first run, queue has pending
        .mockResolvedValueOnce(true), // after second run, queue empty
    });
    const { io, log } = createMockIoAndLog({ mainQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
    ];

    await orchestrate({ log, io, crawlers, checkIntervalMs: 0 });

    expect(runMain).toHaveBeenCalledTimes(2);
    expect(log.info).toHaveBeenCalledWith('Starting crawler for queue with pending requests: main');
  });

  it('polls when keep-alive queue has pending and no non-keep-alive crawlers running', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const llmQueue = createMockQueue({
      isFinished: vi
        .fn()
        .mockResolvedValueOnce(false) // first check: keep-alive has pending
        .mockResolvedValueOnce(true), // second check: drained
    });
    const { io, log } = createMockIoAndLog({ mainQueue, llmQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const runLlm = vi.fn().mockResolvedValue(undefined);
    const stopLlm = vi.fn();

    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
      { crawler: { run: runLlm, stop: stopLlm }, queueId: 'llm-queue', isKeepAlive: true },
    ];

    await orchestrate({ log, io, crawlers, checkIntervalMs: 0 });

    expect(runMain).toHaveBeenCalledTimes(1);
    expect(stopLlm).toHaveBeenCalledTimes(1);
    expect(log.info).toHaveBeenCalledWith(expect.stringContaining('Waiting'));
  });

  it('does not call stop on non-keep-alive crawlers', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const { io, log } = createMockIoAndLog({ mainQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const stopMain = vi.fn();
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: stopMain }, queueId: 'main', isKeepAlive: false },
    ];

    await orchestrate({ log, io, crawlers, checkIntervalMs: 0 });

    expect(stopMain).not.toHaveBeenCalled();
  });

  it('uses default log and io when omitted (crawlers can be empty)', async () => {
    const crawlers: OrchestratedCrawler[] = [];
    await orchestrate({ crawlers, checkIntervalMs: 0 });
  });

  it('uses default queue when queueId is undefined', async () => {
    const defaultQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const { io, log } = createMockIoAndLog({ mainQueue: defaultQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: undefined, isKeepAlive: false },
    ];

    await orchestrate({ log, io, crawlers, checkIntervalMs: 0 });

    expect(io.openRequestQueue).toHaveBeenCalledWith(undefined);
    expect(runMain).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { orchestrate, type OrchestratedCrawler } from './orchestrate.js';
import type { CrawleeOneRequestQueue } from './integrations/types.js';

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

const createMockActor = (overrides?: {
  mainQueue?: CrawleeOneRequestQueue;
  llmQueue?: CrawleeOneRequestQueue;
}) => {
  const mainQueue = overrides?.mainQueue ?? createMockQueue();
  const llmQueue = overrides?.llmQueue ?? createMockQueue();

  return {
    io: {
      openRequestQueue: vi.fn().mockImplementation((id?: string | null) => {
        if (id === 'llm-queue' || id === 'llm') return Promise.resolve(llmQueue);
        return Promise.resolve(mainQueue);
      }),
    },
    log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
  } as any;
};

describe('orchestrate', () => {
  it('exits when all queues are empty (no keep-alive crawlers)', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const actor = createMockActor({ mainQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
    ];

    await orchestrate({ actor, crawlers, checkIntervalMs: 0 });

    expect(runMain).toHaveBeenCalledTimes(1);
    expect(actor.io.openRequestQueue).toHaveBeenCalledWith('main');
  });

  it('exits when all queues are empty (with keep-alive crawlers)', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const llmQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const actor = createMockActor({ mainQueue, llmQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const runLlm = vi
      .fn()
      .mockImplementation(() => new Promise<void>((resolve) => setTimeout(resolve, 10)));
    const stopLlm = vi.fn();

    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
      { crawler: { run: runLlm, stop: stopLlm }, queueId: 'llm-queue', isKeepAlive: true },
    ];

    await orchestrate({ actor, crawlers, checkIntervalMs: 0 });

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
    const actor = createMockActor({ mainQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
    ];

    await orchestrate({ actor, crawlers, checkIntervalMs: 0 });

    expect(runMain).toHaveBeenCalledTimes(2);
    expect(actor.log.info).toHaveBeenCalledWith(
      'Starting crawler for queue with pending requests: main'
    );
  });

  it('polls when keep-alive queue has pending and no non-keep-alive crawlers running', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const llmQueue = createMockQueue({
      isFinished: vi
        .fn()
        .mockResolvedValueOnce(false) // first check: keep-alive has pending
        .mockResolvedValueOnce(true), // second check: drained
    });
    const actor = createMockActor({ mainQueue, llmQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const runLlm = vi.fn().mockResolvedValue(undefined);
    const stopLlm = vi.fn();

    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: 'main', isKeepAlive: false },
      { crawler: { run: runLlm, stop: stopLlm }, queueId: 'llm-queue', isKeepAlive: true },
    ];

    await orchestrate({ actor, crawlers, checkIntervalMs: 0 });

    expect(runMain).toHaveBeenCalledTimes(1);
    expect(stopLlm).toHaveBeenCalledTimes(1);
    expect(actor.log.info).toHaveBeenCalledWith(expect.stringContaining('Waiting'));
  });

  it('does not call stop on non-keep-alive crawlers', async () => {
    const mainQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const actor = createMockActor({ mainQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const stopMain = vi.fn();
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: stopMain }, queueId: 'main', isKeepAlive: false },
    ];

    await orchestrate({ actor, crawlers, checkIntervalMs: 0 });

    expect(stopMain).not.toHaveBeenCalled();
  });

  it('uses default queue when queueId is undefined', async () => {
    const defaultQueue = createMockQueue({ isFinished: vi.fn().mockResolvedValue(true) });
    const actor = createMockActor({ mainQueue: defaultQueue });

    const runMain = vi.fn().mockResolvedValue(undefined);
    const crawlers: OrchestratedCrawler[] = [
      { crawler: { run: runMain, stop: vi.fn() }, queueId: undefined, isKeepAlive: false },
    ];

    await orchestrate({ actor, crawlers, checkIntervalMs: 0 });

    expect(actor.io.openRequestQueue).toHaveBeenCalledWith(undefined);
    expect(runMain).toHaveBeenCalledTimes(1);
  });
});

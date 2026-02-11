import { describe, it, expect, vi } from 'vitest';

import { getColumnFromDataset, datasetSizeMonitor } from './dataset.js';
import type {
  CrawleeOneIO,
  CrawleeOneDataset,
  CrawleeOneRequestQueue,
} from '../integrations/types.js';

const createMockDataset = (overrides?: Partial<CrawleeOneDataset>): CrawleeOneDataset => ({
  pushData: vi.fn(),
  getItems: vi.fn().mockResolvedValue([]),
  getItemCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

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
  dataset?: CrawleeOneDataset;
  reqQueue?: CrawleeOneRequestQueue;
}): CrawleeOneIO<any, any, any> => {
  const dataset = overrides?.dataset ?? createMockDataset();
  const reqQueue = overrides?.reqQueue ?? createMockRequestQueue();

  return {
    openDataset: vi.fn().mockResolvedValue(dataset),
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

describe('getColumnFromDataset', () => {
  it('extracts a single field from dataset items', async () => {
    const dataset = createMockDataset({
      getItems: vi.fn().mockResolvedValue([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]),
    });
    const io = createMockIO({ dataset });

    const result = await getColumnFromDataset('ds-1', 'name', { io });
    expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('passes field name and dataOptions to getItems', async () => {
    const getItems = vi.fn().mockResolvedValue([]);
    const dataset = createMockDataset({ getItems });
    const io = createMockIO({ dataset });

    await getColumnFromDataset('ds-1', 'url', {
      io,
      dataOptions: { limit: 10, offset: 5 },
    });

    expect(getItems).toHaveBeenCalledWith({
      limit: 10,
      offset: 5,
      fields: ['url'],
    });
  });
});

describe('datasetSizeMonitor', () => {
  it('isFull returns false when dataset is under max size', async () => {
    const dataset = createMockDataset({ getItemCount: vi.fn().mockResolvedValue(5) });
    const io = createMockIO({ dataset });

    const monitor = datasetSizeMonitor(10, { io });
    expect(await monitor.isFull()).toBe(false);
  });

  it('isFull returns true when dataset is at max size', async () => {
    const dataset = createMockDataset({ getItemCount: vi.fn().mockResolvedValue(10) });
    const io = createMockIO({ dataset });

    const monitor = datasetSizeMonitor(10, { io });
    expect(await monitor.isFull()).toBe(true);
  });

  it('shortenToSize trims array based on remaining capacity', async () => {
    const dataset = createMockDataset({ getItemCount: vi.fn().mockResolvedValue(7) });
    const io = createMockIO({ dataset });

    const monitor = datasetSizeMonitor(10, { io });
    const result = await monitor.shortenToSize([1, 2, 3, 4, 5]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('clears request queue when max size is reached', async () => {
    const dataset = createMockDataset({ getItemCount: vi.fn().mockResolvedValue(10) });
    const reqQueue = createMockRequestQueue();
    const io = createMockIO({ dataset, reqQueue });

    const monitor = datasetSizeMonitor(10, { io });
    await monitor.refresh();

    expect(reqQueue.clear).toHaveBeenCalled();
  });
});

import { describe, it, expect, vi } from 'vitest';
import type { CrawleeOneIO, CrawleeOneDataset } from 'crawlee-one';

import { getDatasetCount } from '../dataset.js';

const createMockDataset = (overrides?: Partial<CrawleeOneDataset>): CrawleeOneDataset => ({
  pushData: vi.fn(),
  getItems: vi.fn().mockResolvedValue([]),
  getItemCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

const createMockIO = (overrides?: { dataset?: CrawleeOneDataset }): CrawleeOneIO<any, any, any> => {
  const dataset = overrides?.dataset ?? createMockDataset();

  return {
    openDataset: vi.fn().mockResolvedValue(dataset),
    openRequestQueue: vi.fn(),
    openKeyValueStore: vi.fn(),
    getInput: vi.fn().mockResolvedValue(null),
    runInContext: vi.fn(),
    triggerDownstreamCrawler: vi.fn(),
    createDefaultProxyConfiguration: vi.fn().mockResolvedValue(undefined),
    isTelemetryEnabled: vi.fn().mockReturnValue(false),
    generateErrorReport: vi.fn().mockResolvedValue({}),
    generateEntryMetadata: vi.fn().mockResolvedValue({}),
  } as any;
};

describe('getDatasetCount', () => {
  it('returns item count from dataset', async () => {
    const dataset = createMockDataset({ getItemCount: vi.fn().mockResolvedValue(42) });
    const io = createMockIO({ dataset });

    const count = await getDatasetCount(undefined, { io });
    expect(count).toBe(42);
  });

  it('opens named dataset when ID is provided', async () => {
    const dataset = createMockDataset({ getItemCount: vi.fn().mockResolvedValue(5) });
    const io = createMockIO({ dataset });

    await getDatasetCount('my-dataset', { io });
    expect(io.openDataset).toHaveBeenCalledWith('my-dataset');
  });

  it('returns null when getItemCount returns null', async () => {
    const dataset = createMockDataset({ getItemCount: vi.fn().mockResolvedValue(null) });
    const io = createMockIO({ dataset });

    const count = await getDatasetCount(undefined, { io });
    expect(count).toBeNull();
  });

  it('throws when io is not provided', async () => {
    await expect(getDatasetCount()).rejects.toThrow('requires an io option');
  });
});

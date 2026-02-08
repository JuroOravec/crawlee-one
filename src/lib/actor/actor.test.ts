import { describe, it, expect } from 'vitest';

import { createHttpCrawlerOptions } from './actor';

describe('createHttpCrawlerOptions', () => {
  it('returns defaults when no input or overrides', () => {
    const result = createHttpCrawlerOptions({
      input: null,
      defaults: { maxRequestRetries: 3, maxConcurrency: 10 } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 3,
      maxConcurrency: 10,
    });
  });

  it('input fields override defaults', () => {
    const result = createHttpCrawlerOptions({
      input: { maxRequestRetries: 5 },
      defaults: { maxRequestRetries: 3, maxConcurrency: 10 } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 5,
      maxConcurrency: 10,
    });
  });

  it('overrides take precedence over input and defaults', () => {
    const result = createHttpCrawlerOptions({
      input: { maxRequestRetries: 5 },
      defaults: { maxRequestRetries: 3, maxConcurrency: 10 } as any,
      overrides: { maxRequestRetries: 1, maxConcurrency: 2 } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 1,
      maxConcurrency: 2,
    });
  });

  it('omits undefined fields from defaults', () => {
    const result = createHttpCrawlerOptions({
      input: null,
      defaults: { maxRequestRetries: 3, maxConcurrency: undefined } as any,
    });

    expect(result).toHaveProperty('maxRequestRetries', 3);
    expect(result).not.toHaveProperty('maxConcurrency');
  });

  it('omits undefined fields from overrides', () => {
    const result = createHttpCrawlerOptions({
      input: { maxRequestRetries: 5 },
      defaults: { maxConcurrency: 10 } as any,
      overrides: { maxRequestRetries: undefined } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 5,
      maxConcurrency: 10,
    });
  });

  it('handles null input gracefully', () => {
    const result = createHttpCrawlerOptions({
      input: null,
    });

    expect(result).toEqual({});
  });

  it('only picks recognized crawler input fields from input', () => {
    const result = createHttpCrawlerOptions({
      input: {
        maxRequestRetries: 5,
        // This is not a crawler config field - it's a crawlee-one-specific input
        outputDatasetId: 'my-dataset',
        startUrls: ['https://example.com'],
      },
    });

    // Only crawler config fields should be included
    expect(result).toHaveProperty('maxRequestRetries', 5);
    expect(result).not.toHaveProperty('outputDatasetId');
    expect(result).not.toHaveProperty('startUrls');
  });
});

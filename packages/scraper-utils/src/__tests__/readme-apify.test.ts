import { describe, expect, it } from 'vitest';
import type { ApifyScraperActorSpec, ApifyReadmeTemplatesOverrides } from '../index.js';
import { renderApifyReadme } from '../index.js';

/**
 * Minimal but complete actorSpec fixture that exercises the main
 * template branches (multiple datasets, modes, filters, perf stats,
 * personal data, features).
 *
 * Modeled after the profesia-sk scraper's actorspec.
 */
const actorSpec: ApifyScraperActorSpec = {
  actorspecVersion: 1,
  actor: {
    title: 'Test Scraper',
    publicUrl: 'https://apify.com/testuser/test-scraper',
    shortDesc: 'A test scraper for unit testing renderApifyReadme.',
    datasetOverviewImgUrl: './public/imgs/test-overview.png',
  },
  platform: {
    name: 'apify',
    url: 'https://apify.com',
    authorId: 'testuser',
    authorProfileUrl: 'https://apify.com/testuser',
    actorId: 'test-scraper',
    socials: {
      discord: 'https://discord.gg/test',
    },
  },
  authors: [
    {
      name: 'Test Author',
      email: 'test@example.com',
      authorUrl: 'https://example.com',
    },
  ],
  websites: [
    {
      name: 'Example.com',
      url: 'https://www.example.com',
    },
  ],
  pricing: {
    pricingType: 'monthly fee',
    value: 10,
    currency: 'usd',
    period: 1,
    periodUnit: 'month',
  },
  datasets: [
    {
      name: 'items',
      shortDesc: 'Item listings',
      url: 'https://example.com/items',
      size: 5000,
      isDefault: true,
      filters: ['category', 'price range'],
      filterCompleteness: 'some',
      modes: [
        { name: 'fast', isDefault: true, shortDesc: 'listing page only' },
        { name: 'detailed', isDefault: false, shortDesc: 'visit each item page' },
      ],
      features: {
        limitResultsCount: true,
        usesBrowser: false,
        proxySupport: true,
        configurable: true,
        regularlyTested: true,
        privacyCompliance: true,
        errorMonitoring: true,
        changeMonitoring: false,
        downstreamAutomation: true,
        integratedCache: true,
        integratedETL: true,
      },
      faultTolerance: {
        dataLossScope: 'entry',
        timeLostAvgSec: 1,
        timeLostMaxSec: 10,
      },
      privacy: {
        personalDataFields: ['contactEmail'],
        isPersonalDataRedacted: true,
        personalDataSubjects: ['sellers'],
      },
      perfTable: 'main',
      perfStats: [
        { rowId: 'fast', colId: '100items', mode: 'fast', count: 100, costUsd: 0.01, timeSec: 30 },
        {
          rowId: 'fast',
          colId: 'fullRun',
          mode: 'fast',
          count: 'all',
          costUsd: 0.5,
          timeSec: 600,
        },
        {
          rowId: 'detailed',
          colId: '100items',
          mode: 'detailed',
          count: 100,
          costUsd: 0.05,
          timeSec: 120,
        },
        {
          rowId: 'detailed',
          colId: 'fullRun',
          mode: 'detailed',
          count: 'all',
          costUsd: 1.0,
          timeSec: 3600,
        },
      ],
      output: {
        exampleEntry: {
          name: 'Widget A',
          price: 19.99,
          url: 'https://example.com/items/widget-a',
        },
      },
    },
    {
      name: 'categories',
      shortDesc: 'List of categories',
      url: 'https://example.com/categories',
      size: 50,
      isDefault: false,
      filters: [],
      filterCompleteness: 'full',
      modes: [],
      features: {
        limitResultsCount: true,
        usesBrowser: false,
        proxySupport: true,
        configurable: true,
        regularlyTested: true,
        privacyCompliance: false,
        errorMonitoring: true,
        changeMonitoring: false,
        downstreamAutomation: true,
        integratedCache: false,
        integratedETL: false,
      },
      faultTolerance: {
        dataLossScope: 'all',
        timeLostAvgSec: 5,
        timeLostMaxSec: 5,
      },
      privacy: {
        personalDataFields: [],
        isPersonalDataRedacted: true,
        personalDataSubjects: [],
      },
      perfTable: 'other',
      perfStats: [
        {
          rowId: 'default',
          colId: 'fullRun',
          mode: null,
          count: 50,
          costUsd: 0.003,
          timeSec: 10,
        },
      ],
      output: {
        exampleEntry: {
          name: 'Electronics',
          url: 'https://example.com/categories/electronics',
          count: 1200,
        },
      },
    },
  ],
};

const templates: ApifyReadmeTemplatesOverrides = {
  input: {
    maxCount: 'outputMaxEntries',
    privacyName: 'Include personal data',
  },
  perfTables: {
    main: {
      rows: [
        { rowId: 'fast', template: 'Fast run' },
        { rowId: 'detailed', template: 'Detailed run' },
      ],
      cols: [
        { colId: '100items', template: '100 results' },
        {
          colId: 'fullRun',
          template: 'Full run (~ <%~ it.fn.millify(it.dataset.size) %> results)',
        },
      ],
    },
    other: {
      rows: [{ rowId: 'default', template: 'Run' }],
      cols: [
        {
          colId: 'fullRun',
          template: 'Full run (~ <%~ it.fn.millify(it.dataset.size) %> results)',
        },
      ],
    },
  },
  exampleInputs: [
    {
      title: 'Get first 100 items in fast mode',
      inputData: {
        datasetType: 'items',
        outputMaxEntries: 100,
      },
    },
  ],
  hooks: {
    introAfterBegin: '[Example.com](https://example.com) is a test website.',
    useCases: 'Use case 1: Testing.\nUse case 2: More testing.',
  },
};

describe('renderApifyReadme', () => {
  it('renders a README string with expected sections', async () => {
    const content = await renderApifyReadme({
      actorSpec,
      input: { templates },
    });

    expect(typeof content).toBe('string');

    // Actor title and description
    expect(content).toContain('Test Scraper');
    expect(content).toContain('A test scraper for unit testing');

    // Intro hook
    expect(content).toContain('[Example.com](https://example.com) is a test website.');

    // Dataset links
    expect(content).toContain('Item listings');
    expect(content).toContain('List of categories');

    // Features section
    expect(content).toContain('kinds of datasets');
    expect(content).toContain('Fast or Detailed modes');
    expect(content).toContain('Filter support');
    expect(content).toContain('Blazing fast');
    expect(content).toContain('Proxy support');
    expect(content).toContain('Privacy-compliant');
    expect(content).toContain('Error monitoring');
    expect(content).toContain('Pass scraped dataset to other actors');

    // Use cases hook
    expect(content).toContain('Use case 1: Testing.');

    // Perf table
    expect(content).toContain('Fast run');
    expect(content).toContain('Detailed run');
    expect(content).toContain('100 results');

    // Input section
    expect(content).toContain('outputMaxEntries');

    // Filter section
    expect(content).toContain('Category');
    expect(content).toContain('Price range');

    // Example input
    expect(content).toContain('Get first 100 items in fast mode');

    // Output section
    expect(content).toContain('Widget A');
    expect(content).toContain('19.99');

    // Personal data / privacy section
    expect(content).toContain('personal data');
    expect(content).toContain('contactEmail');
    expect(content).toContain('Include personal data');

    // Contact section
    expect(content).toContain('test[at]example[dot]com');
    expect(content).toContain('Discord');

    // Legality section
    expect(content).toContain('legal to scrape');
  });
});

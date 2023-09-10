import {
  BasicCrawler,
  type BasicCrawlingContext,
  CheerioCrawler,
  type CheerioCrawlingContext,
  HttpCrawler,
  type HttpCrawlingContext,
  JSDOMCrawler,
  type JSDOMCrawlingContext,
  PlaywrightCrawler,
  type PlaywrightCrawlingContext,
  PuppeteerCrawler,
  type PuppeteerCrawlingContext,
} from 'crawlee';

import type { CrawlerType } from './types';

export const actorClassByType = {
  basic: BasicCrawler,
  http: HttpCrawler,
  cheerio: CheerioCrawler,
  jsdom: JSDOMCrawler,
  playwright: PlaywrightCrawler,
  puppeteer: PuppeteerCrawler,
} as const satisfies Record<CrawlerType, { new (options: Record<string, any>): any }>;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
type CrawlingContextName = keyof {
  BasicCrawlingContext: BasicCrawlingContext;
  HttpCrawlingContext: HttpCrawlingContext;
  CheerioCrawlingContext: CheerioCrawlingContext;
  JSDOMCrawlingContext: JSDOMCrawlingContext;
  PlaywrightCrawlingContext: PlaywrightCrawlingContext;
  PuppeteerCrawlingContext: PuppeteerCrawlingContext;
};

export const crawlingContextNameByType = {
  basic: 'BasicCrawlingContext',
  http: 'HttpCrawlingContext',
  cheerio: 'CheerioCrawlingContext',
  jsdom: 'JSDOMCrawlingContext',
  playwright: 'PlaywrightCrawlingContext',
  puppeteer: 'PuppeteerCrawlingContext',
} satisfies Record<CrawlerType, CrawlingContextName>;

import type {
  BasicCrawler,
  CrawlingContext,
  BasicCrawlerOptions,
  BasicCrawlingContext,
  HttpCrawler,
  HttpCrawlingContext,
  HttpCrawlerOptions,
  InternalHttpCrawlingContext,
  JSDOMCrawler,
  JSDOMCrawlingContext,
  JSDOMCrawlerOptions,
  CheerioCrawler,
  CheerioCrawlingContext,
  CheerioCrawlerOptions,
  PlaywrightCrawler,
  PlaywrightCrawlingContext,
  PlaywrightCrawlerOptions,
  PuppeteerCrawler,
  PuppeteerCrawlerOptions,
  PuppeteerCrawlingContext,
} from 'crawlee';

/** Available Crawlee crawler types. */
export type CrawlerType = 'basic' | 'http' | 'jsdom' | 'cheerio' | 'playwright' | 'puppeteer';

/**
 * Type utility that retrieves types related to specific Crawlee crawlers.
 *
 * E.g. `CrawleeMeta<'jsdom'>` will return types for JSDOM crawler:
 *
 * ```ts
 * {
 *   crawler: JSDOMCrawler,
 *   context: JSDOMCrawlingContext<TData>,
 *   options: JSDOMCrawlerOptions<TData>
 * }
 * ```
 *
 * Which can then be used like so:
 * ```ts
 * type MyType = CrawleeMeta<'jsdom'>['context'];
 * ```
 * */
export type CrawlerMeta<
  T extends CrawlerType,
  Ctx extends CrawlingContext = CrawlingContext,
  TData extends Record<string, any> = Record<string, any>
> = T extends 'http'
  ? Ctx extends InternalHttpCrawlingContext
    ? { crawler: HttpCrawler<Ctx>, context: HttpCrawlingContext<TData>, options: HttpCrawlerOptions<Ctx> } // prettier-ignore
    : never
  : T extends 'jsdom'
  ? { crawler: JSDOMCrawler, context: JSDOMCrawlingContext<TData>, options: JSDOMCrawlerOptions<TData> } // prettier-ignore
  : T extends 'cheerio'
  ? { crawler: CheerioCrawler, context: CheerioCrawlingContext<TData>, options: CheerioCrawlerOptions<TData> } // prettier-ignore
  : T extends 'playwright'
  ? { crawler: PlaywrightCrawler, context: PlaywrightCrawlingContext<TData>, options: PlaywrightCrawlerOptions } // prettier-ignore
  : T extends 'puppeteer'
  ? { crawler: PuppeteerCrawler, context: PuppeteerCrawlingContext<TData>, options: PuppeteerCrawlerOptions } // prettier-ignore
  : T extends 'basic'
  ? Ctx extends CrawlingContext
    ? { crawler: BasicCrawler<Ctx>, context: BasicCrawlingContext<TData>, options: BasicCrawlerOptions<Ctx> } // prettier-ignore
    : never
  : never;

type OrigRunCrawler<T extends CrawlingContext<any, any>> = BasicCrawler<T>['run'];

/** URL string or object passed to Crawler.run */
export type CrawlerUrl = NonNullable<Parameters<OrigRunCrawler<any>>[0]>[0];

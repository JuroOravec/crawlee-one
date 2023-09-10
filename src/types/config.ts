import type { CrawlerType } from '.';

export interface CrawleeOneConfig {
  /** Version of the CrawleeOne config. */
  version: 1;
  /** Schema defining the crawlers in this project. This schema is used for code generation. */
  schema: CrawleeOneConfigSchema;
}

/** Schema defining the crawlers in a project. This schema is used for code generation. */
export interface CrawleeOneConfigSchema {
  /** Object holding crawler configurations. Each crawler is idefntified by its key.
   *
   * E.g.
   *
   * ```js
   * {
   *   myCrawler: {
   *     type: 'cheerio',
   *     routes: [...],
   *   }
   * }
   * ```
   */
  crawlers: Record<string, CrawleeOneConfigSchemaCrawler>;
}

/** Part of the schema that defines a single crawler. */
export interface CrawleeOneConfigSchemaCrawler {
  /**
   * Crawler type - Each type is linked to a different Crawlee crawler class.
   * Different classes may use different technologies / stack for scraping.
   *
   * E.g. type `cheerio` will use `CheerioCrawler` class.
   */
  type: CrawlerType;
  routes: string[];
}

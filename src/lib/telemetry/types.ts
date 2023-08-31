import type { BasicCrawler, CrawlingContext } from 'crawlee';

import type { MaybePromise, PickPartial } from '../../utils/types';
import type {
  CrawleeOneErrorHandlerOptions,
  ExtractErrorHandlerOptionsReport,
} from '../integrations/types';
import type { CrawlerType } from '../../types';
import type { CrawleeOneActorDef } from '../actor/types';

/**
 * Interface for storing and retrieving:
 * - Scraped data
 * - Requests (URLs) to scrape
 * - Cache data
 *
 * This interface is based on Crawlee/Apify, but defined separately to allow
 * drop-in replacement with other integrations.
 */
export interface CrawleeOneTelemetry<
  TActorDef extends CrawleeOneActorDef<any, any, any, any, any> = CrawleeOneActorDef,
  THandlerOptions extends CrawleeOneErrorHandlerOptions<any> = CrawleeOneErrorHandlerOptions,
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>
> {
  setup: (context: {
    /** String idetifying the actor class, e.g. `'cheerio'` */
    actorType: CrawlerType;
    actorName: string;
    /** Config passed to the {@link createCrawleeOne} */
    actorConfig: PickPartial<TActorDef, 'router' | 'createCrawler' | 'io'>;
  }) => MaybePromise<void>;
  onSendErrorToTelemetry: (
    error: Error,
    context: {
      report: ExtractErrorHandlerOptionsReport<THandlerOptions>;
      options: THandlerOptions;
      ctx: Ctx;
    }
  ) => MaybePromise<void>;
}

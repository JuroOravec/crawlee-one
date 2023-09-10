import type { MaybePromise } from '../../utils/types';
import type {
  CrawleeOneErrorHandlerOptions,
  ExtractErrorHandlerOptionsReport,
} from '../integrations/types';
import type { CrawleeOneActorInst, CrawleeOneCtx } from '../actor/types';

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
  T extends CrawleeOneCtx,
  THandlerOptions extends CrawleeOneErrorHandlerOptions<any> = CrawleeOneErrorHandlerOptions
> {
  setup: (actor: CrawleeOneActorInst<T>) => MaybePromise<void>;
  onSendErrorToTelemetry: (
    error: Error,
    report: ExtractErrorHandlerOptionsReport<THandlerOptions>,
    options: Omit<THandlerOptions, 'onErrorCapture'>,
    ctx: T['context']
  ) => MaybePromise<void>;
}

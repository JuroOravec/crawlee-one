import type { MaybePromise } from '../../utils/types.js';
import type {
  CrawleeOneErrorHandlerOptions,
  ExtractErrorHandlerOptionsReport,
} from '../integrations/types.js';
import type { CrawleeOneActorInst, CrawleeOneCtx } from '../actor/types.js';

/**
 * Interface for sending error reports to a telemetry service:
 * - Error reports
 *
 * This interface is based on Sentry, but defined separately to allow
 * drop-in replacement with other telemetry services.
 */
export interface CrawleeOneTelemetry<
  T extends CrawleeOneCtx,
  THandlerOptions extends CrawleeOneErrorHandlerOptions<any> = CrawleeOneErrorHandlerOptions,
> {
  setup: (actor: CrawleeOneActorInst<T>) => MaybePromise<void>;
  onSendErrorToTelemetry: (
    error: Error,
    report: ExtractErrorHandlerOptionsReport<THandlerOptions>,
    options: Omit<THandlerOptions, 'onErrorCapture'>,
    ctx: T['context']
  ) => MaybePromise<void>;
}

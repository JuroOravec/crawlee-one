import type { MaybePromise } from '../../utils/types.js';
import type { CrawleeOneContext, CrawleeOneTypes } from '../context/types.js';
import type {
  CrawleeOneErrorHandlerOptions,
  ExtractErrorHandlerOptionsReport,
} from '../integrations/types.js';

/**
 * Interface for sending error reports to a telemetry service:
 * - Error reports
 *
 * This interface is based on Sentry, but defined separately to allow
 * drop-in replacement with other telemetry services.
 */
export interface CrawleeOneTelemetry<
  T extends CrawleeOneTypes,
  THandlerOptions extends CrawleeOneErrorHandlerOptions<any> = CrawleeOneErrorHandlerOptions,
> {
  setup: (context: CrawleeOneContext<T>) => MaybePromise<void>;
  onSendErrorToTelemetry: (
    error: Error,
    report: ExtractErrorHandlerOptionsReport<THandlerOptions>,
    options: Omit<THandlerOptions, 'onErrorCapture'>,
    ctx: T['context']
  ) => MaybePromise<void>;
}

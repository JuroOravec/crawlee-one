import { runCrawleeOne } from './lib/actor/actor';
import type {
  CrawleeOneActorInst,
  CrawleeOneActorDef,
  CrawleeOneActorRouterCtx,
  CrawleeOneCtx,
} from './lib/actor/types';
import type { AllActorInputs } from './lib/input';
import { logLevelHandlerWrapper } from './lib/log';
import type { CrawleeOneRouteHandler, CrawleeOneRoute } from './lib/router/types';
import type { CrawlerMeta, CrawlerType } from './types';
import type { MaybePromise } from './utils/types';

/** Args object passed to `crawleeOne` */
export interface CrawleeOneArgs<
  TType extends CrawlerType,
  T extends CrawleeOneCtx<CrawlerMeta<TType>['context']>
> {
  /** Type specifying the Crawlee crawler class, input options, and more. */
  type: CrawlerType;
  /** Unique name of the crawler instance. The name may be used in codegen and logging. */
  name?: string;

  /** Crawlee crawler configuration that CANNOT be overriden via `input` and `crawlerConfigDefaults` */
  crawlerConfig?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
  /** Crawlee crawler configuration that CAN be overriden via `input` and `crawlerConfig`  */
  crawlerConfigDefaults?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;

  /**
   * If `mergeInput` is truthy, will merge input settings from `inputDefaults`, `input`,
   * and `io.getInput()`.
   * 
   * ```js
   * { ...inputDefaults, ...io.getInput(), ...input }
   * ```
   * 
   * If `mergeInput` is falsy, `io.getInput()` is ignored if `input` is provided. So the input is either:
   * 
   * ```js
   * { ...inputDefaults, ...io.getInput() } // If `input` is not defined
   * ```
   * 
   * OR
   * 
   * ```js
   * { ...inputDefaults, ...input } // If `input` is defined
   * ```
   * 
   * Alternatively, you can supply your own function that merges the sources:
   * 
   * ```js
   * {
   *   // `mergeInput` can be also async
   *   mergeInput: ({ defaults, overrides, env }) => {
   *     // This is same as `mergeInput: true`
   *     return { ...defaults, ...env, ...overrides };
   *   },
   * }
   * ```
   */
  mergeInput?: boolean | ((sources: {
    defaults: Partial<AllActorInputs>;
    overrides: Partial<AllActorInputs>;
    env: Partial<AllActorInputs>;
  }) => MaybePromise<Partial<AllActorInputs>>);
  /** Input configuration that CANNOT be overriden via `inputDefaults` and `io.getInput()` */
  input?: Partial<AllActorInputs>;
  /** Input configuration that CAN be overriden via `input` and `io.getInput()` */
  inputDefaults?: Partial<AllActorInputs>;

  // /////// Override services /////////
  /**
   * Configure the Crawlee proxy.
   *
   * See {@link ProxyConfiguration}
   */
  proxy?: CrawleeOneActorDef<T>['proxy'];
  /**
   * Provide a telemetry instance that is used for tracking errors.
   *
   * See {@link CrawleeOneTelemetry}
   */
  telemetry?: CrawleeOneActorDef<T>['telemetry'];
  /**
   * Provide an instance that is responsible for state management:
   * - Adding scraped data to datasets
   * - Adding and removing requests to/from queues
   * - Cache storage
   * 
   * This is an API based on Apify's `Actor` utility class, which is also
   * the default.
   * 
   * You don't need to override this in most of the cases.
   * 
   * By default, the data is saved and kept locally in
   * `./storage` directory. And if the cralwer runs in Apify's platform
   * then it will use Apify's cloud for storage.
   *
   * See {@link CrawleeOneIO}
   */
  io?: CrawleeOneActorDef<T>['io'];
  /**
   * Provide a custom router instance.
   * 
   * By default, router is created as:
   * ```ts
   * import { Router } from 'crawlee';
   * Router.create(),
   * ```
   *
   * See {@link Router}
   */
  router?: CrawleeOneActorDef<T>['router'];

  hooks?: {
    onReady?: (actor: CrawleeOneActorInst<T>) => MaybePromise<void>;
    validateInput?: (input: AllActorInputs | null) => MaybePromise<void>;
    onBeforeHandler?: CrawleeOneRouteHandler<T, CrawleeOneActorRouterCtx<T>>;
    onAfterHandler?: CrawleeOneRouteHandler<T, CrawleeOneActorRouterCtx<T>>;
  };
  routes: Record<T['labels'], CrawleeOneRoute<T, CrawleeOneActorRouterCtx<T>>>;
} // prettier-ignore

export const crawleeOne = <
  TType extends CrawlerType,
  T extends CrawleeOneCtx<CrawlerMeta<TType>['context']> = CrawleeOneCtx<
    CrawlerMeta<TType>['context']
  >
>(
  args: CrawleeOneArgs<TType, T>
) => {
  const hookHandlerWrapper = (handler: CrawleeOneRouteHandler<T, CrawleeOneActorRouterCtx<T>>) => {
    const innerHandler = async (ctx: any) => {
      await args.hooks?.onBeforeHandler?.(ctx as any);
      await handler(ctx);
      await args.hooks?.onAfterHandler?.(ctx as any);
    };
    return innerHandler;
  };

  return runCrawleeOne<TType, T>({
    actorName: args.name,
    actorType: args.type as TType,
    crawlerConfigDefaults: args.crawlerConfigDefaults,
    crawlerConfigOverrides: args.crawlerConfig,
    actorConfig: {
      telemetry: args.telemetry,
      router: args.router,
      proxy: args.proxy,
      io: args.io,

      input: args.input,
      inputDefaults: args.inputDefaults,
      mergeInput: args.mergeInput,
      validateInput: args.hooks?.validateInput,

      routes: args.routes,
      routeHandlerWrappers: ({ input }) => [
        logLevelHandlerWrapper(input?.logLevel ?? 'info'),
        hookHandlerWrapper as any,
      ],
    },
    onReady: async (actor) => {
      const onReady = args.hooks?.onReady ?? ((actor) => actor.runCrawler());
      await onReady(actor);
    },
  });
};

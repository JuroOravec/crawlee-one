import type { ExitOptions } from 'apify';
import type {
  Request as CrawleeRequest,
  CrawlingContext,
  DatasetDataOptions,
  Log,
  ProxyConfiguration,
  RequestOptions,
} from 'crawlee';
import type { Page } from 'playwright';

import type { MaybeArray, MaybePromise, PickRequired } from '../../utils/types.js';

/**
 * Interface for storing and retrieving:
 * - Scraped data
 * - Requests (URLs) to scrape
 * - Cache data
 *
 * This interface is based on Crawlee/Apify, but defined separately to allow
 * drop-in replacement with other integrations.
 */
export interface CrawleeOneIO<
  TEnv extends object = object,
  TReport extends object = object,
  TMetadata extends object = object,
> {
  /**
   * Opens a dataset and returns a promise resolving to an instance of the {@link CrawleeOneDataset}.
   *
   * Datasets are used to store structured data where each object stored has the same attributes,
   * such as online store products or real estate offers. The actual data is stored either on
   * the local filesystem or in the cloud.
   */
  openDataset: (id?: string | null) => MaybePromise<CrawleeOneDataset>;
  /**
   * Opens a request queue and returns a promise resolving to an instance of the {@link CrawleeOneRequestQueue}.
   *
   * RequestQueue represents a queue of URLs to crawl, which is stored either on local filesystem
   * or in the cloud. The queue is used for deep crawling of websites, where you start with several
   * URLs and then recursively follow links to other pages. The data structure supports both
   * breadth-first and depth-first crawling orders.
   */
  openRequestQueue: (id?: string | null) => MaybePromise<CrawleeOneRequestQueue>;
  /**
   * Opens a key-value store and returns a promise resolving to an instance of the {@link CrawleeOneKeyValueStore}.
   *
   * Key-value stores are used to store records or files, along with their MIME content type.
   * The records are stored and retrieved using a unique key. The actual data is stored
   * either on a local filesystem or in the cloud.
   */
  openKeyValueStore: (id?: string | null) => MaybePromise<CrawleeOneKeyValueStore>;
  /**
   * Returns a promise of an object with the crawler input. E.g. In Apify, retrieves the actor input value from
   * the default {@link KeyValueStore} associated with the current actor run.
   */
  getInput: <Input extends object>() => Promise<Input | null>;
  /**
   * Equivalent of {@link Actor.metamorph}.
   *
   * This function should:
   * 1. Start a crawler/actor by its ID,
   * 2. Pass the given input into downsteam crawler.
   * 3. Make the same storage available to the downstream crawler. AKA, the downstream crawler
   *    should use the same "default" storage as is the current "default" storage.
   *
   * Read more about  {@link Actor.metamorph}:
   *
   * `Actor.metamorph` transforms this actor run to an actor run of a given actor. The system
   * stops the current container and starts the new container instead. All the default storages
   * are preserved and the new input is stored under the INPUT-METAMORPH-1 key in the same
   * default key-value store.
   */
  triggerDownstreamCrawler: <TInput extends object>(
    /** ID of the crawler/actor to which should be triggered. */
    targetActorId: string,
    /** Input for the crawler/actor. Must be JSON-serializable (it will be stringified to JSON). */
    input?: TInput,
    options?: {
      /**
       * Tag or number of the target build to metamorph into (e.g. `beta` or `1.2.345`).
       * If not provided, the run uses build tag or number from the default actor run configuration (typically `latest`).
       */
      build?: string;
    }
  ) => Promise<void>;
  /**
   * Equivalent of {@link Actor.main}.
   *
   * Runs the main user function that performs the job of the actor
   * and terminates the process when the user function finishes.
   *
   * **The `Actor.main()` function is optional** and is provided merely for your convenience.
   * It is mainly useful when you're running your code as an actor on the [Apify platform](https://apify.com/actors).
   * However, if you want to use Apify SDK tools directly inside your existing projects, e.g.
   * running in an [Express](https://expressjs.com/) server, on
   * [Google Cloud functions](https://cloud.google.com/functions)
   * or [AWS Lambda](https://aws.amazon.com/lambda/), it's better to avoid
   * it since the function terminates the main process when it finishes!
   *
   * The `Actor.main()` function performs the following actions:
   *
   * - When running on the Apify platform (i.e. `APIFY_IS_AT_HOME` environment variable is set),
   *   it sets up a connection to listen for platform events.
   *   For example, to get a notification about an imminent migration to another server.
   *   See {@link Actor.events} for details.
   * - It checks that either `APIFY_TOKEN` or `APIFY_LOCAL_STORAGE_DIR` environment variable
   *   is defined. If not, the functions sets `APIFY_LOCAL_STORAGE_DIR` to `./apify_storage`
   *   inside the current working directory. This is to simplify running code examples.
   * - It invokes the user function passed as the `userFunc` parameter.
   * - If the user function returned a promise, waits for it to resolve.
   * - If the user function throws an exception or some other error is encountered,
   *   prints error details to console so that they are stored to the log.
   * - Exits the Node.js process, with zero exit code on success and non-zero on errors.
   */
  runInContext: (userFunc: () => MaybePromise<unknown>, options?: ExitOptions) => Promise<void>;
  /**
   * Creates a proxy configuration and returns a promise resolving to an instance of
   * {@link ProxyConfiguration} that is already initialized.
   *
   * Configures connection to a proxy server with the provided options. Proxy servers are used
   * to prevent target websites from blocking your crawlers based on IP address rate limits or
   * blacklists. Setting proxy configuration in your crawlers automatically configures them to
   * use the selected proxies for all connections.
   *
   * For more details and code examples, see {@link ProxyConfiguration}.
   */
  createDefaultProxyConfiguration: <T extends object>(
    input: T | Readonly<T> | undefined
  ) => MaybePromise<ProxyConfiguration | undefined>;
  isTelemetryEnabled: () => MaybePromise<boolean>;
  /** Generate object with info on current context, which will be send to the error Dataset */
  generateErrorReport: (
    input: CrawleeOneErrorHandlerInput,
    options: PickRequired<CrawleeOneErrorHandlerOptions<CrawleeOneIO<TEnv, TReport>>, 'io'>
  ) => MaybePromise<TReport>;
  /** Generate object with info on current context, which will be appended to the scraped entry */
  generateEntryMetadata: <Ctx extends CrawlingContext>(ctx: Ctx) => MaybePromise<TMetadata>;
}

/**
 * Interface for storing and retrieving data in/from Dataset
 *
 * This interface is based on Crawlee/Apify, but defined separately to allow
 * drop-in replacement with other integrations.
 */
export interface CrawleeOneDataset<T extends object = object> {
  /**
   * Stores an object or an array of objects to the dataset. The function returns a promise
   * that resolves when the operation finishes. It has no result, but throws on invalid args
   * or other errors.
   */
  pushData: (
    /**
     * Object or array of objects containing data to be stored in the default dataset.
     * The objects must be serializable to JSON and the JSON representation of each object
     * must be smaller than 9MB.
     */
    data: MaybeArray<T>
  ) => MaybePromise<void>;
  /** Returns the items in the dataset based on the provided parameters. */
  getItems: (
    options?: Pick<DatasetDataOptions, 'offset' | 'limit' | 'desc' | 'fields'>
  ) => MaybePromise<T[]>;
  /** Returns the count of items in the dataset. */
  getItemCount: () => MaybePromise<number | null>;
}

/**
 * Interface for storing and retrieving data in/from KeyValueStore.
 *
 * KeyValueStore is a cache / map structure, where entries are retrieved and saved
 * under keys.
 *
 * This interface is based on Crawlee/Apify, but defined separately to allow
 * drop-in replacement with other integrations.
 */
export interface CrawleeOneKeyValueStore {
  /**
   * Gets a value from the key-value store.
   *
   * The function returns a `Promise` that resolves to the record value.
   *
   * If the record does not exist, the function resolves to `null`.
   *
   * To save or delete a value in the key-value store, use the
   * {@link CrawleeOneKeyValueStore.setValue} function.
   *
   * @param key
   *   Unique key of the record. It can be at most 256 characters long and only consist
   *   of the following characters: `a`-`z`, `A`-`Z`, `0`-`9` and `!-_.'()`
   * @returns
   *   Returns a promise that resolves to the value, or the default value if the key is missing from the store.
   */
  getValue<T = unknown>(key: string, defaultValue: T): Promise<T>;
  /**
   * Saves or deletes a record in the key-value store. The function returns a promise that
   * resolves once the record has been saved or deleted.
   *
   * If value is null, the record is deleted instead. Note that the setValue() function
   * succeeds regardless whether the record existed or not.
   *
   * Beware that the key can be at most 256 characters long and only contain the following
   * characters: a-zA-Z0-9!-_.'()
   *
   * To retrieve a value from the key-value store, use the {@link CrawleeOneKeyValueStore.getValue}
   * function.
   */
  setValue: (
    key: string,
    value: any,
    options?: {
      /** Specifies a custom MIME content type of the record. */
      contentType?: string;
    }
  ) => MaybePromise<void>;
  /**
   * Removes the key-value store either from the cloud storage or from the local directory,
   * depending on the mode of operation.
   */
  drop: () => MaybePromise<void>;
  /** Removes all entries from the store. */
  clear: () => MaybePromise<void>;
}

/**
 * Interface for storing and retrieving Requests (URLs) to scrape
 *
 * This interface is based on Crawlee/Apify, but defined separately to allow
 * drop-in replacement with other integrations.
 */
export interface CrawleeOneRequestQueue {
  /**
   * Adds requests to the queue.
   *
   * If a request that is passed in is already present due to its uniqueKey property
   * being the same, it will not be updated.
   */
  addRequests: (
    /** Objects with request data. */
    requestsLike: (CrawleeRequest | RequestOptions)[],
    options?: {
      /**
       * If set to true, the request will be added to the foremost position in the queue,
       * so that it's returned in the next call to {@link CrawleeOneRequestQueue.fetchNextRequest}.
       *
       * By default, it's put to the end of the queue.
       */
      forefront?: boolean;
    }
  ) => MaybePromise<unknown>;
  /**
   * Marks a request that was previously returned by the
   * {@link CrawleeOneRequestQueue.fetchNextRequest} function as handled after successful
   * processing. Handled requests will never again be returned by the fetchNextRequest function.
   */
  markRequestHandled: (req: CrawleeRequest) => MaybePromise<unknown>;
  /**
   * Returns a next request in the queue to be processed, or null if there are no more
   * pending requests.
   *
   * Once you successfully finish processing of the request, you need to call
   * {@link CrawleeOneRequestQueue.markRequestHandled} to mark the request as handled
   * in the queue. If there was some error in processing the request, call
   * {@link CrawleeOneRequestQueue.reclaimRequest} instead, so that the queue will
   * give the request to some other consumer in another call to the fetchNextRequest function.
   *
   * Note that the null return value doesn't mean the queue processing finished,
   * it means there are currently no pending requests. To check whether all requests in queue
   * were finished, use {@link CrawleeOneRequestQueue.isFinished} instead.
   *
   * @returns — Returns the request object or null if there are no more pending requests.
   */
  fetchNextRequest: () => MaybePromise<CrawleeRequest | null>;
  /**
   * Reclaims a failed request back to the queue, so that it can be returned
   * for processing later again by another call to {@link CrawleeOneRequestQueue.fetchNextRequest}.
   */
  reclaimRequest: (
    req: CrawleeRequest,
    options?: {
      /**
       * If set to true, the request will be placed to the beginning of the queue,
       * so that it's returned in the next call to {@link CrawleeOneRequestQueue.fetchNextRequest}.
       *
       * By default, it's put to the end of the queue.
       */
      forefront?: boolean;
    }
  ) => MaybePromise<unknown>;
  /**
   * Resolves to true if all requests were already handled and there are no more left. Due to the nature
   * of distributed storage used by the queue, the function might occasionally return a false negative.
   */
  isFinished: () => MaybePromise<boolean>;
  /** Removes the queue from the storage. */
  drop: () => MaybePromise<void>;
  /** Removes all entries from the queue. */
  clear: () => MaybePromise<void>;
  /** Returns the number of handled requests. */
  handledCount: () => MaybePromise<number | null>;
}

/** Input passed to the error handler */
export interface CrawleeOneErrorHandlerInput {
  error: Error;
  /** Page instance if we used PlaywrightCrawler */
  page: Page | null;
  /** URL where the error happened. If not given URL is taken from the Page object */
  url: string | null;
  log: Log | null;
}

/** User-configurable options passed to the error handler */
export interface CrawleeOneErrorHandlerOptions<TIO extends CrawleeOneIO = CrawleeOneIO> {
  io?: TIO;
  allowScreenshot?: boolean;
  reportingDatasetId?: string;
  onErrorCapture?: (input: { error: Error; report: ExtractIOReport<TIO> }) => MaybePromise<void>;
}

export type ExtractErrorHandlerOptionsReport<T extends CrawleeOneErrorHandlerOptions<any>> =
  T extends CrawleeOneErrorHandlerOptions<infer U> ? ExtractIOReport<U> : never;

export type ExtractIOReport<T extends CrawleeOneIO<object, object>> =
  T extends CrawleeOneIO<object, infer U> ? U : never;

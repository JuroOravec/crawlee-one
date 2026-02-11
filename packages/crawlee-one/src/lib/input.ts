import type { Actor } from 'apify';
import type { CheerioCrawlerOptions } from 'crawlee';
import {
  createBooleanField,
  createIntegerField,
  createObjectField,
  createStringField,
  createArrayField,
  Field,
} from 'apify-actor-config';
import { z } from 'zod';

import type { CrawlerUrl } from '../types/index.js';
import { LOG_LEVEL, type LogLevel } from './log.js';
import type { CrawleeOneHookFn } from './actor/types.js';

export type ActorInput = InputActorInput &
  CrawlerConfigActorInput &
  PerfActorInput &
  StartUrlsActorInput &
  LoggingActorInput &
  ProxyActorInput &
  PrivacyActorInput &
  RequestActorInput &
  OutputActorInput &
  MetamorphActorInput;

/** Crawler config fields that can be overriden from the actor input */
export type CrawlerConfigActorInput = Pick<
  CheerioCrawlerOptions,
  | 'navigationTimeoutSecs'
  | 'ignoreSslErrors'
  | 'additionalMimeTypes'
  | 'suggestResponseEncoding'
  | 'forceResponseEncoding'
  | 'requestHandlerTimeoutSecs'
  | 'maxRequestRetries'
  | 'maxRequestsPerCrawl'
  | 'maxRequestsPerMinute'
  | 'maxCrawlDepth'
  | 'minConcurrency'
  | 'maxConcurrency'
  | 'keepAlive'
>;

/** Common input fields related to extending Actor input with remote or generated data */
export interface InputActorInput {
  /**
   * If set, the Actor input is extended with a config from this URL.
   *
   * For example, you can store your actor input in a source control, and import it here.
   *
   * In case of a conflict (if a field is defined both in Actor input and in imported input)
   * the Actor input overwrites the imported fields.
   *
   * The URL must point to a JSON file containing a single object (the config).
   */
  inputExtendUrl?: string;
  /**
   * If set, the Actor input is extended with a config from this custom function.
   *
   * For example, you can store your actor input in a source control, and import it here.
   *
   * In case of a conflict (if a field is defined both in Actor input and in imported input)
   * the Actor input overwrites the imported fields.
   *
   * The URL must point to a JSON file containing a single object (the config).
   */
  inputExtendFromFunction?: string | CrawleeOneHookFn<[], ActorInput>;
}

/** Common input fields related to performance which are not part of the CrawlerConfig */
export interface PerfActorInput {
  /**
   * If set, multiple Requests will be handled by a single Actor instance.
   *
   * See official docs: https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs
   *
   * Example: If set to 20, then up to 20 requests will be handled in a single "go".
   */
  batchSize?: number;
  /**
   * How long to wait between entries within a single batch.
   *
   * Increase this value if you're using batching and you're sending requests to the scraped website too fast.
   *
   * Example: If set to 1, then after each entry in a batch, wait 1 second before continuing.
   */
  batchWaitSecs?: number;
}

/** Common input fields for defining URLs to scrape */
export interface StartUrlsActorInput {
  /** URLs to start with, defined manually as a list of strings or crawler requests */
  startUrls?: CrawlerUrl[];
  /**
   * Import starting URLs from an existing Dataset.
   *
   * String is in the format `datasetID#field` (e.g. `datasetid123#url`).
   */
  startUrlsFromDataset?: string;
  /**
   * Import or generate starting URLs using a custom function.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * ```js
   * // Example: Create and load URLs from a Dataset by combining multiple fields
   * async ({ io, input, state, itemCacheKey }) => {
   *   const dataset = await io.openDataset(datasetNameOrId);
   *   const data = await dataset.getData();
   *   const urls = data.items.map((item) => `https://example.com/u/${item.userId}/list/${item.listId}`);
   *   return urls;
   * }
   * ```
   */
  startUrlsFromFunction?: string | CrawleeOneHookFn<[], CrawlerUrl[]>;
}

/** Common input fields related to logging setup */
export interface LoggingActorInput {
  logLevel?: LogLevel;
  /**
   * Whether to report actor errors to telemetry such as <a href="https://sentry.io/">Sentry</a>.
   *
   * This info is used by the author of this actor to identify broken integrations,
   * and track down and fix issues.
   */
  errorTelemetry?: boolean;
  /**
   * Dataset ID to which errors should be captured.
   *
   * Default: `'REPORTING'`.
   */
  errorReportingDatasetId?: string;
}

/** Common input fields related to proxy setup */
export interface ProxyActorInput {
  proxy?: Parameters<Actor['createProxyConfiguration']>[0];
}

/** Common input fields related to actor requests */
export interface RequestActorInput {
  /**
   * If set, only at most this many requests will be scraped.
   *
   * The count is determined from the RequestQueue that's used for the Actor run.
   *
   * This means that if `requestMaxEntries` is set to 50, but the
   * associated RequestQueue already handled 40 requests, then only 10 new requests
   * will be handled.
   */
  requestMaxEntries?: number;

  /**
   * Option to freely transform a request using a custom function before pushing it to the RequestQueue.
   *
   * If not set, the request will remain as is.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the second argument.
   *
   * `async (entry, { io, input, state, itemCacheKey }) => { ... }`
   */
  requestTransform?:
    | string
    | CrawleeOneHookFn<[Exclude<CrawlerUrl, string>], Exclude<CrawlerUrl, string>>;
  /**
   * Use this if you need to run one-time initialization code before `requestTransform`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => { ... }`
   */
  requestTransformBefore?: string | CrawleeOneHookFn;
  /**
   * Use this if you need to run one-time teardown code after `requestTransform`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => { ... }`
   */
  requestTransformAfter?: string | CrawleeOneHookFn;

  /**
   * Option to filter a request using a custom function before pushing it to the RequestQueue.
   *
   * If not set, all requests will be included.
   *
   * This is done after `requestTransform`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the second argument.
   *
   * `async (entry, { io, input, state, itemCacheKey }) => boolean`
   */
  requestFilter?: string | CrawleeOneHookFn<[Exclude<CrawlerUrl, string>], unknown>;
  /**
   * Use this if you need to run one-time initialization code before `requestFilter`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => boolean`
   */
  requestFilterBefore?: string | CrawleeOneHookFn;
  /**
   * Use this if you need to run one-time initialization code after `requestFilter`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => boolean`
   */
  requestFilterAfter?: string | CrawleeOneHookFn;

  /** ID of the RequestQueue to which the requests should be pushed */
  requestQueueId?: string;
}

/** Common input fields related to actor output */
export interface OutputActorInput {
  /**
   * If set, only at most this many entries will be scraped.
   *
   * The count is determined from the Dataset that's used for the Actor run.
   *
   * This means that if `outputMaxEntries` is set to 50, but the
   * associated Dataset already has 40 items in it, then only 10 new entries
   * will be saved.
   */
  outputMaxEntries?: number;
  /**
   * Option to select a subset of keys/fields of an entry that
   * will be pushed to the dataset.
   *
   * If not set, all fields on an entry will be pushed to the dataset.
   *
   * This is done after `outputRenameFields`.
   *
   * Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
   * resolved using Lodash.get().
   */
  outputPickFields?: string[];
  /**
   * Option to remap the keys before pushing the entries to the dataset.
   *
   * This is done before `outputRenameFields`.
   *
   * Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
   * resolved using Lodash.get().
   */
  outputRenameFields?: Record<string, string>;

  /**
   * Option to freely transform the output data object using a custom function before pushing it to the dataset.
   *
   * If not set, the data will remain as is.
   *
   * This is done after `outputPickFields` and `outputRenameFields`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the second argument.
   *
   * `async (entry, { io, input, state, itemCacheKey }) => { ... }`
   */
  outputTransform?: string | CrawleeOneHookFn<[item: any], any>;
  /**
   * Use this if you need to run one-time initialization code before `outputTransform`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => { ... }`
   */
  outputTransformBefore?: string | CrawleeOneHookFn;
  /**
   * Use this if you need to run one-time teardown code after `outputTransform`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => { ... }`
   */
  outputTransformAfter?: string | CrawleeOneHookFn;

  /**
   * Option to filter out the data using a custom function before pushing it to the dataset.
   *
   * If not set, all entries will be included.
   *
   * This is done after `outputPickFields`, `outputRenameFields`, and `outputTransform`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the second argument.
   *
   * `async (entry, { io, input, state, itemCacheKey }) => boolean`
   */
  outputFilter?: string | CrawleeOneHookFn<[item: any], any>;
  /**
   * Use this if you need to run one-time initialization code before `outputFilter`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => boolean`
   */
  outputFilterBefore?: string | CrawleeOneHookFn;
  /**
   * Use this if you need to run one-time initialization code after `outputFilter`.
   *
   * The function has access to Apify's Actor class (under variable `io`), and actor's input
   * and a shared state in the first argument.
   *
   * `async ({ io, input, state, itemCacheKey }) => boolean`
   */
  outputFilterAfter?: string | CrawleeOneHookFn;

  /** ID or name of the dataset to which the data should be pushed */
  outputDatasetId?: string;

  /** ID or name of the key-value store used as cache */
  outputCacheStoreId?: string;
  /** Define fields that will be used for cache key */
  outputCachePrimaryKeys?: string[];
  /** Define whether we want to add, remove, or overwrite cached entries with results from the actor run */
  outputCacheActionOnResult?: 'add' | 'remove' | 'overwrite' | null;
}

/** Common input fields related to actor metamorphing */
export interface MetamorphActorInput {
  /**
   * If you want to run another actor with the same dataset after
   * this actor has finished (AKA metamorph into another actor),
   * then set the ID of the target actor.
   *
   * See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph
   */
  metamorphActorId?: string;
  /**
   * Tag or number of the target actor build to metamorph into (e.g. `beta` or `1.2.345`).
   *
   * See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph
   */
  metamorphActorBuild?: string;
  /**
   * Input passed to the follow-up (metamorph) actor.
   *
   * See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph
   */
  metamorphActorInput?: object;
}

/** Common input fields related to privacy setup */
export interface PrivacyActorInput {
  includePersonalData?: boolean;
}

const datasetIdPattern = '^[a-zA-Z0-9][a-zA-Z0-9-]*$';
const datasetIdWithFieldPattern = `${datasetIdPattern.slice(0, -1)}#.+$`;

// Regex equivalents for Zod schemas
const datasetIdRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;
const datasetIdWithFieldRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*#.+$/;

const newLine = (n: number) => '<br/>'.repeat(n);

const createHookFnExample = (
  args: Record<string, string>,
  mainCode: string,
  includeGuides: boolean
) => {
  const formattedArgs = Object.keys(args).length ? Object.keys(args).join(', ') + ', ' : '';
  const formattedArgDesc = Object.entries(args).length
    ? Object.entries(args).map(([arg, desc]) => ` * \`${arg}\` - ${desc}.`)
    : ` *`;
  const formattedMainCode = mainCode
    .split('\n')
    .map((s) => '//   ' + s)
    .join('\n');

  const guides = `//
//   /* ========== SEE BELOW FOR MORE EXAMPLES ========= */
//
//   /**
//    * ======= ACCESSING DATASET ========
//    * To save/load/access entries in Dataset.
//    * Docs:
//    * - https://docs.apify.com/platform/storage/dataset
//    * - https://docs.apify.com/sdk/js/docs/guides/result-storage#dataset
//    * - https://docs.apify.com/sdk/js/docs/examples/map-and-reduce
//    */
//   // const dataset = await io.openDataset('MyDatasetId');
//   // const info = await dataset.getInfo();
//   // console.log(info.itemCount);
//   // // => 0
//
//   /**
//    * ======= ACCESSING REMOTE DATA ========
//    * Use \`sendRequest\` to get data from the internet:
//    * Docs:
//    * - https://github.com/apify/got-scraping
//    */
//   // const catFact = await sendRequest.get('https://cat-fact.herokuapp.com/facts/5887e1d85c873e0011036889').json();
//   // console.log(catFact.text);
//   // // => "Cats make about 100 different sounds. Dogs make only about 10.",
//
//   /**
//    * ======= USING CACHE ========
//    * To save the entry to the KeyValue cache (or retrieve it), you can use
//    * \`itemCacheKey\` to create the entry's ID for you:
//    */
//   // const cacheId = itemCacheKey(item, input.cachePrimaryKeys);
//   // const cache = await io.openKeyValueStore('MyStoreId');
//   // cache.setValue(cacheId, entry);`;

  const hookFnExample = `
/**
 * Inputs:
${formattedArgDesc}
 * \`ctx.io\` - Instance of CrawleeOneIO that manages results (Dataset), Requests (RequestQueue), and cache (KeyValueStore). By default this is the Apify Actor class, see https://docs.apify.com/sdk/js/reference/class/Actor.
 * \`ctx.input\` - The input object that was passed to this Actor.
 * \`ctx.state\` - An object you can use to persist state across all your custom functions.
 * \`ctx.sendRequest\` - Fetch remote data. Uses 'got-scraping', same as Apify's \`sendRequest\`.
 *                       See https://crawlee.dev/docs/guides/got-scraping
 * \`ctx.itemCacheKey\` - A function you can use to get cacheID for current \`entry\`.
 *                        It takes the entry itself, and a list of properties to be used for hashing.
 *                        By default, you should pass \`input.cachePrimaryKeys\` to it.
 *
 */
// async (${formattedArgs}{ io, input, state, sendRequest, itemCacheKey }) => {
${formattedMainCode}
${includeGuides ? guides : '//'}
// };`;
  return hookFnExample;
};

const CODE_EXAMPLES = {
  // Input
  inputExtendFromFunction: `// Example: Load Actor config from GitHub URL (public)
const config = await sendRequest.get('https://raw.githubusercontent.com/username/project/main/config.json').json();

// Increase concurrency during off-peak hours
// NOTE: Imagine we're targetting a small server, that can be slower during the day
const hours = new Date().getUTCHours();
const isOffPeak = hours < 6 || hours > 20;
config.maxConcurrency = isOffPeak ? 8 : 3;

return config;`,
  startUrlsFromFunction: `// Example: Create and load URLs from a Dataset by combining multiple fields
const dataset = await io.openDataset(datasetNameOrId);
const data = await dataset.getData();
const urls = data.items.map((item) => \`https://example.com/u/\${item.userId}/list/\${item.listId}\`);
return urls;`,

  // Output
  outputTransform: `// Example: Add extra custom fields like aggregates
return {
  ...entry,
  imagesCount: entry.images.length,
};`,
  outputTransformBefore: `// Example: Fetch data or run code BEFORE entries are scraped.
state.categories = await sendRequest.get('https://example.com/my-categories').json();`,
  outputTransformAfter: `// Example: Fetch data or run code AFTER entries are scraped.
delete state.categories;`,
  outputFilter: `// Example: Filter entries based on number of images they have (at least 5)
return entry.images.length > 5;`,
  outputFilterBefore: `// Example: Fetch data or run code BEFORE entries are scraped.
state.categories = await sendRequest.get('https://example.com/my-categories').json();`,
  outputFilterAfter: `// Example: Fetch data or run code AFTER entries are scraped.
delete state.categories;`,

  // Requests
  requestTransform: `// Example: Tag requests
// (maybe because we use RequestQueue that pools multiple scrapers)
request.userData.tag = "VARIANT_A";
return requestQueue;`,
  requestTransformBefore: `// Example: Fetch data or run code BEFORE requests are processed.
state.categories = await sendRequest.get('https://example.com/my-categories').json();`,
  requestTransformAfter: `// Example: Fetch data or run code AFTER requests are processed.
delete state.categories;`,
  requestFilter: `// Example: Filter requests based on their tag
// (maybe because we use RequestQueue that pools multiple scrapers)
return request.userData.tag === "VARIANT_A";`,
  requestFilterBefore: `// Example: Fetch data or run code BEFORE requests are processed.
state.categories = await sendRequest.get('https://example.com/my-categories').json();`,
  requestFilterAfter: `// Example: Fetch data or run code AFTER requests are processed.
delete state.categories;`,
};

/** Common input fields related to actor input */
export const inputInput = {
  inputExtendUrl: createStringField({
    title: 'Extend Actor input from URL',
    type: 'string',
    editor: 'textfield',
    description: `Extend Actor input with a config from a URL.${newLine(1)}
    For example, you can store your actor input in a source control, and import it here.${newLine(1)}
    In case of a conflict (if a field is defined both in Actor input and in imported input) the Actor input overwrites the imported fields.${newLine(1)}
    The URL is requested with GET method, and must point to a JSON file containing a single object (the config).${newLine(1)}
    If you need to send a POST request or to modify the response further, use \`inputExtendFromFunction\` instead.`,
    example: 'https://raw.githubusercontent.com/jfairbank/programming-elm.com/master/cat-breeds.json',
    nullable: true,
    sectionCaption: 'Programmatic Input (Advanced)',
    sectionDescription:
      "With these options you can configure other Actor options programmatically or from remote source.",
    schema: z.string().min(1).url().optional(),
  }), // prettier-ignore

  inputExtendFromFunction: createStringField({
    title: 'Extend Actor input from custom function',
    type: 'string',
    editor: 'javascript',
    description: `Extend Actor input with a config defined by a custom function.${newLine(1)}
    For example, you can store your actor input in a source control, and import it here.${newLine(1)}
    In case of a conflict (if a field is defined both in Actor input and in imported input) the Actor input overwrites the imported fields.${newLine(1)}
    The function must return an object (the config).`,
    example: createHookFnExample({}, CODE_EXAMPLES.inputExtendFromFunction, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.inputExtendFromFunction, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
} satisfies Record<keyof InputActorInput, Field>;

/** Common input fields related to crawler setup */
export const crawlerInput = {
  maxRequestRetries: createIntegerField({
    title: 'maxRequestRetries',
    type: 'integer',
    description:
      'Indicates how many times the request is retried if <a href="https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#requestHandler">BasicCrawlerOptions.requestHandler</a> fails.',
    example: 3,
    prefill: 3,
    minimum: 0,
    nullable: true,
    sectionCaption: 'Crawler configuration (Advanced)',
    sectionDescription:
      "These options are applied directly to the Crawler. In majority of cases you don't need to change these. See https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions",
    schema: z.number().int().min(0).optional(),
  }),
  maxRequestsPerMinute: createIntegerField({
    title: 'maxRequestsPerMinute',
    type: 'integer',
    description:
      'The maximum number of requests per minute the crawler should run. We can pass any positive, non-zero integer.',
    example: 120,
    prefill: 120,
    minimum: 1,
    nullable: true,
    schema: z.number().int().min(1).optional(),
  }),
  maxRequestsPerCrawl: createIntegerField({
    title: 'maxRequestsPerCrawl',
    type: 'integer',
    description: `Maximum number of pages that the crawler will open. The crawl will stop when this limit is reached.
    ${newLine(1)} <strong>NOTE:</strong> In cases of parallel crawling, the actual number of pages visited might be slightly higher than this value.`,
    minimum: 1,
    nullable: true,
    schema: z.number().int().min(1).optional(),
  }), // prettier-ignore
  maxCrawlDepth: createIntegerField({
    title: 'maxCrawlDepth',
    type: 'integer',
    description: `Maximum depth of the crawl. The initial requests have depth 0, requests enqueued from the initial requests have depth 1, and so on.
    ${newLine(1)} Setting this to <code>0</code> will only process the initial requests. Setting it to <code>1</code> will process initial requests and their direct links, etc.
    ${newLine(1)} If not set, the crawl continues until all requests are processed.`,
    minimum: 0,
    nullable: true,
    schema: z.number().int().min(0).optional(),
  }),
  minConcurrency: createIntegerField({
    title: 'minConcurrency',
    type: 'integer',
    description: `Sets the minimum concurrency (parallelism) for the crawl.${newLine(1)}
    <strong>WARNING:</strong> If we set this value too high with respect to the available system memory and CPU, our crawler will run extremely slow or crash. If not sure, it's better to keep the default value and the concurrency will scale up automatically.`,
    example: 1,
    prefill: 1,
    minimum: 1,
    nullable: true,
    schema: z.number().int().min(1).optional(),
  }), // prettier-ignore
  maxConcurrency: createIntegerField({
    title: 'maxConcurrency',
    type: 'integer',
    description: 'Sets the maximum concurrency (parallelism) for the crawl.',
    minimum: 1,
    nullable: true,
    schema: z.number().int().min(1).optional(),
  }),
  navigationTimeoutSecs: createIntegerField({
    title: 'navigationTimeoutSecs',
    type: 'integer',
    description:
      'Timeout in which the HTTP request to the resource needs to finish, given in seconds.',
    minimum: 0,
    nullable: true,
    schema: z.number().int().min(0).optional(),
  }),
  requestHandlerTimeoutSecs: createIntegerField({
    title: 'requestHandlerTimeoutSecs',
    type: 'integer',
    description:
      'Timeout in which the function passed as <a href="https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#requestHandler">BasicCrawlerOptions.requestHandler</a> needs to finish, in seconds.',
    example: 180,
    prefill: 180,
    minimum: 0,
    nullable: true,
    schema: z.number().int().min(0).optional(),
  }),
  keepAlive: createBooleanField({
    title: 'keepAlive',
    type: 'boolean',
    description:
      'Allows to keep the crawler alive even if the RequestQueue gets empty. With keepAlive: true the crawler will keep running, waiting for more requests to come.',
    nullable: true,
    schema: z.boolean().optional(),
  }),
  ignoreSslErrors: createBooleanField({
    title: 'ignoreSslErrors',
    type: 'boolean',
    description: 'If set to true, SSL certificate errors will be ignored.',
    nullable: true,
    schema: z.boolean().optional(),
  }),
  additionalMimeTypes: createArrayField({
    title: 'additionalMimeTypes',
    type: 'array',
    description:
      'An array of MIME types you want the crawler to load and process. By default, only text/html and application/xhtml+xml MIME types are supported.',
    editor: 'stringList',
    uniqueItems: true,
    nullable: true,
    schema: z.array(z.string().min(1)).optional(),
  }),
  suggestResponseEncoding: createStringField({
    title: 'suggestResponseEncoding',
    type: 'string',
    description:
      'By default this crawler will extract correct encoding from the HTTP response headers. There are some websites which use invalid headers. Those are encoded using the UTF-8 encoding. If those sites actually use a different encoding, the response will be corrupted. You can use suggestResponseEncoding to fall back to a certain encoding, if you know that your target website uses it. To force a certain encoding, disregarding the response headers, use forceResponseEncoding.',
    editor: 'textfield',
    nullable: true,
    schema: z.string().min(1).optional(),
  }),
  forceResponseEncoding: createStringField({
    title: 'forceResponseEncoding',
    type: 'string',
    description:
      'By default this crawler will extract correct encoding from the HTTP response headers. Use forceResponseEncoding to force a certain encoding, disregarding the response headers. To only provide a default for missing encodings, use suggestResponseEncoding.',
    editor: 'textfield',
    nullable: true,
    schema: z.string().min(1).optional(),
  }),
} satisfies Record<keyof CrawlerConfigActorInput, Field>;

/** Common input fields related to performance which are not part of the CrawlerConfig */
export const perfInput = {
  batchSize: createIntegerField({
    title: 'Batch requests',
    type: 'integer',
    description: `If set, multiple Requests will be handled by a single Actor instance.${newLine(1)}
       Example: If set to 20, then up to 20 requests will be handled in a single "go", after which the actor instance will reset.${newLine(1)}
       <a href="https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs">See Apify documentation</a>.`,
    example: 20,
    minimum: 0,
    nullable: true,
    sectionCaption: 'Performance configuration (Advanced)',
    sectionDescription: 'Standalone performance options. These are not passed to the Crawler.',
    schema: z.number().int().min(0).optional(),
  }), // prettier-ignore
  batchWaitSecs: createIntegerField({
    title: 'Wait (in seconds) between processing requests in a single batch',
    type: 'integer',
    description: `How long to wait between entries within a single batch.${newLine(1)}
      Increase this value if you're using batching and you're sending requests to the scraped website too fast.${newLine(1)}
      Example: If set to 1, then after each entry in a batch, wait 1 second before continuing.`,
    example: 1,
    minimum: 0,
    nullable: true,
    schema: z.number().int().min(0).optional(),
  }), // prettier-ignore
} satisfies Record<keyof PerfActorInput, Field>;

/** Common input fields for defining URLs to scrape */
export const startUrlsInput = {
  startUrls: createArrayField({
    title: 'Start URLs',
    type: 'array',
    description: `List of URLs to scrape.`,
    editor: 'requestListSources',
    sectionCaption: 'Starting URLs',
    schema: z.array(z.union([z.string().min(1), z.object({}).passthrough()])).optional(),
  }),
  startUrlsFromDataset: createStringField({
    title: 'Start URLs from Dataset',
    type: 'string',
    editor: 'textfield',
    description: `Import URLs to scrape from an existing Dataset.${newLine(1)}
    The dataset and the field to import from should be written as \`{datasetID}#{field}\`.${newLine(1)}
    Example: \`datasetid123#url\` will take URLs from dataset \`datasetid123\` from field \`url\`.`,
    pattern: datasetIdWithFieldPattern,
    example: 'datasetid123#url',
    nullable: true,
    schema: z.string().min(1).regex(datasetIdWithFieldRegex).optional(),
  }), // prettier-ignore
  startUrlsFromFunction: createStringField({
    title: 'Start URLs from custom function',
    type: 'string',
    description: `Import or generate URLs to scrape using a custom function.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.startUrlsFromFunction, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.startUrlsFromFunction, true),
    nullable: true,
    schema: z.union([z.string().min(1), z.function()]).optional(),
  }), // prettier-ignore
} satisfies Record<keyof StartUrlsActorInput, Field>;

/** Common input fields related to logging setup */
export const loggingInput = {
  logLevel: createStringField<LogLevel>({
    title: 'Log Level',
    type: 'string',
    editor: 'select',
    description: 'Select how detailed should be the logging.',
    enum: LOG_LEVEL,
    enumTitles: [
      'No logging (off)',
      'Debug and higher priority',
      'Info and higher priority',
      'Warning and higher priority',
      'Error and higher priority',
    ],
    example: 'info',
    prefill: 'info',
    default: 'info',
    nullable: true,
    sectionCaption: 'Logging & Error handling (Advanced)',
    sectionDescription:
      'Configure how to handle errors or what should be displayed in the log console.',
    schema: z.enum(LOG_LEVEL).optional(),
  }),
  errorReportingDatasetId: createStringField({
    title: 'Error reporting dataset ID',
    type: 'string',
    editor: 'textfield',
    description: `Dataset ID to which errors should be captured.${newLine(1)}
    Default: \`'REPORTING'\`.${newLine(1)}
    <strong>NOTE:</strong> Dataset name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')`,
    example: 'REPORTING',
    prefill: 'REPORTING',
    default: 'REPORTING',
    pattern: datasetIdPattern,
    nullable: true,
    schema: z.string().min(1).regex(datasetIdRegex).optional(),
  }),
  errorTelemetry: createBooleanField({
    title: 'Send errors to telemetry service like Sentry',
    type: 'boolean',
    editor: 'checkbox',
    description: `Whether to report actor errors to telemetry such as <a href="https://sentry.io/">Sentry</a>.${newLine(1)}
    This info is used by the author of this actor to identify broken integrations,
    and track down and fix issues.`,
    example: true,
    default: true,
    nullable: true,
    schema: z.boolean().optional(),
  }), // prettier-ignore
} satisfies Record<keyof LoggingActorInput, Field>;

/** Common input fields related to proxy setup */
export const proxyInput = {
  proxy: createObjectField({
    title: 'Proxy configuration',
    type: 'object',
    description: 'Select proxies to be used by your crawler.',
    editor: 'proxy',
    sectionCaption: 'Proxy',
    sectionDescription: 'Configure the proxy',
    schema: z.object({}).passthrough().optional(),
  }),
} satisfies Record<keyof ProxyActorInput, Field>;

/** Common input fields related to proxy setup */
export const privacyInput = {
  includePersonalData: createBooleanField({
    title: 'Include personal data',
    type: 'boolean',
    description: `By default, fields that are potential personal data are censored. Toggle this option on to get the un-uncensored values.${newLine(1)}
    <strong>WARNING:</strong> Turn this on ONLY if you have consent, legal basis for using the data, or at your own risk. <a href="https://gdpr.eu/eu-gdpr-personal-data/">Learn more</a>`,
    default: false,
    example: false,
    nullable: true,
    sectionCaption: 'Privacy & Data governance (GDPR)',
    schema: z.boolean().optional(),
  }), // prettier-ignore
} satisfies Record<keyof PrivacyActorInput, Field>;

/** Common input fields related to actor request */
export const requestInput = {
  requestMaxEntries: createIntegerField({
    title: 'Limit the number of requests',
    type: 'integer',
    description: `If set, only at most this many requests will be processed.${newLine(1)}
      The count is determined from the RequestQueue that's used for the Actor run.${newLine(1)}
      This means that if \`requestMaxEntries\` is set to 50, but the associated queue already handled 40 requests, then only 10 new requests will be handled.`,
    example: 50,
    prefill: 50,
    minimum: 0,
    nullable: true,
    sectionCaption: 'Requests limit, transformation & filtering (Advanced)',
    schema: z.number().int().min(0).optional(),
  }), // prettier-ignore

  requestTransform: createStringField({
    title: 'Transform requests',
    type: 'string',
    description: `Freely transform the request object using a custom function.${newLine(1)}
    If not set, the request will remain as is.`,
    editor: 'javascript',
    example: createHookFnExample({ request: 'Request holding URL to be scraped' }, CODE_EXAMPLES.requestTransform, false),
    prefill: createHookFnExample({ request: 'Request holding URL to be scraped' }, CODE_EXAMPLES.requestTransform, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  requestTransformBefore: createStringField({
    title: 'Transform requests - Setup',
    type: 'string',
    description: `Use this if you need to run one-time initialization code before \`requestTransform\`.`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.requestTransformBefore, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.requestTransformBefore, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  requestTransformAfter: createStringField({
    title: 'Transform requests - Teardown',
    type: 'string',
    description: `Use this if you need to run one-time teardown code after \`requestTransform\`.`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.requestTransformAfter, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.requestTransformAfter, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore

  requestFilter: createStringField({
    title: 'Filter requests',
    type: 'string',
    description: `Decide which requests should be processed by using a custom function.${newLine(1)}
    If not set, all requests will be included.${newLine(1)}
    This is done after \`requestTransform\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({ request: 'Request holding URL to be scraped' }, CODE_EXAMPLES.requestFilter, false),
    prefill: createHookFnExample({ request: 'Request holding URL to be scraped' }, CODE_EXAMPLES.requestFilter, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  requestFilterBefore: createStringField({
    title: 'Filter requests - Setup',
    type: 'string',
    description: `Use this if you need to run one-time initialization code before \`requestFilter\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.requestFilterBefore, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.requestFilterBefore, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  requestFilterAfter: createStringField({
    title: 'Filter requests - Teardown',
    type: 'string',
    description: `Use this if you need to run one-time teardown code after \`requestFilter\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.requestFilterAfter, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.requestFilterAfter, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore

  requestQueueId: createStringField({
    title: 'RequestQueue ID',
    type: 'string',
    description: `By default, requests are stored in the default request queue.
    Set this option if you want to use a non-default queue.
    <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#opening-named-and-unnamed-storages">Learn more</a>${newLine(1)}
    <strong>NOTE:</strong> RequestQueue name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')`,
    editor: 'textfield',
    example: 'mIJVZsRQrDQf4rUAf',
    pattern: datasetIdPattern,
    nullable: true,
    schema: z.string().min(1).regex(datasetIdRegex).optional(),
  }), // prettier-ignore
} satisfies Record<keyof RequestActorInput, Field>;

/** Common input fields related to actor output */
export const outputInput = {
  outputMaxEntries: createIntegerField({
    title: 'Limit the number of scraped entries',
    type: 'integer',
    description: `If set, only at most this many entries will be scraped.${newLine(1)}
      The count is determined from the Dataset that's used for the Actor run.${newLine(1)}
      This means that if \`outputMaxEntries\` is set to 50, but the associated Dataset already has 40 items in it, then only 10 new entries will be saved.`,
    example: 50,
    prefill: 50,
    minimum: 0,
    nullable: true,
    sectionCaption: 'Output size, transformation & filtering (T in ETL) (Advanced)',
    schema: z.number().int().min(0).optional(),
  }),
  outputRenameFields: createObjectField({
    title: 'Rename dataset fields',
    type: 'object',
    description: `Rename fields (columns) of the output data.${newLine(1)}
    If not set, all fields will have their original names.${newLine(1)}
    This is done before \`outputPickFields\`.${newLine(1)}
    Keys can be nested, e.g. \`"someProp.value[0]"\`.
    Nested path is resolved using <a href="https://lodash.com/docs/4.17.15#get">Lodash.get()</a>.`,
    editor: 'json',
    example: { oldFieldName: 'newFieldName' },
    nullable: true,
    schema: z.record(z.string().min(1), z.string().min(1)).optional(),
  }),
  outputPickFields: createArrayField({
    title: 'Pick dataset fields',
    type: 'array',
    description: `Select a subset of fields of an entry that will be pushed to the dataset.${newLine(1)}
    If not set, all fields on an entry will be pushed to the dataset.${newLine(1)}
    This is done after \`outputRenameFields\`.${newLine(1)}
    Keys can be nested, e.g. \`"someProp.value[0]"\`.
    Nested path is resolved using <a href="https://lodash.com/docs/4.17.15#get">Lodash.get()</a>.`,
    editor: 'stringList',
    example: ['fieldName', 'another.nested[0].field'],
    nullable: true,
    schema: z.array(z.string().min(1)).optional(),
  }), // prettier-ignore

  outputTransform: createStringField({
    title: 'Transform entries',
    type: 'string',
    description: `Freely transform the output data object using a custom function.${newLine(1)}
    If not set, the data will remain as is.${newLine(1)}
    This is done after \`outputPickFields\` and \`outputRenameFields\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({ entry: 'Scraped entry' }, CODE_EXAMPLES.outputTransform, false),
    prefill: createHookFnExample({ entry: 'Scraped entry' }, CODE_EXAMPLES.outputTransform, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  outputTransformBefore: createStringField({
    title: 'Transform entries - Setup',
    type: 'string',
    description: `Use this if you need to run one-time initialization code before \`outputTransform\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.outputTransformBefore, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.outputTransformBefore, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  outputTransformAfter: createStringField({
    title: 'Transform entries - Teardown',
    type: 'string',
    description: `Use this if you need to run one-time teardown code after \`outputTransform\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.outputTransformAfter, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.outputTransformAfter, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore

  outputFilter: createStringField({
    title: 'Filter entries',
    type: 'string',
    description: `Decide which scraped entries should be included in the output by using a custom function.${newLine(1)}
    If not set, all scraped entries will be included.${newLine(1)}
    This is done after \`outputPickFields\`, \`outputRenameFields\`, and \`outputTransform\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({ entry: 'Scraped entry' }, CODE_EXAMPLES.outputFilter, false),
    prefill: createHookFnExample({ entry: 'Scraped entry' }, CODE_EXAMPLES.outputFilter, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  outputFilterBefore: createStringField({
    title: 'Filter entries - Setup',
    type: 'string',
    description: `Use this if you need to run one-time initialization code before \`outputFilter\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.outputFilterBefore, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.outputFilterBefore, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  outputFilterAfter: createStringField({
    title: 'Filter entries - Teardown',
    type: 'string',
    description: `Use this if you need to run one-time teardown code after \`outputFilter\`.${newLine(1)}`,
    editor: 'javascript',
    example: createHookFnExample({}, CODE_EXAMPLES.outputFilterAfter, false),
    prefill: createHookFnExample({}, CODE_EXAMPLES.outputFilterAfter, true),
    nullable: true,
    schema: z.string().min(1).optional(),
  }), // prettier-ignore

  outputDatasetId: createStringField({
    title: 'Dataset ID',
    type: 'string',
    description: `By default, data is written to Default dataset.
    Set this option if you want to write data to non-default dataset.
    <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#opening-named-and-unnamed-storages">Learn more</a>${newLine(1)}
    <strong>NOTE:</strong> Dataset name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')`,
    editor: 'textfield',
    example: 'mIJVZsRQrDQf4rUAf',
    pattern: datasetIdPattern,
    nullable: true,
    sectionCaption: 'Output Dataset & Caching (L in ETL) (Advanced)',
    schema: z.string().min(1).regex(datasetIdRegex).optional(),
  }), // prettier-ignore

  outputCacheStoreId: createStringField({
    title: 'Cache ID',
    type: 'string',
    description: `Set this option if you want to cache scraped entries in <a href="https://docs.apify.com/sdk/js/docs/guides/result-storage#key-value-store">Apify's Key-value store</a>.${newLine(1)}
    This is useful for example when you want to scrape only NEW entries. In such case, you can use the \`outputFilter\` option to define a custom function to filter out entries already found in the cache.
    <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#working-with-key-value-stores">Learn more</a>${newLine(1)}
    <strong>NOTE:</strong> Cache name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')`,
    editor: 'textfield',
    example: 'mIJVZsRQrDQf4rUAf',
    pattern: datasetIdPattern,
    nullable: true,
    schema: z.string().min(1).regex(datasetIdRegex).optional(),
  }), // prettier-ignore
  outputCachePrimaryKeys: createArrayField({
    title: 'Cache primary keys',
    type: 'array',
    description: `Specify fields that uniquely identify entries (primary keys), so entries can be compared against the cache.${newLine(1)}
    <strong>NOTE:</strong> If not set, the entries are hashed based on all fields`,
    editor: 'stringList',
    example: ['name', 'city'],
    nullable: true,
    schema: z.array(z.string().min(1)).optional(),
  }), // prettier-ignore
  outputCacheActionOnResult: createStringField({
    title: 'Cache action on result',
    type: 'string',
    description: `Specify whether scraped results should be added to, removed from, or overwrite the cache.${newLine(1)}
    - <strong>add<strong> - Adds scraped results to the cache${newLine(1)}
    - <strong>remove<strong> - Removes scraped results from the cache${newLine(1)}
    - <strong>set<strong> - First clears all entries from the cache, then adds scraped results to the cache${newLine(1)}
    <strong>NOTE:</strong> No action happens when this field is empty.`,
    editor: 'select',
    enum: ['add', 'remove', 'overwrite'],
    example: 'add',
    nullable: true,
    schema: z.enum(['add', 'remove', 'overwrite']).optional(),
  }), // prettier-ignore
} satisfies Record<keyof OutputActorInput, Field>;

/** Common input fields related to actor metamorphing */
export const metamorphInput = {
  metamorphActorId: createStringField({
    title: 'Metamorph actor ID - metamorph to another actor at the end',
    type: 'string',
    description: `Use this option if you want to run another actor with the same dataset after this actor has finished (AKA metamorph into another actor). <a href="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a> ${newLine(1)}
    New actor is identified by its ID, e.g. "apify/web-scraper".`,
    editor: 'textfield',
    example: 'apify/web-scraper',
    nullable: true,
    sectionCaption: 'Integrations (Metamorphing) (Advanced)',
    schema: z.string().min(1).optional(),
  }), // prettier-ignore
  metamorphActorBuild: createStringField({
    title: 'Metamorph actor build',
    type: 'string',
    description: `Tag or number of the target actor build to metamorph into (e.g. 'beta' or '1.2.345')`,
    editor: 'textfield',
    example: '1.2.345',
    nullable: true,
    schema: z.string().min(1).optional(),
  }),
  metamorphActorInput: createObjectField({
    title: 'Metamorph actor input',
    type: 'object',
    description: `Input object passed to the follow-up (metamorph) actor. <a href="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a>`,
    editor: 'json',
    example: { uploadDatasetToGDrive: true },
    nullable: true,
    schema: z.object({}).passthrough().optional(),
  }),
} satisfies Record<keyof MetamorphActorInput, Field>;

export const actorInput = {
  ...inputInput,
  ...startUrlsInput,
  ...proxyInput,
  ...privacyInput,
  ...requestInput,
  ...outputInput,
  ...crawlerInput,
  ...perfInput,
  ...loggingInput,
  ...metamorphInput,
} satisfies Record<keyof ActorInput, Field>;

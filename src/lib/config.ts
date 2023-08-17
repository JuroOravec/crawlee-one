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
import Joi from 'joi';

import type { CrawlerUrl } from '../types';
import { LOG_LEVEL, LogLevel } from './log';

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
  | 'minConcurrency'
  | 'maxConcurrency'
  | 'keepAlive'
>;

/** Common input fields for defining URLs to scrape */
export type StartUrlsActorInput = {
  /** URLs to start with, defined manually as a list of strings or crawler requests */
  startUrls?: CrawlerUrl[];
  /**
   * Import starting URLs from an existing Apify Dataset.
   *
   * String is in the format `datasetID#field` (e.g. `datasetid123#url`).
   */
  startUrlsFromDataset?: string;
  /**
   * Import or generate starting URLs using a custom function.
   *
   * The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.
   *
   * ```js
   * // Example: Create and load URLs from an Apify Dataset by combining multiple fields
   * async ({ Actor, input, state, itemCacheKey }) => {
   *   const dataset = await Actor.openDataset(datasetNameOrId);
   *   const data = await dataset.getData();
   *   const urls = data.items.map((item) => `https://example.com/u/${item.userId}/list/${item.listId}`);
   *   return urls;
   * }
   * ```
   */
  startUrlsFromFunction?: string;
};

/** Common input fields related to logging setup */
export interface LoggingActorInput {
  logLevel?: LogLevel;
  /**
   * Whether to send actor error reports to <a href="https://sentry.io/">Sentry</a>.
   *
   * This info is used by the author of this actor to identify broken integrations,
   * and track down and fix issues.
   */
  errorSendToSentry?: boolean;
  /**
   * Apify dataset ID or name to which errors should be captured.
   *
   * Default: `'REPORTING'`.
   */
  errorReportingDatasetId?: string;
}

/** Common input fields related to proxy setup */
export interface ProxyActorInput {
  proxy?: Parameters<Actor['createProxyConfiguration']>[0];
}

/** Common input fields related to actor output */
export interface OutputActorInput {
  /**
   * If set, only at most this many entries will be scraped.
   *
   * The count is determined from the Apify Dataset that's used for the Actor run.
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
   * This is done before `outputRenameFields`.
   *
   * Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
   * resolved using Lodash.get().
   */
  outputPickFields?: string[];
  /**
   * Option to remap the keys before pushing the entries to the dataset.
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
   * The function has access to Apify's Actor class, and actor's input and a shared state in the second argument.
   *
   * `async (entry, { Actor, input, state, itemCacheKey }) => { ... }`
   */
  outputTransform?: string;
  /**
   * Use this if you need to run one-time initialization code before `outputTransform`.
   *
   * The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.
   *
   * `async ({ Actor, input, state, itemCacheKey }) => { ... }`
   */
  outputTransformBefore?: string;
  /**
   * Use this if you need to run one-time teardown code after `outputTransform`.
   *
   * The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.
   *
   * `async ({ Actor, input, state, itemCacheKey }) => { ... }`
   */
  outputTransformAfter?: string;

  /**
   * Option to filter out the data using a custom function before pushing it to the dataset.
   *
   * If not set, all entries will be included.
   *
   * This is done after `outputPickFields`, `outputRenameFields`, and `outputFilter`.
   *
   * The function has access to Apify's Actor class, and actor's input and a shared state in the second argument.
   *
   * `async (entry, { Apify, input, state, itemCacheKey }) => boolean`
   */
  outputFilter?: string;
  /**
   * Use this if you need to run one-time initialization code before `outputFilter`.
   *
   * The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.
   *
   * `async ({ Apify, input, state, itemCacheKey }) => boolean`
   */
  outputFilterBefore?: string;
  /**
   * Use this if you need to run one-time initialization code after `outputFilter`.
   *
   * The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.
   *
   * `async ({ Actor, input, state, itemCacheKey }) => boolean`
   */
  outputFilterAfter?: string;

  /** ID or name of the dataset to which the data should be pushed */
  outputDatasetIdOrName?: string;

  /** ID or name of the key-value store used as cache */
  outputCacheStoreIdOrName?: string;
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
  }),
  maxRequestsPerCrawl: createIntegerField({
    title: 'maxRequestsPerCrawl',
    type: 'integer',
    description:
      'Maximum number of pages that the crawler will open. The crawl will stop when this limit is reached. <br/><br/> <strong>NOTE:</strong> In cases of parallel crawling, the actual number of pages visited might be slightly higher than this value.',
    minimum: 1,
    nullable: true,
  }),
  minConcurrency: createIntegerField({
    title: 'minConcurrency',
    type: 'integer',
    description:
      "Sets the minimum concurrency (parallelism) for the crawl.<br/><br/><strong>WARNING:</strong> If we set this value too high with respect to the available system memory and CPU, our crawler will run extremely slow or crash. If not sure, it's better to keep the default value and the concurrency will scale up automatically.",
    example: 1,
    prefill: 1,
    minimum: 1,
    nullable: true,
  }),
  maxConcurrency: createIntegerField({
    title: 'maxConcurrency',
    type: 'integer',
    description: 'Sets the maximum concurrency (parallelism) for the crawl.',
    minimum: 1,
    nullable: true,
  }),
  navigationTimeoutSecs: createIntegerField({
    title: 'navigationTimeoutSecs',
    type: 'integer',
    description:
      'Timeout in which the HTTP request to the resource needs to finish, given in seconds.',
    minimum: 0,
    nullable: true,
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
  }),
  keepAlive: createBooleanField({
    title: 'keepAlive',
    type: 'boolean',
    description:
      'Allows to keep the crawler alive even if the RequestQueue gets empty. With keepAlive: true the crawler will keep running, waiting for more requests to come.',
    nullable: true,
  }),
  ignoreSslErrors: createBooleanField({
    title: 'ignoreSslErrors',
    type: 'boolean',
    description: 'If set to true, SSL certificate errors will be ignored.',
    nullable: true,
  }),
  additionalMimeTypes: createArrayField({
    title: 'additionalMimeTypes',
    type: 'array',
    description:
      'An array of MIME types you want the crawler to load and process. By default, only text/html and application/xhtml+xml MIME types are supported.',
    editor: 'stringList',
    uniqueItems: true,
    nullable: true,
  }),
  suggestResponseEncoding: createStringField({
    title: 'suggestResponseEncoding',
    type: 'string',
    description:
      'By default this crawler will extract correct encoding from the HTTP response headers. There are some websites which use invalid headers. Those are encoded using the UTF-8 encoding. If those sites actually use a different encoding, the response will be corrupted. You can use suggestResponseEncoding to fall back to a certain encoding, if you know that your target website uses it. To force a certain encoding, disregarding the response headers, use forceResponseEncoding.',
    editor: 'textfield',
    nullable: true,
  }),
  forceResponseEncoding: createStringField({
    title: 'forceResponseEncoding',
    type: 'string',
    description:
      'By default this crawler will extract correct encoding from the HTTP response headers. Use forceResponseEncoding to force a certain encoding, disregarding the response headers. To only provide a default for missing encodings, use suggestResponseEncoding.',
    editor: 'textfield',
    nullable: true,
  }),
} satisfies Record<keyof CrawlerConfigActorInput, Field>;

/** Common input fields for defining URLs to scrape */
export const startUrlsInput = {
  startUrls: createArrayField({
    title: 'Start URLs',
    type: 'array',
    description: `List of URLs to scrape.`,
    editor: 'requestListSources',
    sectionCaption: 'Starting URLs',
  }),
  startUrlsFromDataset: createStringField({
    title: 'Start URLs from Dataset',
    type: 'string',
    editor: 'textfield',
    description: `Import URLs to scrape from an existing Apify Dataset.<br/><br/>
    Write the dataset and the field to import in the format \`{datasetID}#{field}\`.<br/><br/>
    Example: \`datasetid123#url\` will take URLs from dataset \`datasetid123\` from field \`url\`.`,
    pattern: datasetIdWithFieldPattern,
    example: 'datasetid123#url',
    nullable: true,
  }),
  startUrlsFromFunction: createStringField({
    title: 'Start URLs from custom function',
    type: 'string',
    description: `Import or generate URLs to scrape using a custom function.<br/><br/>
    The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.<br/><br/>
    \`
    // Example: Create and load URLs from an Apify Dataset by combining multiple fields
    async ({ Actor, input, state, itemCacheKey }) => {
      const dataset = await Actor.openDataset(datasetNameOrId);
      const data = await dataset.getData();
      const urls = data.items.map((item) => \`https://example.com/u/\${item.userId}/list/\${item.listId}\`);
      return urls;
    }
    \`
    `,
    editor: 'javascript',
    example: `
    // Example: Create and load URLs from an Apify Dataset by combining multiple fields
    async ({ Actor, input, state, itemCacheKey }) => {
      const dataset = await Actor.openDataset(datasetNameOrId);
      const data = await dataset.getData();
      const urls = data.items.map((item) => \`https://example.com/u/\${item.userId}/list/\${item.listId}\`);
      return urls;
    }`,
    nullable: true,
  }),
} satisfies Record<keyof StartUrlsActorInput, Field>;

/** Common input fields related to logging setup */
export const loggingInput = {
  logLevel: createStringField<LogLevel>({
    title: 'Log Level',
    type: 'string',
    editor: 'select',
    description: 'Select how detailed should be the logging.',
    enum: ['off', 'debug', 'info', 'warn', 'error'] satisfies LogLevel[],
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
  }),
  errorReportingDatasetId: createStringField({
    title: 'Error reporting dataset ID',
    type: 'string',
    editor: 'textfield',
    description: `Apify dataset ID or name to which errors should be captured.<br/><br/>
    Default: \`'REPORTING'\`.<br/><br/>
    <strong>NOTE:<strong> Dataset name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')`,
    example: 'REPORTING',
    prefill: 'REPORTING',
    default: 'REPORTING',
    pattern: datasetIdPattern,
    nullable: true,
  }),
  errorSendToSentry: createBooleanField({
    title: 'Send errors to Sentry',
    type: 'boolean',
    editor: 'checkbox',
    description: `Whether to send actor error reports to <a href="https://sentry.io/">Sentry</a>.<br/><br/>
    This info is used by the author of this actor to identify broken integrations,
    and track down and fix issues.`,
    example: true,
    default: true,
    nullable: true,
  }),
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
  }),
} satisfies Record<keyof ProxyActorInput, Field>;

/** Common input fields related to proxy setup */
export const privacyInput = {
  includePersonalData: createBooleanField({
    title: 'Include personal data',
    type: 'boolean',
    description: `By default, fields that are potential personal data are censored. Toggle this option on to get the un-uncensored values.<br/><br/><strong>WARNING:</strong> Turn this on ONLY if you have consent, legal basis for using the data, or at your own risk. <a href="https://gdpr.eu/eu-gdpr-personal-data/">Learn more</a>`,
    default: false,
    example: false,
    nullable: true,
    sectionCaption: 'Privacy & Data governance (GDPR)',
  }),
} satisfies Record<keyof PrivacyActorInput, Field>;

/** Common input fields related to actor output */
export const outputInput = {
  outputMaxEntries: createIntegerField({
    title: 'Limit the number of scraped entries',
    type: 'integer',
    description: `If set, only at most this many entries will be scraped.<br/><br/>
      The count is determined from the Apify Dataset that's used for the Actor run.<br/><br/>
      This means that if \`outputMaxEntries\` is set to 50, but the associated Dataset already has 40 items in it, then only 10 new entries will be saved.`,
    example: 50,
    prefill: 50,
    minimum: 0,
    nullable: true,
    sectionCaption: 'Output size, transformation & filtering (T in ETL)',
  }),
  outputPickFields: createArrayField({
    title: 'Pick dataset fields',
    type: 'array',
    description: `Select a subset of fields of an entry that will be pushed to the dataset.<br/><br/>
    If not set, all fields on an entry will be pushed to the dataset.<br/><br/>
    This is done before \`outputRenameFields\`.<br/><br/>
    Keys can be nested, e.g. \`"someProp.value[0]"\`.
    Nested path is resolved using <a href="https://lodash.com/docs/4.17.15#get">Lodash.get()</a>.`,
    editor: 'stringList',
    example: ['fieldName', 'another.nested[0].field'],
    nullable: true,
  }),
  outputRenameFields: createObjectField({
    title: 'Rename dataset fields',
    type: 'object',
    description: `Rename fields (columns) of the output data.<br/><br/>
    If not set, all fields will have their original names.<br/><br/>
    This is done after \`outputPickFields\`.<br/><br/>
    Keys can be nested, e.g. \`"someProp.value[0]"\`.
    Nested path is resolved using <a href="https://lodash.com/docs/4.17.15#get">Lodash.get()</a>.`,
    editor: 'json',
    example: { oldFieldName: 'newFieldName' },
    nullable: true,
  }),

  outputTransform: createStringField({
    title: 'Transform entries',
    type: 'string',
    description: `Freely transform the output data object using a custom function.<br/><br/>
    If not set, the data will remain as is.<br/><br/>
    This is done after \`outputPickFields\` and \`outputRenameFields\`.<br/><br/>
    The function has access to Apify's Actor class, and actor's input and a shared state in the second argument.<br/><br/>
    \`async (entry, { Actor, input, state, itemCacheKey }) => { ... }\`
    `,
    editor: 'javascript',
    example: 'async (entry, { Actor, input, state, itemCacheKey }) => { ... }',
    nullable: true,
  }),
  outputTransformBefore: createStringField({
    title: 'Transform entries - Setup',
    type: 'string',
    description: `Use this if you need to run one-time initialization code before \`outputTransform\`.<br/><br/>
    The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.<br/><br/>
    \`async ({ Actor, input, state, itemCacheKey }) => { ... }\`
    `,
    editor: 'javascript',
    example: 'async ({ Actor, input, state, itemCacheKey }) => { ... }',
    nullable: true,
  }),
  outputTransformAfter: createStringField({
    title: 'Transform entries - Teardown',
    type: 'string',
    description: `Use this if you need to run one-time teardown code after \`outputTransform\`.<br/><br/>
    The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.<br/><br/>
    \`async ({ Actor, input, state, itemCacheKey }) => { ... }\`
    `,
    editor: 'javascript',
    example: 'async ({ Actor, input, state, itemCacheKey }) => { ... }',
    nullable: true,
  }),

  outputFilter: createStringField({
    title: 'Filter entries',
    type: 'string',
    description: `Decide which scraped entries should be included in the output by using a custom function.<br/><br/>
    If not set, all scraped entries will be included.<br/><br/>
    This is done after \`outputPickFields\`, \`outputRenameFields\`, and \`outputTransform\`.<br/><br/>
    The function has access to Apify's Actor class, and actor's input and a shared state in the second argument.<br/><br/>
    \`async (entry, { Actor, input, state, itemCacheKey }) => boolean\`
    `,
    editor: 'javascript',
    example: 'async (entry, { Actor, input, state, itemCacheKey }) => boolean',
    nullable: true,
  }),
  outputFilterBefore: createStringField({
    title: 'Filter entries - Setup',
    type: 'string',
    description: `Use this if you need to run one-time initialization code before \`outputFilter\`.<br/><br/>
    The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.<br/><br/>
    \`async (entry, { Actor, input, state, itemCacheKey }) => boolean\`
    `,
    editor: 'javascript',
    example: 'async ({ Actor, input, state, itemCacheKey }) => boolean',
    nullable: true,
  }),
  outputFilterAfter: createStringField({
    title: 'Filter entries - Teardown',
    type: 'string',
    description: `Use this if you need to run one-time teardown code after \`outputFilter\`.<br/><br/>
    The function has access to Apify's Actor class, and actor's input and a shared state in the first argument.<br/><br/>
    \`async ({ Actor, input, state, itemCacheKey }) => boolean\`
    `,
    editor: 'javascript',
    example: 'async ({ Actor, input, state, itemCacheKey }) => boolean',
    nullable: true,
  }),

  outputDatasetIdOrName: createStringField({
    title: 'Dataset ID or name',
    type: 'string',
    description: `By default, data is written to Default dataset.
    Set this option if you want to write data to non-default dataset.
    <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#opening-named-and-unnamed-storages">Learn more</a><br/><br/>
    <strong>NOTE:<strong> Dataset name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')`,
    editor: 'textfield',
    example: 'mIJVZsRQrDQf4rUAf',
    pattern: datasetIdPattern,
    nullable: true,
    sectionCaption: 'Output Dataset & Caching (L in ETL)',
  }),

  outputCacheStoreIdOrName: createStringField({
    title: 'Cache ID or name',
    type: 'string',
    description: `Set this option if you want to cache scraped entries in <a href="https://docs.apify.com/sdk/js/docs/guides/result-storage#key-value-store">Apify's Key-value store</a>.<br/><br/>
    This is useful for example when you want to scrape only NEW entries. In such case, you can use the \`outputFilter\` option to define a custom function to filter out entries already found in the cache.
    <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#working-with-key-value-stores">Learn more</a><br/><br/>
    <strong>NOTE:<strong> Cache name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')`,
    editor: 'textfield',
    example: 'mIJVZsRQrDQf4rUAf',
    pattern: datasetIdPattern,
    nullable: true,
  }),
  outputCachePrimaryKeys: createArrayField<string[]>({
    title: 'Cache primary keys',
    type: 'array',
    description: `Specify fields that uniquely identify entries (primary keys), so entries can be compared against the cache.<br/><br/>
    <strong>NOTE:<strong> If not set, the entries are hashed based on all fields`,
    editor: 'stringList',
    example: ['name', 'city'],
    nullable: true,
  }),
  outputCacheActionOnResult: createStringField<
    NonNullable<OutputActorInput['outputCacheActionOnResult']>
  >({
    title: 'Cache action on result',
    type: 'string',
    description: `Specify whether scraped results should be added to, removed from, or overwrite the cache.<br/><br/>
    - <strong>add<strong> - Adds scraped results to the cache<br/><br/>
    - <strong>remove<strong> - Removes scraped results from the cache<br/><br/>
    - <strong>set<strong> - First clears all entries from the cache, then adds scraped results to the cache<br/><br/>
    <strong>NOTE:<strong> No action happens when this field is empty.`,
    editor: 'select',
    enum: ['add', 'remove', 'overwrite'],
    example: 'add',
    nullable: true,
  }),
} satisfies Record<keyof OutputActorInput, Field>;

/** Common input fields related to actor metamorphing */
export const metamorphInput = {
  metamorphActorId: createStringField({
    title: 'Metamorph actor ID - metamorph to another actor at the end',
    type: 'string',
    description: `Use this option if you want to run another actor with the same dataset after this actor has finished (AKA metamorph into another actor). <a href="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a> <br/><br/>New actor is identified by its ID, e.g. "apify/web-scraper".`,
    editor: 'textfield',
    example: 'apify/web-scraper',
    nullable: true,
    sectionCaption: 'Integrations (Metamorphing)',
  }),
  metamorphActorBuild: createStringField({
    title: 'Metamorph actor build',
    type: 'string',
    description: `Tag or number of the target actor build to metamorph into (e.g. 'beta' or '1.2.345')`,
    editor: 'textfield',
    example: '1.2.345',
    nullable: true,
  }),
  metamorphActorInput: createObjectField({
    title: 'Metamorph actor input',
    type: 'object',
    description: `Input object passed to the follow-up (metamorph) actor. <a href="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a>`,
    editor: 'json',
    example: { uploadDatasetToGDrive: true },
    nullable: true,
  }),
} satisfies Record<keyof MetamorphActorInput, Field>;

export const crawlerInputValidationFields = {
  navigationTimeoutSecs: Joi.number().integer().min(0).optional(),
  ignoreSslErrors: Joi.boolean().optional(),
  additionalMimeTypes: Joi.array().items(Joi.string().min(1)).optional(),
  suggestResponseEncoding: Joi.string().min(1).optional(),
  forceResponseEncoding: Joi.string().min(1).optional(),
  requestHandlerTimeoutSecs: Joi.number().integer().min(0).optional(),
  maxRequestRetries: Joi.number().integer().min(0).optional(),
  maxRequestsPerCrawl: Joi.number().integer().min(0).optional(),
  maxRequestsPerMinute: Joi.number().integer().min(0).optional(),
  minConcurrency: Joi.number().integer().min(0).optional(),
  maxConcurrency: Joi.number().integer().min(0).optional(),
  keepAlive: Joi.boolean().optional(),
} satisfies Record<keyof CrawlerConfigActorInput, Joi.Schema>;

export const startUrlsInputValidationFields = {
  startUrls: Joi.array().items(Joi.string().min(1), Joi.object()).optional(),
  startUrlsFromDataset: Joi.string().min(1).pattern(new RegExp(datasetIdWithFieldPattern)).optional(), // prettier-ignore
  startUrlsFromFunction: Joi.string().min(1).optional(),
} satisfies Record<keyof StartUrlsActorInput, Joi.Schema>;

export const loggingInputValidationFields = {
  logLevel: Joi.string().valid(...LOG_LEVEL).optional(), // prettier-ignore
  errorReportingDatasetId: Joi.string().min(1).pattern(new RegExp(datasetIdPattern)).optional(), // prettier-ignore
  errorSendToSentry: Joi.boolean().optional(),
} satisfies Record<keyof LoggingActorInput, Joi.Schema>;

export const proxyInputValidationFields = {
  proxy: Joi.object().optional(), // NOTE: Expand this type?
} satisfies Record<keyof ProxyActorInput, Joi.Schema>;

export const privacyInputValidationFields = {
  includePersonalData: Joi.boolean().optional(),
} satisfies Record<keyof PrivacyActorInput, Joi.Schema>;

export const outputInputValidationFields = {
  outputMaxEntries: Joi.number().integer().min(0).optional(),

  outputPickFields: Joi.array().items(Joi.string().min(1)).optional(),
  // https://stackoverflow.com/a/49898360/9788634
  outputRenameFields: Joi.object().pattern(/./, Joi.string().min(1)).optional(),

  outputTransform: Joi.string().min(1).optional(),
  outputTransformBefore: Joi.string().min(1).optional(),
  outputTransformAfter: Joi.string().min(1).optional(),
  outputFilter: Joi.string().min(1).optional(),
  outputFilterBefore: Joi.string().min(1).optional(),
  outputFilterAfter: Joi.string().min(1).optional(),

  outputCacheStoreIdOrName: Joi.string().min(1).pattern(new RegExp(datasetIdPattern)).optional(), // prettier-ignore
  outputCachePrimaryKeys: Joi.array().items(Joi.string().min(1)).optional(),
  outputCacheActionOnResult: Joi.string().min(1).allow('add', 'remove', 'overwrite').optional(), // prettier-ignore

  outputDatasetIdOrName: Joi.string().min(1).pattern(new RegExp(datasetIdPattern)).optional(), // prettier-ignore
} satisfies Record<keyof OutputActorInput, Joi.Schema>;

export const metamorphInputValidationFields = {
  metamorphActorId: Joi.string().min(1).optional(),
  metamorphActorBuild: Joi.string().min(1).optional(),
  metamorphActorInput: Joi.object().unknown(true).optional(),
} satisfies Record<keyof MetamorphActorInput, Joi.Schema>;

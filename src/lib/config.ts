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

/** Common input fields related to logging setup */
export interface LoggingActorInput {
  logLevel?: LogLevel;
}

/** Common input fields related to proxy setup */
export interface ProxyActorInput {
  proxy?: Parameters<Actor['createProxyConfiguration']>[0];
}

/** Common input fields related to actor output */
export interface OutputActorInput {
  /** ID of the dataset to which the data should be pushed */
  outputDatasetId?: string;
  /** Name of the dataset to which the data should be pushed */
  outputDatasetName?: string;
  /** Mapping of oldName:newName for the fields on the dataset entry */
  outputRenameFields?: Record<string, string>;
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
    sectionCaption: 'Logging (Advanced)',
    sectionDescription: 'Configure what should be displayed in the log console.',
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

const outputDatasetDesc = `By default, data is written to Default dataset. Set this option if you want to write data to non-default dataset. <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#opening-named-and-unnamed-storages">Learn more</a> <br/><br/><strong>NOTE:</strong> Set only either <strong>Dataset ID</strong> or <strong>Dataset Name</strong>, but not both.`;
/** Common input fields related to proxy setup */
export const outputInput = {
  outputDatasetId: createStringField({
    title: 'Dataset ID',
    type: 'string',
    description: outputDatasetDesc,
    editor: 'textfield',
    example: 'mIJVZsRQrDQf4rUAf',
    nullable: true,
    sectionCaption: 'Output, Dataset & Integrations',
  }),
  outputDatasetName: createStringField({
    title: 'Dataset name',
    type: 'string',
    description: outputDatasetDesc,
    editor: 'textfield',
    example: 'my-dataset',
    nullable: true,
  }),
  outputRenameFields: createObjectField({
    title: 'Rename dataset fields',
    type: 'object',
    description: `Use this option to rename fields (columns) of the output data. Value is an object of mapping of oldName:newName`,
    editor: 'json',
    example: { oldFieldName: 'newFieldName' },
    nullable: true,
  }),
  metamorphActorId: createStringField({
    title: 'Metamorph actor ID - metamorph to another actor at the end',
    type: 'string',
    description: `Use this option if you want to run another actor with the same dataset after this actor has finished (AKA metamorph into another actor). <ahref="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a> <br/><br/>New actor is identified by its ID, e.g. "apify/web-scraper".`,
    editor: 'textfield',
    example: 'apify/web-scraper',
    nullable: true,
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
    description: `Input object passed to the follow-up (metamorph) actor. <ahref="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a>`,
    editor: 'json',
    example: { uploadDatasetToGDrive: true },
    nullable: true,
  }),
} satisfies Record<keyof OutputActorInput, Field>;

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

export const loggingInputValidationFields = {
  logLevel: Joi.string().valid(...LOG_LEVEL).optional(), // prettier-ignore
} satisfies Record<keyof LoggingActorInput, Joi.Schema>;

export const proxyInputValidationFields = {
  proxy: Joi.object().optional(), // NOTE: Expand this type?
} satisfies Record<keyof ProxyActorInput, Joi.Schema>;

export const privacyInputValidationFields = {
  includePersonalData: Joi.boolean().optional(),
} satisfies Record<keyof PrivacyActorInput, Joi.Schema>;

export const outputInputValidationFields = {
  outputDatasetId: Joi.string().min(1).optional(),
  outputDatasetName: Joi.string().min(1).optional(),
  // https://stackoverflow.com/a/49898360/9788634
  outputRenameFields: Joi.object().pattern(/./, Joi.string()).optional(),
  metamorphActorId: Joi.string().min(1).optional(),
  metamorphActorBuild: Joi.string().min(1).optional(),
  metamorphActorInput: Joi.object().unknown(true).optional(),
} satisfies Record<keyof OutputActorInput, Joi.Schema>;

import type { CheerioCrawlerOptions } from 'crawlee';
import {
  createBooleanField,
  createIntegerField,
  createObjectField,
  createStringField,
  createArrayField,
  Field,
} from 'apify-actor-config';

import type { LogLevel } from './log';

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
  proxy?: any[];
}

/** Common input fields related to crawler setup */
export const crawlerInput: Record<keyof CrawlerConfigActorInput, Field> = {
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
};

/** Common input fields related to logging setup */
export const loggingInput: Record<keyof LoggingActorInput, Field> = {
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
};

/** Common input fields related to proxy setup */
export const proxyInput: Record<keyof ProxyActorInput, Field> = {
  proxy: createObjectField({
    title: 'Proxy configuration',
    type: 'object',
    description: 'Select proxies to be used by your crawler.',
    editor: 'proxy',
    sectionCaption: 'Proxy',
    sectionDescription: 'Configure the proxy',
  }),
};

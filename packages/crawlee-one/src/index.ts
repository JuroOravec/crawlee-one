/* eslint-disable simple-import-sort/exports */

// Main API
export {
  crawleeOne,
  type CrawleeOneOptions,
  createHttpCrawlerOptions,
} from './lib/context/context.js';

// Low-level API + types + helpers
export type { CrawlerMeta, CrawlerType, CrawlerUrl, HttpResponse, SampleUrlItem } from './types.js';
export type {
  ArrVal,
  MaybeArray,
  MaybeAsyncFn,
  MaybePromise,
  PickPartial,
  PickRequired,
} from './utils/types.js';
export {
  type CrawleeOneContext,
  type CrawleeOneHookCtx,
  type CrawleeOneHookFn,
  type CrawleeOneInternalOptions,
  type CrawleeOneInternalOptionsWithInput,
  type CrawleeOneRouteHandlerCtxExtras,
  type CrawleeOneTypes,
  type InputFromFields,
  type Metamorph,
} from './lib/context/types.js';
export {
  type ActorInput,
  actorInput,
  type CrawlerConfigActorInput,
  crawlerInput,
  type InputActorInput,
  inputInput,
  type LlmActorInput,
  type LoggingActorInput,
  loggingInput,
  type MetamorphActorInput,
  metamorphInput,
  type OutputActorInput,
  outputInput,
  type PerfActorInput,
  perfInput,
  type PrivacyActorInput,
  privacyInput,
  type ProxyActorInput,
  proxyInput,
  type RequestActorInput,
  requestInput,
  type StartUrlsActorInput,
  startUrlsInput,
} from './lib/input.js';
export { type PrivacyFilter, type PrivacyMask, type PushDataOptions } from './lib/io/pushData.js';
export { type AddRequestsOptions } from './lib/io/addRequests.js';
export {
  type CrawleeOneRoute,
  type CrawleeOneRouteHandler,
  type CrawleeOneRouteHandlerCtx,
  type CrawleeOneRouteMatcher,
  type CrawleeOneRouteMatcherFn,
  type CrawleeOneRouteMiddleware,
} from './lib/router/types.js';
export {
  type CrawleeOneConfig,
  type CrawleeOneConfigActor,
  type CrawleeOneConfigActorSpec,
  type CrawleeOneConfigGenerate,
  type CrawleeOneConfigReadme,
  type CrawleeOneConfigRun,
  type CrawleeOneConfigRunMetaOptions,
  type CrawleeOneConfigRunOptions,
  type CrawleeOneConfigSchema,
  type CrawleeOneConfigSchemaCrawler,
  type CrawleeOneConfigTypes,
  type CrawlersRecord,
  defineConfig,
  defineCrawler,
  type LlmCompareReportDefinition,
  type ReadmeRenderer,
} from './lib/config/types.js';
export { type PreviewServerOptions, startPreviewServer } from './lib/preview/server.js';
export { type ExportOptions, type ExportResult, runExport } from './lib/export/runExport.js';
export { type DefaultReadmeInput, defaultReadmeRenderer } from './lib/generate/defaultRenderer.js';
export {
  extractWithLlm,
  type ExtractWithLlmOptions,
  type ExtractWithLlmResult,
  type LlmExtractionMetadata,
} from './lib/llmExtract/extractWithLlm.js';
export {
  type ExtractWithLlmAsyncOptions,
  type ExtractWithLlmSyncOptions,
  type LlmExtractionMeta,
  type LlmExtractionResult,
} from './lib/llmExtract/extractWithLlmScoped.js';
export { createLlmCrawler } from './lib/llmExtract/llmCrawler.js';
export { type LogLevel, logLevelHandlerWrapper, logLevelToCrawlee } from './lib/log.js';
export {
  type ApifyCrawleeOneIO,
  type ApifyEntryMetadata,
  type ApifyErrorReport,
  apifyIO,
} from './lib/integrations/apify.js';
export {
  type CrawleeOneDataset,
  type CrawleeOneErrorHandlerInput,
  type CrawleeOneErrorHandlerOptions,
  type CrawleeOneIO,
  type CrawleeOneKeyValueStore,
  type CrawleeOneRequestQueue,
  type ExtractErrorHandlerOptionsReport,
  type ExtractIOReport,
} from './lib/integrations/types.js';
export {
  createLlmModelCompareCrawler,
  type LlmModelCompareCrawlerOptions,
  type LlmModelCompareDatasetItem,
} from './lib/llmCompare/compareCrawler.js';
export {
  type LlmModelCompareConfig,
  type LlmModelCompareReport,
  type LlmModelCompareReportEntry,
} from './lib/llmCompare/types.js';
export {
  type LlmModelComparisonOptions,
  runLlmModelComparison,
} from './lib/llmCompare/comparison.js';
export {
  orchestrate,
  type OrchestratedCrawler,
  type OrchestratedCrawlerInstance,
} from './lib/orchestrate.js';
export { createSentryTelemetry } from './lib/telemetry/sentry.js';
export { type CrawleeOneTelemetry } from './lib/telemetry/types.js';
// TODO - Review errorHandler exports - Not really used anywhere, but the API around error handling
//        is not finalized yet, so exporting it for now. Might be removed in the future.
export {
  type CaptureError,
  captureError,
  type CaptureErrorInput,
  captureErrorRouteHandler,
  captureErrorWrapper,
  createErrorHandler,
} from './lib/error/errorHandler.js';

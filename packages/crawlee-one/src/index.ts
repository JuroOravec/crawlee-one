// Main API
export { crawleeOne, createHttpCrawlerOptions, type CrawleeOneOptions } from './lib/actor/actor.js';

// Low-level API + types + helpers
export type { CrawlerUrl, CrawlerType, CrawlerMeta, HttpResponse, SampleUrlItem } from './types.js';
export type {
  PickPartial,
  PickRequired,
  MaybeArray,
  ArrVal,
  MaybePromise,
  MaybeAsyncFn,
} from './utils/types.js';
export {
  type InputFromFields,
  type CrawleeOneActorInst,
  type CrawleeOneActorDefWithInput,
  type CrawleeOneActorDef,
  type CrawleeOneHookFn,
  type CrawleeOneHookCtx,
  type CrawleeOneActorRouterCtx,
  type CrawleeOneCtx,
  type Metamorph,
} from './lib/actor/types.js';
export {
  type ActorInput,
  type CrawlerConfigActorInput,
  type InputActorInput,
  type PerfActorInput,
  type StartUrlsActorInput,
  type LoggingActorInput,
  type ProxyActorInput,
  type RequestActorInput,
  type OutputActorInput,
  type LlmActorInput,
  type MetamorphActorInput,
  type PrivacyActorInput,
  inputInput,
  crawlerInput,
  perfInput,
  startUrlsInput,
  loggingInput,
  proxyInput,
  privacyInput,
  requestInput,
  outputInput,
  metamorphInput,
  actorInput,
} from './lib/input.js';
export { type PushDataOptions, type PrivacyFilter, type PrivacyMask } from './lib/io/pushData.js';
export { type PushRequestsOptions } from './lib/io/pushRequests.js';
export {
  type CrawleeOneRouteCtx,
  type CrawleeOneRouteHandler,
  type CrawleeOneRouteWrapper,
  type CrawleeOneRoute,
  type CrawleeOneRouteMatcher,
  type CrawleeOneRouteMatcherFn,
} from './lib/router/types.js';
export {
  type ReadmeRenderer,
  type CrawlersRecord,
  type CrawleeOneConfigGenerate,
  type CrawleeOneConfig,
  type CrawleeOneConfigTypes,
  type CrawleeOneConfigActor,
  type CrawleeOneConfigActorSpec,
  type CrawleeOneConfigReadme,
  type CrawleeOneConfigSchema,
  type CrawleeOneConfigSchemaCrawler,
  type CrawleeOneConfigRunOptions,
  type CrawleeOneConfigRunMetaOptions,
  type CrawleeOneConfigRun,
  type LlmCompareReportDefinition,
  defineCrawler,
  defineConfig,
} from './lib/config/types.js';
export { startPreviewServer, type PreviewServerOptions } from './lib/preview/server.js';
export { runExport, type ExportOptions, type ExportResult } from './lib/export/runExport.js';
export { defaultReadmeRenderer, type DefaultReadmeInput } from './lib/generate/defaultRenderer.js';
export {
  extractWithLlm,
  type ExtractWithLlmOptions,
  type ExtractWithLlmResult,
  type LlmExtractionMetadata,
} from './lib/llmExtract/extractWithLlm.js';
export {
  type ExtractWithLlmScopedOptions,
  type LlmExtractionResult,
  type LlmExtractionMeta,
} from './lib/llmExtract/extractWithLlmScoped.js';
export { createLlmCrawler } from './lib/llmExtract/llmCrawler.js';
export { logLevelHandlerWrapper, type LogLevel, logLevelToCrawlee } from './lib/log.js';
export {
  type ApifyCrawleeOneIO,
  apifyIO,
  type ApifyErrorReport,
  type ApifyEntryMetadata,
} from './lib/integrations/apify.js';
export {
  type CrawleeOneIO,
  type CrawleeOneDataset,
  type CrawleeOneRequestQueue,
  type CrawleeOneKeyValueStore,
  type ExtractErrorHandlerOptionsReport,
  type ExtractIOReport,
  type CrawleeOneErrorHandlerOptions,
  type CrawleeOneErrorHandlerInput,
} from './lib/integrations/types.js';
export { type CrawleeOneTelemetry } from './lib/telemetry/types.js';
export { createSentryTelemetry } from './lib/telemetry/sentry.js';
export { writeReportHtml, type WriteReportHtmlOptions } from './lib/llmCompare/reportHtml.js';
export {
  createLlmModelCompareCrawler,
  type LlmModelCompareCrawlerOptions,
  type LlmModelCompareDatasetItem,
} from './lib/llmCompare/compareCrawler.js';
export {
  type LlmModelCompareReport,
  type LlmModelCompareReportEntry,
  type LlmModelCompareConfig,
} from './lib/llmCompare/types.js';
export {
  runLlmModelComparison,
  type LlmModelComparisonOptions,
} from './lib/llmCompare/comparison.js';
export {
  orchestrate,
  type OrchestratedCrawler,
  type OrchestratedCrawlerInstance,
} from './lib/orchestrate.js';
// TODO - Review errorHandler exports - Not really used anywhere, but the API around error handling
//        is not finalized yet, so exporting it for now. Might be removed in the future.
export {
  createErrorHandler,
  captureErrorRouteHandler,
  captureErrorWrapper,
  captureError,
  type CaptureErrorInput,
  type CaptureError,
} from './lib/error/errorHandler.js';

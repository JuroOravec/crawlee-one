[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / actorInput

# Variable: actorInput

> `const` **actorInput**: `object`

Defined in: [packages/crawlee-one/src/lib/input.ts:1236](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L1236)

## Type Declaration

### additionalMimeTypes

> **additionalMimeTypes**: `ArrayField`\<`unknown`, `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>\>

### batchSize

> **batchSize**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### batchWaitSecs

> **batchWaitSecs**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### errorReportingDatasetId

> **errorReportingDatasetId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### errorTelemetry

> **errorTelemetry**: `BooleanField`\<`boolean`, `ZodOptional`\<`ZodBoolean`\>\>

### forceResponseEncoding

> **forceResponseEncoding**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### ignoreSslErrors

> **ignoreSslErrors**: `BooleanField`\<`boolean`, `ZodOptional`\<`ZodBoolean`\>\>

### includePersonalData

> **includePersonalData**: `BooleanField`\<`boolean`, `ZodOptional`\<`ZodBoolean`\>\>

### inputExtendFromFunction

> **inputExtendFromFunction**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### inputExtendUrl

> **inputExtendUrl**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### keepAlive

> **keepAlive**: `BooleanField`\<`boolean`, `ZodOptional`\<`ZodBoolean`\>\>

### llmApiKey

> **llmApiKey**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### llmBaseUrl

> **llmBaseUrl**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### llmHeaders

> **llmHeaders**: `ObjectField`\<`object`, `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>\>

### llmKeyValueStoreId

> **llmKeyValueStoreId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### llmModel

> **llmModel**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### llmProvider

> **llmProvider**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### llmQueueDrainCheckIntervalMs

> **llmQueueDrainCheckIntervalMs**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### llmRequestQueueId

> **llmRequestQueueId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### logLevel

> **logLevel**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodEnum`\<\[`"debug"`, `"info"`, `"warn"`, `"error"`, `"off"`\]\>\>\>

### maxConcurrency

> **maxConcurrency**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxCrawlDepth

> **maxCrawlDepth**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxRequestRetries

> **maxRequestRetries**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxRequestsPerCrawl

> **maxRequestsPerCrawl**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxRequestsPerMinute

> **maxRequestsPerMinute**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### metamorphActorBuild

> **metamorphActorBuild**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### metamorphActorId

> **metamorphActorId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### metamorphActorInput

> **metamorphActorInput**: `ObjectField`\<\{ `uploadDatasetToGDrive`: `boolean`; \}, `ZodOptional`\<`ZodObject`\<\{ \}, `"passthrough"`, `ZodTypeAny`, `objectOutputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>, `objectInputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>\>\>\>

### minConcurrency

> **minConcurrency**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### navigationTimeoutSecs

> **navigationTimeoutSecs**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### outputCacheActionOnResult

> **outputCacheActionOnResult**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodEnum`\<\[`"add"`, `"remove"`, `"overwrite"`\]\>\>\>

### outputCachePrimaryKeys

> **outputCachePrimaryKeys**: `ArrayField`\<`string`[], `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>\>

### outputCacheStoreId

> **outputCacheStoreId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputDatasetId

> **outputDatasetId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputFilter

> **outputFilter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputFilterAfter

> **outputFilterAfter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputFilterBefore

> **outputFilterBefore**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputMaxEntries

> **outputMaxEntries**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### outputPickFields

> **outputPickFields**: `ArrayField`\<`string`[], `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>\>

### outputRenameFields

> **outputRenameFields**: `ObjectField`\<\{ `oldFieldName`: `string`; \}, `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>\>

### outputTransform

> **outputTransform**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputTransformAfter

> **outputTransformAfter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputTransformBefore

> **outputTransformBefore**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### proxy

> **proxy**: `ObjectField`\<`object`, `ZodOptional`\<`ZodObject`\<\{ \}, `"passthrough"`, `ZodTypeAny`, `objectOutputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>, `objectInputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>\>\>\>

### requestFilter

> **requestFilter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### requestFilterAfter

> **requestFilterAfter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### requestFilterBefore

> **requestFilterBefore**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### requestHandlerTimeoutSecs

> **requestHandlerTimeoutSecs**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### requestMaxEntries

> **requestMaxEntries**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### requestQueueId

> **requestQueueId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### requestTransform

> **requestTransform**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### requestTransformAfter

> **requestTransformAfter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### requestTransformBefore

> **requestTransformBefore**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### startUrls

> **startUrls**: `ArrayField`\<`unknown`, `ZodOptional`\<`ZodArray`\<`ZodUnion`\<\[`ZodString`, `ZodObject`\<\{ \}, `"passthrough"`, `ZodTypeAny`, `objectOutputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>, `objectInputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>\>\]\>, `"many"`\>\>\>

### startUrlsFromDataset

> **startUrlsFromDataset**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### startUrlsFromFunction

> **startUrlsFromFunction**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodUnion`\<\[`ZodString`, `ZodFunction`\<`ZodTuple`\<\[\], `ZodUnknown`\>, `ZodUnknown`\>\]\>\>\>

### suggestResponseEncoding

> **suggestResponseEncoding**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

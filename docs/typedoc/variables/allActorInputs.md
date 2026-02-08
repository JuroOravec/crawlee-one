[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / allActorInputs

# Variable: allActorInputs

> `const` **allActorInputs**: `object`

## Type declaration

### additionalMimeTypes

> **additionalMimeTypes**: `ArrayField`\<`any`[]\>

### errorReportingDatasetId

> **errorReportingDatasetId**: `StringField`\<`string`, `string`\>

### errorTelemetry

> **errorTelemetry**: `BooleanField`\<`boolean`\>

### forceResponseEncoding

> **forceResponseEncoding**: `StringField`\<`string`, `string`\>

### ignoreSslErrors

> **ignoreSslErrors**: `BooleanField`\<`boolean`\>

### includePersonalData

> **includePersonalData**: `BooleanField`\<`boolean`\>

### inputExtendFromFunction

> **inputExtendFromFunction**: `StringField`\<`string`, `string`\>

### inputExtendUrl

> **inputExtendUrl**: `StringField`\<`string`, `string`\>

### keepAlive

> **keepAlive**: `BooleanField`\<`boolean`\>

### logLevel

> **logLevel**: `StringField`\<`"error"` \| `"debug"` \| `"info"` \| `"warn"` \| `"off"`, `string`\>

### maxConcurrency

> **maxConcurrency**: `IntegerField`\<`number`, `string`\>

### maxCrawlDepth

> **maxCrawlDepth**: `IntegerField`\<`number`, `string`\>

### maxRequestRetries

> **maxRequestRetries**: `IntegerField`\<`number`, `string`\>

### maxRequestsPerCrawl

> **maxRequestsPerCrawl**: `IntegerField`\<`number`, `string`\>

### maxRequestsPerMinute

> **maxRequestsPerMinute**: `IntegerField`\<`number`, `string`\>

### metamorphActorBuild

> **metamorphActorBuild**: `StringField`\<`string`, `string`\>

### metamorphActorId

> **metamorphActorId**: `StringField`\<`string`, `string`\>

### metamorphActorInput

> **metamorphActorInput**: `ObjectField`\<`object`\>

#### Type declaration

##### uploadDatasetToGDrive

> **uploadDatasetToGDrive**: `boolean` = `true`

### minConcurrency

> **minConcurrency**: `IntegerField`\<`number`, `string`\>

### navigationTimeoutSecs

> **navigationTimeoutSecs**: `IntegerField`\<`number`, `string`\>

### outputCacheActionOnResult

> **outputCacheActionOnResult**: `StringField`\<`NonNullable`\<`undefined` \| `null` \| `"add"` \| `"remove"` \| `"overwrite"`\>, `string`\>

### outputCachePrimaryKeys

> **outputCachePrimaryKeys**: `ArrayField`\<`string`[]\>

### outputCacheStoreId

> **outputCacheStoreId**: `StringField`\<`string`, `string`\>

### outputDatasetId

> **outputDatasetId**: `StringField`\<`string`, `string`\>

### outputFilter

> **outputFilter**: `StringField`\<`string`, `string`\>

### outputFilterAfter

> **outputFilterAfter**: `StringField`\<`string`, `string`\>

### outputFilterBefore

> **outputFilterBefore**: `StringField`\<`string`, `string`\>

### outputMaxEntries

> **outputMaxEntries**: `IntegerField`\<`number`, `string`\>

### outputPickFields

> **outputPickFields**: `ArrayField`\<`string`[]\>

### outputRenameFields

> **outputRenameFields**: `ObjectField`\<`object`\>

#### Type declaration

##### oldFieldName

> **oldFieldName**: `string` = `'newFieldName'`

### outputTransform

> **outputTransform**: `StringField`\<`string`, `string`\>

### outputTransformAfter

> **outputTransformAfter**: `StringField`\<`string`, `string`\>

### outputTransformBefore

> **outputTransformBefore**: `StringField`\<`string`, `string`\>

### perfBatchSize

> **perfBatchSize**: `IntegerField`\<`number`, `string`\>

### perfBatchWaitSecs

> **perfBatchWaitSecs**: `IntegerField`\<`number`, `string`\>

### proxy

> **proxy**: `ObjectField`\<`object`\>

### requestFilter

> **requestFilter**: `StringField`\<`string`, `string`\>

### requestFilterAfter

> **requestFilterAfter**: `StringField`\<`string`, `string`\>

### requestFilterBefore

> **requestFilterBefore**: `StringField`\<`string`, `string`\>

### requestHandlerTimeoutSecs

> **requestHandlerTimeoutSecs**: `IntegerField`\<`number`, `string`\>

### requestMaxEntries

> **requestMaxEntries**: `IntegerField`\<`number`, `string`\>

### requestQueueId

> **requestQueueId**: `StringField`\<`string`, `string`\>

### requestTransform

> **requestTransform**: `StringField`\<`string`, `string`\>

### requestTransformAfter

> **requestTransformAfter**: `StringField`\<`string`, `string`\>

### requestTransformBefore

> **requestTransformBefore**: `StringField`\<`string`, `string`\>

### startUrls

> **startUrls**: `ArrayField`\<`any`[]\>

### startUrlsFromDataset

> **startUrlsFromDataset**: `StringField`\<`string`, `string`\>

### startUrlsFromFunction

> **startUrlsFromFunction**: `StringField`\<`string`, `string`\>

### suggestResponseEncoding

> **suggestResponseEncoding**: `StringField`\<`string`, `string`\>

## Source

[src/lib/input.ts:1041](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L1041)

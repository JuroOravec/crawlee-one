[crawlee-one](README.md) / Exports

# crawlee-one

## Table of contents

### Interfaces

- [ApifyEntryMetadata](interfaces/ApifyEntryMetadata.md)
- [ApifyErrorReport](interfaces/ApifyErrorReport.md)
- [CrawleeOneActorDef](interfaces/CrawleeOneActorDef.md)
- [CrawleeOneActorInst](interfaces/CrawleeOneActorInst.md)
- [CrawleeOneArgs](interfaces/CrawleeOneArgs.md)
- [CrawleeOneConfig](interfaces/CrawleeOneConfig.md)
- [CrawleeOneConfigSchema](interfaces/CrawleeOneConfigSchema.md)
- [CrawleeOneConfigSchemaCrawler](interfaces/CrawleeOneConfigSchemaCrawler.md)
- [CrawleeOneCtx](interfaces/CrawleeOneCtx.md)
- [CrawleeOneDataset](interfaces/CrawleeOneDataset.md)
- [CrawleeOneErrorHandlerInput](interfaces/CrawleeOneErrorHandlerInput.md)
- [CrawleeOneErrorHandlerOptions](interfaces/CrawleeOneErrorHandlerOptions.md)
- [CrawleeOneIO](interfaces/CrawleeOneIO.md)
- [CrawleeOneKeyValueStore](interfaces/CrawleeOneKeyValueStore.md)
- [CrawleeOneRequestQueue](interfaces/CrawleeOneRequestQueue.md)
- [CrawleeOneRoute](interfaces/CrawleeOneRoute.md)
- [CrawleeOneTelemetry](interfaces/CrawleeOneTelemetry.md)
- [DatasetSizeMonitorOptions](interfaces/DatasetSizeMonitorOptions.md)
- [InputActorInput](interfaces/InputActorInput.md)
- [ListingFiltersSetupOptions](interfaces/ListingFiltersSetupOptions.md)
- [ListingLogger](interfaces/ListingLogger.md)
- [ListingPageFilter](interfaces/ListingPageFilter.md)
- [ListingPageScraperContext](interfaces/ListingPageScraperContext.md)
- [ListingPageScraperOptions](interfaces/ListingPageScraperOptions.md)
- [LoggingActorInput](interfaces/LoggingActorInput.md)
- [MetamorphActorInput](interfaces/MetamorphActorInput.md)
- [Migration](interfaces/Migration.md)
- [OutputActorInput](interfaces/OutputActorInput.md)
- [PerfActorInput](interfaces/PerfActorInput.md)
- [PrivacyActorInput](interfaces/PrivacyActorInput.md)
- [ProxyActorInput](interfaces/ProxyActorInput.md)
- [PushDataOptions](interfaces/PushDataOptions.md)
- [PushRequestsOptions](interfaces/PushRequestsOptions.md)
- [RequestActorInput](interfaces/RequestActorInput.md)
- [RequestQueueSizeMonitorOptions](interfaces/RequestQueueSizeMonitorOptions.md)
- [RunCrawleeOneOptions](interfaces/RunCrawleeOneOptions.md)
- [StartUrlsActorInput](interfaces/StartUrlsActorInput.md)

### Type Aliases

- [AllActorInputs](modules.md#allactorinputs)
- [ApifyCrawleeOneIO](modules.md#apifycrawleeoneio)
- [ArrVal](modules.md#arrval)
- [CaptureError](modules.md#captureerror)
- [CaptureErrorInput](modules.md#captureerrorinput)
- [CrawleeOneActorDefWithInput](modules.md#crawleeoneactordefwithinput)
- [CrawleeOneActorRouterCtx](modules.md#crawleeoneactorrouterctx)
- [CrawleeOneHookCtx](modules.md#crawleeonehookctx)
- [CrawleeOneHookFn](modules.md#crawleeonehookfn)
- [CrawleeOneRouteCtx](modules.md#crawleeoneroutectx)
- [CrawleeOneRouteHandler](modules.md#crawleeoneroutehandler)
- [CrawleeOneRouteMatcher](modules.md#crawleeoneroutematcher)
- [CrawleeOneRouteMatcherFn](modules.md#crawleeoneroutematcherfn)
- [CrawleeOneRouteWrapper](modules.md#crawleeoneroutewrapper)
- [CrawlerConfigActorInput](modules.md#crawlerconfigactorinput)
- [CrawlerType](modules.md#crawlertype)
- [CrawlerUrl](modules.md#crawlerurl)
- [ExtractErrorHandlerOptionsReport](modules.md#extracterrorhandleroptionsreport)
- [ExtractIOReport](modules.md#extractioreport)
- [GenRedactedValue](modules.md#genredactedvalue)
- [LogLevel](modules.md#loglevel)
- [MaybeArray](modules.md#maybearray)
- [MaybeAsyncFn](modules.md#maybeasyncfn)
- [MaybePromise](modules.md#maybepromise)
- [Metamorph](modules.md#metamorph)
- [OnBatchAddRequests](modules.md#onbatchaddrequests)
- [OnBatchAddRequestsArgs](modules.md#onbatchaddrequestsargs)
- [PickPartial](modules.md#pickpartial)
- [PickRequired](modules.md#pickrequired)
- [PrivacyFilter](modules.md#privacyfilter)
- [PrivacyMask](modules.md#privacymask)
- [RunCrawler](modules.md#runcrawler)

### Variables

- [LOG\_LEVEL](modules.md#log_level)
- [allActorInputValidationFields](modules.md#allactorinputvalidationfields)
- [allActorInputs](modules.md#allactorinputs-1)
- [apifyIO](modules.md#apifyio)
- [crawlerInput](modules.md#crawlerinput)
- [crawlerInputValidationFields](modules.md#crawlerinputvalidationfields)
- [inputInput](modules.md#inputinput)
- [inputInputValidationFields](modules.md#inputinputvalidationfields)
- [logLevelToCrawlee](modules.md#logleveltocrawlee)
- [loggingInput](modules.md#logginginput)
- [loggingInputValidationFields](modules.md#logginginputvalidationfields)
- [metamorphInput](modules.md#metamorphinput)
- [metamorphInputValidationFields](modules.md#metamorphinputvalidationfields)
- [outputInput](modules.md#outputinput)
- [outputInputValidationFields](modules.md#outputinputvalidationfields)
- [perfInput](modules.md#perfinput)
- [perfInputValidationFields](modules.md#perfinputvalidationfields)
- [privacyInput](modules.md#privacyinput)
- [privacyInputValidationFields](modules.md#privacyinputvalidationfields)
- [proxyInput](modules.md#proxyinput)
- [proxyInputValidationFields](modules.md#proxyinputvalidationfields)
- [requestInput](modules.md#requestinput)
- [requestInputValidationFields](modules.md#requestinputvalidationfields)
- [startUrlsInput](modules.md#starturlsinput)
- [startUrlsInputValidationFields](modules.md#starturlsinputvalidationfields)

### Functions

- [basicCaptureErrorRouteHandler](modules.md#basiccaptureerrorroutehandler)
- [captureError](modules.md#captureerror-1)
- [captureErrorRouteHandler](modules.md#captureerrorroutehandler)
- [captureErrorWrapper](modules.md#captureerrorwrapper)
- [cheerioCaptureErrorRouteHandler](modules.md#cheeriocaptureerrorroutehandler)
- [crawleeOne](modules.md#crawleeone)
- [createErrorHandler](modules.md#createerrorhandler)
- [createHttpCrawlerOptions](modules.md#createhttpcrawleroptions)
- [createLocalMigrationState](modules.md#createlocalmigrationstate)
- [createLocalMigrator](modules.md#createlocalmigrator)
- [createMockClientDataset](modules.md#createmockclientdataset)
- [createMockClientRequestQueue](modules.md#createmockclientrequestqueue)
- [createMockDatasetCollectionClient](modules.md#createmockdatasetcollectionclient)
- [createMockKeyValueStoreClient](modules.md#createmockkeyvaluestoreclient)
- [createMockRequestQueueClient](modules.md#createmockrequestqueueclient)
- [createMockStorageClient](modules.md#createmockstorageclient)
- [createMockStorageDataset](modules.md#createmockstoragedataset)
- [createSentryTelemetry](modules.md#createsentrytelemetry)
- [datasetSizeMonitor](modules.md#datasetsizemonitor)
- [generateTypes](modules.md#generatetypes)
- [getColumnFromDataset](modules.md#getcolumnfromdataset)
- [getDatasetCount](modules.md#getdatasetcount)
- [httpCaptureErrorRouteHandler](modules.md#httpcaptureerrorroutehandler)
- [itemCacheKey](modules.md#itemcachekey)
- [jsdomCaptureErrorRouteHandler](modules.md#jsdomcaptureerrorroutehandler)
- [loadConfig](modules.md#loadconfig)
- [logLevelHandlerWrapper](modules.md#loglevelhandlerwrapper)
- [playwrightCaptureErrorRouteHandler](modules.md#playwrightcaptureerrorroutehandler)
- [puppeteerCaptureErrorRouteHandler](modules.md#puppeteercaptureerrorroutehandler)
- [pushData](modules.md#pushdata)
- [pushRequests](modules.md#pushrequests)
- [registerHandlers](modules.md#registerhandlers)
- [requestQueueSizeMonitor](modules.md#requestqueuesizemonitor)
- [runCrawleeOne](modules.md#runcrawleeone)
- [runCrawlerTest](modules.md#runcrawlertest)
- [scrapeListingEntries](modules.md#scrapelistingentries)
- [setupDefaultHandlers](modules.md#setupdefaulthandlers)
- [setupMockApifyActor](modules.md#setupmockapifyactor)
- [validateConfig](modules.md#validateconfig)

## Type Aliases

### AllActorInputs

Ƭ **AllActorInputs**: [`InputActorInput`](interfaces/InputActorInput.md) & [`CrawlerConfigActorInput`](modules.md#crawlerconfigactorinput) & [`PerfActorInput`](interfaces/PerfActorInput.md) & [`StartUrlsActorInput`](interfaces/StartUrlsActorInput.md) & [`LoggingActorInput`](interfaces/LoggingActorInput.md) & [`ProxyActorInput`](interfaces/ProxyActorInput.md) & [`PrivacyActorInput`](interfaces/PrivacyActorInput.md) & [`RequestActorInput`](interfaces/RequestActorInput.md) & [`OutputActorInput`](interfaces/OutputActorInput.md) & [`MetamorphActorInput`](interfaces/MetamorphActorInput.md)

#### Defined in

src/lib/input.ts:17

___

### ApifyCrawleeOneIO

Ƭ **ApifyCrawleeOneIO**: [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`ApifyEnv`, [`ApifyErrorReport`](interfaces/ApifyErrorReport.md), [`ApifyEntryMetadata`](interfaces/ApifyEntryMetadata.md)\>

Integration between CrawleeOne and Apify.

This is the default integration.

#### Defined in

[src/lib/integrations/apify.ts:39](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/apify.ts#L39)

___

### ArrVal

Ƭ **ArrVal**<`T`\>: `T`[`number`]

Unwrap Array to its item(s)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] \| readonly `any`[] |

#### Defined in

[src/utils/types.ts:9](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/utils/types.ts#L9)

___

### CaptureError

Ƭ **CaptureError**: (`input`: [`CaptureErrorInput`](modules.md#captureerrorinput)) => [`MaybePromise`](modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`input`): [`MaybePromise`](modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CaptureErrorInput`](modules.md#captureerrorinput) |

##### Returns

[`MaybePromise`](modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/error/errorHandler.ts:24](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L24)

___

### CaptureErrorInput

Ƭ **CaptureErrorInput**: [`PickRequired`](modules.md#pickrequired)<`Partial`<[`CrawleeOneErrorHandlerInput`](interfaces/CrawleeOneErrorHandlerInput.md)\>, ``"error"``\>

#### Defined in

[src/lib/error/errorHandler.ts:23](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L23)

___

### CrawleeOneActorDefWithInput

Ƭ **CrawleeOneActorDefWithInput**<`T`\>: `Omit`<[`CrawleeOneActorDef`](interfaces/CrawleeOneActorDef.md)<`T`\>, ``"input"``\> & { `input`: `T`[``"input"``] \| ``null`` ; `state`: `Record`<`string`, `unknown`\>  }

CrawleeOneActorDef object where the input is already resolved

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |

#### Defined in

[src/lib/actor/types.ts:280](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/types.ts#L280)

___

### CrawleeOneActorRouterCtx

Ƭ **CrawleeOneActorRouterCtx**<`T`\>: `Object`

Context passed from actor to route handlers

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `actor` | [`CrawleeOneActorInst`](interfaces/CrawleeOneActorInst.md)<`T`\> | - |
| `metamorph` | [`Metamorph`](modules.md#metamorph) | Trigger actor metamorph, using actor's inputs as defaults. |
| `pushData` | <T\>(`oneOrManyItems`: `T` \| `T`[], `options`: [`PushDataOptions`](interfaces/PushDataOptions.md)<`T`\>) => `Promise`<`any`[]\> | `Actor.pushData` with extra optional features: - Limit the number of entries pushed to the Dataset based on the Actor input - Transform and filter entries via Actor input. - Add metadata to entries before they are pushed to Dataset. - Set which (nested) properties are personal data optionally redact them for privacy compliance. |
| `pushRequests` | <T\>(`oneOrManyItems`: `T` \| `T`[], `options?`: [`PushRequestsOptions`](interfaces/PushRequestsOptions.md)<`T`\>) => `Promise`<`any`[]\> | Similar to `Actor.openRequestQueue().addRequests`, but with extra features: - Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit. - Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue. |

#### Defined in

[src/lib/actor/types.ts:75](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/types.ts#L75)

___

### CrawleeOneHookCtx

Ƭ **CrawleeOneHookCtx**<`T`\>: `Pick`<[`CrawleeOneActorInst`](interfaces/CrawleeOneActorInst.md)<`T`\>, ``"input"`` \| ``"state"``\> & { `io`: `T`[``"io"``] ; `itemCacheKey`: typeof [`itemCacheKey`](modules.md#itemcachekey) ; `sendRequest`: typeof `gotScraping`  }

Context passed to user-defined functions passed from input

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |

#### Defined in

[src/lib/actor/types.ts:104](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/types.ts#L104)

___

### CrawleeOneHookFn

Ƭ **CrawleeOneHookFn**<`TArgs`, `TReturn`, `T`\>: (...`args`: [...TArgs, [`CrawleeOneHookCtx`](modules.md#crawleeonehookctx)<`T`\>]) => [`MaybePromise`](modules.md#maybepromise)<`TReturn`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TArgs` | extends `any`[] = [] |
| `TReturn` | `void` |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) = [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |

#### Type declaration

▸ (`...args`): [`MaybePromise`](modules.md#maybepromise)<`TReturn`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [...TArgs, [`CrawleeOneHookCtx`](modules.md#crawleeonehookctx)<`T`\>] |

##### Returns

[`MaybePromise`](modules.md#maybepromise)<`TReturn`\>

#### Defined in

[src/lib/actor/types.ts:129](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/types.ts#L129)

___

### CrawleeOneRouteCtx

Ƭ **CrawleeOneRouteCtx**<`T`, `RouterCtx`\>: `Parameters`<`Parameters`<`CrawlerRouter`<`T`[``"context"``] & `RouterCtx`\>[``"addHandler"``]\>[``1``]\>[``0``]

Context object provided in CrawlerRouter

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |
| `RouterCtx` | extends `Record`<`string`, `any`\> = {} |

#### Defined in

[src/lib/router/types.ts:7](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/router/types.ts#L7)

___

### CrawleeOneRouteHandler

Ƭ **CrawleeOneRouteHandler**<`T`, `RouterCtx`\>: `Parameters`<`CrawlerRouter`<`T`[``"context"``] & `RouterCtx`\>[``"addHandler"``]\>[``1``]

Function that's passed to `router.addHandler(label, handler)`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\> |

#### Defined in

[src/lib/router/types.ts:13](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/router/types.ts#L13)

___

### CrawleeOneRouteMatcher

Ƭ **CrawleeOneRouteMatcher**<`T`, `RouterCtx`\>: [`MaybeArray`](modules.md#maybearray)<`RegExp` \| [`CrawleeOneRouteMatcherFn`](modules.md#crawleeoneroutematcherfn)<`T`, `RouterCtx`\>\>

Function or RegExp that checks if the [CrawleeOneRoute](interfaces/CrawleeOneRoute.md) this Matcher belongs to
should handle the given request.

If the Matcher returns truthy value, the request is passed to the `action`
function of the same CrawleeOneRoute.

The Matcher can be:
- Regular expression
- Function
- Array of <RegExp | Function>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\> |

#### Defined in

[src/lib/router/types.ts:56](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/router/types.ts#L56)

___

### CrawleeOneRouteMatcherFn

Ƭ **CrawleeOneRouteMatcherFn**<`T`, `RouterCtx`\>: (`url`: `string`, `ctx`: [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`, `RouterCtx`\>, `route`: [`CrawleeOneRoute`](interfaces/CrawleeOneRoute.md)<`T`, `RouterCtx`\>, `routes`: `Record`<`T`[``"labels"``], [`CrawleeOneRoute`](interfaces/CrawleeOneRoute.md)<`T`, `RouterCtx`\>\>) => `unknown`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\> |

#### Type declaration

▸ (`url`, `ctx`, `route`, `routes`): `unknown`

Function variant of Matcher. Matcher that checks if the [CrawleeOneRoute](interfaces/CrawleeOneRoute.md)
this Matcher belongs to should handle the given request.

If the Matcher returns truthy value, the request is passed to the `action`
function of the same CrawleeOneRoute.

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `ctx` | [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`, `RouterCtx`\> |
| `route` | [`CrawleeOneRoute`](interfaces/CrawleeOneRoute.md)<`T`, `RouterCtx`\> |
| `routes` | `Record`<`T`[``"labels"``], [`CrawleeOneRoute`](interfaces/CrawleeOneRoute.md)<`T`, `RouterCtx`\>\> |

##### Returns

`unknown`

#### Defined in

[src/lib/router/types.ts:68](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/router/types.ts#L68)

___

### CrawleeOneRouteWrapper

Ƭ **CrawleeOneRouteWrapper**<`T`, `RouterCtx`\>: (`handler`: (`ctx`: [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`, `RouterCtx`\>) => `Promise`<`void`\> \| `Awaitable`<`void`\>) => [`MaybePromise`](modules.md#maybepromise)<(`ctx`: [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`, `RouterCtx`\>) => `Promise`<`void`\> \| `Awaitable`<`void`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md) |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\> |

#### Type declaration

▸ (`handler`): [`MaybePromise`](modules.md#maybepromise)<(`ctx`: [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`, `RouterCtx`\>) => `Promise`<`void`\> \| `Awaitable`<`void`\>\>

Wrapper that modifies behavior of CrawleeOneRouteHandler

##### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | (`ctx`: [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`, `RouterCtx`\>) => `Promise`<`void`\> \| `Awaitable`<`void`\> |

##### Returns

[`MaybePromise`](modules.md#maybepromise)<(`ctx`: [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`, `RouterCtx`\>) => `Promise`<`void`\> \| `Awaitable`<`void`\>\>

#### Defined in

[src/lib/router/types.ts:19](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/router/types.ts#L19)

___

### CrawlerConfigActorInput

Ƭ **CrawlerConfigActorInput**: `Pick`<`CheerioCrawlerOptions`, ``"navigationTimeoutSecs"`` \| ``"ignoreSslErrors"`` \| ``"additionalMimeTypes"`` \| ``"suggestResponseEncoding"`` \| ``"forceResponseEncoding"`` \| ``"requestHandlerTimeoutSecs"`` \| ``"maxRequestRetries"`` \| ``"maxRequestsPerCrawl"`` \| ``"maxRequestsPerMinute"`` \| ``"minConcurrency"`` \| ``"maxConcurrency"`` \| ``"keepAlive"``\>

Crawler config fields that can be overriden from the actor input

#### Defined in

src/lib/input.ts:29

___

### CrawlerType

Ƭ **CrawlerType**: [`ArrVal`](modules.md#arrval)<typeof `CRAWLER_TYPE`\>

#### Defined in

src/types/index.ts:35

___

### CrawlerUrl

Ƭ **CrawlerUrl**: `NonNullable`<`Parameters`<`OrigRunCrawler`<`any`\>\>[``0``]\>[``0``]

URL string or object passed to Crawler.run

#### Defined in

src/types/index.ts:80

___

### ExtractErrorHandlerOptionsReport

Ƭ **ExtractErrorHandlerOptionsReport**<`T`\>: `T` extends [`CrawleeOneErrorHandlerOptions`](interfaces/CrawleeOneErrorHandlerOptions.md)<infer U\> ? [`ExtractIOReport`](modules.md#extractioreport)<`U`\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneErrorHandlerOptions`](interfaces/CrawleeOneErrorHandlerOptions.md)<`any`\> |

#### Defined in

[src/lib/integrations/types.ts:322](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L322)

___

### ExtractIOReport

Ƭ **ExtractIOReport**<`T`\>: `T` extends [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, infer U\> ? `U` : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`\> |

#### Defined in

[src/lib/integrations/types.ts:325](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L325)

___

### GenRedactedValue

Ƭ **GenRedactedValue**<`V`, `K`, `O`\>: (`val`: `V`, `key`: `K`, `obj`: `O`) => [`MaybePromise`](modules.md#maybepromise)<`any`\>

#### Type parameters

| Name |
| :------ |
| `V` |
| `K` |
| `O` |

#### Type declaration

▸ (`val`, `key`, `obj`): [`MaybePromise`](modules.md#maybepromise)<`any`\>

Functions that generates a "redacted" version of a value.

If you pass it a Promise, it will be resolved.

##### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `V` |
| `key` | `K` |
| `obj` | `O` |

##### Returns

[`MaybePromise`](modules.md#maybepromise)<`any`\>

#### Defined in

[src/lib/io/pushData.ts:15](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushData.ts#L15)

___

### LogLevel

Ƭ **LogLevel**: [`ArrVal`](modules.md#arrval)<typeof [`LOG_LEVEL`](modules.md#log_level)\>

#### Defined in

[src/lib/log.ts:8](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/log.ts#L8)

___

### MaybeArray

Ƭ **MaybeArray**<`T`\>: `T` \| `T`[]

Value or an array thereof

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/utils/types.ts:4](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/utils/types.ts#L4)

___

### MaybeAsyncFn

Ƭ **MaybeAsyncFn**<`R`, `Args`\>: `R` \| (...`args`: `Args`) => [`MaybePromise`](modules.md#maybepromise)<`R`\>

Value or (a)sync func that returns thereof

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `R` |
| `Args` | extends `any`[] |

#### Defined in

[src/utils/types.ts:6](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/utils/types.ts#L6)

___

### MaybePromise

Ƭ **MaybePromise**<`T`\>: `T` \| `Promise`<`T`\>

Value or a promise thereof

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/utils/types.ts:2](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/utils/types.ts#L2)

___

### Metamorph

Ƭ **Metamorph**: (`overrides?`: [`MetamorphActorInput`](interfaces/MetamorphActorInput.md)) => `Promise`<`void`\>

#### Type declaration

▸ (`overrides?`): `Promise`<`void`\>

Trigger actor metamorph, using actor's inputs as defaults.

##### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | [`MetamorphActorInput`](interfaces/MetamorphActorInput.md) |

##### Returns

`Promise`<`void`\>

#### Defined in

[src/lib/actor/types.ts:38](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/types.ts#L38)

___

### OnBatchAddRequests

Ƭ **OnBatchAddRequests**: (...`args`: [`OnBatchAddRequestsArgs`](modules.md#onbatchaddrequestsargs)) => [`MaybePromise`](modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`...args`): [`MaybePromise`](modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`OnBatchAddRequestsArgs`](modules.md#onbatchaddrequestsargs) |

##### Returns

[`MaybePromise`](modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/test/mockApifyClient.ts:31](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L31)

___

### OnBatchAddRequestsArgs

Ƭ **OnBatchAddRequestsArgs**: [requests: Omit<RequestQueueClientRequestSchema, "id"\>[], options?: RequestQueueClientBatchAddRequestWithRetriesOptions]

#### Defined in

[src/lib/test/mockApifyClient.ts:27](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L27)

___

### PickPartial

Ƭ **PickPartial**<`T`, `Keys`\>: `Omit`<`T`, `Keys`\> & `Partial`<`Pick`<`T`, `Keys`\>\>

Pick properties that should be optional

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |
| `Keys` | extends keyof `T` |

#### Defined in

[src/utils/types.ts:18](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/utils/types.ts#L18)

___

### PickRequired

Ƭ **PickRequired**<`T`, `Keys`\>: `Omit`<`T`, `Keys`\> & `Required`<`Pick`<`T`, `Keys`\>\>

Pick properties that should be required

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |
| `Keys` | extends keyof `T` |

#### Defined in

[src/utils/types.ts:21](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/utils/types.ts#L21)

___

### PrivacyFilter

Ƭ **PrivacyFilter**<`V`, `K`, `O`\>: `boolean` \| (`val`: `V`, `key`: `K`, `obj`: `O`, `options?`: { `setCustomRedactedValue`: (`val`: `V`) => `any`  }) => `any`

Determine if the property is considered private (and hence may be hidden for privacy reasons).

`PrivacyFilter` may be either boolean, or a function that returns truthy/falsy value.

Property is private if `true` or if the function returns truthy value.

The function receives the property value, its position, and parent object.

By default, when a property is redacted, its value is replaced with a string
that informs about the redaction. If you want different text or value to be used instead,
supply it to `setCustomRedactedValue`.

If the function returns a Promise, it will be awaited.

#### Type parameters

| Name |
| :------ |
| `V` |
| `K` |
| `O` |

#### Defined in

[src/lib/io/pushData.ts:32](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushData.ts#L32)

___

### PrivacyMask

Ƭ **PrivacyMask**<`T`\>: { [Key in keyof T]?: T[Key] extends Date \| any[] ? PrivacyFilter<T[Key], Key, T\> : T[Key] extends object ? PrivacyMask<T[Key]\> : PrivacyFilter<T[Key], Key, T\> }

PrivacyMask determines which (potentally nested) properties
of an object are considered private.

PrivacyMask copies the structure of another object, but each
non-object property on PrivacyMask is a PrivacyFilter - function
that determines if the property is considered private.

Property is private if the function returns truthy value.

If the function returns a Promise, it will be awaited.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Defined in

[src/lib/io/pushData.ts:55](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushData.ts#L55)

___

### RunCrawler

Ƭ **RunCrawler**<`Ctx`\>: (`requests?`: [`CrawlerUrl`](modules.md#crawlerurl)[], `options?`: `Parameters`<`OrigRunCrawler`<`Ctx`\>\>[``1``]) => `ReturnType`<`OrigRunCrawler`<`Ctx`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Ctx` | extends `CrawlingContext` = `CrawlingContext`<`BasicCrawler`\> |

#### Type declaration

▸ (`requests?`, `options?`): `ReturnType`<`OrigRunCrawler`<`Ctx`\>\>

Extended type of `crawler.run()` function

##### Parameters

| Name | Type |
| :------ | :------ |
| `requests?` | [`CrawlerUrl`](modules.md#crawlerurl)[] |
| `options?` | `Parameters`<`OrigRunCrawler`<`Ctx`\>\>[``1``] |

##### Returns

`ReturnType`<`OrigRunCrawler`<`Ctx`\>\>

#### Defined in

[src/lib/actor/types.ts:32](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/types.ts#L32)

## Variables

### LOG\_LEVEL

• `Const` **LOG\_LEVEL**: readonly [``"debug"``, ``"info"``, ``"warn"``, ``"error"``, ``"off"``]

#### Defined in

[src/lib/log.ts:7](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/log.ts#L7)

___

### allActorInputValidationFields

• `Const` **allActorInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `additionalMimeTypes` | `ArraySchema`<`any`[]\> |
| `errorReportingDatasetId` | `StringSchema`<`string`\> |
| `errorTelemetry` | `BooleanSchema`<`boolean`\> |
| `forceResponseEncoding` | `StringSchema`<`string`\> |
| `ignoreSslErrors` | `BooleanSchema`<`boolean`\> |
| `includePersonalData` | `BooleanSchema`<`boolean`\> |
| `inputExtendFromFunction` | `StringSchema`<`string`\> |
| `inputExtendUrl` | `StringSchema`<`string`\> |
| `keepAlive` | `BooleanSchema`<`boolean`\> |
| `logLevel` | `StringSchema`<`string`\> |
| `maxConcurrency` | `NumberSchema`<`number`\> |
| `maxRequestRetries` | `NumberSchema`<`number`\> |
| `maxRequestsPerCrawl` | `NumberSchema`<`number`\> |
| `maxRequestsPerMinute` | `NumberSchema`<`number`\> |
| `metamorphActorBuild` | `StringSchema`<`string`\> |
| `metamorphActorId` | `StringSchema`<`string`\> |
| `metamorphActorInput` | `ObjectSchema`<`any`\> |
| `minConcurrency` | `NumberSchema`<`number`\> |
| `navigationTimeoutSecs` | `NumberSchema`<`number`\> |
| `outputCacheActionOnResult` | `StringSchema`<`string`\> |
| `outputCachePrimaryKeys` | `ArraySchema`<`any`[]\> |
| `outputCacheStoreId` | `StringSchema`<`string`\> |
| `outputDatasetId` | `StringSchema`<`string`\> |
| `outputFilter` | `StringSchema`<`string`\> |
| `outputFilterAfter` | `StringSchema`<`string`\> |
| `outputFilterBefore` | `StringSchema`<`string`\> |
| `outputMaxEntries` | `NumberSchema`<`number`\> |
| `outputPickFields` | `ArraySchema`<`any`[]\> |
| `outputRenameFields` | `ObjectSchema`<`any`\> |
| `outputTransform` | `StringSchema`<`string`\> |
| `outputTransformAfter` | `StringSchema`<`string`\> |
| `outputTransformBefore` | `StringSchema`<`string`\> |
| `perfBatchSize` | `NumberSchema`<`number`\> |
| `perfBatchWaitSecs` | `NumberSchema`<`number`\> |
| `proxy` | `ObjectSchema`<`any`\> |
| `requestFilter` | `StringSchema`<`string`\> |
| `requestFilterAfter` | `StringSchema`<`string`\> |
| `requestFilterBefore` | `StringSchema`<`string`\> |
| `requestHandlerTimeoutSecs` | `NumberSchema`<`number`\> |
| `requestMaxEntries` | `NumberSchema`<`number`\> |
| `requestQueueId` | `StringSchema`<`string`\> |
| `requestTransform` | `StringSchema`<`string`\> |
| `requestTransformAfter` | `StringSchema`<`string`\> |
| `requestTransformBefore` | `StringSchema`<`string`\> |
| `startUrls` | `ArraySchema`<`any`[]\> |
| `startUrlsFromDataset` | `StringSchema`<`string`\> |
| `startUrlsFromFunction` | `StringSchema`<`string`\> |
| `suggestResponseEncoding` | `StringSchema`<`string`\> |

#### Defined in

src/lib/input.ts:1129

___

### allActorInputs

• `Const` **allActorInputs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `additionalMimeTypes` | `ArrayField`<`any`[]\> |
| `errorReportingDatasetId` | `StringField`<`string`, `string`\> |
| `errorTelemetry` | `BooleanField`<`boolean`\> |
| `forceResponseEncoding` | `StringField`<`string`, `string`\> |
| `ignoreSslErrors` | `BooleanField`<`boolean`\> |
| `includePersonalData` | `BooleanField`<`boolean`\> |
| `inputExtendFromFunction` | `StringField`<`string`, `string`\> |
| `inputExtendUrl` | `StringField`<`string`, `string`\> |
| `keepAlive` | `BooleanField`<`boolean`\> |
| `logLevel` | `StringField`<``"error"`` \| ``"off"`` \| ``"info"`` \| ``"debug"`` \| ``"warn"``, `string`\> |
| `maxConcurrency` | `IntegerField`<`number`, `string`\> |
| `maxRequestRetries` | `IntegerField`<`number`, `string`\> |
| `maxRequestsPerCrawl` | `IntegerField`<`number`, `string`\> |
| `maxRequestsPerMinute` | `IntegerField`<`number`, `string`\> |
| `metamorphActorBuild` | `StringField`<`string`, `string`\> |
| `metamorphActorId` | `StringField`<`string`, `string`\> |
| `metamorphActorInput` | `ObjectField`<{ `uploadDatasetToGDrive`: `boolean` = true }\> |
| `minConcurrency` | `IntegerField`<`number`, `string`\> |
| `navigationTimeoutSecs` | `IntegerField`<`number`, `string`\> |
| `outputCacheActionOnResult` | `StringField`<`NonNullable`<`undefined` \| ``null`` \| ``"add"`` \| ``"remove"`` \| ``"overwrite"``\>, `string`\> |
| `outputCachePrimaryKeys` | `ArrayField`<`string`[]\> |
| `outputCacheStoreId` | `StringField`<`string`, `string`\> |
| `outputDatasetId` | `StringField`<`string`, `string`\> |
| `outputFilter` | `StringField`<`string`, `string`\> |
| `outputFilterAfter` | `StringField`<`string`, `string`\> |
| `outputFilterBefore` | `StringField`<`string`, `string`\> |
| `outputMaxEntries` | `IntegerField`<`number`, `string`\> |
| `outputPickFields` | `ArrayField`<`string`[]\> |
| `outputRenameFields` | `ObjectField`<{ `oldFieldName`: `string` = 'newFieldName' }\> |
| `outputTransform` | `StringField`<`string`, `string`\> |
| `outputTransformAfter` | `StringField`<`string`, `string`\> |
| `outputTransformBefore` | `StringField`<`string`, `string`\> |
| `perfBatchSize` | `IntegerField`<`number`, `string`\> |
| `perfBatchWaitSecs` | `IntegerField`<`number`, `string`\> |
| `proxy` | `ObjectField`<`object`\> |
| `requestFilter` | `StringField`<`string`, `string`\> |
| `requestFilterAfter` | `StringField`<`string`, `string`\> |
| `requestFilterBefore` | `StringField`<`string`, `string`\> |
| `requestHandlerTimeoutSecs` | `IntegerField`<`number`, `string`\> |
| `requestMaxEntries` | `IntegerField`<`number`, `string`\> |
| `requestQueueId` | `StringField`<`string`, `string`\> |
| `requestTransform` | `StringField`<`string`, `string`\> |
| `requestTransformAfter` | `StringField`<`string`, `string`\> |
| `requestTransformBefore` | `StringField`<`string`, `string`\> |
| `startUrls` | `ArrayField`<`any`[]\> |
| `startUrlsFromDataset` | `StringField`<`string`, `string`\> |
| `startUrlsFromFunction` | `StringField`<`string`, `string`\> |
| `suggestResponseEncoding` | `StringField`<`string`, `string`\> |

#### Defined in

src/lib/input.ts:1031

___

### apifyIO

• `Const` **apifyIO**: [`ApifyCrawleeOneIO`](modules.md#apifycrawleeoneio)

Integration between CrawleeOne and Apify.

This is the default integration.

#### Defined in

[src/lib/integrations/apify.ts:117](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/apify.ts#L117)

___

### crawlerInput

• `Const` **crawlerInput**: `Object`

Common input fields related to crawler setup

#### Type declaration

| Name | Type |
| :------ | :------ |
| `additionalMimeTypes` | `ArrayField`<`any`[]\> |
| `forceResponseEncoding` | `StringField`<`string`, `string`\> |
| `ignoreSslErrors` | `BooleanField`<`boolean`\> |
| `keepAlive` | `BooleanField`<`boolean`\> |
| `maxConcurrency` | `IntegerField`<`number`, `string`\> |
| `maxRequestRetries` | `IntegerField`<`number`, `string`\> |
| `maxRequestsPerCrawl` | `IntegerField`<`number`, `string`\> |
| `maxRequestsPerMinute` | `IntegerField`<`number`, `string`\> |
| `minConcurrency` | `IntegerField`<`number`, `string`\> |
| `navigationTimeoutSecs` | `IntegerField`<`number`, `string`\> |
| `requestHandlerTimeoutSecs` | `IntegerField`<`number`, `string`\> |
| `suggestResponseEncoding` | `StringField`<`string`, `string`\> |

#### Defined in

src/lib/input.ts:523

___

### crawlerInputValidationFields

• `Const` **crawlerInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `additionalMimeTypes` | `ArraySchema`<`any`[]\> |
| `forceResponseEncoding` | `StringSchema`<`string`\> |
| `ignoreSslErrors` | `BooleanSchema`<`boolean`\> |
| `keepAlive` | `BooleanSchema`<`boolean`\> |
| `maxConcurrency` | `NumberSchema`<`number`\> |
| `maxRequestRetries` | `NumberSchema`<`number`\> |
| `maxRequestsPerCrawl` | `NumberSchema`<`number`\> |
| `maxRequestsPerMinute` | `NumberSchema`<`number`\> |
| `minConcurrency` | `NumberSchema`<`number`\> |
| `navigationTimeoutSecs` | `NumberSchema`<`number`\> |
| `requestHandlerTimeoutSecs` | `NumberSchema`<`number`\> |
| `suggestResponseEncoding` | `StringSchema`<`string`\> |

#### Defined in

src/lib/input.ts:1044

___

### inputInput

• `Const` **inputInput**: `Object`

Common input fields related to actor input

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputExtendFromFunction` | `StringField`<`string`, `string`\> |
| `inputExtendUrl` | `StringField`<`string`, `string`\> |

#### Defined in

src/lib/input.ts:491

___

### inputInputValidationFields

• `Const` **inputInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputExtendFromFunction` | `StringSchema`<`string`\> |
| `inputExtendUrl` | `StringSchema`<`string`\> |

#### Defined in

src/lib/input.ts:1064

___

### logLevelToCrawlee

• `Const` **logLevelToCrawlee**: `Record`<[`LogLevel`](modules.md#loglevel), `CrawleeLogLevel`\>

Map log levels of `crawlee-one` to log levels of `crawlee`

#### Defined in

[src/lib/log.ts:11](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/log.ts#L11)

___

### loggingInput

• `Const` **loggingInput**: `Object`

Common input fields related to logging setup

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorReportingDatasetId` | `StringField`<`string`, `string`\> |
| `errorTelemetry` | `BooleanField`<`boolean`\> |
| `logLevel` | `StringField`<``"error"`` \| ``"off"`` \| ``"info"`` \| ``"debug"`` \| ``"warn"``, `string`\> |

#### Defined in

src/lib/input.ts:688

___

### loggingInputValidationFields

• `Const` **loggingInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorReportingDatasetId` | `StringSchema`<`string`\> |
| `errorTelemetry` | `BooleanSchema`<`boolean`\> |
| `logLevel` | `StringSchema`<`string`\> |

#### Defined in

src/lib/input.ts:1075

___

### metamorphInput

• `Const` **metamorphInput**: `Object`

Common input fields related to actor metamorphing

#### Type declaration

| Name | Type |
| :------ | :------ |
| `metamorphActorBuild` | `StringField`<`string`, `string`\> |
| `metamorphActorId` | `StringField`<`string`, `string`\> |
| `metamorphActorInput` | `ObjectField`<{ `uploadDatasetToGDrive`: `boolean` = true }\> |

#### Defined in

src/lib/input.ts:1002

___

### metamorphInputValidationFields

• `Const` **metamorphInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `metamorphActorBuild` | `StringSchema`<`string`\> |
| `metamorphActorId` | `StringSchema`<`string`\> |
| `metamorphActorInput` | `ObjectSchema`<`any`\> |

#### Defined in

src/lib/input.ts:1123

___

### outputInput

• `Const` **outputInput**: `Object`

Common input fields related to actor output

#### Type declaration

| Name | Type |
| :------ | :------ |
| `outputCacheActionOnResult` | `StringField`<`NonNullable`<`undefined` \| ``null`` \| ``"add"`` \| ``"remove"`` \| ``"overwrite"``\>, `string`\> |
| `outputCachePrimaryKeys` | `ArrayField`<`string`[]\> |
| `outputCacheStoreId` | `StringField`<`string`, `string`\> |
| `outputDatasetId` | `StringField`<`string`, `string`\> |
| `outputFilter` | `StringField`<`string`, `string`\> |
| `outputFilterAfter` | `StringField`<`string`, `string`\> |
| `outputFilterBefore` | `StringField`<`string`, `string`\> |
| `outputMaxEntries` | `IntegerField`<`number`, `string`\> |
| `outputPickFields` | `ArrayField`<`string`[]\> |
| `outputRenameFields` | `ObjectField`<{ `oldFieldName`: `string` = 'newFieldName' }\> |
| `outputTransform` | `StringField`<`string`, `string`\> |
| `outputTransformAfter` | `StringField`<`string`, `string`\> |
| `outputTransformBefore` | `StringField`<`string`, `string`\> |

#### Defined in

src/lib/input.ts:851

___

### outputInputValidationFields

• `Const` **outputInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `outputCacheActionOnResult` | `StringSchema`<`string`\> |
| `outputCachePrimaryKeys` | `ArraySchema`<`any`[]\> |
| `outputCacheStoreId` | `StringSchema`<`string`\> |
| `outputDatasetId` | `StringSchema`<`string`\> |
| `outputFilter` | `StringSchema`<`string`\> |
| `outputFilterAfter` | `StringSchema`<`string`\> |
| `outputFilterBefore` | `StringSchema`<`string`\> |
| `outputMaxEntries` | `NumberSchema`<`number`\> |
| `outputPickFields` | `ArraySchema`<`any`[]\> |
| `outputRenameFields` | `ObjectSchema`<`any`\> |
| `outputTransform` | `StringSchema`<`string`\> |
| `outputTransformAfter` | `StringSchema`<`string`\> |
| `outputTransformBefore` | `StringSchema`<`string`\> |

#### Defined in

src/lib/input.ts:1102

___

### perfInput

• `Const` **perfInput**: `Object`

Common input fields related to performance which are not part of the CrawlerConfig

#### Type declaration

| Name | Type |
| :------ | :------ |
| `perfBatchSize` | `IntegerField`<`number`, `string`\> |
| `perfBatchWaitSecs` | `IntegerField`<`number`, `string`\> |

#### Defined in

src/lib/input.ts:631

___

### perfInputValidationFields

• `Const` **perfInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `perfBatchSize` | `NumberSchema`<`number`\> |
| `perfBatchWaitSecs` | `NumberSchema`<`number`\> |

#### Defined in

src/lib/input.ts:1059

___

### privacyInput

• `Const` **privacyInput**: `Object`

Common input fields related to proxy setup

#### Type declaration

| Name | Type |
| :------ | :------ |
| `includePersonalData` | `BooleanField`<`boolean`\> |

#### Defined in

src/lib/input.ts:749

___

### privacyInputValidationFields

• `Const` **privacyInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `includePersonalData` | `BooleanSchema`<`boolean`\> |

#### Defined in

src/lib/input.ts:1085

___

### proxyInput

• `Const` **proxyInput**: `Object`

Common input fields related to proxy setup

#### Type declaration

| Name | Type |
| :------ | :------ |
| `proxy` | `ObjectField`<`object`\> |

#### Defined in

src/lib/input.ts:737

___

### proxyInputValidationFields

• `Const` **proxyInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `proxy` | `ObjectSchema`<`any`\> |

#### Defined in

src/lib/input.ts:1081

___

### requestInput

• `Const` **requestInput**: `Object`

Common input fields related to actor request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `requestFilter` | `StringField`<`string`, `string`\> |
| `requestFilterAfter` | `StringField`<`string`, `string`\> |
| `requestFilterBefore` | `StringField`<`string`, `string`\> |
| `requestMaxEntries` | `IntegerField`<`number`, `string`\> |
| `requestQueueId` | `StringField`<`string`, `string`\> |
| `requestTransform` | `StringField`<`string`, `string`\> |
| `requestTransformAfter` | `StringField`<`string`, `string`\> |
| `requestTransformBefore` | `StringField`<`string`, `string`\> |

#### Defined in

src/lib/input.ts:763

___

### requestInputValidationFields

• `Const` **requestInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `requestFilter` | `StringSchema`<`string`\> |
| `requestFilterAfter` | `StringSchema`<`string`\> |
| `requestFilterBefore` | `StringSchema`<`string`\> |
| `requestMaxEntries` | `NumberSchema`<`number`\> |
| `requestQueueId` | `StringSchema`<`string`\> |
| `requestTransform` | `StringSchema`<`string`\> |
| `requestTransformAfter` | `StringSchema`<`string`\> |
| `requestTransformBefore` | `StringSchema`<`string`\> |

#### Defined in

src/lib/input.ts:1089

___

### startUrlsInput

• `Const` **startUrlsInput**: `Object`

Common input fields for defining URLs to scrape

#### Type declaration

| Name | Type |
| :------ | :------ |
| `startUrls` | `ArrayField`<`any`[]\> |
| `startUrlsFromDataset` | `StringField`<`string`, `string`\> |
| `startUrlsFromFunction` | `StringField`<`string`, `string`\> |

#### Defined in

src/lib/input.ts:657

___

### startUrlsInputValidationFields

• `Const` **startUrlsInputValidationFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `startUrls` | `ArraySchema`<`any`[]\> |
| `startUrlsFromDataset` | `StringSchema`<`string`\> |
| `startUrlsFromFunction` | `StringSchema`<`string`\> |

#### Defined in

src/lib/input.ts:1069

## Functions

### basicCaptureErrorRouteHandler

▸ **basicCaptureErrorRouteHandler**<`T`\>(`...args`): [`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`BasicCrawlingContext`<`Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [handler: Function, options: CrawleeOneErrorHandlerOptions<T["io"]\>] |

#### Returns

[`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Defined in

[src/lib/error/errorHandler.ts:133](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L133)

___

### captureError

▸ **captureError**<`TIO`\>(`input`, `options`): `Promise`<`never`\>

Error handling for CrawleeOne crawlers.

By default, error reports are saved to Apify Dataset.

See https://docs.apify.com/academy/node-js/analyzing-pages-and-fixing-errors#error-reporting

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TIO` | extends [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`, `TIO`\> = [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CaptureErrorInput`](modules.md#captureerrorinput) |
| `options` | [`CrawleeOneErrorHandlerOptions`](interfaces/CrawleeOneErrorHandlerOptions.md)<`TIO`\> |

#### Returns

`Promise`<`never`\>

#### Defined in

[src/lib/error/errorHandler.ts:33](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L33)

___

### captureErrorRouteHandler

▸ **captureErrorRouteHandler**<`T`\>(`handler`, `options`): [`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

Drop-in replacement for regular request handler callback for Crawlee route
that automatically tracks errors.

By default, error reports are saved to Apify Dataset.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlingContext`<`BasicCrawler`<`BasicCrawlingContext`<`Dictionary`\>\> \| `PuppeteerCrawler` \| `PlaywrightCrawler` \| `JSDOMCrawler` \| `CheerioCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`<`any`, `any`, `HttpCrawler`<`any`\>\>\>, `Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | (`ctx`: `Omit`<`T`[``"context"``] & {}, ``"request"``\> & { `request`: `Request`<`Dictionary`\>  } & { `captureError`: [`CaptureError`](modules.md#captureerror)  }) => [`MaybePromise`](modules.md#maybepromise)<`void`\> |
| `options` | [`CrawleeOneErrorHandlerOptions`](interfaces/CrawleeOneErrorHandlerOptions.md)<`T`[``"io"``]\> |

#### Returns

[`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

**`Example`**

```ts
router.addDefaultHandler(
 captureErrorRouteHandler(async (ctx) => {
   const { page, crawler } = ctx;
   const url = page.url();
   ...
 })
);
```

#### Defined in

[src/lib/error/errorHandler.ts:110](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L110)

___

### captureErrorWrapper

▸ **captureErrorWrapper**<`TIO`\>(`fn`, `options`): `Promise`<`void`\>

Error handling for Crawlers as a function wrapper

By default, error reports are saved to Apify Dataset.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TIO` | extends [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`, `TIO`\> = [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`input`: { `captureError`: [`CaptureError`](modules.md#captureerror)  }) => [`MaybePromise`](modules.md#maybepromise)<`void`\> |
| `options` | [`CrawleeOneErrorHandlerOptions`](interfaces/CrawleeOneErrorHandlerOptions.md)<`TIO`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/lib/error/errorHandler.ts:77](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L77)

___

### cheerioCaptureErrorRouteHandler

▸ **cheerioCaptureErrorRouteHandler**<`T`\>(`...args`): [`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CheerioCrawlingContext`<`any`, `any`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [handler: Function, options: CrawleeOneErrorHandlerOptions<T["io"]\>] |

#### Returns

[`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Defined in

[src/lib/error/errorHandler.ts:136](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L136)

___

### crawleeOne

▸ **crawleeOne**<`TType`, `T`\>(`args`): `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TType` | extends ``"basic"`` \| ``"http"`` \| ``"cheerio"`` \| ``"jsdom"`` \| ``"playwright"`` \| ``"puppeteer"`` |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlerMeta`<`TType`\>[``"context"``], `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> = [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlerMeta`<`TType`\>[``"context"``], `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`CrawleeOneArgs`](interfaces/CrawleeOneArgs.md)<`TType`, `T`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

src/api.ts:124

___

### createErrorHandler

▸ **createErrorHandler**<`T`\>(`options`): `ErrorHandler`<`T`[``"context"``]\>

Create an `ErrorHandler` function that can be assigned to
`failedRequestHandler` option of `BasicCrawlerOptions`.

The function saves error to a Dataset, and optionally forwards it to Sentry.

By default, error reports are saved to Apify Dataset.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlingContext`<`BasicCrawler`<`BasicCrawlingContext`<`Dictionary`\>\> \| `PuppeteerCrawler` \| `PlaywrightCrawler` \| `JSDOMCrawler` \| `CheerioCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`<`any`, `any`, `HttpCrawler`<`any`\>\>\>, `Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CrawleeOneErrorHandlerOptions`](interfaces/CrawleeOneErrorHandlerOptions.md)<`T`[``"io"``]\> & { `onSendErrorToTelemetry?`: `T`[``"telemetry"``][``"onSendErrorToTelemetry"``] ; `sendToTelemetry?`: `boolean`  } |

#### Returns

`ErrorHandler`<`T`[``"context"``]\>

#### Defined in

[src/lib/error/errorHandler.ts:148](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L148)

___

### createHttpCrawlerOptions

▸ **createHttpCrawlerOptions**<`T`, `TOpts`\>(`«destructured»`): `Partial`<`TOpts`\> & `Dictionary`<`TOpts`[``"requestHandler"``] \| `TOpts`[``"handleRequestFunction"``] \| `TOpts`[``"requestList"``] \| `TOpts`[``"requestQueue"``] \| `TOpts`[``"requestHandlerTimeoutSecs"``] \| `TOpts`[``"handleRequestTimeoutSecs"``] \| `TOpts`[``"errorHandler"``] \| `TOpts`[``"failedRequestHandler"``] \| `TOpts`[``"handleFailedRequestFunction"``] \| `TOpts`[``"maxRequestRetries"``] \| `TOpts`[``"maxRequestsPerCrawl"``] \| `TOpts`[``"autoscaledPoolOptions"``] \| `TOpts`[``"minConcurrency"``] \| `TOpts`[``"maxConcurrency"``] \| `TOpts`[``"maxRequestsPerMinute"``] \| `TOpts`[``"keepAlive"``] \| `TOpts`[``"useSessionPool"``] \| `TOpts`[``"sessionPoolOptions"``] \| `TOpts`[``"loggingInterval"``] \| `TOpts`[``"log"``]\>

Given the actor input, create common crawler options.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlingContext`<`BasicCrawler`<`BasicCrawlingContext`<`Dictionary`\>\> \| `PuppeteerCrawler` \| `PlaywrightCrawler` \| `JSDOMCrawler` \| `CheerioCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`<`any`, `any`, `HttpCrawler`<`any`\>\>\>, `Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |
| `TOpts` | extends `BasicCrawlerOptions`<`T`[``"context"``], `TOpts`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | - |
| › `defaults?` | `TOpts` | Default config options set by us. These may be overriden by values from actor input (set by user). |
| › `input` | ``null`` \| `T`[``"input"``] | Actor input |
| › `overrides?` | `TOpts` | These config options will overwrite both the default and user options. This is useful for hard-setting values e.g. in tests. |

#### Returns

`Partial`<`TOpts`\> & `Dictionary`<`TOpts`[``"requestHandler"``] \| `TOpts`[``"handleRequestFunction"``] \| `TOpts`[``"requestList"``] \| `TOpts`[``"requestQueue"``] \| `TOpts`[``"requestHandlerTimeoutSecs"``] \| `TOpts`[``"handleRequestTimeoutSecs"``] \| `TOpts`[``"errorHandler"``] \| `TOpts`[``"failedRequestHandler"``] \| `TOpts`[``"handleFailedRequestFunction"``] \| `TOpts`[``"maxRequestRetries"``] \| `TOpts`[``"maxRequestsPerCrawl"``] \| `TOpts`[``"autoscaledPoolOptions"``] \| `TOpts`[``"minConcurrency"``] \| `TOpts`[``"maxConcurrency"``] \| `TOpts`[``"maxRequestsPerMinute"``] \| `TOpts`[``"keepAlive"``] \| `TOpts`[``"useSessionPool"``] \| `TOpts`[``"sessionPoolOptions"``] \| `TOpts`[``"loggingInterval"``] \| `TOpts`[``"log"``]\>

#### Defined in

[src/lib/actor/actor.ts:584](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L584)

___

### createLocalMigrationState

▸ **createLocalMigrationState**(`«destructured»`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `stateDir` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `loadState` | (`migrationFilename`: `string`) => `Promise`<`Actor`\> |
| `saveState` | (`migrationFilename`: `string`, `actor`: `ActorClient`) => `Promise`<`void`\> |

#### Defined in

[src/lib/migrate/localState.ts:5](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/migrate/localState.ts#L5)

___

### createLocalMigrator

▸ **createLocalMigrator**(`«destructured»`): `Object`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | - |
| › `delimeter` | `string` | Delimeter between version and rest of file name |
| › `extension` | `string` | Extension glob |
| › `migrationsDir` | `string` | - |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `migrate` | (`version`: `string`) => `Promise`<`void`\> |
| `unmigrate` | (`version`: `string`) => `Promise`<`void`\> |

#### Defined in

[src/lib/migrate/localMigrator.ts:8](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/migrate/localMigrator.ts#L8)

___

### createMockClientDataset

▸ **createMockClientDataset**(`overrides?`): `Dataset`

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Dataset` |

#### Returns

`Dataset`

#### Defined in

[src/lib/test/mockApifyClient.ts:33](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L33)

___

### createMockClientRequestQueue

▸ **createMockClientRequestQueue**(`overrides?`): `RequestQueue`

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `RequestQueue` |

#### Returns

`RequestQueue`

#### Defined in

[src/lib/test/mockApifyClient.ts:50](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L50)

___

### createMockDatasetCollectionClient

▸ **createMockDatasetCollectionClient**(`«destructured»?`): `DatasetCollectionClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `log?` | (`args`: `any`) => `void` |

#### Returns

`DatasetCollectionClient`

#### Defined in

[src/lib/test/mockApifyClient.ts:195](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L195)

___

### createMockKeyValueStoreClient

▸ **createMockKeyValueStoreClient**(`«destructured»?`): `KeyValueStoreClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `log?` | (`args`: `any`) => `void` |

#### Returns

`KeyValueStoreClient`

#### Defined in

[src/lib/test/mockApifyClient.ts:71](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L71)

___

### createMockRequestQueueClient

▸ **createMockRequestQueueClient**(`«destructured»?`): `RequestQueueClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `log?` | (`args`: `any`) => `void` |
| › `onBatchAddRequests?` | [`OnBatchAddRequests`](modules.md#onbatchaddrequests) |

#### Returns

`RequestQueueClient`

#### Defined in

[src/lib/test/mockApifyClient.ts:98](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L98)

___

### createMockStorageClient

▸ **createMockStorageClient**(`«destructured»?`): `StorageClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `log?` | (`args`: `any`) => `void` |
| › `onBatchAddRequests?` | [`OnBatchAddRequests`](modules.md#onbatchaddrequests) |

#### Returns

`StorageClient`

#### Defined in

[src/lib/test/mockApifyClient.ts:227](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L227)

___

### createMockStorageDataset

▸ **createMockStorageDataset**(`...args`): `Promise`<`Dataset`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [datasetId?: null \| string, options?: OpenStorageOptions, custom?: Object] |

#### Returns

`Promise`<`Dataset`<`any`\>\>

#### Defined in

[src/lib/test/mockApifyClient.ts:252](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/mockApifyClient.ts#L252)

___

### createSentryTelemetry

▸ **createSentryTelemetry**<`T`\>(`sentryOptions?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<[`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlingContext`<`BasicCrawler`<`BasicCrawlingContext`<`Dictionary`\>\> \| `PuppeteerCrawler` \| `PlaywrightCrawler` \| `JSDOMCrawler` \| `CheerioCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`<`any`, `any`, `HttpCrawler`<`any`\>\>\>, `Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>\>, [`CrawleeOneErrorHandlerOptions`](interfaces/CrawleeOneErrorHandlerOptions.md)<[`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `sentryOptions?` | `NodeOptions` |

#### Returns

`T`

#### Defined in

[src/lib/telemetry/sentry.ts:24](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/telemetry/sentry.ts#L24)

___

### datasetSizeMonitor

▸ **datasetSizeMonitor**(`maxSize`, `options?`): `Object`

Semi-automatic monitoring of Dataset size. This is used in limiting the total of entries
scraped per run / Dataset:
- When Dataset reaches `maxSize`, then all remaining Requests
  in the RequestQueue are removed.
- Pass an array of items to `shortenToSize` to shorten the array to the size
  that still fits the Dataset.

By default uses Apify Dataset.

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxSize` | `number` |
| `options?` | [`DatasetSizeMonitorOptions`](interfaces/DatasetSizeMonitorOptions.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `isFull` | () => `Promise`<`boolean`\> |
| `isStale` | () => `boolean` |
| `onValue` | (`callback`: `ValueCallback`<`number`\>) => () => `void` |
| `refresh` | () => `Promise`<`number`\> |
| `shortenToSize` | <T\>(`arr`: `T`[]) => `Promise`<`T`[]\> |
| `value` | () => ``null`` \| `number` \| `Promise`<`number`\> |

#### Defined in

[src/lib/io/dataset.ts:94](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/dataset.ts#L94)

___

### generateTypes

▸ **generateTypes**(`outfile`, `configOrPath?`): `Promise`<`void`\>

Generate types for CrawleeOne given a config.

Config can be passed directly, or as the path to the config file.
If the config is omitted, it is automatically searched for using CosmicConfig.

#### Parameters

| Name | Type |
| :------ | :------ |
| `outfile` | `string` |
| `configOrPath?` | `string` \| [`CrawleeOneConfig`](interfaces/CrawleeOneConfig.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

src/cli/commands/codegen.ts:251

___

### getColumnFromDataset

▸ **getColumnFromDataset**<`T`\>(`datasetId`, `field`, `options?`): `Promise`<`T`[]\>

Given a Dataset ID and a name of a field, get the columnar data.

By default uses Apify Dataset.

Example:
```js
// Given dataset
// [
//   { id: 1, field: 'abc' },
//   { id: 2, field: 'def' }
// ]
const results = await getColumnFromDataset('datasetId123', 'field');
console.log(results)
// ['abc', 'def']
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetId` | `string` |
| `field` | `string` |
| `options?` | `Object` |
| `options.dataOptions?` | `Pick`<`DatasetDataOptions`, ``"offset"`` \| ``"desc"`` \| ``"limit"``\> |
| `options.io?` | [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\> |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[src/lib/io/dataset.ts:48](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/dataset.ts#L48)

___

### getDatasetCount

▸ **getDatasetCount**(`datasetNameOrId?`, `options?`): `Promise`<``null`` \| `number`\>

Given a Dataset ID, get the number of entries already in the Dataset.

By default uses Apify Dataset.

#### Parameters

| Name | Type |
| :------ | :------ |
| `datasetNameOrId?` | `string` |
| `options?` | `Object` |
| `options.io?` | [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\> |
| `options.log?` | `Log` |

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[src/lib/io/dataset.ts:12](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/dataset.ts#L12)

___

### httpCaptureErrorRouteHandler

▸ **httpCaptureErrorRouteHandler**<`T`\>(`...args`): [`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`HttpCrawlingContext`<`any`, `any`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [handler: Function, options: CrawleeOneErrorHandlerOptions<T["io"]\>] |

#### Returns

[`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Defined in

[src/lib/error/errorHandler.ts:134](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L134)

___

### itemCacheKey

▸ **itemCacheKey**(`item`, `primaryKeys?`): `string`

Serialize dataset item to fixed-length hash.

NOTE: Apify (around which this lib is designed) allows the key-value store key
      to be max 256 char long.
      https://docs.apify.com/sdk/js/reference/class/KeyValueStore#setValue

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `primaryKeys?` | `string`[] |

#### Returns

`string`

#### Defined in

[src/lib/io/pushData.ts:245](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushData.ts#L245)

___

### jsdomCaptureErrorRouteHandler

▸ **jsdomCaptureErrorRouteHandler**<`T`\>(`...args`): [`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`JSDOMCrawlingContext`<`any`, `any`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [handler: Function, options: CrawleeOneErrorHandlerOptions<T["io"]\>] |

#### Returns

[`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Defined in

[src/lib/error/errorHandler.ts:135](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L135)

___

### loadConfig

▸ **loadConfig**(`configFilePath?`): `Promise`<``null`` \| [`CrawleeOneConfig`](interfaces/CrawleeOneConfig.md)\>

Load CrawleeOne config file. Config will be searched for using CosmicConfig.

Optionally, you can supply path to the config file.

Learn more: https://github.com/cosmiconfig/cosmiconfig

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath?` | `string` |

#### Returns

`Promise`<``null`` \| [`CrawleeOneConfig`](interfaces/CrawleeOneConfig.md)\>

#### Defined in

src/cli/commands/config.ts:51

___

### logLevelHandlerWrapper

▸ **logLevelHandlerWrapper**<`T`, `RouterCtx`\>(`logLevel`): [`CrawleeOneRouteWrapper`](modules.md#crawleeoneroutewrapper)<`T`, `RouterCtx`\>

Wrapper for Crawlee route handler that configures log level.

Usage with Crawlee's `RouterHandler.addDefaultHandler`
```ts
const wrappedHandler = logLevelHandlerWrapper('debug')(handler)
await router.addDefaultHandler<Ctx>(wrappedHandler);
```

Usage with Crawlee's `RouterHandler.addHandler`
```ts
const wrappedHandler = logLevelHandlerWrapper('error')(handler)
await router.addHandler<Ctx>(wrappedHandler);
```

Usage with `createCrawleeOne`
```ts
const actor = await createCrawleeOne<CheerioCrawlingContext>({
  validateInput,
  router: createCheerioRouter(),
  routes,
  routeHandlers: ({ input }) => createHandlers(input!),
  routeHandlerWrappers: ({ input }) => [
    logLevelHandlerWrapper<CheerioCrawlingContext<any, any>>(input?.logLevel ?? 'info'),
  ],
  createCrawler: ({ router, input }) => createCrawler({ router, input, crawlerConfig }),
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlingContext`<`BasicCrawler`<`BasicCrawlingContext`<`Dictionary`\>\> \| `PuppeteerCrawler` \| `PlaywrightCrawler` \| `JSDOMCrawler` \| `CheerioCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`<`any`, `any`, `HttpCrawler`<`any`\>\>\>, `Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `logLevel` | ``"error"`` \| ``"off"`` \| ``"info"`` \| ``"debug"`` \| ``"warn"`` |

#### Returns

[`CrawleeOneRouteWrapper`](modules.md#crawleeoneroutewrapper)<`T`, `RouterCtx`\>

#### Defined in

[src/lib/log.ts:49](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/log.ts#L49)

___

### playwrightCaptureErrorRouteHandler

▸ **playwrightCaptureErrorRouteHandler**<`T`\>(`...args`): [`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`PlaywrightCrawlingContext`<`Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [handler: Function, options: CrawleeOneErrorHandlerOptions<T["io"]\>] |

#### Returns

[`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Defined in

[src/lib/error/errorHandler.ts:137](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L137)

___

### puppeteerCaptureErrorRouteHandler

▸ **puppeteerCaptureErrorRouteHandler**<`T`\>(`...args`): [`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`PuppeteerCrawlingContext`<`Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [handler: Function, options: CrawleeOneErrorHandlerOptions<T["io"]\>] |

#### Returns

[`CrawleeOneRouteHandler`](modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\>\>

#### Defined in

[src/lib/error/errorHandler.ts:138](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/error/errorHandler.ts#L138)

___

### pushData

▸ **pushData**<`Ctx`, `T`\>(`ctx`, `oneOrManyItems`, `options`): `Promise`<`unknown`[]\>

Apify's `Actor.pushData` with extra features:

- Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
- Limit the max size of the Dataset. No entries are added when Dataset is at or above the limit.
- Redact "private" fields
- Add metadata to entries before they are pushed to dataset.
- Select and rename (nested) properties
- Transform and filter entries. Entries that did not pass the filter are not added to the dataset.
- Add/remove entries to/from KeyValueStore. Entries are saved to the store by hash generated from entry fields set by `cachePrimaryKeys`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Ctx` | extends `CrawlingContext`<`unknown`, `Dictionary`, `Ctx`\> |
| `T` | extends `Record`<`any`, `any`\> = `Record`<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Ctx` |
| `oneOrManyItems` | `T` \| `T`[] |
| `options` | [`PushDataOptions`](interfaces/PushDataOptions.md)<`T`\> |

#### Returns

`Promise`<`unknown`[]\>

#### Defined in

[src/lib/io/pushData.ts:319](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushData.ts#L319)

___

### pushRequests

▸ **pushRequests**<`T`\>(`oneOrManyItems`, `options?`): `Promise`<`unknown`[]\>

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `oneOrManyItems` | `T` \| `T`[] |
| `options?` | [`PushRequestsOptions`](interfaces/PushRequestsOptions.md)<`T`\> |

#### Returns

`Promise`<`unknown`[]\>

#### Defined in

[src/lib/io/pushRequests.ts:78](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L78)

___

### registerHandlers

▸ **registerHandlers**<`T`, `RouterCtx`\>(`router`, `routes`, `options?`): `Promise`<`void`\>

Register many handlers at once onto the Crawlee's RouterHandler.

The labels under which the handlers are registered are the respective object keys.

Example:

```js
registerHandlers(router, { labelA: fn1, labelB: fn2 });
```

Is similar to:
```js
router.addHandler(labelA, fn1)
router.addHandler(labelB, fn2)
```

You can also specify a list of wrappers to override the behaviour of all handlers
all at once.

A list of wrappers `[a, b, c]` will be applied to the handlers right-to-left as so
`a( b( c( handler ) ) )`.

The entries on the `routerContext` object will be made available to all handlers.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlingContext`<`BasicCrawler`<`BasicCrawlingContext`<`Dictionary`\>\> \| `PuppeteerCrawler` \| `PlaywrightCrawler` \| `JSDOMCrawler` \| `CheerioCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`<`any`, `any`, `HttpCrawler`<`any`\>\>\>, `Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `router` | `RouterHandler`<`T`[``"context"``]\> |
| `routes` | `Record`<`T`[``"labels"``], [`CrawleeOneRoute`](interfaces/CrawleeOneRoute.md)<`T`, `RouterCtx`\>\> |
| `options?` | `Object` |
| `options.handlerWrappers?` | [`CrawleeOneRouteWrapper`](modules.md#crawleeoneroutewrapper)<`T`, `RouterCtx`\>[] |
| `options.onSetCtx?` | (`ctx`: ``null`` \| `Omit`<`T`[``"context"``] & `RouterCtx`, ``"request"``\> & { `request`: `Request`<`Dictionary`\>  }) => `void` |
| `options.routerContext?` | `RouterCtx` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/lib/router/router.ts:89](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/router/router.ts#L89)

___

### requestQueueSizeMonitor

▸ **requestQueueSizeMonitor**(`maxSize`, `options?`): `Object`

Semi-automatic monitoring of RequestQueue size. This is used for limiting the total of
entries scraped per run / RequestQueue:
- When RequestQueue reaches `maxSize`, then all remaining Requests are removed.
- Pass an array of items to `shortenToSize` to shorten the array to the size
  that still fits the RequestQueue.

By default uses Apify RequestQueue.

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxSize` | `number` |
| `options?` | [`RequestQueueSizeMonitorOptions`](interfaces/RequestQueueSizeMonitorOptions.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `isFull` | () => `Promise`<`boolean`\> |
| `isStale` | () => `boolean` |
| `onValue` | (`callback`: `ValueCallback`<`number`\>) => () => `void` |
| `refresh` | () => `Promise`<`number`\> |
| `shortenToSize` | <T\>(`arr`: `T`[]) => `Promise`<`T`[]\> |
| `value` | () => ``null`` \| `number` \| `Promise`<`number`\> |

#### Defined in

[src/lib/io/requestQueue.ts:24](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/requestQueue.ts#L24)

___

### runCrawleeOne

▸ **runCrawleeOne**<`TType`, `T`\>(`args`): `Promise`<`void`\>

Create opinionated Crawlee crawler that uses, and run it within Apify's `Actor.main()` context.

Apify context can be replaced with custom implementation using the `actorConfig.io` option.

This function does the following for you:

1) Full TypeScript coverage - Ensure all components use the same Crawler / CrawlerContext.

2) Get Actor input from `io.getInput()`, which by default
corresponds to Apify's `Actor.getInput()`.

3) (Optional) Validate Actor input

4) Set up router such that requests that reach default route are
redirected to labelled routes based on which item from "routes" they match.

5) Register all route handlers for you.

6) (Optional) Wrap all route handlers in a wrapper. Use this e.g.
if you want to add a field to the context object, or handle errors
from a single place.

7) (Optional) Support transformation and filtering of (scraped) entries,
configured via Actor input.

8) (Optional) Support Actor metamorphing, configured via Actor input.

9) Apify context (e.g. calling `Actor.getInput`) can be replaced with custom
 implementation using the `io` option.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TType` | extends ``"basic"`` \| ``"http"`` \| ``"cheerio"`` \| ``"jsdom"`` \| ``"playwright"`` \| ``"puppeteer"`` |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlerMeta`<`TType`\>[``"context"``], `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`RunCrawleeOneOptions`](interfaces/RunCrawleeOneOptions.md)<`TType`, `T`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/lib/actor/actor.ts:155](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L155)

___

### runCrawlerTest

▸ **runCrawlerTest**<`TData`, `TInput`\>(`«destructured»`): `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | extends [`MaybeArray`](modules.md#maybearray)<`Dictionary`\> |
| `TInput` | `TInput` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `input` | `TInput` |
| › `log?` | (...`args`: `any`[]) => `void` |
| › `onBatchAddRequests?` | [`OnBatchAddRequests`](modules.md#onbatchaddrequests) |
| › `onDone?` | (`done`: () => `void`) => [`MaybePromise`](modules.md#maybepromise)<`void`\> |
| › `onPushData?` | (`data`: `any`, `done`: () => `void`) => [`MaybePromise`](modules.md#maybepromise)<`void`\> |
| › `runCrawler` | () => [`MaybePromise`](modules.md#maybepromise)<`void`\> |
| › `vi` | `VitestUtils` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/lib/test/actor.ts:61](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/actor.ts#L61)

___

### scrapeListingEntries

▸ **scrapeListingEntries**<`Ctx`, `UrlType`\>(`options`): `Promise`<`UrlType`[]\>

Get entries from a listing page (eg URLs to profiles that should be scraped later)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Ctx` | extends `object` |
| `UrlType` | `UrlType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ListingPageScraperOptions`](interfaces/ListingPageScraperOptions.md)<`Ctx`, `UrlType`\> |

#### Returns

`Promise`<`UrlType`[]\>

#### Defined in

[src/lib/actions/scrapeListing.ts:229](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actions/scrapeListing.ts#L229)

___

### setupDefaultHandlers

▸ **setupDefaultHandlers**<`T`, `RouterCtx`\>(`«destructured»`): `Promise`<`void`\>

Configures the default router handler to redirect URLs to labelled route handlers
based on which route the URL matches first.

NOTE: This does mean that the URLs passed to this default handler will be fetched
twice (as the URL will be requeued to the correct handler). We recommend to use this
function only in the scenarios where there is a small number of startUrls, yet these
may need various ways of processing based on different paths or etc.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](interfaces/CrawleeOneCtx.md)<`CrawlingContext`<`BasicCrawler`<`BasicCrawlingContext`<`Dictionary`\>\> \| `PuppeteerCrawler` \| `PlaywrightCrawler` \| `JSDOMCrawler` \| `CheerioCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`<`any`, `any`, `HttpCrawler`<`any`\>\>\>, `Dictionary`\>, `string`, `Record`<`string`, `any`\>, [`CrawleeOneIO`](interfaces/CrawleeOneIO.md)<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](interfaces/CrawleeOneTelemetry.md)<`any`, `any`\>, `T`\> |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](modules.md#crawleeoneroutectx)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `input?` | ``null`` \| `T`[``"input"``] |
| › `io` | `T`[``"io"``] |
| › `onSetCtx?` | (`ctx`: ``null`` \| `Omit`<`T`[``"context"``] & `RouterCtx`, ``"request"``\> & { `request`: `Request`<`Dictionary`\>  }) => `void` |
| › `routeHandlerWrappers?` | [`CrawleeOneRouteWrapper`](modules.md#crawleeoneroutewrapper)<`T`, `RouterCtx`\>[] |
| › `router` | `RouterHandler`<`T`[``"context"``]\> |
| › `routerContext?` | `RouterCtx` |
| › `routes` | `Record`<`T`[``"labels"``], [`CrawleeOneRoute`](interfaces/CrawleeOneRoute.md)<`T`, `RouterCtx`\>\> |

#### Returns

`Promise`<`void`\>

**`Example`**

```ts
const routeLabels = {
  MAIN_PAGE: 'MAIN_PAGE',
  JOB_LISTING: 'JOB_LISTING',
  JOB_DETAIL: 'JOB_DETAIL',
  JOB_RELATED_LIST: 'JOB_RELATED_LIST',
  PARTNERS: 'PARTNERS',
} as const;

const router = createPlaywrightRouter();

const routes = createPlaywrightCrawleeOneRouteMatchers<typeof routeLabels>([
 // URLs that match this route are redirected to router.addHandler(routeLabels.MAIN_PAGE)
 {
    route: routeLabels.MAIN_PAGE,
    // Check for main page like https://www.profesia.sk/?#
    match: (url) => url.match(/[\W]profesia\.sk/?(?:[?#~]|$)/i),
  },

 // Optionally override the logic that assigns the URL to the route by specifying the `action` prop
 {
    route: routeLabels.MAIN_PAGE,
    // Check for main page like https://www.profesia.sk/?#
    match: (url) => url.match(/[\W]profesia\.sk/?(?:[?#~]|$)/i),
    action: async (ctx) => {
      await ctx.crawler.addRequests([{
        url: 'https://profesia.sk/praca',
        label: routeLabels.JOB_LISTING,
      }]);
    },
  },
]);

// Set up default route to redirect to labelled routes
setupDefaultHandlers({ router, routes });

// Now set up the labelled routes
await router.addHandler(routeLabels.JOB_LISTING, async (ctx) => { ... }
```

#### Defined in

[src/lib/router/router.ts:306](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/router/router.ts#L306)

___

### setupMockApifyActor

▸ **setupMockApifyActor**<`TInput`, `TData`\>(`«destructured»`): `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TInput` | `TInput` |
| `TData` | extends [`MaybeArray`](modules.md#maybearray)<`Dictionary`\> = [`MaybeArray`](modules.md#maybearray)<`Dictionary`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `actorInput?` | `TInput` |
| › `log?` | (...`args`: `any`[]) => `void` |
| › `onBatchAddRequests?` | [`OnBatchAddRequests`](modules.md#onbatchaddrequests) |
| › `onGetInfo?` | (...`args`: `any`[]) => [`MaybePromise`](modules.md#maybepromise)<`void`\> |
| › `onPushData?` | (`data`: `TData`) => [`MaybePromise`](modules.md#maybepromise)<`void`\> |
| › `vi` | `VitestUtils` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/lib/test/actor.ts:12](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/test/actor.ts#L12)

___

### validateConfig

▸ **validateConfig**(`config`): `void`

Validate given CrawleeOne config.

Config can be passed directly, or you can specify the path to the config file.
For the latter, the config will be loaded using [loadConfig](modules.md#loadconfig).

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `unknown` |

#### Returns

`void`

#### Defined in

src/cli/commands/config.ts:40

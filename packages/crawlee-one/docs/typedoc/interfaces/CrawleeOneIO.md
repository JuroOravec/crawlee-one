[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneIO

# Interface: CrawleeOneIO\<TEnv, TReport, TMetadata\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:23](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L23)

Interface for storing and retrieving:
- Scraped data
- Requests (URLs) to scrape
- Cache data

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Type Parameters

### TEnv

`TEnv` *extends* `object` = `object`

### TReport

`TReport` *extends* `object` = `object`

### TMetadata

`TMetadata` *extends* `object` = `object`

## Properties

### createDefaultProxyConfiguration()

> **createDefaultProxyConfiguration**: \<`T`\>(`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`ProxyConfiguration` \| `undefined`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:128](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L128)

Creates a proxy configuration and returns a promise resolving to an instance of
ProxyConfiguration that is already initialized.

Configures connection to a proxy server with the provided options. Proxy servers are used
to prevent target websites from blocking your crawlers based on IP address rate limits or
blacklists. Setting proxy configuration in your crawlers automatically configures them to
use the selected proxies for all connections.

For more details and code examples, see ProxyConfiguration.

#### Type Parameters

##### T

`T` *extends* `object`

#### Parameters

##### input

`T` | `Readonly`\<`T`\> | `undefined`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`ProxyConfiguration` \| `undefined`\>

***

### generateEntryMetadata()

> **generateEntryMetadata**: \<`Ctx`\>(`ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`TMetadata`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:138](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L138)

Generate object with info on current context, which will be appended to the scraped entry

#### Type Parameters

##### Ctx

`Ctx` *extends* `CrawlingContext`\<`unknown`, `Dictionary`\>

#### Parameters

##### ctx

`Ctx`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`TMetadata`\>

***

### generateErrorReport()

> **generateErrorReport**: (`input`, `options`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`TReport`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:133](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L133)

Generate object with info on current context, which will be send to the error Dataset

#### Parameters

##### input

[`CrawleeOneErrorHandlerInput`](CrawleeOneErrorHandlerInput.md)

##### options

[`PickRequired`](../type-aliases/PickRequired.md)\<[`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)\<`CrawleeOneIO`\<`TEnv`, `TReport`, `object`\>\>, `"io"`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`TReport`\>

***

### getInput()

> **getInput**: \<`Input`\>() => `Promise`\<`Input` \| `null`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:57](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L57)

Returns a promise of an object with the crawler input. E.g. In Apify, retrieves the actor input value from
the default KeyValueStore associated with the current actor run.

#### Type Parameters

##### Input

`Input` *extends* `object`

#### Returns

`Promise`\<`Input` \| `null`\>

***

### isTelemetryEnabled()

> **isTelemetryEnabled**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:131](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L131)

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

***

### openDataset()

> **openDataset**: (`id?`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<[`CrawleeOneDataset`](CrawleeOneDataset.md)\<`object`\>\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:35](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L35)

Opens a dataset and returns a promise resolving to an instance of the [CrawleeOneDataset](CrawleeOneDataset.md).

Datasets are used to store structured data where each object stored has the same attributes,
such as online store products or real estate offers. The actual data is stored either on
the local filesystem or in the cloud.

#### Parameters

##### id?

`string` | `null`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<[`CrawleeOneDataset`](CrawleeOneDataset.md)\<`object`\>\>

***

### openKeyValueStore()

> **openKeyValueStore**: (`id?`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<[`CrawleeOneKeyValueStore`](CrawleeOneKeyValueStore.md)\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:52](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L52)

Opens a key-value store and returns a promise resolving to an instance of the [CrawleeOneKeyValueStore](CrawleeOneKeyValueStore.md).

Key-value stores are used to store records or files, along with their MIME content type.
The records are stored and retrieved using a unique key. The actual data is stored
either on a local filesystem or in the cloud.

#### Parameters

##### id?

`string` | `null`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<[`CrawleeOneKeyValueStore`](CrawleeOneKeyValueStore.md)\>

***

### openRequestQueue()

> **openRequestQueue**: (`id?`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<[`CrawleeOneRequestQueue`](CrawleeOneRequestQueue.md)\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:44](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L44)

Opens a request queue and returns a promise resolving to an instance of the [CrawleeOneRequestQueue](CrawleeOneRequestQueue.md).

RequestQueue represents a queue of URLs to crawl, which is stored either on local filesystem
or in the cloud. The queue is used for deep crawling of websites, where you start with several
URLs and then recursively follow links to other pages. The data structure supports both
breadth-first and depth-first crawling orders.

#### Parameters

##### id?

`string` | `null`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<[`CrawleeOneRequestQueue`](CrawleeOneRequestQueue.md)\>

***

### runInContext()

> **runInContext**: (`userFunc`, `options?`) => `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:116](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L116)

Equivalent of Actor.main.

Runs the main user function that performs the job of the actor
and terminates the process when the user function finishes.

**The `Actor.main()` function is optional** and is provided merely for your convenience.
It is mainly useful when you're running your code as an actor on the [Apify platform](https://apify.com/actors).
However, if you want to use Apify SDK tools directly inside your existing projects, e.g.
running in an [Express](https://expressjs.com/) server, on
[Google Cloud functions](https://cloud.google.com/functions)
or [AWS Lambda](https://aws.amazon.com/lambda/), it's better to avoid
it since the function terminates the main process when it finishes!

The `Actor.main()` function performs the following actions:

- When running on the Apify platform (i.e. `APIFY_IS_AT_HOME` environment variable is set),
  it sets up a connection to listen for platform events.
  For example, to get a notification about an imminent migration to another server.
  See Actor.events for details.
- It checks that either `APIFY_TOKEN` or `APIFY_LOCAL_STORAGE_DIR` environment variable
  is defined. If not, the functions sets `APIFY_LOCAL_STORAGE_DIR` to `./apify_storage`
  inside the current working directory. This is to simplify running code examples.
- It invokes the user function passed as the `userFunc` parameter.
- If the user function returned a promise, waits for it to resolve.
- If the user function throws an exception or some other error is encountered,
  prints error details to console so that they are stored to the log.
- Exits the Node.js process, with zero exit code on success and non-zero on errors.

#### Parameters

##### userFunc

() => `unknown`

##### options?

`ExitOptions`

#### Returns

`Promise`\<`void`\>

***

### triggerDownstreamCrawler()

> **triggerDownstreamCrawler**: \<`TInput`\>(`targetActorId`, `input?`, `options?`) => `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:74](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L74)

Equivalent of Actor.metamorph.

This function should:
1. Start a crawler/actor by its ID,
2. Pass the given input into downsteam crawler.
3. Make the same storage available to the downstream crawler. AKA, the downstream crawler
   should use the same "default" storage as is the current "default" storage.

Read more about  Actor.metamorph:

`Actor.metamorph` transforms this actor run to an actor run of a given actor. The system
stops the current container and starts the new container instead. All the default storages
are preserved and the new input is stored under the INPUT-METAMORPH-1 key in the same
default key-value store.

#### Type Parameters

##### TInput

`TInput` *extends* `object`

#### Parameters

##### targetActorId

`string`

ID of the crawler/actor to which should be triggered.

##### input?

`TInput`

Input for the crawler/actor. Must be JSON-serializable (it will be stringified to JSON).

##### options?

###### build?

`string`

Tag or number of the target build to metamorph into (e.g. `beta` or `1.2.345`).
If not provided, the run uses build tag or number from the default actor run configuration (typically `latest`).

#### Returns

`Promise`\<`void`\>

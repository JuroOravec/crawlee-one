[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / OrchestratedCrawler

# Type Alias: OrchestratedCrawler

> **OrchestratedCrawler** = `object`

Defined in: [packages/crawlee-one/src/lib/orchestrate.ts:14](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/orchestrate.ts#L14)

Crawler descriptor for [orchestrate](../functions/orchestrate.md).

## Properties

### crawler

> **crawler**: [`OrchestratedCrawlerInstance`](OrchestratedCrawlerInstance.md)

Defined in: [packages/crawlee-one/src/lib/orchestrate.ts:16](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/orchestrate.ts#L16)

Crawler instance with `run()` and `stop()` methods.

***

### isKeepAlive

> **isKeepAlive**: `boolean`

Defined in: [packages/crawlee-one/src/lib/orchestrate.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/orchestrate.ts#L24)

Whether the crawler was configured with `keepAlive: true`.

This affects how the crawler is orchestrated. See [orchestrate](../functions/orchestrate.md) for more details.

***

### queueId

> **queueId**: `string` \| `undefined`

Defined in: [packages/crawlee-one/src/lib/orchestrate.ts:18](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/orchestrate.ts#L18)

Queue ID this crawler consumes. Pass `undefined` for the default queue.

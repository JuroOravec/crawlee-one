[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / PerfActorInput

# Interface: PerfActorInput

Defined in: [packages/crawlee-one/src/lib/input.ts:73](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/input.ts#L73)

Common input fields related to performance which are not part of the CrawlerConfig

## Properties

### perfBatchSize?

> `optional` **perfBatchSize**: `number`

Defined in: [packages/crawlee-one/src/lib/input.ts:81](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/input.ts#L81)

If set, multiple Requests will be handled by a single Actor instance.

See official docs: https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs

Example: If set to 20, then up to 20 requests will be handled in a single "go".

***

### perfBatchWaitSecs?

> `optional` **perfBatchWaitSecs**: `number`

Defined in: [packages/crawlee-one/src/lib/input.ts:89](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/input.ts#L89)

How long to wait between entries within a single batch.

Increase this value if you're using batching and you're sending requests to the scraped website too fast.

Example: If set to 1, then after each entry in a batch, wait 1 second before continuing.

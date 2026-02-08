[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / PerfActorInput

# Interface: PerfActorInput

Common input fields related to performance which are not part of the CrawlerConfig

## Properties

### perfBatchSize?

> `optional` **perfBatchSize**: `number`

If set, multiple Requests will be handled by a single Actor instance.

See official docs: https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs

Example: If set to 20, then up to 20 requests will be handled in a single "go".

#### Source

[src/lib/input.ts:81](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L81)

***

### perfBatchWaitSecs?

> `optional` **perfBatchWaitSecs**: `number`

How long to wait between entries within a single batch.

Increase this value if you're using batching and you're sending requests to the scraped website too fast.

Example: If set to 1, then after each entry in a batch, wait 1 second before continuing.

#### Source

[src/lib/input.ts:89](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L89)

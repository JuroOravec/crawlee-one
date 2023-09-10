[crawlee-one](../README.md) / [Exports](../modules.md) / PerfActorInput

# Interface: PerfActorInput

Common input fields related to performance which are not part of the CrawlerConfig

## Table of contents

### Properties

- [perfBatchSize](PerfActorInput.md#perfbatchsize)
- [perfBatchWaitSecs](PerfActorInput.md#perfbatchwaitsecs)

## Properties

### perfBatchSize

• `Optional` **perfBatchSize**: `number`

If set, multiple Requests will be handled by a single Actor instance.

See official docs: https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs

Example: If set to 20, then up to 20 requests will be handled in a single "go".

#### Defined in

[src/lib/input.ts:80](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/input.ts#L80)

___

### perfBatchWaitSecs

• `Optional` **perfBatchWaitSecs**: `number`

How long to wait between entries within a single batch.

Increase this value if you're using batching and you're sending requests to the scraped website too fast.

Example: If set to 1, then after each entry in a batch, wait 1 second before continuing.

#### Defined in

[src/lib/input.ts:88](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/input.ts#L88)

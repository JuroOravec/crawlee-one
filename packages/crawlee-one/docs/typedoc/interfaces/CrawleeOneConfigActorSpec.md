[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigActorSpec

# Interface: CrawleeOneConfigActorSpec

Defined in: packages/crawlee-one/src/lib/config/types.ts:82

## Properties

### config

> **config**: `ActorSpec`

Defined in: packages/crawlee-one/src/lib/config/types.ts:86

The `ActorSpec` object to serialize.

***

### outFile?

> `optional` **outFile**: `string`

Defined in: packages/crawlee-one/src/lib/config/types.ts:92

Output file path (relative to cwd).

Defaults to `.actor/actorspec.json` if `.actor/` exists, otherwise `./actorspec.json`.

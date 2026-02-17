[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigActor

# Interface: CrawleeOneConfigActor

Defined in: packages/crawlee-one/src/lib/config/types.ts:69

## Properties

### config

> **config**: `unknown`

Defined in: packages/crawlee-one/src/lib/config/types.ts:73

The `ActorConfig` object to serialize.

***

### outFile?

> `optional` **outFile**: `string`

Defined in: packages/crawlee-one/src/lib/config/types.ts:79

Output file path (relative to cwd).

Defaults to `.actor/actor.json` if `.actor/` exists, otherwise `./actor.json`.

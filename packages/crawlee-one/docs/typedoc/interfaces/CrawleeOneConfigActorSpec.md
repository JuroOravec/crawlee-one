[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigActorSpec

# Interface: CrawleeOneConfigActorSpec

Defined in: [packages/crawlee-one/src/lib/config/types.ts:107](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L107)

## Properties

### config

> **config**: `ActorSpec`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:111](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L111)

The `ActorSpec` object to serialize.

***

### outFile?

> `optional` **outFile**: `string`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:117](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L117)

Output file path (relative to cwd).

Defaults to `.actor/actorspec.json` if `.actor/` exists, otherwise `./actorspec.json`.

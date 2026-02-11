[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigActorSpec

# Interface: CrawleeOneConfigActorSpec

Defined in: [packages/crawlee-one/src/types/config.ts:79](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L79)

## Properties

### config

> **config**: `ActorSpec`

Defined in: [packages/crawlee-one/src/types/config.ts:83](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L83)

The `ActorSpec` object to serialize.

***

### outFile?

> `optional` **outFile**: `string`

Defined in: [packages/crawlee-one/src/types/config.ts:89](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L89)

Output file path (relative to cwd).

Defaults to `.actor/actorspec.json` if `.actor/` exists, otherwise `./actorspec.json`.

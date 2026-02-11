[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigActor

# Interface: CrawleeOneConfigActor

Defined in: [packages/crawlee-one/src/types/config.ts:66](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L66)

## Properties

### config

> **config**: `unknown`

Defined in: [packages/crawlee-one/src/types/config.ts:70](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L70)

The `ActorConfig` object to serialize.

***

### outFile?

> `optional` **outFile**: `string`

Defined in: [packages/crawlee-one/src/types/config.ts:76](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L76)

Output file path (relative to cwd).

Defaults to `.actor/actor.json` if `.actor/` exists, otherwise `./actor.json`.

[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneConfigActor

# Interface: CrawleeOneConfigActor

Defined in: [packages/crawlee-one/src/lib/config/types.ts:94](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L94)

## Properties

### config

> **config**: `unknown`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:98](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L98)

The `ActorConfig` object to serialize.

---

### outFile?

> `optional` **outFile**: `string`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:104](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L104)

Output file path (relative to cwd).

Defaults to `.actor/actor.json` if `.actor/` exists, otherwise `./actor.json`.

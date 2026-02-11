[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfig

# Interface: CrawleeOneConfig

Defined in: [packages/crawlee-one/src/types/config.ts:30](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L30)

## Properties

### actor?

> `optional` **actor**: [`CrawleeOneConfigActor`](CrawleeOneConfigActor.md)

Defined in: [packages/crawlee-one/src/types/config.ts:46](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L46)

Actor config generation settings (produces `actor.json`).

If omitted, `actor.json` generation is skipped.

***

### actorspec?

> `optional` **actorspec**: [`CrawleeOneConfigActorSpec`](CrawleeOneConfigActorSpec.md)

Defined in: [packages/crawlee-one/src/types/config.ts:52](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L52)

Actor spec generation settings (produces `actorspec.json`).

If omitted, `actorspec.json` generation is skipped.

***

### readme?

> `optional` **readme**: [`CrawleeOneConfigReadme`](CrawleeOneConfigReadme.md)

Defined in: [packages/crawlee-one/src/types/config.ts:58](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L58)

`README.md` generation settings.

If omitted, `README.md` generation is skipped.

***

### schema

> **schema**: [`CrawleeOneConfigSchema`](CrawleeOneConfigSchema.md)

Defined in: [packages/crawlee-one/src/types/config.ts:34](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L34)

Schema defining the crawlers in this project. This schema is used for code generation.

***

### types?

> `optional` **types**: [`CrawleeOneConfigTypes`](CrawleeOneConfigTypes.md)

Defined in: [packages/crawlee-one/src/types/config.ts:40](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L40)

Type generation settings.

If omitted, type generation is skipped.

***

### version

> **version**: `1`

Defined in: [packages/crawlee-one/src/types/config.ts:32](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L32)

Version of the CrawleeOne config.

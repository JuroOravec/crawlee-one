[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigGenerate

# Interface: CrawleeOneConfigGenerate\<TRenderer\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:39

Settings for code generation (types, actor.json, actorspec.json, README).

All fields are optional. Omitted sections are skipped.

## Type Parameters

### TRenderer

`TRenderer` *extends* [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\> = [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\>

## Properties

### actor?

> `optional` **actor**: [`CrawleeOneConfigActor`](CrawleeOneConfigActor.md)

Defined in: packages/crawlee-one/src/lib/config/types.ts:45

Actor config generation (produces `actor.json`). If omitted, generation is skipped.

***

### actorspec?

> `optional` **actorspec**: [`CrawleeOneConfigActorSpec`](CrawleeOneConfigActorSpec.md)

Defined in: packages/crawlee-one/src/lib/config/types.ts:47

Actor spec generation (produces `actorspec.json`). If omitted, generation is skipped.

***

### readme?

> `optional` **readme**: [`CrawleeOneConfigReadme`](CrawleeOneConfigReadme.md)\<`TRenderer`\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:49

README generation. If omitted, generation is skipped.

***

### types?

> `optional` **types**: [`CrawleeOneConfigTypes`](CrawleeOneConfigTypes.md)

Defined in: packages/crawlee-one/src/lib/config/types.ts:43

TypeScript type generation. If omitted, generation is skipped.

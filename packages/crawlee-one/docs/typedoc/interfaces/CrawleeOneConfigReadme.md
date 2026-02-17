[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigReadme

# Interface: CrawleeOneConfigReadme\<TRenderer\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:95

## Type Parameters

### TRenderer

`TRenderer` *extends* [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\> = [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`unknown`\>

## Properties

### actorSpec?

> `optional` **actorSpec**: `ActorSpec`

Defined in: packages/crawlee-one/src/lib/config/types.ts:105

The `ActorSpec` data passed to the renderer.

***

### input?

> `optional` **input**: `TRenderer` *extends* [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`I`\> ? `I` : `unknown`

Defined in: packages/crawlee-one/src/lib/config/types.ts:118

Renderer-specific data. Shape depends on the renderer.

Everything the renderer needs (templates, helper functions, etc.)
is passed through this single object.

***

### outFile?

> `optional` **outFile**: `string`

Defined in: packages/crawlee-one/src/lib/config/types.ts:103

Output file path (relative to cwd).

Defaults to `.actor/README.md` if `.actor/` exists, otherwise `./README.md`.

***

### renderer?

> `optional` **renderer**: `TRenderer`

Defined in: packages/crawlee-one/src/lib/config/types.ts:111

The renderer function that produces the README string.

Falls back to `defaultReadmeRenderer` if not provided.

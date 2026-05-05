[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneConfigReadme

# Interface: CrawleeOneConfigReadme\<TRenderer\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:120](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L120)

## Type Parameters

### TRenderer

`TRenderer` _extends_ [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\> = [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`unknown`\>

## Properties

### actorSpec?

> `optional` **actorSpec**: `ActorSpec`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:130](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L130)

The `ActorSpec` data passed to the renderer.

---

### input?

> `optional` **input**: `TRenderer` _extends_ [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`I`\> ? `I` : `unknown`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:143](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L143)

Renderer-specific data. Shape depends on the renderer.

Everything the renderer needs (templates, helper functions, etc.)
is passed through this single object.

---

### outFile?

> `optional` **outFile**: `string`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:128](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L128)

Output file path (relative to cwd).

Defaults to `.actor/README.md` if `.actor/` exists, otherwise `./README.md`.

---

### renderer?

> `optional` **renderer**: `TRenderer`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:136](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L136)

The renderer function that produces the README string.

Falls back to `defaultReadmeRenderer` if not provided.

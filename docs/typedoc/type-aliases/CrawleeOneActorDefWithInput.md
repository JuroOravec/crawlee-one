[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneActorDefWithInput

# Type Alias: CrawleeOneActorDefWithInput\<T\>

> **CrawleeOneActorDefWithInput**\<`T`\> = `Omit`\<[`CrawleeOneActorDef`](../interfaces/CrawleeOneActorDef.md)\<`T`\>, `"input"`\> & `object`

Defined in: [src/lib/actor/types.ts:280](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L280)

CrawleeOneActorDef object where the input is already resolved

## Type Declaration

### input

> **input**: `T`\[`"input"`\] \| `null`

### state

> **state**: `Record`\<`string`, `unknown`\>

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

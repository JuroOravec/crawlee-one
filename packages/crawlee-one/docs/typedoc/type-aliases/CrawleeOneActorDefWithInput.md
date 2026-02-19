[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorDefWithInput

# Type Alias: CrawleeOneActorDefWithInput\<T\>

> **CrawleeOneActorDefWithInput**\<`T`\> = `Omit`\<[`CrawleeOneActorDef`](../interfaces/CrawleeOneActorDef.md)\<`T`\>, `"input"`\> & `object`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:307](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L307)

CrawleeOneActorDef object where the input is already resolved

## Type Declaration

### input

> **input**: `T`\[`"input"`\] \| `null`

### state

> **state**: `Record`\<`string`, `unknown`\>

## Type Parameters

### T

`T` *extends* [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)

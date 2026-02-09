[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneHookFn

# Type Alias: CrawleeOneHookFn()\<TArgs, TReturn, T\>

> **CrawleeOneHookFn**\<`TArgs`, `TReturn`, `T`\> = (...`args`) => [`MaybePromise`](MaybePromise.md)\<`TReturn`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:129](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actor/types.ts#L129)

## Type Parameters

### TArgs

`TArgs` *extends* `any`[] = \[\]

### TReturn

`TReturn` = `void`

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md) = [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

## Parameters

### args

...\[`...TArgs`, [`CrawleeOneHookCtx`](CrawleeOneHookCtx.md)\<`T`\>\]

## Returns

[`MaybePromise`](MaybePromise.md)\<`TReturn`\>

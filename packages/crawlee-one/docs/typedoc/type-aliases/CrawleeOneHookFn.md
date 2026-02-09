[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneHookFn

# Type Alias: CrawleeOneHookFn()\<TArgs, TReturn, T\>

> **CrawleeOneHookFn**\<`TArgs`, `TReturn`, `T`\> = (...`args`) => [`MaybePromise`](MaybePromise.md)\<`TReturn`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:129](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L129)

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

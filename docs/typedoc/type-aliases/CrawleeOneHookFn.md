[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneHookFn

# Type alias: CrawleeOneHookFn()\<TArgs, TReturn, T\>

> **CrawleeOneHookFn**\<`TArgs`, `TReturn`, `T`\>: (...`args`) => [`MaybePromise`](MaybePromise.md)\<`TReturn`\>

## Type parameters

• **TArgs** *extends* `any`[] = []

• **TReturn** = `void`

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md) = [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

## Parameters

• ...**args**: [`...TArgs`, [`CrawleeOneHookCtx`](CrawleeOneHookCtx.md)\<`T`\>]

## Returns

[`MaybePromise`](MaybePromise.md)\<`TReturn`\>

## Source

[src/lib/actor/types.ts:129](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L129)

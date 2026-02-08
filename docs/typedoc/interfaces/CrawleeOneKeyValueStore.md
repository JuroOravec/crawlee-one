[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneKeyValueStore

# Interface: CrawleeOneKeyValueStore

Interface for storing and retrieving data in/from KeyValueStore.

KeyValueStore is a cache / map structure, where entries are retrieved and saved
under keys.

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Properties

### clear()

> **clear**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Removes all entries from the store.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/integrations/types.ts:223](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L223)

***

### drop()

> **drop**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Removes the key-value store either from the cloud storage or from the local directory,
depending on the mode of operation.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/integrations/types.ts:221](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L221)

***

### setValue()

> **setValue**: (`key`, `value`, `options`?) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Saves or deletes a record in the key-value store. The function returns a promise that
resolves once the record has been saved or deleted.

If value is null, the record is deleted instead. Note that the setValue() function
succeeds regardless whether the record existed or not.

Beware that the key can be at most 256 characters long and only contain the following
characters: a-zA-Z0-9!-_.'()

To retrieve a value from the key-value store, use the [CrawleeOneKeyValueStore.getValue](CrawleeOneKeyValueStore.md#getvalue)
function.

#### Parameters

• **key**: `string`

• **value**: `any`

• **options?**

• **options.contentType?**: `string`

Specifies a custom MIME content type of the record.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/integrations/types.ts:209](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L209)

## Methods

### getValue()

> **getValue**\<`T`\>(`key`, `defaultValue`): `Promise`\<`T`\>

Gets a value from the key-value store.

The function returns a `Promise` that resolves to the record value.

If the record does not exist, the function resolves to `null`.

To save or delete a value in the key-value store, use the
[CrawleeOneKeyValueStore.setValue](CrawleeOneKeyValueStore.md#setvalue) function.

#### Type parameters

• **T** = `unknown`

#### Parameters

• **key**: `string`

Unique key of the record. It can be at most 256 characters long and only consist
  of the following characters: `a`-`z`, `A`-`Z`, `0`-`9` and `!-_.'()`

• **defaultValue**: `T`

#### Returns

`Promise`\<`T`\>

Returns a promise that resolves to the value, or the default value if the key is missing from the store.

#### Source

[src/lib/integrations/types.ts:195](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L195)

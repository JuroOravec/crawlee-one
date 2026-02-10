[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ViewTransformation

# Interface: ViewTransformation\<TFields\>

Defined in: [outputSchema.ts:64](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L64)

See https://docs.apify.com/platform/actors/development/output-schema#viewtransformation-object-definition

## Type Parameters

### TFields

`TFields` *extends* `string` = `string`

## Properties

### desc?

> `optional` **desc**: `boolean`

Defined in: [outputSchema.ts:117](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L117)

By default, results are sorted in ascending based
on the write event into the dataset. `desc: true` param
will return the newest writes to the dataset first.

***

### fields

> **fields**: (`string` \| `TFields`)[]

Defined in: [outputSchema.ts:71](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L71)

Selects fields that are going to be presented in the output.
The order of fields matches the order of columns
in visualization UI. In case the fields value
is missing, it will be presented as "undefined" in the UI.

***

### flatten?

> `optional` **flatten**: `TFields`[]

Defined in: [outputSchema.ts:101](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L101)

Transforms nested object into flat structure.
e.g. with

`flatten: ["foo"]`

the object

`{ "foo": { "bar": "hello" } }`

is turned into

`{ "foo.bar": "hello" }

***

### limit?

> `optional` **limit**: `number`

Defined in: [outputSchema.ts:111](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L111)

The maximum number of results returned.
Default is all results.

***

### omit?

> `optional` **omit**: (`string` \| `TFields`)[]

Defined in: [outputSchema.ts:106](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L106)

Removes the specified fields from the output.
Nested fields names can be used there as well.

***

### unwind?

> `optional` **unwind**: `TFields`[]

Defined in: [outputSchema.ts:86](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L86)

Deconstructs nested children into parent object,
e.g. with

`unwind: ["foo"]`

the object

`{"foo": { "bar": "hello" }}`

is turned into

`{ "bar": "hello" }`

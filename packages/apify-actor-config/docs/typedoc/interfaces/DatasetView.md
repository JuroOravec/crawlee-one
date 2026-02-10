[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / DatasetView

# Interface: DatasetView\<TTransform, TViewDisplay\>

Defined in: [outputSchema.ts:43](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L43)

See https://docs.apify.com/platform/actors/development/output-schema#datasetview-object-definition

## Type Parameters

### TTransform

`TTransform` *extends* [`ViewTransformation`](ViewTransformation.md) = [`ViewTransformation`](ViewTransformation.md)

### TViewDisplay

`TViewDisplay` *extends* [`ViewDisplay`](ViewDisplay.md) = [`ViewDisplay`](ViewDisplay.md)

## Properties

### description?

> `optional` **description**: `string`

Defined in: [outputSchema.ts:53](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L53)

The description is only available in the API response.
The usage of this field is optional.

***

### display

> **display**: `TViewDisplay`

Defined in: [outputSchema.ts:60](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L60)

The definition of Output tab UI visualization.

***

### title

> **title**: `string`

Defined in: [outputSchema.ts:48](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L48)

The title is visible in UI in the Output tab as well as in the API.

***

### transformation

> **transformation**: `TTransform`

Defined in: [outputSchema.ts:58](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L58)

The definition of data transformation is applied when dataset
data are loaded from Dataset API.

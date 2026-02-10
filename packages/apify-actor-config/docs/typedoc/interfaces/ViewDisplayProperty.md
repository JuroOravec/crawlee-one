[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ViewDisplayProperty

# Interface: ViewDisplayProperty

Defined in: [outputSchema.ts:134](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L134)

See https://docs.apify.com/platform/actors/development/output-schema#viewdisplayproperty-object-definition

## Properties

### format?

> `optional` **format**: `"number"` \| `"boolean"` \| `"object"` \| `"array"` \| `"text"` \| `"date"` \| `"link"` \| `"image"`

Defined in: [outputSchema.ts:144](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L144)

Describes how output data values are formatted
in order to be rendered in the output tab UI.

***

### label?

> `optional` **label**: `string`

Defined in: [outputSchema.ts:139](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L139)

In case the data are visualized as in Table view.
The label will be visible table column's header.

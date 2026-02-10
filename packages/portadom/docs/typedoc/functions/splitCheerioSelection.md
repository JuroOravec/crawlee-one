[**portadom**](../README.md)

***

[portadom](../globals.md) / splitCheerioSelection

# Function: splitCheerioSelection()

> **splitCheerioSelection**\<`T`\>(`cheerioSel`): `Cheerio`\<`T`\>[]

Defined in: [dom/domUtils.ts:17](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/domUtils.ts#L17)

Given a Cheerio selection, split it into an array of Cheerio selections,
where each has only one element.

From `Cheerio[el, el, el, el]`

To `[Cheerio[el], Cheerio[el], Cheerio[el], Cheerio[el]]`

## Type Parameters

### T

`T` *extends* `AnyNode`

## Parameters

### cheerioSel

`Cheerio`\<`T`\>

## Returns

`Cheerio`\<`T`\>[]

[**portadom**](../README.md)

***

[portadom](../globals.md) / Portadom

# Interface: Portadom\<El, TNewEl\>

Defined in: dom/types.ts:23

Common interface for working with DOM despite different environments.

Consider these environments:
1) Browser (via Playwright & Chromium) - uses Browser API to work with DOM
2) Cheerio - uses own API to work with DOM

This common interfaces makes the scraping code more portable between the two.

## Type Parameters

### El

`El`

### TNewEl

`TNewEl` = `El`

## Properties

### attr()

> **attr**: (`attrName`, `options?`) => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:39

Get element's attribute

#### Parameters

##### attrName

`string`

##### options?

###### allowEmpty?

`boolean`

#### Returns

`MaybePromise`\<`string` \| `null`\>

***

### attrs()

> **attrs**: \<`T`\>(`attrNames`, `options?`) => `MaybePromise`\<`Record`\<`T`, `string` \| `null`\>\>

Defined in: dom/types.ts:41

Get element's attributes

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### attrNames

`T`[]

##### options?

###### allowEmpty?

`boolean`

#### Returns

`MaybePromise`\<`Record`\<`T`, `string` \| `null`\>\>

***

### children()

> **children**: \<`TFindEl`\>() => [`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:81

Get element's children

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Returns

[`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

***

### closest()

> **closest**: \<`TFindEl`\>(`selector`) => [`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:77

Get a single ancestor (or itself) matching the selector

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Parameters

##### selector

`string`

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

***

### findMany()

> **findMany**: \<`TFindEl`\>(`selector`) => [`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:75

Get all descendants matching the selector

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Parameters

##### selector

`string`

#### Returns

[`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

***

### findOne()

> **findOne**: \<`TFindEl`\>(`selector`) => [`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:73

Get a single descendant matching the selector

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Parameters

##### selector

`string`

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

***

### getCommonAncestor()

> **getCommonAncestor**: \<`TFindEl`\>(`otherEl`) => [`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:91

Given two elements, return closest ancestor element that encompases them both,
or `null` if none such found.

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Parameters

##### otherEl

`El`

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

***

### getCommonAncestorFromSelector()

> **getCommonAncestorFromSelector**: \<`TFindEl`\>(`selector`) => [`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:97

Given a selector, find all DOM elements that match the selector,
and return closest ancestor element that encompases them all,
or `null` if none such found.

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Parameters

##### selector

`string`

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

***

### href()

> **href**: (`options?`) => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:58

Get element's href

#### Parameters

##### options?

`object` & `FormatUrlOptions`

#### Returns

`MaybePromise`\<`string` \| `null`\>

***

### map()

> **map**: \<`TVal`\>(`map`) => `MaybePromise`\<`TVal`\>

Defined in: dom/types.ts:66

Freely modify the underlying DOM node

#### Type Parameters

##### TVal

`TVal`

#### Parameters

##### map

(`node`) => `TVal`

#### Returns

`MaybePromise`\<`TVal`\>

***

### node

> **node**: `El` \| `null`

Defined in: dom/types.ts:24

***

### nodeName()

> **nodeName**: () => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:62

Get element's nodeName

#### Returns

`MaybePromise`\<`string` \| `null`\>

***

### parent()

> **parent**: \<`TFindEl`\>() => [`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:79

Get element's parent

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

***

### prop()

> **prop**: \<`R`\>(`propName`, `options?`) => `MaybePromise`\<`R`\>

Defined in: dom/types.ts:46

Get element's property

#### Type Parameters

##### R

`R` = `any`

#### Parameters

##### propName

`MaybeArray`\<`string`\>

Single or nested prop path

##### options?

###### allowEmpty?

`boolean`

#### Returns

`MaybePromise`\<`R`\>

***

### props()

> **props**: \<`R`\>(`propName`, `options?`) => `MaybePromise`\<`R`\>

Defined in: dom/types.ts:52

Get element's properties

#### Type Parameters

##### R

`R` = `any`

#### Parameters

##### propName

`MaybeArray`\<`string`\>[]

List of single or nested prop paths

##### options?

###### allowEmpty?

`boolean`

#### Returns

`MaybePromise`\<`R`\>

***

### remove()

> **remove**: () => `MaybePromise`\<`void`\>

Defined in: dom/types.ts:83

Remove the element

#### Returns

`MaybePromise`\<`void`\>

***

### root()

> **root**: \<`TFindEl`\>() => [`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

Defined in: dom/types.ts:85

Get root element

#### Type Parameters

##### TFindEl

`TFindEl` = `TNewEl`

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`TFindEl`\>

***

### src()

> **src**: (`options?`) => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:60

Get element's src

#### Parameters

##### options?

`object` & `FormatUrlOptions`

#### Returns

`MaybePromise`\<`string` \| `null`\>

***

### text()

> **text**: (`options?`) => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:31

Get element's text (trimmed)

#### Parameters

##### options?

###### allowEmpty?

`boolean`

#### Returns

`MaybePromise`\<`string` \| `null`\>

***

### textAsLower()

> **textAsLower**: (`options?`) => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:35

Get element's text as lowercase (trimmed)

#### Parameters

##### options?

###### allowEmpty?

`boolean`

#### Returns

`MaybePromise`\<`string` \| `null`\>

***

### textAsNumber()

> **textAsNumber**: (`options?`) => `MaybePromise`\<`number` \| `null`\>

Defined in: dom/types.ts:37

Get element's text and convert it to number

#### Parameters

##### options?

`StrAsNumOptions`

#### Returns

`MaybePromise`\<`number` \| `null`\>

***

### textAsUpper()

> **textAsUpper**: (`options?`) => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:33

Get element's text as uppercase (trimmed)

#### Parameters

##### options?

###### allowEmpty?

`boolean`

#### Returns

`MaybePromise`\<`string` \| `null`\>

***

### url()

> **url**: () => `MaybePromise`\<`string` \| `null`\>

Defined in: dom/types.ts:64

Get URL of website associated with the DOM

#### Returns

`MaybePromise`\<`string` \| `null`\>

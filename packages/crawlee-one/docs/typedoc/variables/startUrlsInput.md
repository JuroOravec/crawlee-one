[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / startUrlsInput

# Variable: startUrlsInput

> `const` **startUrlsInput**: `object`

Defined in: [packages/crawlee-one/src/lib/input.ts:752](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L752)

Common input fields for defining URLs to scrape

## Type Declaration

### startUrls

> **startUrls**: `ArrayField`\<`unknown`, `ZodOptional`\<`ZodArray`\<`ZodUnion`\<\[`ZodString`, `ZodObject`\<\{ \}, `"passthrough"`, `ZodTypeAny`, `objectOutputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>, `objectInputType`\<\{ \}, `ZodTypeAny`, `"passthrough"`\>\>\]\>, `"many"`\>\>\>

### startUrlsFromDataset

> **startUrlsFromDataset**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### startUrlsFromFunction

> **startUrlsFromFunction**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodUnion`\<\[`ZodString`, `ZodFunction`\<`ZodTuple`\<\[\], `ZodUnknown`\>, `ZodUnknown`\>\]\>\>\>

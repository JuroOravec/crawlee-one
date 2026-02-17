[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / crawlerInput

# Variable: crawlerInput

> `const` **crawlerInput**: `object`

Defined in: [packages/crawlee-one/src/lib/input.ts:580](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L580)

Common input fields related to crawler setup

## Type Declaration

### additionalMimeTypes

> **additionalMimeTypes**: `ArrayField`\<`unknown`, `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>\>

### forceResponseEncoding

> **forceResponseEncoding**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### ignoreSslErrors

> **ignoreSslErrors**: `BooleanField`\<`boolean`, `ZodOptional`\<`ZodBoolean`\>\>

### keepAlive

> **keepAlive**: `BooleanField`\<`boolean`, `ZodOptional`\<`ZodBoolean`\>\>

### maxConcurrency

> **maxConcurrency**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxCrawlDepth

> **maxCrawlDepth**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxRequestRetries

> **maxRequestRetries**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxRequestsPerCrawl

> **maxRequestsPerCrawl**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### maxRequestsPerMinute

> **maxRequestsPerMinute**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### minConcurrency

> **minConcurrency**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### navigationTimeoutSecs

> **navigationTimeoutSecs**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### requestHandlerTimeoutSecs

> **requestHandlerTimeoutSecs**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### suggestResponseEncoding

> **suggestResponseEncoding**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

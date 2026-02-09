[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / generateTypes

# Function: generateTypes()

> **generateTypes**(`outfile`, `configOrPath?`): `Promise`\<`void`\>

Defined in: [src/cli/commands/codegen.ts:251](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/cli/commands/codegen.ts#L251)

Generate types for CrawleeOne given a config.

Config can be passed directly, or as the path to the config file.
If the config is omitted, it is automatically searched for using CosmicConfig.

## Parameters

### outfile

`string`

### configOrPath?

`string` | [`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)

## Returns

`Promise`\<`void`\>

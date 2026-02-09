[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / generateTypes

# Function: generateTypes()

> **generateTypes**(`outfile`, `configOrPath?`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/cli/commands/codegen.ts:251](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/cli/commands/codegen.ts#L251)

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

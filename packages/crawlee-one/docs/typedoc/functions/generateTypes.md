[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / generateTypes

# Function: generateTypes()

> **generateTypes**(`configOrPath?`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/cli/commands/generateTypes.ts:254](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/cli/commands/generateTypes.ts#L254)

Generate types for CrawleeOne given a config.

Reads the output file path from `config.types.outFile`.
If the `types` section is not present in the config, generation is skipped.

Config can be passed directly, or as the path to the config file.
If the config is omitted, it is automatically searched for using CosmicConfig.

## Parameters

### configOrPath?

`string` | [`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)

## Returns

`Promise`\<`void`\>

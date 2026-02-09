[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / loadConfig

# Function: loadConfig()

> **loadConfig**(`configFilePath?`): `Promise`\<[`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md) \| `null`\>

Defined in: [src/cli/commands/config.ts:51](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/cli/commands/config.ts#L51)

Load CrawleeOne config file. Config will be searched for using CosmicConfig.

Optionally, you can supply path to the config file.

Learn more: https://github.com/cosmiconfig/cosmiconfig

## Parameters

### configFilePath?

`string`

## Returns

`Promise`\<[`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md) \| `null`\>

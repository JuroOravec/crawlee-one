[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigSchema

# Interface: CrawleeOneConfigSchema

Defined in: [packages/crawlee-one/src/types/config.ts:176](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L176)

Schema defining the crawlers in a project. This schema is used for code generation.

## Properties

### crawlers

> **crawlers**: `Record`\<`string`, [`CrawleeOneConfigSchemaCrawler`](CrawleeOneConfigSchemaCrawler.md)\>

Defined in: [packages/crawlee-one/src/types/config.ts:190](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L190)

Object holding crawler configurations. Each crawler is identified by its key.

E.g.

```js
{
  myCrawler: {
    type: 'cheerio',
    routes: [...],
  }
}
```

[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigSchema

# Interface: CrawleeOneConfigSchema

Defined in: packages/crawlee-one/src/types/config.ts:11

Schema defining the crawlers in a project. This schema is used for code generation.

## Properties

### crawlers

> **crawlers**: `Record`\<`string`, [`CrawleeOneConfigSchemaCrawler`](CrawleeOneConfigSchemaCrawler.md)\>

Defined in: packages/crawlee-one/src/types/config.ts:25

Object holding crawler configurations. Each crawler is idefntified by its key.

E.g.

```js
{
  myCrawler: {
    type: 'cheerio',
    routes: [...],
  }
}
```

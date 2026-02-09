[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneConfigSchema

# Interface: CrawleeOneConfigSchema

Defined in: [src/types/config.ts:11](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/types/config.ts#L11)

Schema defining the crawlers in a project. This schema is used for code generation.

## Properties

### crawlers

> **crawlers**: `Record`\<`string`, [`CrawleeOneConfigSchemaCrawler`](CrawleeOneConfigSchemaCrawler.md)\>

Defined in: [src/types/config.ts:25](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/types/config.ts#L25)

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

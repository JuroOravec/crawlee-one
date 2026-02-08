[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneConfigSchema

# Interface: CrawleeOneConfigSchema

Schema defining the crawlers in a project. This schema is used for code generation.

## Properties

### crawlers

> **crawlers**: `Record`\<`string`, [`CrawleeOneConfigSchemaCrawler`](CrawleeOneConfigSchemaCrawler.md)\>

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

#### Source

[src/types/config.ts:25](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/types/config.ts#L25)

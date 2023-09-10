[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneConfigSchema

# Interface: CrawleeOneConfigSchema

Schema defining the crawlers in a project. This schema is used for code generation.

## Table of contents

### Properties

- [crawlers](CrawleeOneConfigSchema.md#crawlers)

## Properties

### crawlers

• **crawlers**: `Record`<`string`, [`CrawleeOneConfigSchemaCrawler`](CrawleeOneConfigSchemaCrawler.md)\>

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

#### Defined in

[src/types/config.ts:25](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/types/config.ts#L25)

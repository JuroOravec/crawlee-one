# 3. Simple transformations: Select, rename, and limit fields

> **TL;DR:** Rename fields, select specific columns, and cap the number of entries -- all from input config, no coding required.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

Scraped data rarely matches the exact format your downstream system expects. Field names don't align with the CRM schema, there are extra columns you don't need, and the dataset is larger than necessary.

Typically, this means writing a separate script to post-process the data -- or asking a developer to do it every time. CrawleeOne lets you handle these adjustments directly from the scraper input, with no code.

## Input fields

- `outputMaxEntries` -- Cap the number of entries scraped.
- `outputPickFields` -- Keep only the specified fields (the rest is discarded).
- `outputRenameFields` -- Rename fields so the output matches what the downstream system expects. Supports nested paths.

## Example

Given this scraped entry:

```json
{
  "id": "xxxx-xxxx-xxxx-xxxx",
  "name": "XXXX XXXX",
  "profileUrl": "https://producthunt.com/p/xxxxxx",
  "email": "xxxx@xxxx.xx",
  "description": "<SOME VERY LONG TEXT>",
  "media": {
    "photos": [{ "data": { "photoUrl": "https://.../img.png" } }]
  }
}
```

Apply this input:

```json
{
  "outputRenameFields": { "photoUrl": "media.photos[0].data.photoUrl" },
  "outputPickFields": ["name", "email", "profileUrl", "photoUrl"]
}
```

The output becomes:

```json
{
  "name": "XXXX XXXX",
  "profileUrl": "https://producthunt.com/p/xxxxxx",
  "email": "xxxx@xxxx.xx",
  "photoUrl": "https://.../img.png"
}
```

**Result:** Fields renamed, extras removed, output ready for the CRM -- all configured from the Apify UI.

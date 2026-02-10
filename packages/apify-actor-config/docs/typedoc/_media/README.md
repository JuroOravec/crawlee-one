**apify-actor-config**

***

# apify-actor-config

**Type-safe Apify Actor config. Full autocomplete, compile-time validation.**

Apify Actors need an `actor.json` that defines metadata, input schemas, and output schemas. The input schema alone has 6 field types, 18 input fields, and dozens of type-specific properties.

One typo and your Actor breaks at deploy time with no useful error.

Apify doesn't publish official types for this. `apify-actor-config` fills the gap.

Write Actor config in `.ts`, get full autocomplete, catch mistakes at compile time, and generate `actor.json` from it.

```sh
npm install apify-actor-config
```

## Quick start

Define your Apify `actor.json` config in TypeScript. This file can live anywhere and have any name.

```ts
// config.ts
import {
  createActorConfig,
  createActorInputSchema,
  createStringField,
  createObjectField,
} from 'apify-actor-config';

// Define actor inputs
const inputSchema = createActorInputSchema({
  schemaVersion: 1,
  title: 'My Scraper',
  type: 'object',
  properties: {
    startUrl: createStringField({
      title: 'Start URL',
      type: 'string',
      description: 'URL to start scraping from',
      editor: 'textfield',
      example: 'https://example.com',
    }),
    proxy: createObjectField({
      title: 'Proxy configuration',
      type: 'object',
      description: 'Select proxies to be used.',
      editor: 'proxy',
      sectionCaption: 'Proxy',
    }),
  },
});

// Define actor
export default createActorConfig({
  actorSpecification: 1,
  name: 'my-scraper',
  version: '0.1',
  input: inputSchema,
});
```

Compile it to JS, then point the CLI at the compiled output:

```sh
npx apify-actor-config gen --config ./dist/config.js
```

This generates an `actor.json` file inside `.actor/`.

If there is no `./actor/` directory, the file is saved to `./actor.json`.

## Why apify-actor-config?

### Autocomplete for every field, editor, and property.

No more guessing which editors are valid for `array` fields, or what `datepicker` requires. Your IDE tells you.

### Catch errors before deploy.

A misspelled `"editor": "textfeild"` fails the compiler, not your production Actor.

### Field-specific types.

Available properties and their types depend on the type of the field. `StringField` expects different values than `ArrayField`. The compiler rejects anything else.

### One source of truth.

Write config in TypeScript. Generate `actor.json` from it. No manual sync, no drift.

## Before and after

<details>
<summary>What changes when you switch from JSON to TypeScript (click to expand)</summary>

**With apify-actor-config:**

```ts
import { createActorConfig, createActorInputSchema, createStringField } from 'apify-actor-config';

export default createActorConfig({
  actorSpecification: 1,
  name: 'my-scraper',
  version: '0.1',
  input: createActorInputSchema({
    schemaVersion: 1,
    title: 'My Scraper',
    type: 'object',
    properties: {
      startUrl: createStringField({
        title: 'Start URL',
        type: 'string',
        description: 'URL to start scraping from',
        editor: 'textfield', // ← autocomplete shows all valid editors
        pattern: '^https://',
        errorMessage: { pattern: 'URL must start with https://' },
      }),
    },
  }),
});
```

**Without (hand-written `actor.json`):**

```json
{
  "actorSpecification": 1,
  "name": "my-scraper",
  "version": "0.1",
  "input": {
    "schemaVersion": 1,
    "title": "My Scraper",
    "type": "object",
    "properties": {
      "startUrl": {
        "title": "Start URL",
        "type": "string",
        "description": "URL to start scraping from",
        "editor": "textfeild",
        "pattern": "^https://",
        "errorMessage": { "patttern": "URL must start with https://" }
      }
    }
  }
}
```

Spot the two typos? Your users will -- at runtime. TypeScript catches both at compile time.

</details>

## CLI

```sh
npx apify-actor-config gen --config ./dist/config.js
```

### `gen`

Generate `actor.json` from a compiled JS config module.

| Flag                   | Required | Description                                                                            |
| ---------------------- | -------- | -------------------------------------------------------------------------------------- |
| `-c, --config <path>`  | Yes      | Path to the compiled JS config file.                                                   |
| `-o, --out-dir [path]` | No       | Output directory. Defaults to `.actor/` if it exists, otherwise the current directory. |
| `-s, --silent`         | No       | Suppress log output.                                                                   |

## Documentation

| Document                                  | Description                         |
| ----------------------------------------- | ----------------------------------- |
| [API reference](_media/README.md) | Auto-generated TypeScript API docs. |
| [Changelog](_media/CHANGELOG.md)               | Release history.                    |

## License

MIT

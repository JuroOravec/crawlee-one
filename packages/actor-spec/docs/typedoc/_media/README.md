**actor-spec**

***

# actor-spec

**Publish your Apify Actors on other platforms. Define once, run anywhere.**

Apify actors are powerful, but they lock your scraper definitions to one platform.

If you want to self-host, migrate to another provider, or run the same actor across multiple environments, there is no standard way to describe what an actor _is_ outside of Apify's ecosystem.

`actor-spec` is a platform-agnostic schema for actor metadata -- features, pricing, performance, datasets, privacy compliance -- expressed as TypeScript types. Describe your actors once.

```sh
npm install actor-spec
```

## Quick start

Define an actor spec in TypeScript:

```ts
// actorspec.ts
import type { ScraperActorSpec } from 'actor-spec';

const spec: ScraperActorSpec = {
  actorspecVersion: 1,
  actor: {
    title: 'Product Scraper',
    publicUrl: 'https://apify.com/my-org/product-scraper',
    shortDesc: 'Extracts product data from example.com',
    datasetOverviewImgUrl: null,
  },
  platform: {
    name: 'apify',
    url: 'https://apify.com',
    authorId: 'my-org',
    authorProfileUrl: 'https://apify.com/my-org',
    actorId: 'product-scraper',
  },
  authors: [{ name: 'Jane', email: 'jane@example.com', authorUrl: null }],
  websites: [{ name: 'Example Store', url: 'https://example.com' }],
  pricing: {
    pricingType: 'none',
    value: 0,
    currency: 'usd',
    period: 0,
    periodUnit: '',
  },
  datasets: [
    // Dataset definitions with filters, modes, perf stats, privacy...
  ],
};

export default spec;
```

Compile it to JS, then point the CLI at the compiled output:

```sh
npx actor-spec gen --config ./dist/actorspec.js
```

This generates `actorspec.json` inside `.actor/`.

If there is no `.actor/` directory, the file is saved to the current dir.

## Why actor-spec?

### Move actors off Apify -- or run them on both.

The spec captures everything about an actor in a single file: what it does, what data it extracts, how fast it runs, what it costs. That definition is yours, independent of any platform.

### Self-host with confidence.

When you self-host an actor, you lose Apify's metadata layer. `actor-spec` replaces it. Your tooling can read `actorspec.json` to discover datasets, validate configs, and generate documentation -- no platform required.

### Autocomplete for every field.

TypeScript types cover the full schema: actor metadata, dataset features, scraper modes, perf stats, fault tolerance, and privacy fields. Your IDE fills in the rest.

### Compare actors across platforms.

Structured performance data (`DatasetPerfStat`) and feature flags (`DatasetFeatures`) make it possible to programmatically compare scrapers on cost, speed, and capabilities -- even when they run on different infrastructure.

### Track privacy compliance.

Each dataset declares which fields contain personal data, whether that data is redacted, and which groups of people are affected. The same compliance metadata applies regardless of where the actor runs.

## CLI

```sh
npx actor-spec gen --config ./dist/actorspec.js
```

### `gen`

Generate `actorspec.json` from a compiled JS config module.

| Flag                   | Required | Description                                                                            |
| ---------------------- | -------- | -------------------------------------------------------------------------------------- |
| `-c, --config <path>`  | Yes      | Path to the compiled JS config file.                                                   |
| `-o, --out-dir [path]` | No       | Output directory. Defaults to `.actor/` if it exists, otherwise the current directory. |
| `-s, --silent`         | No       | Suppress log output.                                                                   |

The config file must have a default export -- either an `ActorSpec` object or an async function that returns one.

## Documentation

| Document                                  | Description                         |
| ----------------------------------------- | ----------------------------------- |
| [API reference](_media/README.md) | Auto-generated TypeScript API docs. |
| [Changelog](_media/CHANGELOG.md)               | Release history.                    |

## License

MIT

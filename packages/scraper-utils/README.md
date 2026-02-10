# scraper-utils

**Shared utilities for scrapers in the crawlee-one monorepo.**

This is a private package -- it is not published to npm. Scrapers consume it via `workspace:*` and tsup bundles it into their `dist/` at build time.

## Why this package exists

Scrapers share common needs: async iteration helpers, string and URL formatting, package metadata reading, and Apify README generation. Rather than duplicating this code in every scraper, it lives here as a single source of truth.

Because scrapers are deployed as Docker images without access to the monorepo, workspace dependencies are bundled into each scraper's output by tsup's `noExternal` option. This package is included in that bundle -- it adds no extra install step to the Docker image.

## What's included

| Module           | Exports                                                                                           | Purpose                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `types`          | `MaybePromise`, `MaybeArray`, `ArrVal`, `enumFromArray`                                           | Common type utilities                                            |
| `async`          | `wait`, `retryAsync`, `serialAsyncMap`, `serialAsyncFilter`, `serialAsyncFind`, `deferredPromise` | Serial async iteration, retries, delays                          |
| `format`         | `strOrNull`, `strAsNumber`                                                                        | String parsing and coercion                                      |
| `url`            | `validateUrl`, `resolveUrlPath`, `sortUrl`, `equalUrls`                                           | URL manipulation and comparison                                  |
| `package`        | `getPackageJsonInfo`                                                                              | Read fields from the nearest `package.json` relative to a module |
| `readme/apify/*` | `renderApifyReadme`, `defaultFeatureTexts`, Apify README types                                    | Generate Apify actor README from a template and actorspec        |

## Usage

Import everything from the package root:

```typescript
import { wait, serialAsyncMap, equalUrls } from 'scraper-utils';
import type { MaybePromise, ApifyScraperActorSpec } from 'scraper-utils';
```

### `getPackageJsonInfo`

This function walks up from the caller's directory to find the nearest `package.json`. Pass `import.meta.url` so it resolves relative to your scraper, not relative to scraper-utils:

```typescript
import { getPackageJsonInfo } from 'scraper-utils';

const pkg = getPackageJsonInfo(['name', 'version'], import.meta.url);
console.log(pkg.name); // "my-scraper"
```

### Apify README generation

Generate a rich README for an Apify actor from an actorspec and template overrides:

```typescript
import { renderApifyReadme } from 'scraper-utils';
import actorSpec from './actorspec.js';

await renderApifyReadme({
  filepath: './.actor/README.md',
  actorSpec,
  templates: {
    input: { maxCount: 'outputMaxEntries', privacyName: 'Include personal data' },
    perfTables: {
      /* ... */
    },
    exampleInputs: [
      /* ... */
    ],
    hooks: { introAfterBegin: 'Custom intro text.' },
  },
});
```

## Adding new utilities

If a utility is generic enough to be reused across scrapers:

1. Add the source file to `packages/scraper-utils/src/`.
2. Export it from `src/index.ts`.
3. Rebuild: `pnpm --filter scraper-utils build`.
4. All scrapers that list `scraper-utils` in their tsup `noExternal` will pick up the change on their next build.

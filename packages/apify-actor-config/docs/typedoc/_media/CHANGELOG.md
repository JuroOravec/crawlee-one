# Release notes

## Unreleased

#### Features

- All `Field` objects now have an optional `schema` property for embedding validation schemas (e.g. Zod). The property is automatically stripped when generating `actor.json`.

  ```ts
  import { z } from 'zod';
  import { createStringField } from 'apify-actor-config';

  const myField = createStringField({
    title: 'Target URL',
    type: 'string',
    description: 'URL to scrape',
    editor: 'textfield',
    schema: z.string().url(), // Embedded Zod schema -- stripped from actor.json
  });
  ```

## v2.0.0

_2026-02-10_

Migrated from [JuroOravec/apify-actor-config](https://github.com/JuroOravec/apify-actor-config) into the [crawlee-one monorepo](https://github.com/JuroOravec/crawlee-one).

#### Breaking Changes

- **This package is now pure ESM.** It can no longer be `require()`'d from CommonJS.
- Minimum Node.js version raised from 16 to 20.

#### Features

- Updated the `ActorConfig` schema to match Apify config as of 2026-02-10
- Test suite with >97% statement coverage (vitest).
- TypeDoc-generated API documentation.
- Quality assurance: GitHub Actions CI, Dependabot, release workflow with npm OIDC trusted publishing.
- Quarterly drift-check workflow to detect type drift against Apify docs.

#### Refactor

- Build system modernized: tsup (bundling) + tsc (declarations) replaces plain tsc.
- CLI rewritten for ESM (`import()` replaces `require()`).

## v1.0.3

_Previous release from the [standalone repository](https://github.com/JuroOravec/apify-actor-config)._

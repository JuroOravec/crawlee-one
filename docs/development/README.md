# Development Guide

This document covers everything you need to build, test, and contribute to crawlee-one.

## Prerequisites

- **Node.js** >= 20 (see `.nvmrc` for the pinned version)
- **npm** (ships with Node)
- **Playwright browsers** (for integration tests that use `PlaywrightCrawler`)

```sh
nvm use           # switch to the pinned Node version
npm install       # install all dependencies
```

Playwright browsers are installed separately:

```sh
npx playwright install --with-deps chromium
```

## Commands

| Command              | What it does                                                    |
| -------------------- | --------------------------------------------------------------- |
| `npm run build`      | Bundle with tsup + emit declarations with tsc                   |
| `npm test`           | Run all tests once (Vitest)                                     |
| `npm run coverage`   | Run tests with v8 coverage report                               |
| `npm run lint`       | Lint `src/` with ESLint                                         |
| `npm run lint:fix`   | Lint and auto-fix                                               |
| `npm run start:dev`  | Run `src/index.ts` directly via tsx (for local experimentation) |
| `npm run start:prod` | Run the built `dist/index.js`                                   |
| `npm run gen:docs`   | Regenerate TypeDoc API docs into `docs/typedoc/`                |

## Project structure

```
src/
├── index.ts              # Public API -- re-exports everything consumers import
├── api.ts                # Top-level crawleeOne() function
├── cli/                  # CLI entry point (npx crawlee-one ...)
│   └── commands/         #   Subcommands (codegen, config)
├── types/                # Shared type definitions and config schema
├── lib/
│   ├── actor/            # Core actor logic
│   ├── router/           # Route matching and handler registration
│   ├── io/               # Data and request I/O
│   ├── error/            # Error capture and reporting
│   ├── input.ts          # Actor input schemas and validation (Joi)
│   ├── log.ts            # Log level helpers
│   ├── integrations/     # Platform-specific I/O implementations
│   ├── telemetry/        # Error/performance telemetry
│   ├── actions/          # High-level scraping patterns
│   ├── migrate/          # Data migration utilities
│   └── test/             # Shared test utilities
└── utils/                # General-purpose utilities
```

## Architecture

### Entry points

The package has three entry points, defined in `tsup.config.ts` and `package.json` `exports`:

| Import path          | File                            | Purpose                           |
| -------------------- | ------------------------------- | --------------------------------- |
| `crawlee-one`        | `src/index.ts`                  | Core API (framework-agnostic)     |
| `crawlee-one/apify`  | `src/lib/integrations/apify.ts` | Apify Actor I/O adapter           |
| `crawlee-one/sentry` | `src/lib/telemetry/sentry.ts`   | Sentry error tracking integration |

The CLI (`npx crawlee-one`) is a separate entry point at `src/cli/index.ts`.

### Crawler types

CrawleeOne supports seven crawler types, each mapping to a Crawlee class:

| Type                  | Crawlee class               | Use case                                  |
| --------------------- | --------------------------- | ----------------------------------------- |
| `basic`               | `BasicCrawler`              | Custom HTTP handling, no parsing          |
| `http`                | `HttpCrawler`               | Raw HTTP with Buffer body                 |
| `cheerio`             | `CheerioCrawler`            | Fast HTML scraping with jQuery-like API   |
| `jsdom`               | `JSDOMCrawler`              | DOM-based scraping without a browser      |
| `playwright`          | `PlaywrightCrawler`         | Full browser scraping                     |
| `adaptive-playwright` | `AdaptivePlaywrightCrawler` | Auto-switches between HTTP and Playwright |
| `puppeteer`           | `PuppeteerCrawler`          | Full browser scraping (Puppeteer)         |

The mapping lives in `src/constants.ts` (`actorClassByType`).

### Core flow

1. **`crawleeOne()`** (in `src/api.ts`) is the main entry point. It calls `runCrawleeOne()`.
2. **`runCrawleeOne()`** (in `src/lib/actor/actor.ts`) resolves input, creates scoped push/metamorph functions, registers routes, instantiates the correct crawler class, and runs it.
3. **Route matching** (in `src/lib/router/router.ts`) uses `registerHandlers` to wire named routes to the Crawlee Router. The default handler matches unlabeled requests against route matchers (regex, string, function) and re-enqueues them with the correct label.
4. **Data I/O** (in `src/lib/io/`) handles pushing data to datasets and requests to queues, with transforms, filters, privacy masking, and size limits applied.

### IO abstraction

All platform-specific operations (reading input, opening datasets, opening request queues, key-value stores) go through the `CrawleeOneIO` interface (`src/lib/integrations/types.ts`). The Apify implementation lives in `src/lib/integrations/apify.ts`. This makes the core framework testable and portable -- tests use mock IO objects.

## Build

The build has two steps (see `npm run build`):

1. **tsup** bundles the source into ESM in `dist/`.
2. **tsc** (via `tsconfig.build.json`) emits declaration files (`.d.ts`) separately. This is necessary because tsup's built-in DTS bundler cannot handle Apify's circular types.

## Testing

Tests use **Vitest** with colocated test files (`*.test.ts` next to the source).

### Running tests

```sh
npm test              # all tests, single run
npm run coverage      # with v8 coverage report
```

### Coverage thresholds

Coverage thresholds are configured in `vitest.config.ts`. CI enforces these -- they should only go up over time.

### Integration tests

Some tests spin up a local HTTP server to test real fetch-parse-handle pipelines. These require unrestricted process spawning (Crawlee's Snapshotter spawns child processes for system info).

See [testing-gotchas.md](./testing-gotchas.md) for project-specific pitfalls to be aware of when writing tests.

## Linting

ESLint (flat config) + Prettier. Run `npm run lint:fix` before committing.

## API docs

Generated with TypeDoc into `docs/typedoc/`. Regenerate after API changes:

```sh
npm run gen:docs
```

CI checks that generated docs are up to date -- if `gen:docs` produces uncommitted changes, the checks job fails.

## Release process

1. Update `CHANGELOG.md` with the new version's changes.
2. Bump the version in `package.json`.
3. Commit, push, and create a GitHub Release.
4. The release workflow automatically publishes to npm.

## Further reading

- [CONTRIBUTING.md](../../CONTRIBUTING.md) -- how to submit PRs and report bugs
- [testing-gotchas.md](./testing-gotchas.md) -- Crawlee-specific testing pitfalls
- [Getting started](../getting-started.md) -- user-facing guide for the library API
- [Features](../features.md) -- complete feature catalog

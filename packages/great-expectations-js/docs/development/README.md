# Development Guide

Internal guide for contributors working on `great-expectations-js`.

## Prerequisites

- Node.js >= 20 (see root `.nvmrc`)
- pnpm (workspace package manager)

## Commands

| Script              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `pnpm build`        | Bundle with tsup + emit declarations via tsc        |
| `pnpm dev`          | Watch mode (rebuilds on file changes)               |
| `pnpm test`         | Run tests once                                      |
| `pnpm test:watch`   | Run tests in watch mode                             |
| `pnpm coverage`     | Run tests with v8 coverage report                   |
| `pnpm lint`         | Lint `src/` with ESLint                             |
| `pnpm lint:fix`     | Auto-fix lint issues                                |
| `pnpm format`       | Format all files with Prettier                      |
| `pnpm format:check` | Check formatting without writing                    |
| `pnpm docs:gen`     | Generate API docs with TypeDoc into `docs/typedoc/` |

## Project structure

```
packages/great-expectations-js/
├── docs/
│   └── development/
│       └── README.md                        # This file
├── scripts/
│   └── list-ge-expectations.ts              # Fetch expectation names from upstream GE repo
├── src/
│   ├── types.ts                             # Core types (Dataset, ExpectationResult, etc.)
│   ├── utils.ts                             # Shared helpers (column extraction, result builders)
│   ├── expectations/                        # Grouped by concern
│   │   ├── table.ts                         # Table-level (row/column count, column set matching)
│   │   ├── columnExistence.ts               # Exist, null, unique, compound unique
│   │   ├── columnSet.ts                     # Set membership (in set, distinct values, etc.)
│   │   ├── columnRange.ts                   # Between, increasing, decreasing, lengths, types
│   │   ├── columnRegex.ts                   # Regex, JSON parseable, date parseable, strftime
│   │   ├── columnAggregate.ts               # Max, min, mean, median, sum, stdev, proportions
│   │   ├── columnPair.ts                    # Pair comparisons, multicolumn sum
│   │   ├── columnLike.ts                    # SQL LIKE pattern matching
│   │   ├── columnStats.ts                   # Quantile values, z-scores
│   │   ├── columnSchema.ts                  # JSON Schema validation (ajv)
│   │   ├── semantic.ts                      # Format, network, datetime validators
│   │   ├── semanticChecksum.ts              # ISBN, EAN, IMEI, ISIN, MEID, ISMN, ISAN, barcode, GTIN
│   │   ├── semanticData.ts                  # ISO country, currency, timezone, language, state, TLD
│   │   ├── semanticFinance.ts               # IBAN, BIC, VAT
│   │   ├── semanticFormat.ts                # SSN, DOI, ORCID, arXiv, temperature, price, passwords
│   │   ├── semanticMath.ts                  # Prime, Fibonacci, leap year, pronic, sphenic, etc.
│   │   ├── semanticNetwork.ts               # Private IP, IP in CIDR network
│   │   ├── semanticTelecom.ts               # IMSI, phone number
│   │   └── *.test.ts                        # Colocated test files (one per module)
│   ├── index.ts                             # Public API re-exports
│   └── index.test.ts                        # Smoke tests for public exports
├── dist/                                    # Build output (git-ignored)
├── package.json
├── tsconfig.json                            # Extends root tsconfig.base.json
├── tsconfig.build.json                      # Declaration-only emit, excludes tests
├── tsup.config.ts                           # ESM bundler config
├── vitest.config.ts                         # Test runner config
├── .prettierignore                          # Excludes dist/ and coverage/ from formatting
├── CHANGELOG.md
└── README.md                                # User-facing docs with expectation status table
```

## Architecture

### Entry point

`src/index.ts` re-exports everything consumers need: types, utilities, and all expectation functions. This is the single entry point for the package.

### Expectations

Each expectation is a standalone pure function. They follow the naming and semantics of [Great Expectations](https://greatexpectations.io/) (Python), translated to TypeScript.

Expectations are organized by concern into grouped files under `src/expectations/`:

**Core expectations:**

- **Table-level** (`table.ts`) — operate on the full dataset (row counts, column sets).
- **Column existence & uniqueness** (`columnExistence.ts`) — null checks, uniqueness, compound keys.
- **Column set membership** (`columnSet.ts`) — value in set, distinct values.
- **Column ranges & types** (`columnRange.ts`) — numeric ranges, ordering, string lengths, type checks.
- **Column regex & parsing** (`columnRegex.ts`) — regex matching, JSON/date parsing, strftime.
- **Column aggregates** (`columnAggregate.ts`) — statistical aggregates (max, min, mean, median, sum, stdev, proportions).
- **Column pairs** (`columnPair.ts`) — two-column comparisons, multicolumn sum.
- **LIKE patterns** (`columnLike.ts`) — SQL LIKE pattern matching with `%` and `_` wildcards.
- **Statistics** (`columnStats.ts`) — quantile ranges and z-score thresholds.
- **JSON Schema** (`columnSchema.ts`) — validate column values against a JSON Schema using `ajv`.

**Semantic type validators:**

- **Format & network** (`semantic.ts`) — UUID, email, URL, IPv4/IPv6, MAC, HTTP methods/status, ports, dates.
- **Checksum** (`semanticChecksum.ts`) — ISBN-10/13, EAN, IMEI, ISIN, MEID, ISMN, ISAN, barcodes, GTIN.
- **Data-table lookups** (`semanticData.ts`) — ISO country, currency, timezone, language, MIME, TLD, US states.
- **Finance** (`semanticFinance.ts`) — IBAN, BIC/SWIFT, EU VAT.
- **Extended format** (`semanticFormat.ts`) — SSN, DOI, ORCID, arXiv, temperature, price, passwords, vectors.
- **Math** (`semanticMath.ts`) — prime, Fibonacci, leap year, pronic, powerful, semiprime, sphenic, square-free.
- **Network** (`semanticNetwork.ts`) — private IP addresses, IP in CIDR network.
- **Telecom** (`semanticTelecom.ts`) — IMSI, phone number validation.

Each expectation:

1. Accepts a `Dataset` (array of records), a column name (for column-level), and options.
2. Returns an `ExpectationResult` with `success`, counts, and a sample of unexpected values.
3. Supports a `mostly` threshold (e.g., "at least 95% of values must pass").

### Upstream reference

Expectation names are sourced from the upstream Python repo. The script `scripts/list-ge-expectations.ts` fetches the current list via the GitHub API. The README tracks implementation status for all 174 expectations.

## Build pipeline

1. **tsup** bundles `src/index.ts` → `dist/index.js` (ESM, with source maps).
2. **tsc** emits declaration files (`dist/*.d.ts`) via `tsconfig.build.json`.

This two-step approach keeps tsup fast (no declaration emit) while still producing proper `.d.ts` files for every module.

## Testing

Tests use Vitest and are colocated with source files (`*.test.ts`).

```sh
pnpm test          # single run
pnpm test:watch    # watch mode
pnpm coverage      # with v8 coverage
```

Each expectation module has a corresponding test file covering:

- Happy path (all values pass)
- Failure path (some values fail, check counts)
- Edge cases (empty dataset, all nulls, single row)
- `mostly` threshold behavior

## Linting

ESLint config is inherited from the monorepo root (`eslint.config.mjs`). Prettier config likewise (`.prettierrc.mjs`).

```sh
pnpm lint          # check
pnpm lint:fix      # auto-fix
pnpm format:check  # check formatting
pnpm format        # auto-format
```

## Adding a new expectation

1. Pick an unimplemented expectation from the README status table.
2. Add the function to the appropriate file under `src/expectations/` (match by concern — e.g., regex validators go in `columnRegex.ts`, checksum validators in `semanticChecksum.ts`). Create a new file only if the expectation doesn't fit any existing group.
3. Add tests to the corresponding `.test.ts` file.
4. Export from `src/index.ts`.
5. Update the README status from :x: to :white_check_mark:.
6. Add a changelog entry.

## Release process

See the root-level release workflow and `act-repo-release` skill. This package follows semver and is published to npm as `great-expectations-js`. The release workflow is at `.github/workflows/great-expectations-js--release.yml`.

# Release notes

## v0.5.0

_2026-02-10_

Migrated from [JuroOravec/actor-spec](https://github.com/JuroOravec/actor-spec) into the [crawlee-one monorepo](https://github.com/JuroOravec/crawlee-one).

#### 🚨 Breaking Changes

- **This package is now pure ESM.** It can no longer be `require()`'d from CommonJS.
- Minimum Node.js version is now 20 (previously 16).
- CommonJS build output (`dist/cjs/`) removed. Only ESM is shipped.

#### Features

- Add test suite with vitest (type-level and CLI tests).
- Add TypeDoc-generated API documentation.
- Add GitHub Actions CI (tested on Ubuntu and Windows, Node 20 and 22).
- Add Dependabot coverage.
- Add npm release workflow with OIDC trusted publishing.

#### Refactor

- Modernize build system: `tsup` for bundling, `tsc` for declaration files (replaces plain `tsc` dual build).
- Rewrite CLI for ESM (`import()` replaces `require()`).
- Update all internal imports to use `.js` extensions for ESM compatibility.

## v0.4.1

_Previous release from the standalone repository._

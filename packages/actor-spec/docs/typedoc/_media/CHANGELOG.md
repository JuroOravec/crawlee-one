# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - TBD

Migrated from [JuroOravec/actor-spec](https://github.com/JuroOravec/actor-spec) into the [crawlee-one monorepo](https://github.com/JuroOravec/crawlee-one).

### Breaking changes

- **ESM only** -- the package no longer ships a CommonJS build. Use `import` instead of `require`.
- **Node >= 20** -- minimum Node.js version raised from 16 to 20.

### Added

- Test suite with vitest (type-level and CLI tests).
- TypeDoc-generated API documentation.
- QA: tested in GitHub Actions; Dependabot coverage.
- Release workflow with npm OIDC trusted publishing.

### Changed

- Build system modernized: tsup (bundling) + tsc (declarations) replaces plain tsc.
- CLI rewritten for ESM (`import()` replaces `require()`).

### Removed

- CommonJS build output (`dist/cjs/`).
- Dual ESM/CJS build. Only ESM is shipped.

## [0.4.1] - Previous release

Last release from the standalone repository.

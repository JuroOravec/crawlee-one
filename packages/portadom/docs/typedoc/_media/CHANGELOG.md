# Release notes

## v2.0.0-rc.0

_2026-02-10_

#### 🚨 Breaking Changes

- **Moved to the `crawlee-one` monorepo.** The package source now lives at `packages/portadom/` in [JuroOravec/crawlee-one](https://github.com/JuroOravec/crawlee-one). The original standalone repo ([JuroOravec/portadom](https://github.com/JuroOravec/portadom)) is archived.
- **This package is now pure ESM.** It can no longer be `require()`'d from CommonJS.
- Minimum Node.js version is now 20.
- Minimum `cheerio` peer dependency is now `^1.0.0` (previously `^1.0.0-rc.12`).
- Minimum `playwright` peer dependency is now `^1.44.0` (previously `^1.37.1`).
- `cheerio` and `playwright` are now **optional peer dependencies**. Install only the engine(s) you need.
- `AnyNode` type is now imported from `domhandler` instead of `cheerio`.

#### Features

- Add comprehensive test suite (88 tests covering utilities, CheerioPortadom, and Promise wrappers).
- Add README with API documentation and usage examples.
- Add npm release workflow with OIDC trusted publishing.

#### Refactor

- Modernize build system: `tsup` for bundling, `tsc` for declaration files.
- Add `domhandler` as a direct dependency (previously a transitive dep via cheerio).
- Update all internal imports to use `.js` extensions for ESM compatibility.

## v1.0.2

_2023-09-03_

Initial standalone release.

- Single DOM manipulation interface across Browser API, Cheerio, and Playwright.
- `Portadom` interface with scalar operations (text, attr, prop, href, src) and node operations (findOne, findMany, closest, parent, children, root, remove, getCommonAncestor).
- `PortadomPromise` and `PortadomArrayPromise` for chainable async DOM traversal.
- `Portapage` interface for page-level operations (infinite scroll).

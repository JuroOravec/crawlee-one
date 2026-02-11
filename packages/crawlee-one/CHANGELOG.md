# Release notes

## v3.1.0

#### Breaking Changes 🚨

- **`AllActorInputs` type renamed to `ActorInput`.** Update imports: `import type { ActorInput } from 'crawlee-one'`.
- **`allActorInputs` value renamed to `actorInput`.** Update imports: `import { actorInput } from 'crawlee-one'`.
- The `*ValidationFields` exports (`crawlerInputValidationFields`, etc.) have been removed. Use the embedded `schema` property on Field objects instead (e.g. `actorInput.startUrls.schema`).
- **`getDatasetCount` was removed.**

  If you used `getDatasetCount()`, you can re-implement it youself as:

  ```ts
  import type { Log } from 'apify';
  import type { CrawleeOneIO } from 'crawlee-one';

  /**
   * Given a Dataset ID, get the number of entries already in the Dataset.
  */
  export const getDatasetCount = async (
    datasetNameOrId?: string,
    options?: { io: CrawleeOneIO; log?: Log }
  ) => {
    const { io, log } = options ?? {};
    if (!io) throw new Error('getDatasetCount requires an io option');

    log?.debug('Opening dataset');
    const dataset = await io.openDataset(datasetNameOrId);
    log?.debug('Obtaining dataset entries count');
    const count = await dataset.getItemCount();
    if (typeof count !== 'number') {
      log?.warning('Failed to get count of entries in dataset. We use this info to know how many items were scraped. More entries might be scraped than was set.'); // prettier-ignore
    } else {
      log?.debug(`Done obtaining dataset entries count (${count})`);
    }
    return count;
  };
  ```

#### Features

- Add `inputFields` option to `crawleeOne()` and `CrawleeOneActorDef`. Embed Zod schemas on Field objects for automatic input validation -- eliminates manual validation boilerplate in scrapers.

  ```ts
  import { z } from 'zod';
  import { createStringField } from 'apify-actor-config';
  import { crawleeOne, actorInput } from 'crawlee-one';

  const fields = {
    ...actorInput,

    targetUrl: createStringField({
      title: 'Target URL',
      type: 'string',
      description: 'URL to scrape',
      editor: 'textfield',
      schema: z.string().url(),
    }),
  };

  await crawleeOne({
    type: 'cheerio',
    inputFields: fields,
    routes: {
      /* ... */
    },
  });
  ```

- Export `InputFromFields` type helper to infer `ActorInput` types directly from Field objects with embedded Zod schemas.

#### Refactor

- Replace Joi with Zod for input validation schemas. Zod schemas are now co-located on each Field object in `input.ts` instead of in separate `*ValidationFields` objects.

## v3.0.2

_2026-02-09_

#### Fix

- Fix README copy in release workflow (move from prepublishOnly to CI step).

## v3.0.1

_2026-02-09_

#### Fix

- Include README in the published npm package.

## v3.0.0

_2026-02-09_

#### 🚨 Breaking Changes

- **This package is now pure ESM.** It can no longer be `require()`'d from CommonJS. See [Sindre's guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) for migration help.
- Minimum Node.js version is now 20.
- The package `exports` have changed from CJS to ESM entry points. If you were importing from `crawlee-one`, `crawlee-one/apify`, or `crawlee-one/sentry`, the import paths remain the same but now resolve to ESM.

#### Features

- Add `adaptive-playwright` crawler type, backed by Crawlee's `AdaptivePlaywrightCrawler` (v3.8.0). This crawler automatically switches between HTTP-only and browser rendering for better performance.
- Add `maxCrawlDepth` input option (Crawlee v3.14.0). Limits how deep the crawler follows links from initial requests.

## v2.0.4

_2024-05-29_

#### Refactor

- Throw error if batching is used with non-browser crawler.
- Better logging for batching and route matching.

## v2.0.3

_2024-05-28_

#### Fix

- Allow function for `input.startUrlsFromFunction`.

#### Refactor

- Fix readme codegen example.

## v2.0.2

_2024-05-28_

#### Fix

- Set default log level.

#### Refactor

- Fix TypeScript errors.

## v2.0.1

_2023-09-10_

#### Refactor

- Fix docs, links, and readme.
- Use `clear()` instead of `drop()`.

## v2.0.0

_2023-09-10_

#### Breaking Changes

- Consolidate the API for v2.
- Remove the readme gen feature.

#### Feat

- Add cosmiconfig for configuration file support.
- Add codegen CLI.
- Add typedoc-generated API docs.

#### Refactor

- Update the Sentry integration.

## v1.1.3

_2023-09-01_

#### Refactor

- Remove DOM manipulation (moved to [portadom](https://github.com/JuroOravec/portadom)).

## v1.1.2

_2023-08-31_

#### Feat

- Allow to specify route matcher as regex.

## v1.1.1

_2023-08-31_

#### Refactor

- Reorder `CrawleeOneRouteMatcher`.

## v1.1.0

_2023-08-31_

#### Feat

- Add async wrappers for actor lifecycle hooks.
- Decouple telemetry from core.
- Update public API names.

## v1.0.8

_2023-08-29_

#### Fix

- Fix bug in `urlsFromFn`.

## v1.0.7

_2023-08-29_

#### Feat

- Add user guide doc section.

#### Refactor

- Scope readme gen to Apify.

## v1.0.6

_2023-08-29_

#### Refactor

- Clear queue by marking requests as handled.
- Clean up router file.

## v1.0.5

_2023-08-29_

#### Fix

- Don't use stale `RequestQueue` instance.

## v1.0.4

_2023-08-29_

#### Refactor

- Try to clear queue by dropping and recreating it.

## v1.0.3

_2023-08-29_

#### Refactor

- Use "clear" instead of "drop" when limit reached.

## v1.0.2

_2023-08-29_

#### Feat

- Add log instance to actor context.

## v1.0.1

_2023-08-28_

#### Feat

- Decouple from Apify via `CrawleeOneIO` abstraction layer.
- Add documentation.

#### Refactor

- Add missing exports.

## v0.22.1

_2023-08-23_

#### Refactor

- Update section name.

## v0.22.0

_2023-08-23_

#### Feat

- Filter and map requests via configuration.

## v0.21.0

_2023-08-21_

#### Feat

- Allow to extend actor input from URL or function.

## v0.20.0

_2023-08-18_

#### Feat

- Add Playwright Locator-based DOMLib.

## v0.19.11

_2023-08-18_

#### Feat

- Make batch wait duration configurable.

## v0.19.10

_2023-08-18_

#### Refactor

- Fix newlines and typos in config docs.

## v0.19.9

_2023-08-18_

#### Refactor

- Fix config docs.

## v0.19.8

_2023-08-18_

#### Feat

- Add `sendRequest` and code examples to hooks.

## v0.19.7

_2023-08-18_

#### Refactor

- Reset retries.

## v0.19.6

_2023-08-18_

#### Feat

- Add retries to `infiniteScroll`.

## v0.19.5

_2023-08-17_

#### Fix

- Fix slicing logic in `shortenToSize`.

## v0.19.4

_2023-08-17_

#### Refactor

- Refetch stale value on access in `createValueMonitor`.

## v0.19.3

_2023-08-17_

#### Feat

- Allow to stop `infiniteScroll` from within the callback.

## v0.19.2

_2023-08-17_

#### Refactor

- Update Page on new batch Request.

## v0.19.1

_2023-08-17_

#### Refactor

- Logging and type cleanup.

## v0.19.0

_2023-08-17_

#### Feat

- Add batching with `perfBatchSize` actor input.
- Add `maxCount` option to `pushData` and actor input (later renamed to `maxEntries`).
- Pass context vars in `PageLib.infiniteScroll`.

## v0.18.8

_2023-08-16_

#### Feat

- Report all Playwright evaluation errors.

#### Refactor

- Fix `_getCommonAncestor`.
- Fix errors in `PageLib`.

## v0.18.7

_2023-08-16_

#### Fix

- Preserve DOM context in `splitCheerioSelection`.

#### Refactor

- Clean up types.

## v0.18.6

_2023-08-15_

#### Feat

- Support nested path in "props".
- Add `props` and `attrs` DOMLib methods.
- Add `closest` to DOMLib.

#### Refactor

- Fix wrap common ancestor in DOMLib.

## v0.18.0

_2023-08-14_

#### Feat

- Add `PageLib` and `PlaywrightPageLib`.
- Add `PlaywrightDOMLib`.
- Add `getCommonAncestor` to DOMLib.
- Add support for async in DOMLib.
- Add input options for resolving start URLs.
- Refactor `DOMLib` interface.

#### Refactor

- Move DOM and listing scraper to actions dir.
- Expose function to split Cheerio selection.

## v0.15.1

_2023-07-23_

#### Fix

- Fix `privateValueGen`.

## v0.15.0

_2023-07-23_

#### Feat

- Scoped `pushData` and `metamorph` -- each route handler can push to its own dataset.
- Rename `runActor` to `createAndRunActor`.

#### Refactor

- Split metamorph and output actor inputs.

## v0.13.7

_2023-05-09_

#### Feat

- Add caching, filtering, and transformation for output entries.

## v0.13.6

_2023-05-09_

#### Feat

- Move max count detection to utils.

## v0.13.5

_2023-05-09_

#### Refactor

- Validate pattern for `datasetId`.

## v0.13.4

_2023-05-09_

#### Refactor

- Bump `actor-spec` dependency.

## v0.13.3

_2023-05-09_

#### Refactor

- Fix input typos.

## v0.13.2

_2023-05-09_

#### Refactor

- Fix typo.

## v0.13.1

_2023-05-09_

#### Refactor

- Add docstring to `createAndRunApifyActor` inputs.

## v0.13.0

_2023-05-09_

#### Feat

- Standardise actor setup with `createAndRunApifyActor`.

## v0.12.0

_2023-05-09_

#### Feat

- Add error handling input fields.

#### Refactor

- Use Sentry's "enabled" option.

## v0.11.3

_2023-05-05_

#### Refactor

- Fix types for `RunActor` type.

## v0.11.2

_2023-05-05_

#### Feat

- Allow to set metamorph actor via input.

#### Refactor

- Add `metamorphActorBuild` input field.
- Rename input section.

## v0.11.0

_2023-05-05_

#### Feat

- Add definition of output actor inputs.
- Enable to pick and rename entry fields.
- Enable to set custom dataset on `pushData`.

## v0.10.11

_2023-05-03_

#### Refactor

- Another fix for the bracket in readme.

## v0.10.10

_2023-05-03_

#### Feat

- Add statement of quality to readme.

#### Refactor

- Fix mode bracket in readme when there are no modes.

## v0.10.9

_2023-05-03_

#### Feat

- Add `getInfo` to `createMockStorageDataset`.

#### Refactor

- Pass callbacks via `setupMockApifyActor`.

## v0.10.8

_2023-05-03_

#### Refactor

- Handle optional comment objects.

## v0.10.7

_2023-05-03_

#### Refactor

- Handle optional features object.

## v0.10.6

_2023-05-03_

#### Refactor

- Bump `actor-spec` dependency.

## v0.10.5

_2023-05-03_

#### Refactor

- Make features optional on overrides object.

## v0.10.4

_2023-05-03_

#### Refactor

- Make example input comments optional.

## v0.10.3

_2023-05-03_

#### Refactor

- Handle undefined template hooks.

## v0.10.2

_2023-05-03_

_No user-facing changes._

## v0.10.1

_2023-05-03_

#### Refactor

- Fix extended ActorSpec types.

## v0.10.0

_2023-05-03_

#### Feat

- Add more readme hooks and add type safety.
- Support more kinds of perf tables.

#### Refactor

- Show perf tables only for datasets with `perfStats`.

## v0.9.6

_2023-05-03_

#### Refactor

- Bump `actor-spec` dependency.

## v0.9.5

_2023-05-02_

#### Refactor

- Fix typos.

## v0.9.4

_2023-05-02_

#### Refactor

- Update template to use `actor.title`.
- Fix missing features on readme.

## v0.9.3

_2023-05-02_

#### Refactor

- Make function optional.
- Update docstring for `renderReadme`.

## v0.9.2

_2023-05-02_

#### Refactor

- Add missing exports.

## v0.9.0

_2023-05-02_

#### Feat

- Add Apify ActorSpec integration.
- Add README generation from actor metadata.

## v0.8.7

_2023-05-01_

#### Refactor

- Update README.

## v0.8.6

_2023-05-01_

#### Refactor

- Update privacy input description.

## v0.8.5

_2023-05-01_

#### Refactor

- Update logic in privacy mask.

## v0.8.4

_2023-05-01_

#### Fix

- Fix logic in `applyPrivacyMask`.

## v0.8.3

_2023-05-01_

#### Fix

- Handle null object in privacy mask.

## v0.8.2

_2023-05-01_

#### Fix

- Handle undefined privacy mask props.

## v0.8.1

_2023-05-01_

#### Refactor

- Make `PrivacyMask` props optional.

## v0.8.0

_2023-05-01_

#### Feat

- Add privacy input options.
- Allow to hide personal data on `pushData`.

## v0.7.3

_2023-04-30_

#### Feat

- Add example for migration.

## v0.7.2

_2023-04-30_

#### Refactor

- Make type more permissive.

## v0.7.1

_2023-04-30_

#### Refactor

- Move proxy, router, and `errorHandler` out of options function.

## v0.7.0

_2023-04-30_

#### Feat

- Move creating crawler options to utils.

## v0.6.7

_2023-04-30_

#### Feat

- Add config validation to utils package.

## v0.6.6

_2023-04-30_

#### Feat

- Update migrate CLI options.

## v0.6.5

_2023-04-29_

#### Refactor

- Change migration version from positional to option arg.

## v0.6.4

_2023-04-29_

_No user-facing changes._

## v0.6.3

_2023-04-29_

#### Refactor

- Add missing dependency.

## v0.6.2

_2023-04-29_

#### Refactor

- Add CLI bin entry point.

## v0.6.1

_2023-04-29_

#### Refactor

- Remove unused input.

## v0.6.0

_2023-04-29_

#### Feat

- Add migration to utils.
- Add migration CLI.

## v0.5.0

_2023-04-29_

#### Feat

- Setup default proxy if not custom.

#### Refactor

- Change interface for Sentry setup.
- Move test utils to lib.

## v0.4.1

_2023-04-29_

#### Refactor

- Change interface for Sentry setup.

## v0.4.0

_2023-04-29_

#### Feat

- Add Sentry integration to utils.

## v0.3.3

_2023-04-28_

#### Refactor

- Improve typing of input objects.

## v0.3.2

_2023-04-28_

#### Refactor

- Update type of proxy input field.

## v0.3.1

_2023-04-28_

#### Refactor

- Add missing export.

## v0.3.0

_2023-04-28_

#### Feat

- Add common actor config fields.

## v0.2.1

_2023-04-26_

#### Fix

- Add missing imports.

## v0.2.0

_2023-04-26_

#### Feat

- Add `logLevelHandlerWrapper`.
- Add `scrapeListing`.

## v0.1.5

_2023-04-25_

#### Feat

- Allow array of `handlerWrappers` and init function.

## v0.1.4

_2023-04-25_

#### Refactor

- Expose `captureError` function.

## v0.1.3

_2023-04-24_

Initial release.

#### Feat

- First version of Apify/Crawlee utilities.

#### Fix

- Use user's instance of vitest.
- Mapped `DOMLibChildren` should return array.

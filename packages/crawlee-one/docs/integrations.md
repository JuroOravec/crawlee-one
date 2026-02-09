# Integrations

CrawleeOne provides two extension points for integrating with external services: **telemetry** (error tracking) and **IO** (storage backend).

## Custom telemetry (CrawleeOneTelemetry)

Track errors to any service by implementing the `CrawleeOneTelemetry` interface and passing it to the `telemetry` option.

### Interface

```ts
interface CrawleeOneTelemetry {
  setup: (actor: CrawleeOneActorInst) => Promise<void> | void;
  onSendErrorToTelemetry: (
    error: Error,
    report: object,
    options: {
      io?: CrawleeOneIO;
      allowScreenshot?: boolean;
      reportingDatasetId?: string;
    },
    ctx: CrawleeOneCtx,
  ) => Promise<void> | void;
}
```

### Built-in: Sentry

CrawleeOne includes a Sentry integration out of the box:

```ts
import { createSentryTelemetry } from 'crawlee-one/sentry';

await crawleeOne({
  telemetry: createSentryTelemetry({
    dsn: 'https://...@....ingest.sentry.io/...',
    tracesSampleRate: 1.0,
    serverName: 'myCrawler',
  }),
  // ...
});
```

### Example: File system telemetry

```ts
import fs from 'fs';
import type { CrawleeOneCtx, CrawleeOneTelemetry } from 'crawlee-one';

export const createFsTelemetry = <T extends CrawleeOneTelemetry<CrawleeOneCtx>>() => {
  const timestamp = new Date().getTime();
  let errors = 0;

  return {
    setup: async () => {
      await fs.promises.mkdir('./temp/error', { recursive: true });
    },
    onSendErrorToTelemetry: async (error, report) => {
      const filename = `./temp/error/${timestamp}_${(errors++).toString().padStart(5, '0')}.json`;
      await fs.promises.writeFile(filename, JSON.stringify({ error, report }), 'utf-8');
    },
  } as T;
};

await crawleeOne({
  telemetry: createFsTelemetry(),
  // ...
});
```

See the [Sentry source](../src/lib/telemetry/sentry.ts) for a full integration example.

---

## Custom storage backend (CrawleeOneIO)

By default, CrawleeOne uses [Apify](https://github.com/apify/apify-sdk-js) for datasets, request queues, and key-value stores. When running locally (outside Apify's platform), data is saved to the `./storage` directory.

To send data to a custom endpoint, database, or other service, implement the `CrawleeOneIO` interface and pass it to the `io` option.

### Interface

```ts
interface CrawleeOneIO {
  openDataset: (id?: string | null) => MaybePromise<CrawleeOneDataset>;
  openRequestQueue: (id?: string | null) => MaybePromise<CrawleeOneRequestQueue>;
  openKeyValueStore: (id?: string | null) => MaybePromise<CrawleeOneKeyValueStore>;
  getInput: () => Promise<Input | null>;
  triggerDownstreamCrawler: (
    targetActorId: string,
    input?: TInput,
    options?: { build?: string },
  ) => Promise<void>;
  runInContext: (userFunc: () => MaybePromise<unknown>, options?: ExitOptions) => Promise<void>;
  createDefaultProxyConfiguration: (
    input?: T | Readonly<T>,
  ) => MaybePromise<ProxyConfiguration | undefined>;
  isTelemetryEnabled: () => MaybePromise<boolean>;
  generateErrorReport: (
    input: CrawleeOneErrorHandlerInput,
    options: PickRequired<CrawleeOneErrorHandlerOptions, 'io'>,
  ) => MaybePromise<object>;
  generateEntryMetadata: (ctx: Ctx) => MaybePromise<TMetadata>;
}
```

### Example: Custom HTTP endpoint

Send scraped data to a custom REST endpoint. Everything else remains managed via Crawlee/Apify (request queue, key-value store, etc).
```ts
import type { CrawleeOneIO } from 'crawlee-one';
import { apifyIO } from 'crawlee-one/apify';

export const createCustomIO = (baseUrl: string) => {
  const createDatasetIO = (id?: string) => {
    const endpoint = `${baseUrl}/dataset/${id ?? 'default'}`;

    return {
      pushData: (items: any[]) =>
        fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(items),
        }).then((r) => r.json()),
      getItems: () => fetch(`${endpoint}/all`).then((r) => r.json()),
      getItemsCount: () =>
        fetch(`${endpoint}/all`)
          .then((r) => r.json())
          .then((d) => d.length),
    };
  };

  return {
    ...apifyIO,
    openDataset: createDatasetIO,
  } as CrawleeOneIO;
};

await crawleeOne({
  io: createCustomIO('https://my-api.example.com'),
  // ...
});
```

See the [Apify IO source](../src/lib/integrations/apify.ts) for the default implementation.

---

## Related

- [`CrawleeOneTelemetry` type docs](./typedoc/interfaces/CrawleeOneTelemetry.md)
- [`CrawleeOneIO` type docs](./typedoc/interfaces/CrawleeOneIO.md)
- [`CrawleeOneArgs` type docs](./typedoc/interfaces/CrawleeOneArgs.md)

# LLM Extraction Flow

This document describes the LLM extraction flow in crawlee-one: how route handlers use `extractWithLLM`, how jobs are deferred to an LLM queue, and how the `crawlee-one llm extract` command processes them. It is intended for developers implementing LLM-based extraction in scrapers or extending the crawlee-one LLM infrastructure.

---

## 1. Overview

When a route handler encounters a page that requires LLM extraction (e.g. custom-design job pages where DOM selectors fail), it calls the scoped `extractWithLLM` function from the handler context. This function implements a **two-phase flow**:

1. **First pass (defer):** If no result exists yet, push a job to the LLM request queue and return `null`. The original request is marked handled; it is **not** reclaimed (to avoid an infinite loop where the same URL is re-processed before the LLM queue completes).
2. **LLM processing:** Run `crawlee-one llm extract`. It consumes the LLM queue, calls the LLM, writes results to a key-value store, and **adds the original request back** to the main crawler's queue.
3. **Second pass (collect):** The main crawler picks up the re-queued URL. `extractWithLLM` finds the result in the store, returns it, and the handler calls `pushData`.

This design keeps the crawl fast (no LLM calls during crawling), avoids infinite retry loops, and allows LLM extraction to run as a standalone, scalable actor.

---

## 2. Components

### 2.1 Scoped `extractWithLLM`

The scoped `extractWithLLM` is created by `createExtractWithLlmForContext(ctx, actor)` and injected into the handler context when the actor has LLM input configured. It is the primary API for route handlers.

**Signature:**

```typescript
extractWithLLM<T>(opts: ExtractWithLlmScopedOptions<T>): Promise<ExtractWithLlmScopedResult<T> | null>
```

**Options:**

| Option        | Required | Description                                                                 |
|---------------|----------|-----------------------------------------------------------------------------|
| `schema`      | Yes      | Zod schema for the expected output. Converted to JSON schema for the queue.  |
| `systemPrompt`| Yes      | System prompt describing the extraction task.                              |
| `text`        | No       | Override default text. Default: `ctx.$.html()` (Cheerio) or `ctx.page.content()` (browser) or `ctx.body` (Http). |
| `apiKey`      | No       | Override actor input.                                                      |
| `provider`    | No       | Override actor input.                                                      |
| `model`       | No       | Override actor input.                                                      |
| `baseURL`     | No       | Override actor input.                                                      |
| `headers`     | No       | Override actor input.                                                      |
| `llmRequestQueueId`   | No | Override queue ID.                                                         |
| `llmKeyValueStoreId`  | No | Override store ID.                                                         |

**Return value:**

- `null` — Result not yet available (request deferred to LLM queue; caller should return early). Throws if LLM is not configured.
- `{ object, _extractionMeta? }` — Extracted object and optional metadata (provider, model, `extractionMs`, token usage).

### 2.2 Default text extraction

`getDefaultExtractionText(ctx)` infers the text to send to the LLM from the crawling context:

| Crawler type | Context shape     | Default text          |
|--------------|-------------------|------------------------|
| Cheerio/JSDOM| `$` with `.html()` | `ctx.$.html()`        |
| Playwright/Puppeteer | `page`  | `ctx.page.content()`  |
| Http/Basic   | `body`            | `ctx.body` (string)    |

Pass `text` explicitly when the default is wrong (e.g. `text: $('.content').html()` for a subset of the DOM).

### 2.3 LLM request queue

Jobs awaiting LLM processing are pushed to a dedicated `RequestQueue`. Each request has:

- `url` — Original page URL (for logging).
- `uniqueKey` — Same as the original request (for correlation).
- `skipNavigation: true` — No HTTP fetch; the LLM crawler reads from `userData`.
- `userData` — `{ html, jsonSchema, systemPrompt, apiKey, provider, model, baseURL?, headers?, url?, originalRequestId, originalRequestQueueId? }`.

`originalRequestId` (from `request.id ?? request.uniqueKey`) is used as the key for the result in the key-value store.
`originalRequestQueueId` (from actor input `requestQueueId`) is used by the LLM crawler to add the original request back to the main queue when extraction completes.

### 2.4 LLM key-value store

Results are stored under keys `llm--{requestId}`. Each value has shape:

```typescript
{
  object: T;  // Extracted object
  _extractionMeta?: {
    extractedByLlm: true;
    llmProvider: string;
    llmModel: string;
    extractionMs: number;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}
```

When the handler retrieves a result, the key is deleted (pop semantics) so the same request is not processed twice.

---

## 3. Flow diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Main scraper (first run)                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Route handler calls extractWithLLM({ schema, systemPrompt })                │
│         │                                                                   │
│         ├─ Check KVS for llm--{requestId}                                    │
│         │                                                                   │
│         ├─ Not found → Create request with userData (html, schema, config,   │
│         │              originalRequestQueueId)                              │
│         │              Push to LLM RequestQueue                             │
│         │              return null (request marked handled, no reclaim)     │
│         │                                                                   │
│         └─ Found → Read value, delete key, return { object, _extractionMeta }│
│                    Handler calls pushData(result)                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: crawlee-one llm extract (standalone run)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BasicCrawler with RequestQueue "llm"                                        │
│         │                                                                   │
│         └─ For each request:                                                 │
│              Read userData (html, jsonSchema, systemPrompt, apiKey, ...)     │
│              Call extractWithLlm(...)                                        │
│              Write result to KVS under llm--{originalRequestId}               │
│              Add original request back to originalRequestQueueId             │
│              markRequestHandled                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Main scraper (second run)                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Same URLs are processed again (re-queued by LLM crawler)                     │
│  extractWithLLM finds result in KVS → returns object → handler pushData      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Environment variables and config

| Variable                      | Default | Purpose                          |
|-------------------------------|---------|----------------------------------|
| `CRAWLEE_LLM_REQUEST_QUEUE_ID`| `llm`   | Request queue for LLM jobs       |
| `CRAWLEE_LLM_KEY_VALUE_STORE_ID` | `llm` | Key-value store for results      |

Actor input overrides: `llmRequestQueueId`, `llmKeyValueStoreId` (from `LlmActorInput`).

---

## 5. Running `crawlee-one llm extract`

**CLI:**

```bash
crawlee-one llm extract
crawlee-one llm extract --queue llm --store llm
```

**As Apify actor:** Use `crawlee-one llm extract` as the main command. Pass `CRAWLEE_LLM_REQUEST_QUEUE_ID` and `CRAWLEE_LLM_KEY_VALUE_STORE_ID` via environment.

**When to run:** After the main scraper has finished and pushed jobs to the LLM queue. The command processes all pending jobs and writes results to the store. Then re-run the main scraper so deferred URLs pick up the results.

---

## 6. Schema serialization

Zod schemas are converted to JSON schema via `zod-to-json-schema` before being stored in request `userData`. The LLM crawler uses `jsonSchema()` from the AI SDK with `generateText` and `Output.object()` to produce structured output. This allows full serialization of extraction jobs across process boundaries.

---

## 7. Re-queue after LLM processing

When `extractWithLLM` defers, it returns `null` and the request is marked handled (no reclaim). This avoids an infinite loop where the same URL would be reclaimed, re-processed immediately, and deferred again before the LLM queue has run. Instead, the **LLM crawler** adds the original request back to the main queue (using `originalRequestQueueId` from userData) after writing the result to KVS. Ensure `requestQueueId` is set in actor input when using LLM deferral (it is set automatically in dev mode).

---

## 8. Reference implementation

See `scrapers/profesia-sk/src/pages/jobCustom/route.ts` for a complete route handler using `extractWithLLM`.

---

## 9. Low-level API

- **`extractWithLlm`** — Extract structured data from HTML using an LLM with a JSON schema. Used internally by the LLM crawler. Also exported for direct use when you need immediate extraction (e.g. in a handler without deferral).
- **`createLlmCrawler`** — Creates the `BasicCrawler` that processes the LLM queue. Used by the `llm extract` CLI command.

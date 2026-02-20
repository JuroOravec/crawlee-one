# LLM Extraction Flow

This document describes the LLM extraction flow in crawlee-one: how route handlers use `extractWithLLM`, how jobs are deferred to an LLM queue, and how the LLM crawler (run concurrently with the main crawler) processes them. It is intended for developers implementing LLM-based extraction in scrapers or extending the crawlee-one LLM infrastructure.

---

## 1. Overview

When a route handler encounters a page that requires LLM extraction (e.g. custom-design job pages where DOM selectors fail), it calls the scoped `extractWithLLM` function from the handler context. This function implements a **two-phase flow**:

1. **First pass (defer):** If no result exists yet, push a job to the LLM request queue and return `null`. The original request is marked handled; it is **not** reclaimed (to avoid an infinite loop where the same URL is re-processed before the LLM queue completes).
2. **LLM processing:** The LLM crawler runs **concurrently** with the main crawler. It consumes the LLM queue, calls the LLM, writes results to a key-value store, and **adds the original request back** to the main crawler's queue.
3. **Second pass (collect):** The main crawler picks up the re-queued URL. `extractWithLLM` finds the result in the store, returns it, and the handler calls `pushData`.

This design keeps the crawl fast (no LLM calls during crawling), avoids infinite retry loops, and processes LLM jobs as soon as they arrive.

---

## 2. Components

### 2.1 Scoped `extractWithLLM`

The scoped `extractWithLLM` and `extractWithLLMSync` are created by `createExtractWithLlmForContext` and injected into the handler context when the actor has LLM input configured.

- **extractWithLLM** — Two-phase deferred flow (queue + KVS). Primary API for production.
- **extractWithLLMSync** — Calls the LLM directly (no queue/KVS). Use when blocking is acceptable (e.g. few URLs, dev flows).

**Signature:**

```typescript
extractWithLLM<T>(opts: ExtractWithLlmAsyncOptions<T>): Promise<LlmExtractionResult<T> | null>
```

**Options:**

| Option               | Required | Description                                                                                                      |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `schema`             | Yes      | Zod schema for the expected output. Converted to JSON schema for the queue.                                      |
| `systemPrompt`       | Yes      | System prompt describing the extraction task.                                                                    |
| `text`               | No       | Override default text. Default: `ctx.$.html()` (Cheerio) or `ctx.page.content()` (browser) or `ctx.body` (Http). |
| `model`              | Yes*     | Model ID. Required for the LLM API call; can come from actor input.                                             |
| `apiKey`             | No       | Override actor input. Defaults to `OPENAI_API_KEY` env.                                                          |
| `provider`           | No       | Override actor input. Defaults to `openai`.                                                                      |
| `baseURL`            | No       | Override actor input.                                                                                            |
| `headers`            | No       | Override actor input.                                                                                            |
| `llmRequestQueueId`  | No       | Override queue ID.                                                                                               |
| `llmKeyValueStoreId` | No       | Override store ID.                                                                                               |

**Return value:**

- `null` — Result not yet available (request deferred to LLM queue; caller should return early). Throws if LLM is not configured.
- `{ object, _extractionMeta? }` — Extracted object and optional metadata (provider, model, `extractionMs`, token usage).

### 2.2 Default text extraction

`getDefaultExtractionText(ctx)` infers the text to send to the LLM from the crawling context:

| Crawler type         | Context shape      | Default text         |
| -------------------- | ------------------ | -------------------- |
| Cheerio/JSDOM        | `$` with `.html()` | `ctx.$.html()`       |
| Playwright/Puppeteer | `page`             | `ctx.page.content()` |
| Http/Basic           | `body`             | `ctx.body` (string)  |

Pass `text` explicitly when the default is wrong (e.g. `text: $('.content').html()` for a subset of the DOM).

### 2.3 LLM request queue

Jobs awaiting LLM processing are pushed to a dedicated `RequestQueue`. Each request has:

- `url` — Original page URL (for logging).
- `uniqueKey` — Extraction ID (each extraction gets its own queue entry).
- `skipNavigation: true` — No HTTP fetch; the LLM crawler reads from `userData`.
- `userData` — `{ html, jsonSchema, systemPrompt, apiKey, provider, model, baseURL?, headers?, url?, extractionId, originalRequestUniqueKey, originalRequestQueueId? }`.

`extractionId` uniquely identifies each extraction:

- **Without `text`:** `requestId` + system prompt hash + JSON schema hash
- **With `text`:** text hash + system prompt hash + JSON schema hash
- **Override:** Pass `extractionId` in opts to use a custom ID (escape hatch).

When `text` is unspecified (parsing the entire page), we use `requestId` rather than a text hash because the re-fetched HTML may differ slightly between passes (e.g. timestamps, ads). The `requestId` is stable across re-attempts, so the result can be retrieved on the second pass even if the HTML changed.

Multiple extractions per request are supported: call `extractWithLLM` several times with different `text`, `systemPrompt`, or `schema` to extract different parts of the page (e.g. header vs body) — useful for cheaper models that perform well on smaller HTML snippets.

`originalRequestUniqueKey` and `originalRequestQueueId` are used by the LLM crawler to re-queue the original request to the main queue when extraction completes. The request is added with `forefront: true` so it is processed soon, minimizing the chance that the cached result (in the in-memory LRU) is evicted before the main crawler picks it up.

### 2.4 LLM key-value store

Results are stored in key-value store under `extractionId` (each run has its own KVS).

Each value has shape:

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

When the handler retrieves a result, it is popped from KVS (deleted) and cached in process memory (LRU-bounded, max 500 entries). Popping avoids unbounded KVS growth across many pages. The cache keeps results available for the current handler run (e.g. multi-extraction) or if the same request is retried after a failure (e.g. pushData throws, request reclaimed). We do not delete cache entries on read — multiple accesses to the same extractionId are expected. Worst case only the current actor process memory grows, not the shared KVS.

---

## 3. Flow diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Main scraper (first run)                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Route handler calls extractWithLLM({ schema, systemPrompt })                │
│         │                                                                   │
│         ├─ Check KVS for {requestId}                                          │
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
│ Phase 2: LLM crawler (runs concurrently with main crawler)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BasicCrawler with RequestQueue (run-scoped: "llm-{runId}" or "llm-t{ts}")  │
│         │                                                                   │
│         └─ For each request:                                                 │
│              Read userData (html, jsonSchema, systemPrompt, apiKey, ...)     │
│              Call extractWithLlm(...)                                        │
│              Write result to KVS under {extractionId}                         │
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

| Variable                         | Default                  | Purpose                     |
| -------------------------------- | ------------------------ | --------------------------- |
| Actor input `llmRequestQueueId`  | run-scoped `llm-{runId}` | Request queue for LLM jobs  |
| Actor input `llmKeyValueStoreId` | run-scoped `llm-{runId}` | Key-value store for results |

Actor input overrides: `llmRequestQueueId`, `llmKeyValueStoreId` (from `LlmActorInput`).

### Run-scoped IDs (default: `llm`)

When using the default IDs (`llm` for both queue and store), crawlee-one **automatically scopes them per run** by appending a suffix:

- **On Apify:** `llm-{APIFY_ACTOR_RUN_ID}` (e.g. `llm-abc123xyz`)
- **Locally / elsewhere:** `llm-t{timestamp}` (e.g. `llm-t1708234567890`)

This prevents cross-run queue sharing on Apify: concurrent runs and different actors no longer share one `llm` queue, avoiding runs that never finish because other actors keep adding requests.

When you **explicitly** pass a custom ID (e.g. `llmRequestQueueId: 'shared-queue'`), it is used as-is. Use this for manual phases where a separate LLM actor run must share the same queue as the main scraper run; pass the run-scoped ID from the main run (e.g. `llm-{runId}`) as input to the LLM actor.

---

## 5. Orchestration and `crawlee-one llm extract`

**Default flow:** The LLM crawler runs **concurrently** with the main crawler. No separate step is needed — LLM jobs are processed as they arrive, and deferred URLs are re-queued and picked up in the same run.

**Manual phases (`crawlee-one llm extract`):** For advanced setups where the main scraper and LLM worker run as **separate** Apify actor runs:

```bash
crawlee-one llm extract
crawlee-one llm extract --queue llm --store llm
```

Pass the same queue and store IDs to both runs. The main run uses run-scoped IDs (e.g. `llm-abc123`). Get the run ID from the main run (Apify console, logs, or `APIFY_ACTOR_RUN_ID`), then pass `llmRequestQueueId: 'llm-{runId}'` and `llmKeyValueStoreId: 'llm-{runId}'` to the LLM actor run.

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

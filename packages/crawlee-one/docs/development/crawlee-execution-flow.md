# Crawlee Internal Execution Flow

This document describes the internal execution flow of Crawlee's crawlers, starting at `crawler.run()` and tracing through request fetching, HTTP handling, and persistence. It is intended for developers working on crawlee-one features that need to integrate with or extend Crawlee's request lifecycle (e.g. dev scaffolding, caching, `RequestQueue`/`Dataset` usage).

All references point to the Crawlee GitHub repository at commit `adf3daeb0b3000124817b1b2196342e8715`. Code snippets and line numbers are approximate and may drift with upstream changes.

---

## 1. Entry Point: `crawler.run()`

The crawl begins with `BasicCrawler.run()`, which orchestrates initialization, request processing, and shutdown.

### 1.1 Queue Purge (Default Queue Only)

Before crawling, `BasicCrawler.run()` may purge the default `RequestQueue`:

```typescript
// basic-crawler.ts, ~lines 976-979
if (this.requestQueue?.name === 'default' && purgeRequestQueue) {
  await this.requestQueue.drop();
  this.requestQueue = await this._getRequestQueue();
  this.requestManager = undefined;
}
```

**Important:** Only the queue named `'default'` is purged. Custom-named `RequestQueue` instances (e.g. `RequestQueue.open({ name: 'dev-profesia' })`) persist across runs. This allows `crawlee-one dev` to keep fetched data between invocations without losing the queue.

### 1.2 Initialization

`run()` triggers `_init()`, which:

1. Sets up the default or custom `RequestQueue`
2. Creates the `RequestManager` (wraps `RequestQueue`/`RequestList`)
3. Instantiates `AutoscaledPool` and wires it to `_runTaskFunction`

The `AutoscaledPool` manages concurrency and calls `_runTaskFunction` on intervals or when previous tasks complete. It has no direct knowledge of requests or datasets; it only invokes the task function.

---

## 2. Main Execution Loop: `_runTaskFunction`

The core request-processing loop is `BasicCrawler._runTaskFunction()` (basic-crawler.ts, ~lines 1546–1678). It is invoked by the `AutoscaledPool` whenever a worker slot is available.

### 2.1 Flow Overview

```
_runTaskFunction()
  → _fetchNextRequest()
  → (optional) delayRequest() for same-domain throttling
  → _runRequestHandler(request)
```

### 2.2 `_fetchNextRequest`

`_fetchNextRequest()` delegates to `RequestManager.fetchNextRequest()`, which for `RequestQueue` (v2) ultimately calls `RequestQueue.fetchNextRequest()`.

### 2.3 `delayRequest`

If same-domain throttling is enabled, `delayRequest()` may postpone processing. The request remains in the `inProgress` set until it is released. This does not change how requests are stored or marked as handled.

### 2.4 `_runRequestHandler`

Once a request is available, `BasicCrawler._runRequestHandler()` (line ~1620) is called. It:

1. Passes the request to `BasicCrawler.requestHandler`
2. In crawlee-one, the `requestHandler` is the Crawlee `Router` (see actor.ts, lines 183–184)

The Router executes middlewares and the route handler, but **the Router does not perform the HTTP fetch itself**. This is done **BEFORE** the context is handed over to the Router. That responsibility lies in crawler subclasses (e.g. `HttpCrawler`).

---

## 3. HTTP Request Handling: `HttpCrawler`

`HttpCrawler` overrides `_runRequestHandler` to perform the actual HTTP fetch before calling the `requestHandler`.

### 3.1 `_runRequestHandler` (http-crawler.ts, ~lines 508–577)

```
_runRequestHandler(request)
  → if (request.skipNavigation) → skip HTTP fetch
  → else → _handleNavigation() → _parseResponse()
```

If `request.skipNavigation` is `true`, no HTTP request is made. This can be used as an early interception point for caching: set `skipNavigation` and inject response data into the crawler context instead of fetching.

### 3.2 `_handleNavigation` and `_requestFunction`

`_handleNavigation` prepares HTTP options and calls `_requestFunction`, which in turn calls `_requestAsBrowser` (http-crawler.ts, lines 639–661, 727).

### 3.3 Actual HTTP Call: `httpClient.stream()`

The real network request happens in `_requestAsBrowser` (lines ~929–948):

```typescript
// Pseudo-code
BasicCrawler.httpClient.stream(gotOptions);
```

The `httpClient` implements the `BaseHttpClient` interface (core, base-http-client.ts, lines 179–195), which exposes:

- `sendRequest(options)`
- `stream(options)`

**Interception point for caching:** A custom `HttpClient` wrapper can:

1. Check `request.userData` for a cached response
2. If present, return a synthetic response (e.g. from a readable stream) instead of calling the underlying client
3. If absent, delegate to the real `httpClient` and optionally store the response in `userData` before marking the request as handled

---

## 4. Crawlee-One Integration: Router as `requestHandler`

In crawlee-one (actor.ts, lines 183–185):

```typescript
overrides: {
  requestHandler: router,
  // ...
}
```

The `router` is Crawlee's `Router` (core/router.ts, ~lines 193–214). When invoked as a `requestHandler`, it:

1. Runs middlewares
2. Matches the request to a route handler
3. Invokes the matched handler

The Router does **not** perform the HTTP fetch. The fetch is done earlier by `HttpCrawler._runRequestHandler` before the Router runs. So the flow is:

1. `_runRequestHandler` fetches the page (HTTP)
2. Then calls `requestHandler` (Router) with the loaded response
3. Router runs middlewares and the route handler

---

## 5. Request Fetching: `RequestQueue` (v2)

### 5.1 `fetchNextRequest` (request_queue_v2.ts, ~lines 144–192)

`fetchNextRequest`:

1. Ensures the queue head is non-empty via `ensureHeadIsNonEmpty()`
2. Selects a request ID from the head
3. Calls `getOrHydrateRequest()` to obtain the full request
4. Skips requests with `request.handledAt` set (already processed)
5. Returns the next pending request to the caller

### 5.2 `ensureHeadIsNonEmpty` and `_listHeadAndLock`

`ensureHeadIsNonEmpty()` (lines ~280–291) calls `_listHeadAndLock()`, which:

1. Invokes `client.listAndLockHead` on the underlying storage (e.g. `RequestQueueClient` in `@crawlee/memory-storage`)
2. Loads requests from persistent storage into memory
3. Locks them by setting `orderNo` to a non-null value
4. Populates the in-memory `queueHeadIds` with request IDs

The lock prevents the same request from being fetched by multiple workers. Lock expiry is handled by the storage client.

### 5.3 Storage Layout (Local / Memory Storage)

With `CRAWLEE_STORAGE_DIR` (default `./storage`), request queue data is stored under:

```
./storage/request_queues/{QUEUE_ID}/
```

Each request is represented by an `InternalRequest` object (memory-storage, request-queue.ts, lines 44–52):

```typescript
export interface InternalRequest {
  id: string;
  orderNo: number | null;
  url: string;
  uniqueKey: string;
  method: Exclude<storage.RequestOptions['method'], undefined>;
  retryCount: number;
  json: string;
}
```

The `json` field is a stringified `RequestSchema`, which includes `userData`, `handledAt`, etc.:

```typescript
// @crawlee/types storages.ts, lines 266–276
export interface RequestSchema {
  id?: string;
  url: string;
  uniqueKey: string;
  method?: AllowedHttpMethods;
  payload?: string;
  noRetry?: boolean;
  retryCount?: number;
  errorMessages?: string[];
  headers?: Dictionary<string>;
  userData?: Dictionary;
  handledAt?: string;
  loadedUrl?: string;
}
```

### 5.4 `orderNo` and Handled Status

- **`orderNo !== null`**: Request is pending (or locked). It can be returned by `listAndLockHead` / `fetchNextRequest`.
- **`orderNo === null`**: Request is handled. It is filtered out when building the queue head (see request-queue.ts, ~line 267).

When a request is successfully processed, `markRequestHandled` is called (see §7). That updates the stored request:

- Sets `handledAt` to an ISO datetime string
- Sets `orderNo` to `null` in the `InternalRequest`

The request is **not deleted** from storage; it remains in the filesystem with updated metadata. This allows `userData` (and any cached response) to persist.

### 5.5 `addRequest` and Deduplication

When adding a request via `addRequest`:

- If a request with the same `uniqueKey` already exists, the operation returns `wasAlreadyPresent: true` and does **not** update the existing entry.
- New requests get a non-null `orderNo` (unless created with `handledAt`).
- For requests loaded from storage that already have `handledAt`, `orderNo` is set to `null` (see `_calculateOrderNo`, request-queue.ts, lines 640–646).

---

## 6. `uniqueKey` and Request Identity

### 6.1 Computation

`uniqueKey` is computed in the `Request` constructor (request.ts, ~line 203) via `computeUniqueKey()` (lines 418–435). By default it is a normalized URL. Options include:

- `keepUrlFragment`: Include the URL fragment in the key
- `useExtendedUniqueKey`: Include `method` and `payload` for finer-grained uniqueness

It is possible to override `uniqueKey` when creating a request to allow multiple entries for the same URL.

### 6.2 Request ID

The request `id` is derived from `uniqueKey` using a SHA256 hash:

```typescript
// memory-storage/utils.ts, line 27
uniqueKeyToRequestId(uniqueKey: string)
```

### 6.3 Deduplication Across Runs

When running `crawlee-one dev --fetch` multiple times:

- New URLs are added and get new `uniqueKey` values.
- Existing URLs with the same `uniqueKey` are detected by `addRequest` (`wasAlreadyPresent: true`).
- No duplicate entries are created for the same logical request.

---

## 7. Marking Requests as Handled

### 7.1 `markRequestHandled` (request_provider.ts, ~lines 570–600)

After successful processing, the crawler calls `markRequestHandled(request)`:

1. Sets `request.handledAt` to `new Date().toISOString()`
2. Calls `client.updateRequest` to persist the change

### 7.2 Storage Update (request-queue.ts, ~lines 500–569)

`updateRequest` in the memory-storage `RequestQueueClient`:

1. Reads the existing `InternalRequest` from storage
2. Parses `json` to get `RequestSchema`
3. Merges in the new fields (including `handledAt`)
4. Recomputes `orderNo` via `_calculateOrderNo()` — if `handledAt` is set, `orderNo` becomes `null`
5. Writes the updated `InternalRequest` back to storage

The request remains in storage; only its metadata changes.

Note: The `orderNo` is just a timestamp, with an optional minus sign (`-`) at the start. See [`_calculateOrderNo()`](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/memory-storage/src/resource-clients/request-queue.ts#L662).

### 7.3 `reclaimRequest`

To make a handled request available again (e.g. for re-fetching in dev mode):

- Call `reclaimRequest(request)` to clear `handledAt` and set `orderNo` to a non-null timestamp.
- The request will again be returned by `fetchNextRequest`.

---

## 8. Caching Strategy for Dev Scaffolding

### 8.1 Design Considerations

1. **Request persistence:** Use a **named** `RequestQueue` (not `'default'`) so it is not purged on `crawler.run()`.
2. **Storing responses:** `request.userData` is part of `RequestSchema` and persists with the request in the `json` field of `InternalRequest`. It can hold serialized req/res data.
3. **Deduplication:** Crawlee's `uniqueKey` mechanism already prevents duplicate requests; no custom logic needed.
4. **Serving cached responses:** Wrap `BasicCrawler.httpClient` with a custom implementation that:
   - Checks `request.userData` for a cached response before calling the real client
   - If found, returns a synthetic response (e.g. from stored HTML/body)
   - If not found, delegates to the real client and (optionally) stores the response in `userData` before `markRequestHandled`

### 8.2 Alternative Interception Points

| Point                    | Mechanism                       | Pros                                                 | Cons                                                             |
| ------------------------ | ------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| `request.skipNavigation` | Set before handling             | Simple, skips fetch entirely                         | Must inject response into context; may not fit all crawler types |
| `httpClient` override    | Custom `BaseHttpClient`         | Full control over response; works for all HTTP paths | Need to implement `stream`/`sendRequest` correctly               |
| Route handler            | Store in `userData` after fetch | No crawler changes                                   | Cannot avoid the HTTP request; only helps for post-fetch storage |

### 8.3 `RequestQueue` vs `Dataset` for Cache Iteration

- **RequestQueue:** Optimized for fetch-next semantics. Public API does not support iterating all requests (including handled ones) efficiently.
- **Dataset:** Better for iterating all stored items. For a `dev extract` command that walks all cached responses, consider storing a parallel `Dataset` or using `Dataset` as the primary cache store. `RequestQueue` + `userData` remains viable for on-the-fly request-level caching when the crawler fetches; `Dataset` suits batch iteration.

---

## 9. Summary Diagram

```
crawler.run()
  │
  ├─ purge default RequestQueue (if name === 'default' && purgeRequestQueue)
  ├─ _init() → RequestManager, AutoscaledPool
  │
  └─ AutoscaledPool
       │
       └─ _runTaskFunction()
            │
            ├─ _fetchNextRequest()
            │    └─ RequestQueue.fetchNextRequest()
            │         ├─ ensureHeadIsNonEmpty() → _listHeadAndLock()
            │         │    └─ client.listAndLockHead() → load from storage, filter orderNo !== null
            │         ├─ getOrHydrateRequest(id)
            │         └─ skip if request.handledAt
            │
            ├─ delayRequest() [optional, same-domain throttling]
            │
            └─ _runRequestHandler(request)
                 │
                 ├─ HttpCrawler: if !request.skipNavigation
                 │    └─ _handleNavigation()
                 │         └─ _requestFunction() → _requestAsBrowser()
                 │              └─ httpClient.stream()  ◄── CACHING INTERCEPTION POINT
                 │
                 └─ requestHandler(router) → middlewares + route handler
                      │
                      └─ on success → markRequestHandled(request)
                           └─ updateRequest: handledAt, orderNo = null
```

---

## References

- [BasicCrawler.run](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/basic-crawler/src/internals/basic-crawler.ts)
- [RequestQueue v2](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/core/src/storages/request_queue_v2.ts)
- [Memory Storage RequestQueueClient](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/memory-storage/src/resource-clients/request-queue.ts)
- [HttpCrawler](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/http-crawler/src/internals/http-crawler.ts)
- [BaseHttpClient](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/core/src/http_clients/base-http-client.ts)
- [RequestSchema](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/types/src/storages.ts)
- [Request](https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/core/src/request.ts)

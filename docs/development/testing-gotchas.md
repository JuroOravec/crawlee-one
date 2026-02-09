# Testing Gotchas

This document lists project-specific pitfalls discovered while writing and maintaining tests for crawlee-one. If you're adding tests and something fails in a confusing way, check here first.

## Crawlee request deduplication

Crawlee tracks processed URLs in a local storage directory and silently skips duplicates within the same process. If two integration tests use the exact same URL (e.g., `http://127.0.0.1:PORT/`), only the first one actually processes the request -- the rest are no-ops.

**Fix:** Give each integration test a unique URL by appending a query parameter:

```typescript
const url = `http://127.0.0.1:${port}/?type=cheerio`;
```

## Router mock context (`ctx.log`)

Crawlee's `Router` calls `ctx.log.debug()`, `ctx.log.info()`, etc., directly on the `log` object **before** delegating to your handler. This means the mock `log` must have `debug`, `info`, `error`, and `warning` methods on the object itself -- not just via `.child()`.

**Fix:** Use a helper that attaches all log methods to both the parent and child:

```typescript
function createRouterMockLog() {
  const methods = { debug: vi.fn(), info: vi.fn(), error: vi.fn(), warning: vi.fn() };
  return { ...methods, child: vi.fn().mockReturnValue({ ...methods }) };
}
```

## HttpCrawler body type

In Crawlee v3, `HttpCrawler` returns `ctx.body` as a `Buffer`, not a `string`. Code like `typeof ctx.body === 'string'` will evaluate to `false`.

**Fix:** Use `.toString()` to convert, or check for existence with `!!ctx.body`:

```typescript
const bodyStr = ctx.body?.toString() ?? '';
const hasContent = bodyStr.includes('Hello');
```

## Snapshotter sandbox issues

Crawlee's internal `Snapshotter` (part of the autoscaling system) spawns child processes to gather system memory information. In sandboxed environments (e.g., Cursor's default sandbox), this fails with `EPERM`.

**Fix:** Run integration tests that instantiate real Crawlee crawlers outside the sandbox. In Cursor, this means using `required_permissions: ['all']` when invoking the test command.

## `captureError` rethrows

The `captureError` function always rethrows the error after reporting it. Tests that call code using `captureError` must account for this:

```typescript
// Correct
await expect(wrappedFn()).rejects.toThrow('expected error');

// Also correct
try {
  await wrappedFn();
  expect.fail('should have thrown');
} catch (err) {
  expect((err as Error).message).toBe('expected error');
}
```

## Mock IO `runInContext`

The default mock for `io.runInContext` is a no-op (`vi.fn()`). For tests that exercise `runCrawleeOne` end-to-end, it must actually call the callback it receives:

```typescript
const mockIO = {
  // ...
  runInContext: vi.fn().mockImplementation(async (fn) => {
    await fn();
  }),
};
```

Without this, the crawler run callback is never executed and the test silently passes without exercising any handler logic.

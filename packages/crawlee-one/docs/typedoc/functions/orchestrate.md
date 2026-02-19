[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / orchestrate

# Function: orchestrate()

> **orchestrate**(`input`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/orchestrate.ts:104](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/orchestrate.ts#L104)

Run multiple crawlers with reactive reconciliation.

The aim of this function is to run all the provided crawlers until all their queues are empty.

This function resolves when all queues are empty.

## Details

Crawlers can be of 2 types:
- `keepAlive: true` - crawlers that run continuously until explicitly stopped.
- `keepAlive: false` - crawlers that run until their queue is empty, then exit.

Crawlers can add new work to other crawler's queues.

Crawers with `keepAlive: false` are handled reactively - if crawlerA with `keepAlive: false`
has already finished and stopped, but crawlerB populates crawlerA's queue with new work,
we need to start crawlerA again.

The general strategy is:

- **keepAlive: true** crawlers run continuously until explicitly stopped.
  They typically consume a queue (e.g. LLM processor) and stay alive so they're
  ready when new work arrives. Started at the beginning; stopped only once all
  queues have drained.

- **keepAlive: false** crawlers run until their queue is empty, then exit.
  We run them, react when they finish, reconcile queues, and restart them if
  their queue has new work (e.g. main scraper that defers to LLM and re-queues).

**This implementation reacts as soon as any single crawler finishes.**
Throughput is not limited by the slowest crawler.

## Flow

1. **Keep-alive crawlers**: Started once and run until the very end. No changes.

2. **Non-keep-alive crawlers - reactive reconciliation**:
   - Initial run: start all non-keep-alive crawlers (queues may be created by
     their `run()`, so we cannot inspect queues before first run).
   - When any non-keep-alive crawler finishes:
     a. Wait `checkIntervalMs`
     b. Reconcile: check all non-keep-alive crawlers vs their queues
     c. Start those that are NOT running but have non-empty queues

3. **Reconciliation states**:
   - Running + queue has work     → leave it running
   - Not running + queue empty    → nothing to do
   - Not running + queue has work → start that crawler
   - Running + queue empty        → let it finish (do not stop it)

4. **Keep-alive check**: Only when a reconciliation finds that ALL
   non-keep-alive queues are empty AND no non-keep-alive crawlers are running
   do we check keep-alive queues.
   - If those are also empty           → done.
   - If keep-alive queues have pending → wait interval and redo the full check
                                         (no crawlers to start since they are already running,
                                          so we just poll until they drain).

## Edge cases

- **No running crawlers, all non-keep-alive queues empty, keep-alive has
  pending**: Skip the "wait for a crawler to finish" step; wait interval,
  then run full reconciliation again. Correct polling loop.

- **Crawler running but queue already empty**: Let it finish. When its run()
  resolves, we reconcile. No special handling needed.

- **Keep-alive pushes to a non-keep-alive queue after the last one finished**:
  A prior iteration may have seen all non-keep-alive queues empty and only
  checked keep-alive. The next iteration reconciles and sees work in a
  non-keep-alive queue, so it starts that crawler again.

- **No "retirement"**: A crawler that finishes with an empty queue can receive
  new work later (e.g. from keep-alive crawlers). It will be started again in
  a future reconciliation.

## Parameters

### input

#### checkIntervalMs?

`number`

Interval in ms between queue-drain checks. Default: 5000. Use 0 in tests.

#### context

`Pick`\<[`CrawleeOneContext`](../interfaces/CrawleeOneContext.md)\<`any`\>, `"io"` \| `"log"`\>

#### crawlers

[`OrchestratedCrawler`](../type-aliases/OrchestratedCrawler.md)[]

## Returns

`Promise`\<`void`\>

import type { CrawleeOneActorInst } from './actor/types.js';
import type { MaybePromise } from '../utils/types.js';
import type { CrawleeOneIO } from './integrations/types.js';

const DEFAULT_QUEUE_DRAIN_CHECK_INTERVAL_MS = 5_000;

/** Crawler with run/stop methods. Can be a Crawlee BasicCrawler or a wrapper. */
export type OrchestratedCrawlerInstance = {
  run: () => MaybePromise<any>;
  stop: () => void;
};

/** Crawler descriptor for {@link orchestrate}. */
export type OrchestratedCrawler = {
  /** Crawler instance with `run()` and `stop()` methods. */
  crawler: OrchestratedCrawlerInstance;
  /** Queue ID this crawler consumes. Pass `undefined` for the default queue. */
  queueId: string | undefined;
  /**
   * Whether the crawler was configured with `keepAlive: true`.
   *
   * This affects how the crawler is orchestrated. See {@link orchestrate} for more details.
   */
  isKeepAlive: boolean;
};

/**
 * Run multiple crawlers with reactive reconciliation.
 *
 * The aim of this function is to run all the provided crawlers until all their queues are empty.
 *
 * This function resolves when all queues are empty.
 *
 * ## Details
 *
 * Crawlers can be of 2 types:
 * - `keepAlive: true` - crawlers that run continuously until explicitly stopped.
 * - `keepAlive: false` - crawlers that run until their queue is empty, then exit.
 *
 * Crawlers can add new work to other crawler's queues.
 *
 * Crawers with `keepAlive: false` are handled reactively - if crawlerA with `keepAlive: false`
 * has already finished and stopped, but crawlerB populates crawlerA's queue with new work,
 * we need to start crawlerA again.
 *
 * The general strategy is:
 *
 * - **keepAlive: true** crawlers run continuously until explicitly stopped.
 *   They typically consume a queue (e.g. LLM processor) and stay alive so they're
 *   ready when new work arrives. Started at the beginning; stopped only once all
 *   queues have drained.
 *
 * - **keepAlive: false** crawlers run until their queue is empty, then exit.
 *   We run them, react when they finish, reconcile queues, and restart them if
 *   their queue has new work (e.g. main scraper that defers to LLM and re-queues).
 *
 * **This implementation reacts as soon as any single crawler finishes.**
 * Throughput is not limited by the slowest crawler.
 *
 * ## Flow
 *
 * 1. **Keep-alive crawlers**: Started once and run until the very end. No changes.
 *
 * 2. **Non-keep-alive crawlers - reactive reconciliation**:
 *    - Initial run: start all non-keep-alive crawlers (queues may be created by
 *      their `run()`, so we cannot inspect queues before first run).
 *    - When any non-keep-alive crawler finishes:
 *      a. Wait `checkIntervalMs`
 *      b. Reconcile: check all non-keep-alive crawlers vs their queues
 *      c. Start those that are NOT running but have non-empty queues
 *
 * 3. **Reconciliation states**:
 *    - Running + queue has work     → leave it running
 *    - Not running + queue empty    → nothing to do
 *    - Not running + queue has work → start that crawler
 *    - Running + queue empty        → let it finish (do not stop it)
 *
 * 4. **Keep-alive check**: Only when a reconciliation finds that ALL
 *    non-keep-alive queues are empty AND no non-keep-alive crawlers are running
 *    do we check keep-alive queues.
 *    - If those are also empty           → done.
 *    - If keep-alive queues have pending → wait interval and redo the full check
 *                                          (no crawlers to start since they are already running,
 *                                           so we just poll until they drain).
 *
 * ## Edge cases
 *
 * - **No running crawlers, all non-keep-alive queues empty, keep-alive has
 *   pending**: Skip the "wait for a crawler to finish" step; wait interval,
 *   then run full reconciliation again. Correct polling loop.
 *
 * - **Crawler running but queue already empty**: Let it finish. When its run()
 *   resolves, we reconcile. No special handling needed.
 *
 * - **Keep-alive pushes to a non-keep-alive queue after the last one finished**:
 *   A prior iteration may have seen all non-keep-alive queues empty and only
 *   checked keep-alive. The next iteration reconciles and sees work in a
 *   non-keep-alive queue, so it starts that crawler again.
 *
 * - **No "retirement"**: A crawler that finishes with an empty queue can receive
 *   new work later (e.g. from keep-alive crawlers). It will be started again in
 *   a future reconciliation.
 */
export async function orchestrate(input: {
  actor: Pick<CrawleeOneActorInst<any>, 'io' | 'log'>;
  crawlers: OrchestratedCrawler[];
  /** Interval in ms between queue-drain checks. Default: 5000. Use 0 in tests. */
  checkIntervalMs?: number;
}): Promise<void> {
  const { actor, crawlers } = input;

  const io: CrawleeOneIO = actor.io;
  const checkIntervalMs = input.checkIntervalMs ?? DEFAULT_QUEUE_DRAIN_CHECK_INTERVAL_MS;

  const keptAliveCrawlers = crawlers.filter((c) => c.isKeepAlive);
  const nonKeptAliveCrawlers = crawlers.filter((c) => !c.isKeepAlive);

  // Start keep-alive crawlers; do NOT await.
  const keptAlivePromises = keptAliveCrawlers.map((c) => c.crawler.run());

  const sleep = (ms: number) =>
    ms > 0 ? new Promise<void>((r) => setTimeout(r, ms)) : Promise.resolve();

  const checkNonKeptAliveQueues = async (): Promise<Map<OrchestratedCrawler, boolean>> => {
    const results = await Promise.all(
      nonKeptAliveCrawlers.map(async (crawler) => {
        const queue = await io.openRequestQueue(crawler.queueId);
        const finished = await queue.isFinished();
        return { crawler, hasPending: !finished } as const;
      })
    );
    return new Map(results.map((r) => [r.crawler, r.hasPending]));
  };

  const allNonKeptAliveQueuesEmpty = (queueStates: Map<OrchestratedCrawler, boolean>): boolean => {
    for (const hasPending of queueStates.values()) {
      if (hasPending) return false;
    }
    return true;
  };

  const allKeptAliveQueuesEmpty = async (): Promise<boolean> => {
    const results = await Promise.all(
      keptAliveCrawlers.map(async (crawler) => {
        const queue = await io.openRequestQueue(crawler.queueId);
        return queue.isFinished();
      })
    );
    return results.every(Boolean);
  };

  try {
    // Initial run: start all non-keep-alive crawlers (queues may be created by run()).
    const running = new Map<OrchestratedCrawler, Promise<void>>();
    for (const crawler of nonKeptAliveCrawlers) {
      const prom = Promise.resolve(crawler.crawler.run());
      running.set(crawler, prom);
    }

    let done = false;
    while (!done) {
      // 1. If any non-keep-alive crawler is running, wait for one to finish.
      if (running.size > 0) {
        const finishedCrawler = await Promise.race(
          Array.from(running.entries()).map(([crawler, prom]) => prom.then(() => crawler))
        );
        running.delete(finishedCrawler);
      }

      // 2. Wait interval.
      await sleep(checkIntervalMs);

      // 3. Reconcile: check all non-keep-alive queues.
      const queueStates = await checkNonKeptAliveQueues();

      // 4. Start crawlers that are not running but have pending work.
      for (const crawler of nonKeptAliveCrawlers) {
        const hasPendingWork = queueStates.get(crawler);
        if (hasPendingWork && !running.has(crawler)) {
          const prom = Promise.resolve(crawler.crawler.run());
          running.set(crawler, prom);
          actor.log.info(
            `Starting crawler for queue with pending requests: ${crawler.queueId ?? 'default'}`
          );
        }
      }

      // 5. If no non-keep-alive crawlers running AND all non-keep-alive queues empty,
      //    then check keep-alive queues.
      if (running.size === 0 && allNonKeptAliveQueuesEmpty(queueStates)) {
        const keptAliveEmpty = await allKeptAliveQueuesEmpty();
        if (keptAliveEmpty) {
          done = true;
          break;
        }
        // Keep-alive queues still have pending; wait and recheck.
        actor.log.info(
          `Queue(s) with pending requests. Waiting ${checkIntervalMs / 1000}s before rechecking...`
        );
      }
    }
  } finally {
    // After all queues are empty, wait for the keep-alive crawlers to finish.
    // NOTE: We await the `run()` promises, because `BasicCrawler.stop()` just
    //       sets the internal state, but does not wait for the crawler to actually finish.
    keptAliveCrawlers.forEach((c) => c.crawler.stop());
    await Promise.all(keptAlivePromises);
  }
}

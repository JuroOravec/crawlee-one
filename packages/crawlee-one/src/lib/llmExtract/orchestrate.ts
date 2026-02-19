import type { MaybePromise } from '../../utils/types.js';
import type { CrawleeOneActorInst } from '../actor/types.js';
import { orchestrate, type OrchestratedCrawler } from '../orchestrate.js';
import { createLlmCrawler } from './llmCrawler.js';

/**
 * Run the main crawler (`run`) concurrently with the LLM crawler until both queues are empty.
 *
 * - Starts the LLM crawler (keepAlive) and the main crawler concurrently.
 * - When the main crawler finishes, waits for the LLM queue to drain.
 * - If the LLM crawler re-queues URLs to the main queue, re-runs the main crawler.
 * - Repeats until both queues are empty.
 *
 * Delegates to {@link orchestrate} for reactive per-crawler coordination.
 */
export async function orchestrateWithLlm(input: {
  actor: CrawleeOneActorInst<any>;
  llmRequestQueueId: string;
  llmKeyValueStoreId: string;
  /** Interval in ms between queue-drain checks. Default: 5000. Use 0 in tests to avoid timeouts. */
  llmQueueDrainCheckIntervalMs?: number;
  run: () => MaybePromise<void>;
}): Promise<void> {
  const { actor, llmRequestQueueId, llmKeyValueStoreId, llmQueueDrainCheckIntervalMs, run } = input;

  const llmCrawler = await createLlmCrawler({
    requestQueueId: llmRequestQueueId,
    keyValueStoreId: llmKeyValueStoreId,
    // keepAlive to keep the LLM node running after the scraper finishes
    keepAlive: true,
  });

  // On the first run we call the provided `run` function as that may populate the queue.
  // If the crawler is needed to be re-started, we then call only `actor.crawler.run([])`
  // so that we only run the crawler without adding new requests to the queue.
  let hasRunInitial = false;
  const mainRun = async (): Promise<void> => {
    if (!hasRunInitial) {
      hasRunInitial = true;
      await run();
    } else {
      await actor.crawler.run([]);
    }
  };

  const crawlers: OrchestratedCrawler[] = [
    {
      crawler: { run: mainRun, stop: () => {} }, // Stops by itself when queue is empty
      queueId: actor.input?.requestQueueId,
      isKeepAlive: false,
    },
    {
      crawler: llmCrawler,
      queueId: llmRequestQueueId,
      isKeepAlive: true,
    },
  ];

  await orchestrate({
    actor,
    crawlers,
    checkIntervalMs: llmQueueDrainCheckIntervalMs,
  });
}

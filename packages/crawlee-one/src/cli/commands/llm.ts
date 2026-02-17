import { Command } from 'commander';

import { apifyIO } from '../../lib/integrations/apify.js';
import { createLlmCrawler } from '../../lib/llmExtract/llmCrawler.js';

export function createLlmCommand(): Command {
  const llm = new Command('llm') //
    .description('LLM extraction and related subcommands');

  const extract = new Command('extract')
    .description(
      'Process deferred LLM extraction jobs from the LLM request queue. ' +
        'Run after the main scraper to extract data via LLM for pages that called extractWithLLM(). ' +
        'Queue and store IDs are read from env CRAWLEE_LLM_REQUEST_QUEUE_ID and CRAWLEE_LLM_KEY_VALUE_STORE_ID (default: "llm").'
    )
    .option('--queue [id]', 'LLM request queue ID (overrides CRAWLEE_LLM_REQUEST_QUEUE_ID)')
    .option('--store [id]', 'LLM key-value store ID (overrides CRAWLEE_LLM_KEY_VALUE_STORE_ID)')
    .addHelpText(
      'after',
      `
Example (standalone):
  $ crawlee-one llm extract

Example (as Apify actor command):
  CMD: ["node", "dist/cli.js", "llm", "extract"]
  Env: CRAWLEE_LLM_REQUEST_QUEUE_ID=llm CRAWLEE_LLM_KEY_VALUE_STORE_ID=llm
`
    )
    .action(async (opts: { queue?: string; store?: string }) => {
      try {
        const queueId = opts.queue ?? process.env.CRAWLEE_LLM_REQUEST_QUEUE_ID ?? 'llm';
        const storeId = opts.store ?? process.env.CRAWLEE_LLM_KEY_VALUE_STORE_ID ?? 'llm';
        await runLlmExtractCommand(queueId, storeId);
      } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
      }
    });

  return llm.addCommand(extract);
}

async function runLlmExtractCommand(queueId: string, storeId: string): Promise<void> {
  await apifyIO.runInContext(
    async () => {
      const crawler = await createLlmCrawler({
        requestQueueId: queueId,
        keyValueStoreId: storeId,
      });
      await crawler.run();
    },
    { statusMessage: 'LLM extraction finished!' }
  );
}

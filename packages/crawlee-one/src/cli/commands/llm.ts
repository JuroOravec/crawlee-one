import path from 'node:path';
import { Command } from 'commander';

import { loadConfig } from '../../lib/config/config.js';
import { apifyIO } from '../../lib/integrations/apify.js';
import { createLlmCrawler } from '../../lib/llmExtract/llmCrawler.js';
import { runLlmModelComparison } from '../../lib/llmCompare/comparison.js';
import type { LlmCompareReportDefinition } from '../../lib/config/types.js';
import type { CrawlerUrl } from '../../types.js';
import { getStorageDir } from '../../lib/preview/storage.js';

export function createLlmCommand(): Command {
  const llm = new Command('llm') //
    .description('LLM extraction and related subcommands');

  const compare = new Command('compare')
    .description(
      'Run LLM model comparisons from llm.compare.reports in crawlee-one.config.ts. ' +
        'For each report, fetches URLs, extracts via each model, and writes output to storage/reports/llm-compare--{name}.'
    )
    .option('--report [name]', 'Run only the named report (default: all)')
    .option('--config [path]', 'Path to crawlee-one.config.ts')
    .option('--format <html|json>', 'Output format: html (default) or json', 'html')
    .option(
      '--report-only',
      'Skip crawl; generate report from existing dataset only (no new extractions)'
    )
    .addHelpText(
      'after',
      `
Example:
  $ crawlee-one llm compare
  $ crawlee-one llm compare --report jobDetail
  $ crawlee-one llm compare --format json
  $ crawlee-one llm compare --report jobDetail --report-only
`
    )
    .action(
      async (opts: { report?: string; config?: string; format?: string; reportOnly?: boolean }) => {
        try {
          await runLlmCompareCommand(opts.report, opts.config, opts.format, opts.reportOnly);
        } catch (err) {
          console.error(err instanceof Error ? err.message : err);
          process.exit(1);
        }
      }
    );

  const extract = new Command('extract')
    .argument(
      '[id]',
      'ID used for both queue and store when --queue/--store are not set (e.g. llm extract my-id)'
    )
    .description(
      'Process deferred LLM extraction jobs from the LLM request queue. ' +
        'Run after the main scraper to extract data via LLM for pages that called extractWithLLM(). ' +
        'Requires explicit queue/store IDs: use positional id for both, or --queue/--store for individual config.'
    )
    .option('--queue <id>', 'LLM request queue ID')
    .option('--store <id>', 'LLM key-value store ID')
    .addHelpText(
      'after',
      `
Examples:
  $ crawlee-one llm extract my-id          # sets both queue and store to "my-id"
  $ crawlee-one llm extract my-id --queue q  # queue=q, store=my-id
  $ crawlee-one llm extract my-id --store s  # queue=my-id, store=s
  $ crawlee-one llm extract --queue q --store s  # queue=q, store=s
`
    )
    .action(async (id: string | undefined, opts: { queue?: string; store?: string }) => {
      try {
        const queueId = opts.queue ?? id;
        const storeId = opts.store ?? id;
        if (!queueId || !storeId) {
          const missing = !queueId && !storeId ? 'id' : !queueId ? '--queue' : '--store';
          console.error(
            `Error: Missing ${missing}. Use "llm extract my-id" or --queue and --store.`
          );
          process.exit(1);
        }
        await runLlmExtractCommand(queueId, storeId);
      } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
      }
    });

  return llm.addCommand(compare).addCommand(extract);
}

async function runLlmCompareCommand(
  reportName?: string,
  configPath?: string,
  formatOpt?: string,
  reportOnly?: boolean
): Promise<void> {
  const format = (formatOpt?.toLowerCase() ?? 'html') as 'html' | 'json';
  if (formatOpt && format !== 'html' && format !== 'json') {
    throw new Error(`Invalid --format "${formatOpt}". Use "html" or "json".`);
  }
  const config = await loadConfig(configPath);
  if (!config?.llm?.compare?.reports) {
    throw new Error(
      'No llm.compare.reports found in crawlee-one config. Add llm.compare.reports to crawlee-one.config.ts.'
    );
  }
  if (!Object.keys(config.llm.compare.reports).length) {
    throw new Error('llm.compare.reports is empty.');
  }

  const reportsToProcess: { name: string; reportDef: LlmCompareReportDefinition }[] = [];
  if (reportName) {
    if (!config.llm.compare.reports[reportName]) {
      throw new Error(
        `Report "${reportName}" not found in llm.compare.reports. Available: ${Object.keys(config.llm.compare.reports).join(', ')}`
      );
    }
    const reportDef = config.llm.compare.reports[reportName];
    reportsToProcess.push({ name: reportName, reportDef });
  } else {
    reportsToProcess.push(
      ...Object.entries(config.llm.compare.reports).map(([name, reportDef]) => ({
        name,
        reportDef,
      }))
    );
  }

  const configDir = configPath ? path.dirname(path.resolve(configPath)) : process.cwd();
  if (!process.env.APIFY_LOCAL_STORAGE_DIR) {
    process.env.APIFY_LOCAL_STORAGE_DIR = path.resolve(configDir, 'storage');
  }
  const storageDir = getStorageDir();

  await apifyIO.runInContext(
    async () => {
      for (const { name, reportDef } of reportsToProcess) {
        const outputDir = path.join(storageDir, 'reports', `llm-compare--${name}`);
        const outputPath = path.join(outputDir, format === 'json' ? 'report.json' : 'report.html');

        console.log(
          reportOnly
            ? `[llm compare] Generating report "${name}" from existing dataset...`
            : `[llm compare] Running report "${name}"...`
        );
        await runLlmModelComparison({
          urls: reportDef.urls as CrawlerUrl[],
          modelConfigs: reportDef.models,
          referenceModel: reportDef.referenceModel,
          schema: reportDef.schema,
          systemPrompt: reportDef.systemPrompt,
          outputPath,
          outputFormat: format,
          reportName: name,
          reportOnly,
        });
        console.log(`[llm compare] Report "${name}" saved to ${outputPath}`);
      }
    },
    { statusMessage: 'LLM compare finished!' }
  );
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

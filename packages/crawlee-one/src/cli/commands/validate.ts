import { Command } from 'commander';

import { loadConfig, validateConfig } from '../../lib/config/config.js';

export function createValidateCommand(): Command {
  return new Command('validate')
    .description('Validate CrawleeOne config')
    .requiredOption('-c --config <config-file>', 'path to config file')
    .addHelpText(
      'after',
      `

Example call:
  $ crawlee-one validate -c ./path/to/config`
    )
    .action(async ({ config: configPath }: { config: string }) => {
      const config = await loadConfig(configPath);
      validateConfig(config);
      console.log('CrawleeOne config is OK!');
    });
}

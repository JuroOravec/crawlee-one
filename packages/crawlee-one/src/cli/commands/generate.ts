import { Command } from 'commander';

import { generateTypes } from '../../lib/generate/generateTypes.js';
import { generateActor } from '../../lib/generate/generateActor.js';
import { generateActorSpec } from '../../lib/generate/generateActorspec.js';
import { generateReadme } from '../../lib/generate/generateReadme.js';
import { loadConfig, validateConfig } from '../../lib/config/config.js';

export function createGenerateCommand(): Command {
  return new Command('generate')
    .alias('gen')
    .description(
      'Generate all configured artifacts (types, actor.json, actorspec.json, README) from config'
    )
    .option('-c --config [config-file]', 'path to config file')
    .addHelpText(
      'after',
      `

Example call:
  $ crawlee-one generate
  $ crawlee-one gen -c ./path/to/config-file.ts`
    )
    .action(async ({ config: configFile }) => {
      try {
        await runGenerateCommand(configFile);
      } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
      }
    });
}

/**
 * Generate all configured artifacts from crawlee-one config.
 *
 * Generates: types, actor.json, actorspec.json, README.
 *
 * @param configFilePath - Optional path to config file (default: cosmiconfig resolution).
 *
 * @example Via CLI
 * ```bash
 * crawlee-one generate
 * crawlee-one gen -c ./crawlee-one.config.ts
 * ```
 */
async function runGenerateCommand(configFilePath?: string): Promise<void> {
  const config = await loadConfig(configFilePath);
  validateConfig(config);

  if (!config) {
    console.error('No crawlee-one config found. Create a crawlee-one.config.ts file.');
    process.exit(1);
  }

  await generateTypes(config);
  await generateActor(config);
  await generateActorSpec(config);
  await generateReadme(config);
}

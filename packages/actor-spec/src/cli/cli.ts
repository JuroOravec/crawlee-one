import { createRequire } from 'node:module';
import { program } from 'commander';

import { generate } from './commands.js';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

interface CLIOptions {
  config: string;
  outDir?: string;
  silent: boolean;
}

// Example
// `actor-spec gen -c/--config ./actorspec.js -o/--out ./.actor/actorspec.json`
program
  .name('actor-spec')
  .description('Utils for working with ActorSpec config')
  .version(version)
  .addHelpText(
    'after',
    `

Example call:
  $ actor-spec gen -c ./actor.js -o ./.actor/actorspec.json`
  );

program
  .command('gen')
  .description('Generate actorspec.json from given js config file')
  .option('-c, --config <path>', 'path to actor config')
  .option(
    '-o, --out-dir [output-path]',
    'path to dir where the actorspec.json is exported. By default exports to "./.actor" if it exists, otherwise to "./"'
  )
  .option('-s, --silent', 'do not write log messages to stdout')
  .action(async (options: CLIOptions) => {
    await generate(options);
  });

export const cli = () => {
  program.parse();
};

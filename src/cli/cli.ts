import { program } from 'commander';
import path from 'path';

import { getPackageJsonInfo } from '../utils/package';
import { createLocalMigrator } from '../lib/migrate/localMigrator';
import { loadConfig, validateConfig } from './commands/config';
import { generateTypes } from './commands/codegen';

const pkgJson = getPackageJsonInfo(module, ['name', 'version']);

program //
  .name(pkgJson.name)
  .description('CLI to run crawlee-one tools')
  .version(pkgJson.version);

program
  .command('generate')
  .description('Generate CrawleeOne types based on config')
  .option('-c --config [config-file]', 'path to config file')
  .requiredOption('-o --out <output-file>', 'path to output file')
  .addHelpText(
    'after',
    `

Example call:
  $ crawlee-one generate -c ./path/to/config-file -o ./path/to/output.ts`
  )
  .action(async ({ config: configFile, out: outFile }) => {
    await generateTypes(outFile, configFile);
  });

program
  .command('validate')
  .description('Validate CrawleeOne config')
  .requiredOption('-c --config <config-file>', 'path to config file')
  .addHelpText(
    'after',
    `

Example call:
  $ crawlee-one validate -c ./path/to/config`
  )
  .action(async ({ config: configPath }) => {
    const config = await loadConfig(configPath);
    validateConfig(config);
    console.log('CrawleeOne config is OK!');
  });

program
  .command('migrate')
  .description('Run a migration script specified by the version number')
  .requiredOption('-t --target <target-version>', 'migration version to execute, eg "v1"')
  .requiredOption('-d --dir <path>', 'path to the migrations directory')
  .option(
    '--delimeter [delimeter]',
    'delimeter between version and rest of file name, eg "v1_filename"'
  )
  .option(
    '--ext --extension [ext-glob]',
    'glob pattern for valid extensions for migration files, eg ".js" or ".{js,ts}"'
  )
  .addHelpText(
    'after',
    `

Example call:
  $ crawlee-one migrate -d ./path/to/migrations-dir -t v1`
  )
  .action(async ({ dir, target, extension, delimeter }) => {
    const migrationsDir = path.resolve(process.cwd(), dir);
    const { migrate } = createLocalMigrator({ migrationsDir, extension, delimeter });
    await migrate(target);
  });

program
  .command('unmigrate')
  .description('Run an un-migration script specified by the version number')
  .requiredOption('-t --target <target-version>', 'migration version to execute, eg "v1"')
  .requiredOption('-d --dir <path>', 'path to the migrations directory')
  .option(
    '--delimeter [delimeter]',
    'delimeter between version and rest of file name, eg "v1_filename"'
  )
  .option(
    '--ext --extension [ext-glob]',
    'glob pattern for valid extensions for migration files, eg ".js" or ".{js,ts}"'
  )
  .addHelpText(
    'after',
    `

Example call:
  $ crawlee-one unmigrate -d ./path/to/migrations-dir -t v1`
  )
  .action(async ({ dir, target, extension, delimeter }) => {
    const migrationsDir = path.resolve(process.cwd(), dir);
    const { unmigrate } = createLocalMigrator({ migrationsDir, extension, delimeter });
    await unmigrate(target);
  });

export const cli = () => {
  program.parse();
};

import { program } from 'commander';
import path from 'path';

import { getPackageJsonInfo } from '../utils/package';
import { createLocalMigrator } from '../lib/migrate/localMigrator';

const pkgJson = getPackageJsonInfo(module, ['name', 'version']);

program //
  .name(pkgJson.name)
  .description('CLI to run Apify actor utils')
  .version(pkgJson.version);

program
  .command('migrate')
  .description('Run a migration script specified by the version number')
  .requiredOption('-t --target <target-version>', 'migration version to execute, eg "v1"')
  .requiredOption('-d --dir <path>', 'path to the migrations directory')
  .addHelpText(
    'after',
    `

Example call:
  $ apify-actor-utils migrate v1`
  )
  .action(async (options) => {
    const migrationsDir = path.resolve(process.cwd(), options.dir);
    const { migrate } = createLocalMigrator({ migrationsDir });
    await migrate(options.target);
  });

program
  .command('unmigrate')
  .description('Run an un-migration script specified by the version number')
  .requiredOption('-t --target <target-version>', 'migration version to execute, eg "v1"')
  .requiredOption('-d --dir <path>', 'path to the migrations directory')
  .addHelpText(
    'after',
    `

Example call:
  $ apify-actor-utils unmigrate v1`
  )
  .action(async (options) => {
    const migrationsDir = path.resolve(process.cwd(), options.dir);
    const { unmigrate } = createLocalMigrator({ migrationsDir });
    await unmigrate(options.target);
  });

export const cli = () => {
  program.parse();
};

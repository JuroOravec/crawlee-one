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
  .argument('<version>', 'migration version to execute, eg "v1"')
  .requiredOption('-d --dir <path>', 'path to the migrations directory')
  .addHelpText(
    'after',
    `

Example call:
  $ apify-actor-utils migrate v1`
  )
  .action(async (version, options) => {
    const migrationsDir = path.resolve(process.cwd(), options.dir);
    const { migrate } = createLocalMigrator({ migrationsDir });
    await migrate(version);
  });

program
  .command('unmigrate')
  .description('Run an un-migration script specified by the version number')
  .argument('<version>', 'migration version to execute, eg "v1"')
  .requiredOption('-d --dir <path>', 'path to the migrations directory')
  .addHelpText(
    'after',
    `

Example call:
  $ apify-actor-utils unmigrate v1`
  )
  .action(async (version, options) => {
    const migrationsDir = path.resolve(process.cwd(), options.dir);
    const { unmigrate } = createLocalMigrator({ migrationsDir });
    await unmigrate(version);
  });

export const cli = () => {
  program.parse();
};

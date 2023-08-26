import { program } from 'commander';
import path from 'path';

import { getPackageJsonInfo } from '../utils/package';
import { createLocalMigrator } from '../lib/migrate/localMigrator';

const pkgJson = getPackageJsonInfo(module, ['name', 'version']);

program //
  .name(pkgJson.name)
  .description('CLI to run crawlee-one tools')
  .version(pkgJson.version);

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

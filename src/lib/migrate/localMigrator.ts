import path from 'path';
import dotenv from 'dotenv';
import { glob } from 'glob';
import { ApifyClient } from 'apify-client';

import type { Migration } from './types';

export const createLocalMigrator = ({ migrationsDir }: { migrationsDir: string }) => {
  const findLocalMigrationFileByVersion = async (version: string): Promise<string> => {
    const files = await glob(path.join(migrationsDir, `${version}_*`));
    if (!files.length) {
      throw Error(`No migration file matched version "${version}"`);
    }
    if (files.length > 1) {
      throw Error(
        `Ambiguous migration version. Version "${version}" matched multiple migration files`
      );
    }
    return files[0];
  };

  const setup = () => {
    dotenv.config();
    const client = new ApifyClient({
      token: process.env.APIFY_TOKEN,
    });
    return { client };
  };

  const migrate = async (version: string) => {
    const migFile = await findLocalMigrationFileByVersion(version);
    const { client } = setup();
    const { migrate } = require(migFile).default as Migration;
    await migrate(client);
  };

  const unmigrate = async (version: string) => {
    const migFile = await findLocalMigrationFileByVersion(version);
    const { client } = setup();
    const { unmigrate } = require(migFile).default as Migration;
    await unmigrate(client);
  };

  return {
    migrate,
    unmigrate,
  };
};

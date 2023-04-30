import type { ApifyClient } from 'apify-client';
import path from 'path';

import { Migration, createLocalMigrationState } from '../../..';

// This file is an example of how to make changes to the actors
// programmatically in a documented (and optionally reversible) way.
//
// Docs: https://docs.apify.com/academy/getting-started/apify-client
//
// Exmaple:
// migrate - `npm run migrate -- -t v1`
// unmigrate - `npm run unmigrate -- -t v1`

const { saveState, loadState } = createLocalMigrationState({
  stateDir: path.join(`${process.cwd()}`, './src/actor-migrations/states'),
});

/** Run the migration forward */
const migrate = async (client: ApifyClient): Promise<void> => {
  const actor = client.actor('YOUR_USERNAME/adding-actor');
  // console.log({ actorClient: actor, actorData: await actor.get() });
  console.log('Called MIGRATE with client ', client);
  await saveState(__filename, { get: () => ({} as any) } as any);

  // await actor.update({
  //   defaultRunOptions: {
  //     build: 'latest',
  //     memoryMbytes: 256,
  //     timeoutSecs: 20,
  //   },
  // });
};

/** Run the migration backward (AKA undo the migration), if old state is available */
const unmigrate = async (client: ApifyClient): Promise<void> => {
  const actor = client.actor('YOUR_USERNAME/adding-actor');
  console.log('Called UNMIGRATE with client ', client);
  const oldActorState = await loadState(__filename);

  // await actor.update({
  //   defaultRunOptions: oldActorState.defaultRunOptions,
  // });
};

const migration: Migration = { migrate, unmigrate };

export default migration;

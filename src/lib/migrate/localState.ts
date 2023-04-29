import fsp from 'fs/promises';
import path from 'path';
import type { Actor, ActorClient } from 'apify-client';

export const createLocalMigrationState = ({ stateDir }: { stateDir: string }) => {
  const genStateFilepath = (migrationFilename: string) => {
    const filenameNoExt = path.parse(migrationFilename).name;
    const stateFilename = `${filenameNoExt}.json`;
    const stateFilepath = path.join(stateDir, stateFilename);
    return stateFilepath;
  };

  const saveState = async (migrationFilename: string, actor: ActorClient): Promise<void> => {
    const stateFilepath = genStateFilepath(migrationFilename);
    const actorData = JSON.stringify(await actor.get());

    await fsp.mkdir(path.dirname(stateFilepath), { recursive: true });
    await fsp.writeFile(stateFilepath, actorData, 'utf-8');
  };

  const loadState = async (migrationFilename: string): Promise<Actor> => {
    const stateFilepath = genStateFilepath(migrationFilename);
    const fileContent = await fsp.readFile(stateFilepath, 'utf-8');
    const actorData = JSON.parse(fileContent) as Actor;
    return actorData;
  };

  return {
    saveState,
    loadState,
  };
};

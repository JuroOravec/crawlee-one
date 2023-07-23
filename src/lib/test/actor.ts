import type { vi } from 'vitest';
import { Actor, RequestQueue } from 'apify';
import { Dictionary, KeyValueStore } from 'crawlee';

import type { MaybeArray, MaybePromise } from '../../utils/types';
import {
  OnBatchAddRequests,
  createMockStorageClient,
  createMockStorageDataset,
} from './mockApifyClient';

export const setupMockApifyActor = async <
  TInput,
  TData extends MaybeArray<Dictionary> = MaybeArray<Dictionary>
>({
  vi: viInstance,
  actorInput,
  log,
  onPushData,
  onBatchAddRequests,
  onGetInfo,
}: {
  vi: typeof vi;
  actorInput?: TInput;
  log?: (...args: any[]) => void;
  onPushData?: (data: TData) => MaybePromise<void>;
  onBatchAddRequests?: OnBatchAddRequests;
  onGetInfo?: (...args: any[]) => MaybePromise<void>;
}) => {
  const mockStorageClient = createMockStorageClient({ log, onBatchAddRequests });

  viInstance.spyOn(Actor, 'main').mockImplementation(async (fn) => fn());
  viInstance.spyOn(Actor, 'getInput').mockImplementation(() => Promise.resolve(actorInput));

  viInstance.spyOn(Actor, 'openDataset').mockImplementation(async (datasetIdOrName, options) => {
    console.log('Mock Actor.openDataset: ', datasetIdOrName);
    return createMockStorageDataset(datasetIdOrName, options, { log, onPushData, onGetInfo });
  });
  viInstance.spyOn(Actor, 'pushData').mockImplementation(async (data) => {
    console.log('Mock Actor.pushData');
    if (onPushData) await onPushData(data as any);
  });

  viInstance.spyOn(RequestQueue, 'open').mockImplementation(async () => {
    const reqQueue = new RequestQueue({
      id: 'test',
      client: mockStorageClient,
    });
    return reqQueue;
  });

  viInstance
    .spyOn(KeyValueStore, 'open')
    .mockImplementation(
      async () => new KeyValueStore({ id: 'keyvalstore', client: mockStorageClient })
    );

  await Actor.init();
};

export const runCrawlerTest = async <TData extends MaybeArray<Dictionary>, TInput>({
  vi: viInstance,
  input,
  runCrawler,
  log,
  onPushData,
  onBatchAddRequests,
  onDone = (done) => done(),
}: {
  vi: typeof vi;
  input: TInput;
  runCrawler: () => MaybePromise<void>;
  log?: (...args: any[]) => void;
  onPushData?: (data: any, done: () => void) => MaybePromise<void>;
  onBatchAddRequests?: OnBatchAddRequests;
  onDone?: (done: () => void) => MaybePromise<void>;
}) => {
  await new Promise<void>(async (done) => {
    await setupMockApifyActor<TInput, TData>({
      vi: viInstance,
      actorInput: { ...input },
      log,
      onPushData: (data) => onPushData?.(data, done),
      onBatchAddRequests,
    });

    await runCrawler();
    await onDone?.(done);
  });
};

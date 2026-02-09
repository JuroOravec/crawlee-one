import type { Dataset, OpenStorageOptions } from 'apify';
import type {
  RequestQueue as ClientRequestQueue,
  RequestQueueClientAddRequestOptions,
  RequestQueueClientAddRequestResult,
  RequestQueueClientBatchAddRequestWithRetriesOptions,
  RequestQueueClientBatchRequestsOperationResult,
  RequestQueueClientGetRequestResult,
  RequestQueueClientListHeadOptions,
  RequestQueueClientListHeadResult,
  RequestQueueClientRequestSchema,
} from 'apify-client';
import type {
  Dataset as ClientDataset,
  DatasetCollectionClient,
  DatasetCollectionClientGetOrCreateOptions,
  DatasetCollectionClientListOptions,
  DatasetCollectionClientListResult,
  KeyValueStoreClient,
  KeyValueStoreRecord,
  RequestQueueClient,
} from 'apify-client';
import type { StorageClient } from 'crawlee';

import type { MaybePromise } from '../../utils/types.js';

export type OnBatchAddRequestsArgs = [
  requests: Omit<RequestQueueClientRequestSchema, 'id'>[],
  options?: RequestQueueClientBatchAddRequestWithRetriesOptions,
];
export type OnBatchAddRequests = (...args: OnBatchAddRequestsArgs) => MaybePromise<void>;

export const createMockClientDataset = (overrides?: ClientDataset): ClientDataset => ({
  id: 'MockClientDataset.id',
  name: 'MockClientDataset.name',
  title: 'MockClientDataset.title',
  userId: 'MockClientDataset.id.userId',
  createdAt: new Date('2023-04-17'),
  modifiedAt: new Date('2023-04-17'),
  accessedAt: new Date('2023-04-17'),
  itemCount: 10,
  cleanItemCount: 10,
  actId: 'MockClientDataset.actId',
  actRunId: 'MockClientDataset.actRunId',
  stats: {},
  fields: [],
  itemsPublicUrl: '',
  ...overrides,
});

export const createMockClientRequestQueue = (
  overrides?: ClientRequestQueue
): ClientRequestQueue => ({
  id: 'MockClientRequestQueue.id',
  name: 'MockClientRequestQueue.name',
  title: 'MockClientRequestQueue.title',
  userId: 'MockClientRequestQueue.userId',
  createdAt: new Date('2023-04-17'),
  modifiedAt: new Date('2023-04-17'),
  accessedAt: new Date('2023-04-17'),
  // expireAt?: string;
  totalRequestCount: 0,
  handledRequestCount: 0,
  pendingRequestCount: 0,
  // actId?: string;
  // actRunId?: string;
  hadMultipleClients: false,
  stats: {},
  ...overrides,
});

export const createMockKeyValueStoreClient = ({
  log,
}: { log?: (args: any) => void } = {}): KeyValueStoreClient => {
  return {
    getRecord: (...args: [string]): Promise<KeyValueStoreRecord<any> | undefined> => {
      const [key] = args;
      log?.(`Called MockKeyValueStoreClient.getRecord with ${JSON.stringify(args)}`);
      return Promise.resolve({
        key,
        value: null,
        // contentType?: string;
      });
    },
    setRecord: (...args: [record: KeyValueStoreRecord<any>]): Promise<void> => {
      log?.(`Called MockKeyValueStoreClient.setRecord with ${JSON.stringify(args)}`);
      return Promise.resolve();
    },
    // get(): Promise<KeyValueStoreInfo | undefined>;
    // update(newFields: KeyValueStoreClientUpdateOptions): Promise<Partial<KeyValueStoreInfo>>;
    // delete(): Promise<void>;
    // listKeys(options?: KeyValueStoreClientListOptions): Promise<KeyValueStoreClientListData>;
    // getRecord(key: string, options?: KeyValueStoreClientGetRecordOptions): Promise<KeyValueStoreRecord | undefined>;
    // setRecord(record: KeyValueStoreRecord): Promise<void>;
    // deleteRecord(key: string): Promise<void>;
  } as any;
};

export const createMockRequestQueueClient = ({
  log,
  onBatchAddRequests,
}: {
  log?: (args: any) => void;
  onBatchAddRequests?: OnBatchAddRequests;
} = {}): RequestQueueClient => {
  const requestQueue: any[] = [];

  return {
    batchAddRequests: async (
      ...args: OnBatchAddRequestsArgs
    ): Promise<RequestQueueClientBatchRequestsOperationResult> => {
      const [requests, options] = args;
      log?.(`Called MockRequestQueueClient.batchAddRequests with ${JSON.stringify(args)}`);
      const reqsWithIds = requests.map((r) => ({ ...r, id: Math.random() + '' }));
      requestQueue.push(...reqsWithIds);

      const reqsAddedToQueue = reqsWithIds.map((r) => ({
        uniqueKey: r.uniqueKey,
        requestId: r.id,
        wasAlreadyPresent: false,
        wasAlreadyHandled: false,
      }));

      await onBatchAddRequests?.(requests, options);

      return Promise.resolve({
        unprocessedRequests: [],
        processedRequests: reqsAddedToQueue,
      });
    },

    get: (...args: any[]) => {
      log?.(`Called MockRequestQueueClient.get with ${JSON.stringify(args)}`);
      return Promise.resolve(createMockClientRequestQueue());
    },

    getRequest: async (
      ...args: [id: string]
    ): Promise<RequestQueueClientGetRequestResult | undefined> => {
      const [id] = args;
      log?.(`Called MockRequestQueueClient.getRequest with ${JSON.stringify(args)}`);
      log?.(`requestQueue: ${JSON.stringify(requestQueue.map((r) => r.id))}`);

      const indexOfNextRequest = requestQueue.findIndex((r) => r.id === id);
      if (indexOfNextRequest === -1) return undefined;

      const [req] = requestQueue.splice(indexOfNextRequest, 1);
      return req;
    },

    updateRequest: (
      ...args: [
        request: RequestQueueClientRequestSchema,
        options?: RequestQueueClientAddRequestOptions,
      ]
    ): Promise<RequestQueueClientAddRequestResult> => {
      const [request, _options] = args;
      log?.(`Called MockRequestQueueClient.updateRequest with ${JSON.stringify(args)}`);
      log?.(`requestQueue: ${JSON.stringify(requestQueue)}`);

      const indexOfUpdatedRequest = requestQueue.findIndex((r) => r.id === request.id);
      const wasAlreadyPresent = indexOfUpdatedRequest !== -1;
      if (wasAlreadyPresent) {
        const req = requestQueue[indexOfUpdatedRequest];
        Object.assign(req, request);
      } else {
        const req = Object.assign({}, request);
        requestQueue.push(req);
      }

      log?.(`requestQueue: ${JSON.stringify(requestQueue)}`);

      // [{"id":"0.9121846955138175","url":"https://profesia.sk/partneri","loadedUrl":"https://www.profesia.sk/partneri","uniqueKey":"https://profesia.sk/partneri","method":"GET","noRetry":false,"retryCount":0,"errorMessages":[],"headers":{},"userData":{"__crawlee":{"state":4}},"handledAt":"2023-04-17T12:15:57.350Z"}]
      return Promise.resolve({
        requestId: request.id,
        wasAlreadyPresent,
        wasAlreadyHandled: false,
      });
    },

    listHead: (
      ...args: [options?: RequestQueueClientListHeadOptions]
    ): Promise<RequestQueueClientListHeadResult> => {
      const [options] = args;
      log?.(`Called MockRequestQueueClient.listHead with ${JSON.stringify(args)}`);
      return Promise.resolve({
        items: [],
        queueModifiedAt: new Date('2023-04-17'),
        hadMultipleClients: false,
        limit: options?.limit ?? 100,
      });
    },
  } as any;
};

export const createMockDatasetCollectionClient = ({
  log,
}: { log?: (args: any) => void } = {}): DatasetCollectionClient => {
  const dataset: any[] = [];

  return {
    list: (
      options?: DatasetCollectionClientListOptions
    ): Promise<DatasetCollectionClientListResult> => {
      let items = dataset.slice();
      if (options?.desc) items = items.reverse();
      if (options?.offset) items = items.slice(options.offset);

      return Promise.resolve({
        total: dataset.length,
        count: options?.limit ?? items.length,
        offset: options?.offset ?? 0,
        limit: options?.limit ?? items.length,
        desc: options?.desc ?? false,
        unnamed: false,
        items,
      });
    },

    getOrCreate: (
      name?: string,
      options?: DatasetCollectionClientGetOrCreateOptions
    ): Promise<ClientDataset> => Promise.resolve(createMockClientDataset()),

    // _list, _create, _getOrCreate, baseUrl
  } as any;
};

export const createMockStorageClient = ({
  log,
  onBatchAddRequests,
}: {
  log?: (args: any) => void;
  onBatchAddRequests?: OnBatchAddRequests;
} = {}): StorageClient => {
  return {
    datasets: (...args: any[]): DatasetCollectionClient => {
      log?.(`Called MockStorageClient.datasets with ${JSON.stringify(args)}`);
      return createMockDatasetCollectionClient({ log });
    },
    requestQueue: (...args: any[]) => {
      log?.(`Called MockStorageClient.requestQueue with ${JSON.stringify(args)}`);
      return createMockRequestQueueClient({ log, onBatchAddRequests });
    },
    keyValueStore: (...args: any[]) => {
      log?.(`Called MockStorageClient.keyValueStore with ${JSON.stringify(args)}`);
      return createMockKeyValueStoreClient({ log });
    },

    // dataset, keyValueStores, requestQueues
  } as any;
};

export const createMockStorageDataset = (
  ...args: [
    datasetId?: string | null,
    options?: OpenStorageOptions,
    custom?: {
      log?: (...args: any[]) => void;
      onPushData?: (...args: any[]) => MaybePromise<void>;
      onGetInfo?: (...args: any[]) => MaybePromise<void>;
    },
  ]
): Promise<Dataset<any>> => {
  const origArgs = args.slice().slice(0, 2);
  const [datasetId, __, custom] = args;
  const { log, onPushData, onGetInfo } = custom || {};
  log?.(`Called MockStorageDataset with ${JSON.stringify(origArgs)}`);

  return Promise.resolve({
    pushData: async (...args) => {
      log?.(`Called MockStorageDataset.pushData (instance ${datasetId}) with ${JSON.stringify(args)}`); // prettier-ignore
      await onPushData?.(...args);
    },
    getInfo: async (...args) => {
      log?.(`Called MockStorageDataset.getInfo (instance ${datasetId}) with ${JSON.stringify(args)}`); // prettier-ignore
      return onGetInfo ? onGetInfo(...args) : { itemCount: 10 };
    },
  } as Dataset);
};

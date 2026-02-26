import {
  type Log,
  type RequestQueue,
  type RequestQueueOperationOptions,
  type Source,
} from 'crawlee';

import { type CrawleeOneRequestQueue } from '../integrations/types.js';

/** Options for addRequestOrReclaim */
export interface AddRequestOrReclaimOpts {
  queue: RequestQueue | CrawleeOneRequestQueue;
  request: Source;
  log: Log;
  options?: RequestQueueOperationOptions;
}

export const addRequestOrReclaim = async (opts: AddRequestOrReclaimOpts) => {
  const { queue, request, log, options } = opts;
  const addResult = await queue.addRequest(request, options);
  const queueName = queue.name ?? 'queue';

  if (addResult.wasAlreadyHandled || addResult.wasAlreadyPresent) {
    const req = await queue.getRequest(addResult.requestId);
    if (req) {
      const reqObj = req as unknown as Record<string, unknown>;
      // To ensure request gets processed again, we need to remove handledAt
      // and set orderNo to a non-null value
      const { handledAt: _handledAt, ...reqWithoutHandledAt } = reqObj;
      const reclaimReq = { ...reqWithoutHandledAt, orderNo: Date.now(), retryCount: 0 };

      await queue.reclaimRequest(reclaimReq as unknown as typeof req);
      log.info(`Reclaimed original request in ${queueName} for ${request.url}`);
    } else {
      log.warning(
        `Could not reclaim request ${addResult.requestId} in ${queueName} (getRequest returned null)`
      );
    }
  } else {
    log.info(`Re-queued original request to ${queueName} for ${request.url}`);
  }
};

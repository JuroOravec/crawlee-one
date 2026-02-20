import { RequestQueue, Source, Log, type RequestQueueOperationOptions } from 'crawlee';

import { CrawleeOneRequestQueue } from '../integrations/types.js';

export const addRequestOrReclaim = async (
  queue: RequestQueue | CrawleeOneRequestQueue,
  request: Source,
  log: Log,
  options?: RequestQueueOperationOptions
) => {
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

import { Actor } from 'apify';
import type { CrawlingContext } from 'crawlee';

export interface ActorEntryMetadata {
  actorId: string | null;
  actorRunId: string | null;
  actorRunUrl: string | null;
  contextId: string;
  requestId: string | null;

  /** The URL given to the crawler */
  originalUrl: string | null;
  /** The URL given to the crawler after possible redirects */
  loadedUrl: string | null;

  /** ISO datetime string that indicates the time when the request has been processed. */
  dateHandled: string;
  numberOfRetries: number;
}

export type WithActorEntryMetadata<Obj> = Obj & { metadata: ActorEntryMetadata };

export const pushDataWithMetadata = async <
  Ctx extends CrawlingContext,
  T extends Record<any, any> = Record<any, any>
>(
  oneOrManyItems: T | T[],
  ctx: Ctx
) => {
  const items = Array.isArray(oneOrManyItems) ? oneOrManyItems : [oneOrManyItems];
  ctx.log.info(`Adding metadata to ${items.length} entries before pushing them to dataset`);

  const { actorId, actorRunId } = Actor.getEnv();
  const actorRunUrl =
    actorId != null && actorRunId != null
      ? `https://console.apify.com/actors/${actorId}/runs/${actorRunId}`
      : null;

  const itemsWithMetadata = items.map(
    (item): WithActorEntryMetadata<T> => ({
      ...item,
      metadata: {
        actorId,
        actorRunId,
        actorRunUrl,
        contextId: ctx.id,
        requestId: ctx.request.id ?? null,

        originalUrl: ctx.request.url ?? null,
        loadedUrl: ctx.request.loadedUrl ?? null,

        dateHandled: ctx.request.handledAt || new Date().toISOString(),
        numberOfRetries: ctx.request.retryCount,
      },
    })
  );

  ctx.log.info(`Pushing ${items.length} entries to dataset`);
  await Actor.pushData(itemsWithMetadata);
  ctx.log.info(`Done pushing ${items.length} entries to dataset`);

  return items;
};

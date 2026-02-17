/**
 * Dev context: AsyncLocalStorage for dev-only metadata (e.g. devDatasetIdPrefix).
 * Set in runDev before calling run(); consumed by createPushDataForContext.
 *
 * Keeps dev plumbing out of actor input.
 *
 * devOnReady: runs before user's onReady when in dev mode. Used to populate
 * the dev RequestQueue from actor.routes and patch the crawler, so scrapers
 * don't need to export routes.
 *
 * restore: called after run() completes to restore handlers when fetchOnly.
 */

import { AsyncLocalStorage } from 'node:async_hooks';

export interface DevContext {
  /** Prefix for dev datasets: `{devDatasetIdPrefix}-{routeLabel}` */
  devDatasetIdPrefix: string;
  /** Runs before user's onReady in dev mode. Has access to actor.routes. */
  devOnReady?: (actor: { routes: Record<string, any>; crawler: any }) => Promise<void>;
  /** Called after run() settles to restore stashed handlers (fetchOnly). */
  restore?: () => void;
}

export const devContextStore = new AsyncLocalStorage<DevContext>();

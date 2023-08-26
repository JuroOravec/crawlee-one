import * as Sentry from '@sentry/node';

import type { CrawleeOneIO } from '../integrations/types';
import { apifyIO } from '../integrations/apify';

/**
 * Sentry configuration common to all crawlers.
 *
 * By default, sentry is enabled only on the server.
 * In Apify, whis is when `process.env.APIFY_IS_AT_HOME` is true.
 */
export const setupSentry = async (
  sentryOptions?: Sentry.NodeOptions,
  options?: { io?: CrawleeOneIO }
) => {
  const { io = apifyIO } = options ?? {};

  // As default, enable sentry only on Apify server
  const enabled =
    sentryOptions?.enabled != null ? sentryOptions.enabled : await io.isTelemetryEnabled();

  if (!enabled) return;

  // We use this field for identification in UI, so it's required.
  if (!sentryOptions?.serverName) throw Error('Sentry setup is missing "serverName" property.'); // prettier-ignore

  Sentry.init({
    dsn: 'https://5b2e0562b4ec4ef6805a3fbbf4ff8acd@o470159.ingest.sentry.io/4505019830370304',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    ...sentryOptions,
  });
};

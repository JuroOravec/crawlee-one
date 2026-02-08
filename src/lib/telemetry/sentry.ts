import * as Sentry from '@sentry/node';

import type { CrawleeOneTelemetry } from './types.js';
import type { CrawleeOneCtx } from '../actor/types.js';

/**
 * Sentry configuration common to all crawlers.
 *
 * By default, sentry is enabled only on the server.
 * In Apify, whis is when `process.env.APIFY_IS_AT_HOME` is true.
 */
const setupSentry = async (sentryOptions?: Sentry.NodeOptions) => {
  // As default, enable sentry only on Apify server
  const enabled = sentryOptions?.enabled != null && sentryOptions.enabled;

  if (!enabled) return;

  // We use this field for identification in UI, so it's required.
  if (!sentryOptions?.serverName) throw Error('Sentry setup is missing "serverName" property.'); // prettier-ignore

  Sentry.init(sentryOptions);
};

export const createSentryTelemetry = <T extends CrawleeOneTelemetry<CrawleeOneCtx>>(
  sentryOptions?: Sentry.NodeOptions
) => {
  return {
    setup: async (actor) => {
      await setupSentry(sentryOptions);
    },
    onSendErrorToTelemetry: (error, report, options, ctx) => {
      Sentry.captureException(error, { extra: report as any });
    },
  } as T;
};

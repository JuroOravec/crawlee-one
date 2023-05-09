import * as Sentry from '@sentry/node';

/**
 * Sentry configuration common to all actors.
 *
 * By default, sentry is enabled only on Apify server
 * where `process.env.APIFY_IS_AT_HOME` is true
 */
export const setupSentry = (sentryOptions?: Sentry.NodeOptions) => {
  // As default, enable sentry only on Apify server
  const enabled =
    sentryOptions?.enabled != null ? sentryOptions.enabled : !!process.env.APIFY_IS_AT_HOME;

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

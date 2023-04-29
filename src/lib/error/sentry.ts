import * as Sentry from '@sentry/node';

export const setupSentry = ({ enabled }: { enabled: boolean }, options?: Sentry.NodeOptions) => {
  if (!enabled) return;

  // We use this field for identification in UI, so it's required.
  if (!options?.serverName) throw Error('Sentry setup is missing "serverName" property.');

  Sentry.init({
    dsn: 'https://5b2e0562b4ec4ef6805a3fbbf4ff8acd@o470159.ingest.sentry.io/4505019830370304',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    ...options,
  });
};

// Sentry instrumentation file (v8 ESM requirement)
// This file must be imported with --import flag before the app starts
import * as Sentry from "@sentry/node";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      Sentry.httpIntegration({ includePendingRequests: true }),
      Sentry.expressIntegration(),
    ],
    // Performance monitoring
    profilesSampleRate: 1.0,
  });
}

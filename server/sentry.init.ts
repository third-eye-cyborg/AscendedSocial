/**
 * Sentry initialization for Node.js
 * This file must be imported before the main application code
 */
import * as Sentry from "@sentry/node";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    integrations: [
      Sentry.httpIntegration({ includePendingRequests: true }),
      Sentry.expressIntegration(),
    ],
  });
}

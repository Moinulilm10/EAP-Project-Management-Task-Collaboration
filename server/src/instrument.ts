import * as Sentry from "@sentry/node";

if (process.env.NODE_ENV !== "test") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    includeLocalVariables: true,
    enableLogs: true,
  });
}

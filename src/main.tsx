import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./main/components/App";
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://5a5c41d59dc745c1a6e18c4fcd58b939@o1140389.ingest.sentry.io/6197530",
    integrations: [Sentry.browserTracingIntegration()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

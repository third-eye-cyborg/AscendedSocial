import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

try {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN || import.meta.env.SENTRY_DSN;
  if (sentryDsn) {
    import("@sentry/react").then((Sentry) => {
      Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE || 'development',
        integrations: [
          Sentry.browserTracingIntegration(),
        ],
        tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
      });
    }).catch(() => {
      console.warn('Sentry failed to load - error tracking disabled');
    });
  }
} catch (e) {
  console.warn('Sentry initialization skipped:', e);
}

const rootEl = document.getElementById("root");
if (rootEl) {
  try {
    createRoot(rootEl).render(<App />);
  } catch (e) {
    console.error("React failed to render:", e);
    rootEl.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f0a1a;color:#e2d5f0;font-family:sans-serif;padding:20px;text-align:center">
        <div>
          <h1 style="font-size:24px;margin-bottom:12px">Something went wrong</h1>
          <p style="opacity:0.7">Please try refreshing the page.</p>
          <button onclick="location.reload()" style="margin-top:16px;padding:10px 24px;background:#7c3aed;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px">Refresh</button>
        </div>
      </div>
    `;
  }
}

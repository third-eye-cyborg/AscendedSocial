import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 Ascended Social initializing...");

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
    console.log("📦 Mounting React application...");
    createRoot(rootEl).render(<App />);
    console.log("✅ React application mounted successfully");
  } catch (e) {
    console.error("❌ React failed to render:", e);
    const errorMsg = e instanceof Error ? e.message : String(e);
    const errorStack = e instanceof Error ? e.stack : '';
    rootEl.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f0a1a;color:#e2d5f0;font-family:sans-serif;padding:20px;text-align:center">
        <div style="max-width:600px">
          <h1 style="font-size:24px;margin-bottom:12px">❌ React Initialization Failed</h1>
          <div style="background:#1a1527;border:1px solid #7c3aed;border-radius:8px;padding:12px;margin-bottom:16px;text-align:left">
            <p style="font-size:12px;font-family:monospace;margin:0;margin-bottom:8px;opacity:0.8">Error:</p>
            <p style="font-size:14px;font-family:monospace;margin:0;margin-bottom:12px;color:#fbbf24;word-break:break-all">${errorMsg}</p>
            ${errorStack ? `<details style="margin-top:12px;opacity:0.6"><summary style="cursor:pointer;font-size:12px">Stack Trace</summary><pre style="font-family:monospace;font-size:11px;margin-top:8px;max-height:200px;overflow:auto;white-space:pre-wrap;word-break:break-word;line-height:1.4">${errorStack}</pre></details>` : ''}
          </div>
          <button onclick="location.reload()" style="margin-top:16px;padding:10px 24px;background:#7c3aed;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px">🔄 Refresh Page</button>
        </div>
      </div>
    `;
  }
} else {
  console.error("❌ Root element not found in HTML");
}

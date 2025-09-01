import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add loaded class to body for mobile CSS fallback
document.body.classList.add('loaded');

// Ensure mobile viewport is properly configured
if (window.innerWidth <= 768) {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes');
  }
}

// Add error handling for mobile environments
window.addEventListener('error', (event) => {
  console.error('Script loading error:', event.error);
  // Show basic fallback message if critical error occurs
  if (event.error && event.error.message && event.error.message.includes('Failed to fetch')) {
    const root = document.getElementById('root');
    if (root && !root.innerHTML) {
      root.innerHTML = `
        <div style="min-height: 100vh; background: linear-gradient(135deg, #1a1b3a 0%, #2d1b69 50%, #1a1b3a 100%); color: white; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; text-align: center;">
          <div style="width: 60px; height: 60px; border: 4px solid rgba(139, 92, 246, 0.3); border-top: 4px solid #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
          <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Ascended Social</h1>
          <p style="margin: 0 0 10px 0; font-size: 16px;">Loading your spiritual experience...</p>
          <p style="margin: 0; font-size: 14px; opacity: 0.7;">Please wait while we connect to the cosmic realm</p>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
    }
  }
});

// Ensure React app renders
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
} catch (error) {
  console.error('Failed to render React app:', error);
  // Fallback for critical rendering errors
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; background: linear-gradient(135deg, #1a1b3a 0%, #2d1b69 50%, #1a1b3a 100%); color: white; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; text-align: center;">
        <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700;">Ascended Social</h1>
        <div style="width: 60px; height: 60px; border: 4px solid rgba(139, 92, 246, 0.3); border-top: 4px solid #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
        <p style="margin: 0 0 10px 0; font-size: 18px;">Initializing spiritual platform...</p>
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">Connecting to higher consciousness</p>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;
  }
}

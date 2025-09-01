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

createRoot(document.getElementById("root")!).render(<App />);

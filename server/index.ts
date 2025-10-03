import * as Sentry from "@sentry/node";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import zeroTrustRoutes from './zeroTrustApi';
import complianceRoutes from './compliance-routes';
import mcpRoutes from './mcp-routes';
// Mobile auth routes handled by Replit Auth
import notionMcpRoutes from './notion-mcp-routes';
import autoSyncRoutes from './auto-sync-routes';
import builderRoutes from './builder-integration';

// Initialize Sentry for error tracking (v8 API - must be done before creating Express app)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Add auth callback route to serve frontend page
  app.get('/auth-callback', (req, res, next) => {
    // Let Vite handle serving the frontend page for auth callback
    if (app.get("env") === "development") {
      next(); // Let Vite handle it
    } else {
      // In production, serve the static frontend
      res.sendFile('index.html', { root: 'dist/client' });
    }
  });

  // Mobile auth routes handled by Replit Auth

  // Register other API routes BEFORE Vite setup to prevent catch-all route conflicts
  app.use('/api/zero-trust', zeroTrustRoutes);
  app.use('/api/compliance', complianceRoutes);
  app.use('/api/mcp', mcpRoutes);
  app.use('/api/notion-mcp', notionMcpRoutes);
  app.use('/api/auto-sync', autoSyncRoutes);
  app.use('/api/builder', builderRoutes);

  // Sentry error handler (must be after routes, before other error middleware)
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  // Force port 5000 since it's the only port that works in Replit
  const port = 5000;
  
  // Add error handling for port conflicts
  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Please free the port or use a different one.`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', error);
      process.exit(1);
    }
  });

  // Graceful shutdown handling
  const shutdown = () => {
    log('🔄 Received shutdown signal, closing server gracefully...');
    server.close(() => {
      log('✅ Server closed successfully');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
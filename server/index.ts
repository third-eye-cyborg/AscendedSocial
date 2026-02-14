import * as Sentry from "@sentry/node";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import zeroTrustRoutes from './zeroTrustApi';
import complianceRoutes from './compliance-routes';
import mcpRoutes from './mcp-routes';
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
  // Other ports may be firewalled. Default to 5000 if not specified.
  // This serves both the API and the client.
  const port = Number(process.env.PORT) || 5000;
  
  // Function to start server with port fallback
  const startServer = (tryPort: number, maxRetries: number = 5): Promise<void> => {
    return new Promise((resolve, reject) => {
      const attempt = (currentPort: number, retriesLeft: number) => {
        const listener = server.listen({
          port: currentPort,
          host: "0.0.0.0",
          reusePort: true,
        }, () => {
          log(`serving on port ${currentPort}`);
          
          // Show debug endpoints information
          const isDebugMode = process.env.NODE_ENV === 'development' || process.env.DEBUG_AUTH === 'true';
          if (isDebugMode) {
            console.log('\n' + '='.repeat(70));
            console.log('🔐 AUTHENTICATION DEBUG MODE ENABLED');
            console.log('='.repeat(70));
            console.log('\n📍 Debug Endpoints Available:');
            console.log(`   • Check auth status: http://localhost:${currentPort}/api/debug/auth`);
            console.log(`   • View session info: http://localhost:${currentPort}/api/debug/session`);
            console.log(`   • Auth flow guide:  http://localhost:${currentPort}/api/debug/auth-flow`);
            console.log(`   • Route info:       http://localhost:${currentPort}/api/debug/route-info`);
            console.log('\n📚 Full guide: See docs/AUTH_VERBOSE_DEBUGGING.md');
            console.log('\n💡 Troubleshooting Tips:');
            console.log('   1. Visit /api/debug/auth to check if you\'re logged in');
            console.log('   2. If not logged in, click the login button in the app');
            console.log('   3. Check /api/debug/session to verify session data');
            console.log('   4. Look for 401 responses with "reason" field for details');
            console.log('='.repeat(70) + '\n');
          }
          
          resolve();
        });

        listener.once('error', (error: any) => {
          if (error.code === 'EADDRINUSE' && retriesLeft > 0) {
            console.warn(`⚠️ Port ${currentPort} is in use, trying port ${currentPort + 1}...`);
            listener.close();
            // Try the next port
            attempt(currentPort + 1, retriesLeft - 1);
          } else if (error.code === 'EADDRINUSE') {
            console.error(`❌ Could not find an available port after ${maxRetries} attempts (tried ports ${tryPort}-${tryPort + maxRetries - 1})`);
            reject(error);
          } else {
            console.error('❌ Server error:', error);
            reject(error);
          }
        });
      };

      attempt(tryPort, maxRetries);
    });
  };

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

  try {
    await startServer(port);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
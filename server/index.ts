// Import Sentry initialization first - before any other imports
import "./sentry.init.ts";

import * as Sentry from "@sentry/node";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import zeroTrustRoutes from './zeroTrustApi';
import complianceRoutes from './compliance-routes';
import mcpRoutes from './mcp-routes';
// Mobile auth routes handled by Replit Auth
import builderRoutes from './builder-integration';

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

  // Serve on configurable port (default 5000 for Replit compatibility)
  // In development, use PORT env var; in production, default to 5000
  // This port serves both the API and the client frontend
  const port = parseInt(process.env.PORT || '5000', 10);

  // Auto-kill any process occupying the port before binding (uses /proc, no system commands needed)
  const killPortProcess = async (targetPort: number): Promise<void> => {
    const { readFileSync, readdirSync, readlinkSync } = await import('fs');
    const targetPortHex = targetPort.toString(16).toUpperCase().padStart(4, '0');
    
    try {
      // Read /proc/net/tcp to find connections on our port
      const tcpData = readFileSync('/proc/net/tcp', 'utf8');
      const listeningInodes = new Set<string>();
      
      for (const line of tcpData.split('\n').slice(1)) {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 10) continue;
        const [, portHex] = (parts[1] || '').split(':');
        const state = parts[3]; // 0A = LISTEN
        if (portHex === targetPortHex && state === '0A') {
          listeningInodes.add(parts[9]);
        }
      }

      if (listeningInodes.size === 0) return;

      // Map inodes to PIDs by scanning /proc/[pid]/fd/
      const procDirs = readdirSync('/proc').filter(f => /^\d+$/.test(f));
      for (const pidStr of procDirs) {
        const pid = parseInt(pidStr);
        if (pid === process.pid || pid <= 1) continue;
        try {
          const fds = readdirSync(`/proc/${pidStr}/fd`);
          for (const fd of fds) {
            try {
              const link = readlinkSync(`/proc/${pidStr}/fd/${fd}`);
              if (link.startsWith('socket:[')) {
                const inode = link.slice(8, -1);
                if (listeningInodes.has(inode)) {
                  log(`🔄 Killing previous process (PID ${pid}) on port ${targetPort}`);
                  try { process.kill(pid, 'SIGKILL'); } catch {}
                  listeningInodes.delete(inode);
                  if (listeningInodes.size === 0) break;
                }
              }
            } catch {}
          }
        } catch {}
        if (listeningInodes.size === 0) break;
      }
    } catch (e) {
      // /proc not available, try ss as fallback
      try {
        const { execSync } = await import('child_process');
        const result = execSync(`ss -tlnp 'sport = :${targetPort}' 2>/dev/null`, { encoding: 'utf8' });
        const match = result.match(/pid=(\d+)/);
        if (match) {
          const pid = parseInt(match[1]);
          if (pid !== process.pid) {
            log(`🔄 Killing previous process (PID ${pid}) on port ${targetPort}`);
            try { process.kill(pid, 'SIGKILL'); } catch {}
          }
        }
      } catch {}
    }
    
    // Wait for port to be released
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Try to kill existing port holder before first listen attempt (dev mode only)
  if (app.get("env") === "development") {
    await killPortProcess(port);
  }

  // Add error handling for port conflicts
  server.on('error', async (error: any) => {
    if (error.code === 'EADDRINUSE') {
      log(`⚠️ Port ${port} in use, attempting to reclaim...`);
      await killPortProcess(port);
      // Retry listen after killing
      try {
        server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
          log(`serving on port ${port} (reclaimed)`);
        });
      } catch {
        console.error(`❌ Could not reclaim port ${port}. Please restart manually.`);
        process.exit(1);
      }
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
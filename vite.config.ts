import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Disabled runtime error overlay - it was trying to use React before initialization
    // Use Vite's default error overlay instead via server.hmr.overlay
    // runtimeErrorOverlay(),
    // Temporarily disabled cartographer plugin due to "traverse is not a function" error
    // ...(process.env.NODE_ENV !== "production" &&
    // process.env.REPL_ID !== undefined
    //   ? [
    //       await import("@replit/vite-plugin-cartographer").then((m) =>
    //         m.cartographer(),
    //       ),
    //     ]
    //   : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false, // Disable overlay to prevent WebSocket errors from blocking the app
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/cypress/**',
        '**/migrations/**',
        '**/logs/**',
        '**/.config/**',
        '**/attached_assets/**',
        '**/scripts/**',
      ],
      usePolling: false,
    },
  },
});

import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import crypto from 'crypto';
import * as ipaddr from 'ipaddr.js';

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

// List of admin user IDs (Replit user IDs) who can access admin functions
const ADMIN_USER_IDS = [
  "25531750", // Add your Replit user ID here
  // Add more admin user IDs as needed
];

// Admin IP whitelist (optional - leave empty to allow from any IP)
const ADMIN_IP_WHITELIST: string[] = [
  // Add IP addresses or CIDR blocks that should have admin access
  // Example: '192.168.1.0/24', '10.0.0.1'
];

// Rate limiting state for admin endpoints
const adminRateLimits = new Map<string, { count: number; resetTime: number }>();
const ADMIN_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each admin to 100 requests per windowMs
};

// Admin session configuration with enhanced security settings
function getAdminSessionConfig() {
  const sessionTtl = 4 * 60 * 60 * 1000; // 4 hours for admin sessions (shorter than user sessions)
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "admin_sessions", // Separate table for admin sessions
  });
  
  return session({
    name: 'admin.sid', // Different session name for admins  
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'strict', // Stricter than user sessions
      path: '/api/admin' // Restrict cookie to admin routes only
    },
  });
}

// Admin security middleware
function adminSecurityMiddleware(req: any, res: any, next: any) {
  // Enhanced security headers for admin routes
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // HSTS header for production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
}

// Rate limiting middleware for admin routes
function adminRateLimit(req: any, res: any, next: any) {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  const clientLimit = adminRateLimits.get(clientId);
  
  if (!clientLimit || now > clientLimit.resetTime) {
    // Reset or initialize rate limit
    adminRateLimits.set(clientId, { count: 1, resetTime: now + ADMIN_RATE_LIMIT.windowMs });
    return next();
  }
  
  if (clientLimit.count >= ADMIN_RATE_LIMIT.max) {
    console.warn(`⚠️ Admin rate limit exceeded for IP: ${clientId}`);
    return res.status(429).json({ 
      message: 'Too many admin requests, please try again later.',
      retryAfter: Math.ceil((clientLimit.resetTime - now) / 1000)
    });
  }
  
  clientLimit.count++;
  return next();
}

// IP whitelist middleware with proper CIDR validation
async function adminIPWhitelist(req: any, res: any, next: any) {
  if (ADMIN_IP_WHITELIST.length === 0) {
    return next(); // No IP restrictions if whitelist is empty
  }
  
  const clientIP = req.ip;
  
  try {
    // Parse client IP using ipaddr.js for proper validation
    const parsedClientIP = ipaddr.process(clientIP);
    
    const isAllowed = ADMIN_IP_WHITELIST.some(allowedEntry => {
      try {
        if (allowedEntry.includes('/')) {
          // CIDR block matching using proper IP parsing
          const [network, prefixLength] = allowedEntry.split('/');
          const parsedNetwork = ipaddr.process(network);
          const prefix = parseInt(prefixLength, 10);
          
          // Ensure both IPs are the same type (IPv4 or IPv6)
          if (parsedClientIP.kind() !== parsedNetwork.kind()) {
            return false;
          }
          
          return parsedClientIP.match(parsedNetwork, prefix);
        } else {
          // Exact IP matching
          const parsedAllowedIP = ipaddr.process(allowedEntry);
          return parsedClientIP.toString() === parsedAllowedIP.toString();
        }
      } catch (error) {
        console.error(`❌ Invalid IP whitelist entry: ${allowedEntry}`, error);
        return false;
      }
    });
    
    if (!isAllowed) {
      console.warn(`🚫 Admin access denied for IP: ${clientIP} (parsed: ${parsedClientIP.toString()})`);
      await logAdminAction(req, 'ip_access_denied', { 
        clientIP: parsedClientIP.toString(),
        whitelist: ADMIN_IP_WHITELIST 
      });
      return res.status(403).json({ message: 'Access denied from this IP address' });
    }
    
    return next();
    
  } catch (error) {
    console.error(`❌ Failed to parse client IP: ${clientIP}`, error);
    await logAdminAction(req, 'ip_parsing_failed', { 
      clientIP, 
      error: error.message 
    });
    return res.status(403).json({ message: 'Invalid IP address format' });
  }
}

const AUDIT_ACTIONS = new Set([
  "user_banned",
  "user_unbanned",
  "user_suspended",
  "user_unsuspended",
  "user_warned",
  "user_role_changed",
  "post_removed",
  "post_restored",
  "comment_removed",
  "comment_restored",
  "report_reviewed",
  "community_banned",
  "community_created",
  "community_deleted",
  "other_action",
]);

function normalizeAuditAction(action: string) {
  return AUDIT_ACTIONS.has(action) ? action : "other_action";
}

// Audit logging for admin actions
async function logAdminAction(req: any, action: string, details?: any) {
  try {
    const user = req.user;
    if (!user) return;
    const normalizedAction = normalizeAuditAction(action);

    await storage.createAuditLog({
      action: normalizedAction as any,
      performedBy: user.id,
      reason: `Admin action: ${action}`,
      details: details ? JSON.stringify(details) : null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown',
    });
    
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

async function upsertAdminUser(claims: any) {
  // Only create admin users if they're in the allowed list
  if (!ADMIN_USER_IDS.includes(claims["sub"])) {
    throw new Error("User is not authorized for admin access");
  }

  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
  
  return await storage.getUser(claims["sub"]);
}

export async function setupAdminAuth(app: Express) {
  // Apply admin session middleware FIRST - separate from user sessions
  app.use('/api/admin', getAdminSessionConfig());
  app.use('/api/admin', passport.initialize());
  app.use('/api/admin', passport.session());
  
  // Apply security middleware stack to all admin routes
  app.use('/api/admin', adminSecurityMiddleware);
  app.use('/api/admin', adminRateLimit);
  app.use('/api/admin', adminIPWhitelist);
  
  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      const claims = tokens.claims();
      
      // Check if user is authorized for admin access
      if (!claims || !ADMIN_USER_IDS.includes(claims["sub"])) {
        console.warn(`❌ Unauthorized admin access attempt by user: ${claims?.["sub"]} (${claims?.["email"]})`);
        verified(new Error("User is not authorized for admin access"), null);
        return;
      }

      const dbUser = await upsertAdminUser(claims);
      const user = dbUser ? { 
        ...dbUser,
        claims,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: claims?.exp || Math.floor(Date.now() / 1000) + 3600,
        isAdmin: true
      } as any : null;
      
      if (user) {
        verified(null, user);
      } else {
        verified(new Error("Failed to create admin user"), null);
      }
    } catch (error) {
      console.error("Error in admin verify function:", error);
      verified(error, null);
    }
  };

  // Create separate Passport strategy for admin authentication
  const domains = process.env.REPLIT_DOMAINS!.split(",");
  
  // Add localhost for development
  const allDomains = [...domains, 'localhost'];
  
  for (const domain of allDomains) {
    const isLocalhost = domain === 'localhost';
    const protocol = isLocalhost ? 'http' : 'https';
    const port = isLocalhost ? ':5000' : '';
    
    const strategy = new Strategy(
      {
        name: `replit-admin:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `${protocol}://${domain}${port}/api/admin/callback`,
      },
      verify,
    );
    passport.use(strategy);
    
  }

  // Admin login endpoint
  app.get("/api/admin/login", (req, res, next) => {
    
    passport.authenticate(`replit-admin:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  // Admin callback endpoint
  app.get("/api/admin/callback", (req, res, next) => {
    passport.authenticate(`replit-admin:${req.hostname}`, (err: any, user: any, info: any) => {
      if (err) {
        console.error("Admin auth error:", err);
        return res.redirect("/api/admin/login?error=auth_failed");
      }
      if (!user) {
        console.error("No admin user returned from auth:", info);
        return res.redirect("/api/admin/login?error=unauthorized");
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Admin login error:", loginErr);
          return res.redirect("/api/admin/login?error=login_failed");
        }
        
        res.redirect("/admin/dashboard"); // Redirect to admin dashboard
      });
    })(req, res, next);
  });

  // Admin logout endpoint
  app.get("/api/admin/logout", (req, res) => {
    req.logout(() => {
      // Get the post-logout redirect URI from environment or construct it dynamically
      // Priority: LOGOUT_REDIRECT_URI env var > POST_LOGOUT_URI > dynamic construction
      let postLogoutUri = process.env.LOGOUT_REDIRECT_URI || process.env.POST_LOGOUT_URI;
      
      if (!postLogoutUri) {
        // If no explicit redirect is configured, use the current request's domain
        const hostname = req.get('host') || req.hostname;
        postLogoutUri = `${req.protocol}://${hostname}`;
      }
      
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: postLogoutUri,
        }).href
      );
    });
  });

  // Get current admin user endpoint
  app.get("/api/admin/user", isAdminAuthenticated, (req: any, res) => {
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      isAdmin: true
    });
  });
}

export const isAdminAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.isAdmin) {
    await logAdminAction(req, 'unauthorized_access_attempt', { path: req.path });
    return res.status(401).json({ message: "Admin authentication required" });
  }

  // Cross-auth prevention: Ensure this is actually an admin session
  if (!user.isAdmin) {
    console.warn(`⚠️ Non-admin session attempted to access admin endpoint: ${req.path}`);
    await logAdminAction(req, 'unauthorized_access_attempt', { path: req.path, reason: 'non-admin session' });
    return res.status(403).json({ message: "User sessions cannot access admin endpoints" });
  }

  // Check if user is still in admin list
  if (!ADMIN_USER_IDS.includes(user.id)) {
    console.warn(`⚠️ Admin access revoked for user: ${user.id} (${user.email})`);
    await logAdminAction(req, 'revoked_admin_access_attempt', { userId: user.id, email: user.email });
    return res.status(403).json({ message: "Admin access revoked" });
  }

  if (!user.expires_at) {
    await logAdminAction(req, 'invalid_session_attempt', { path: req.path });
    return res.status(401).json({ message: "Invalid admin session" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    // Log successful admin access for audit trail
    if (req.method !== 'GET' || req.path.includes('/dashboard') || req.path.includes('/analytics')) {
      await logAdminAction(req, 'admin_endpoint_access', { 
        method: req.method, 
        path: req.path,
        userAgent: req.get('User-Agent')
      });
    }
    
    return next();
  }

  // Token refresh logic for admin users
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    await logAdminAction(req, 'session_expired', { path: req.path });
    res.status(401).json({ message: "Admin session expired" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    
    user.claims = tokenResponse.claims();
    user.access_token = tokenResponse.access_token;
    user.refresh_token = tokenResponse.refresh_token;
    user.expires_at = user.claims?.exp;
    
    await logAdminAction(req, 'session_refreshed', { path: req.path });
    
    return next();
  } catch (error) {
    console.error('Admin token refresh failed:', error);
    await logAdminAction(req, 'session_refresh_failed', { path: req.path, error: error.message });
    res.status(401).json({ message: "Admin session expired" });
    return;
  }
};

// Export the audit logging function for use in routes
export { logAdminAction };
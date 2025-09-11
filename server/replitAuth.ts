import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { bypassAuthForTesting, isAuthenticatedWithBypass } from './auth-bypass';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

// Separate session stores for user vs admin authentication
export function getUserSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week for users
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions", // User sessions table
  });
  return session({
    name: 'user.sid', // Different session name for users
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

// Legacy function for backward compatibility
export function getSession() {
  return getUserSession();
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
  
  // Return the user from database
  return await storage.getUser(claims["sub"]);
}

// Generate mobile authentication token
function generateMobileAuthToken(user: any): string {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET required for JWT generation');
  }
  
  const payload = {
    userId: user.id,
    email: user.email,
    claims: user.claims,
    expires_at: user.expires_at,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  
  return jwt.sign(payload, process.env.SESSION_SECRET);
}

// User authentication middleware with security headers
function userSecurityHeaders(req: any, res: any, next: any) {
  // Security headers for user routes
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  
  // Apply security headers to all user auth routes
  app.use('/api/auth', userSecurityHeaders);
  app.use('/api/login', userSecurityHeaders);
  app.use('/api/callback', userSecurityHeaders);
  
  app.use(getUserSession());
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Add authentication bypass middleware for testing
  app.use(bypassAuthForTesting);

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      const claims = tokens.claims();
      const dbUser = await upsertUser(claims);
      const user = dbUser ? { ...dbUser } as any : null;
      if (user) {
        updateUserSession(user, tokens);
        verified(null, user);
      } else {
        verified(new Error("Failed to create user"), null);
      }
    } catch (error) {
      console.error("Error in verify function:", error);
      verified(error, null);
    }
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    const redirectUrl = req.query.redirectUrl as string;
    const mobileBounce = req.query.mobile_bounce;
    
    console.log('🔍 Main login endpoint called:', {
      redirectUrl,
      mobileBounce,
      mobileReferrer: (req.session as any).mobileReferrer,
      mobileCallbackUrl: (req.session as any).mobileCallbackUrl
    });
    
    // Store redirect URL in session for later use
    if (redirectUrl) {
      (req.session as any).redirectUrl = redirectUrl;
    }

    // Mark mobile bounce in session so OAuth callback can handle it
    if (mobileBounce && (req.session as any).mobileReferrer) {
      (req.session as any).isMobileBounce = true;
      console.log('📱 Mobile bounce detected - will redirect back to mobile after auth');
    }
    
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, (err: any, user: any, info: any) => {
      if (err) {
        console.error("Auth error:", err);
        return res.redirect("/api/login");
      }
      if (!user) {
        console.error("No user returned from auth:", info);
        return res.redirect("/api/login");
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          return res.redirect("/api/login");
        }
        console.log("Authentication successful");
        
        // Enhanced platform-specific redirect handling
        const redirectUrl = (req.session as any).redirectUrl;
        const authPlatform = (req.session as any).authPlatform;
        const authReferer = (req.session as any).authReferer || '';
        const userAgent = req.get('User-Agent') || '';
        
        console.log('🔄 OAuth callback processing:', {
          redirectUrl,
          redirectUrlType: typeof redirectUrl,
          authPlatform,
          authReferer: authReferer.substring(0, 50) + '...',
          userAgent: userAgent.substring(0, 50) + '...',
          mobileTargetDomain: (req.session as any).mobileTargetDomain,
          sessionRedirectUrl: (req.session as any).redirectUrl
        });
        
        // Generate JWT token for mobile platforms
        let finalRedirectUrl;
        
        // Check if this is a mobile bounce request
        const isMobileBounce = (req.session as any).isMobileBounce;
        const mobileCallbackUrl = (req.session as any).mobileCallbackUrl;
        const mobileReferrer = (req.session as any).mobileReferrer;

        if (isMobileBounce && mobileCallbackUrl) {
          // MOBILE BOUNCE: Generate secure JWT token for mobile app
          const mobileAuthToken = jwt.sign(
            {
              userId: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImageUrl: user.profileImageUrl,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + (10 * 60) // 10 minutes expiry
            },
            process.env.SESSION_SECRET!
          );
          
          finalRedirectUrl = `/auth-callback?mobile_bounce=true&mobile_referrer=${encodeURIComponent(mobileReferrer || '')}&mobile_callback=${encodeURIComponent(mobileCallbackUrl)}&auth_token=${mobileAuthToken}`;
          console.log(`📱 Mobile bounce redirect with secure token: ${finalRedirectUrl.substring(0, 100)}...`);
        } else {
          // Regular web app redirect
          finalRedirectUrl = '/auth-callback';
          console.log(`🏠 Regular web app redirect: ${finalRedirectUrl}`);
        }
        
        // Clear session auth data
        delete (req.session as any).authPlatform;
        delete (req.session as any).authReferer;
        delete (req.session as any).isMobileBounce;
        delete (req.session as any).mobileReferrer;
        delete (req.session as any).mobileCallbackUrl;
        delete (req.session as any).mobileTargetDomain;
        
        return res.redirect(finalRedirectUrl);
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // SECURITY GATE: Only check for test bypass in test environment
  if (process.env.NODE_ENV === 'test') {
    const isTestingMode = req.headers['x-testing-mode'] === 'true' ||
                         req.headers['x-test-auth-bypass'] === 'true' ||
                         req.headers['x-spiritual-tester'] === 'active' ||
                         req.headers['user-agent']?.includes('Playwright') ||
                         req.headers['user-agent']?.includes('Puppeteer');

    if (isTestingMode && req.user) {
      console.log('🧪 Authentication bypassed for testing in isAuthenticated middleware');
      return next();
    }
  }

  // Check for JWT Bearer token authentication (mobile apps)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
      
      // Get user data from database
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Set user in request for downstream middleware
      req.user = {
        id: decoded.userId,
        claims: { sub: decoded.userId },
        ...decoded
      };
      
      console.log('✅ JWT Bearer token authentication successful for user:', user.email);
      return next();
    } catch (error) {
      console.error('❌ JWT token verification failed:', error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  // Fall back to session-based authentication (main web app)
  const user = req.user as any;

  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Cross-auth prevention: Ensure this is not an admin session
  if (user.isAdmin) {
    console.warn(`⚠️ Admin session attempted to access user endpoint: ${req.path}`);
    return res.status(403).json({ message: "Admin sessions cannot access user endpoints" });
  }

  if (!user.expires_at) {
    return res.status(401).json({ message: "Invalid session" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    // Log user activity for security monitoring
    if (process.env.NODE_ENV === 'production') {
      console.log(`👤 User ${user.id} accessed ${req.method} ${req.path}`);
    }
    return next();
  }

  // Token refresh logic
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Session expired" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    
    updateUserSession(user, tokenResponse);
    
    return next();
  } catch (error) {
    console.error('Token refresh failed:', error);
    res.status(401).json({ message: "Session expired" });
    return;
  }
};

// Export the enhanced authentication middleware
export { isAuthenticatedWithBypass };

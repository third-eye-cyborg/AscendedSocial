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

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
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

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
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
    
    // Store redirect URL in session for later use
    if (redirectUrl) {
      (req.session as any).redirectUrl = redirectUrl;
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
          authPlatform,
          authReferer: authReferer.substring(0, 50) + '...',
          userAgent: userAgent.substring(0, 50) + '...'
        });
        
        // Generate JWT token for mobile platforms
        let finalRedirectUrl;
        
        if (redirectUrl && redirectUrl.startsWith('ascended://')) {
          // Mobile app deep link - create JWT token and redirect
          const token = generateMobileAuthToken(user);
          finalRedirectUrl = `${redirectUrl}?token=${token}&success=true`;
          console.log(`🔗 Redirecting to mobile app: ${finalRedirectUrl}`);
        } else if (redirectUrl && redirectUrl.includes('095b9124-ae0d-4cdf-a44b-bdc917e288fa')) {
          // React Native/Expo web app - create JWT token and redirect to auth callback
          const token = generateMobileAuthToken(user);
          finalRedirectUrl = `${redirectUrl}?token=${token}&success=true`;
          console.log(`🌐 Redirecting to React Native web app: ${finalRedirectUrl}`);
        } else if (redirectUrl && redirectUrl.includes('ascended.social')) {
          // Production web app - create JWT token and redirect
          const token = generateMobileAuthToken(user);
          finalRedirectUrl = `${redirectUrl}?token=${token}&success=true`;
          console.log(`🚀 Redirecting to production web app: ${finalRedirectUrl}`);
        } else if (authReferer.includes('095b9124-ae0d-4cdf-a44b-bdc917e288fa')) {
          // Fallback: Based on referer, redirect to React Native web app
          const token = generateMobileAuthToken(user);
          finalRedirectUrl = `https://095b9124-ae0d-4cdf-a44b-bdc917e288fa-00-1yfsp5ge10rpv.picard.replit.dev/auth/callback?token=${token}&success=true`;
          console.log(`🔄 Referer-based redirect to React Native web app: ${finalRedirectUrl}`);
        } else if (authReferer.includes('ascended.social')) {
          // Fallback: Based on referer, redirect to production web app
          const token = generateMobileAuthToken(user);
          finalRedirectUrl = `https://ascended.social/auth/callback?token=${token}&success=true`;
          console.log(`🔄 Referer-based redirect to production web app: ${finalRedirectUrl}`);
        } else {
          // Default web app redirect (this backend's frontend)
          finalRedirectUrl = redirectUrl && !redirectUrl.includes('://') ? redirectUrl : '/';
          console.log(`🏠 Default redirect to main web app: ${finalRedirectUrl}`);
        }
        
        // Clear session auth data
        delete (req.session as any).authPlatform;
        delete (req.session as any).authReferer;
        
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
  // Check for test bypass first
  const isTestingMode = process.env.NODE_ENV === 'test' || 
                       req.headers['x-testing-mode'] === 'true' ||
                       req.headers['x-test-auth-bypass'] === 'true' ||
                       req.headers['user-agent']?.includes('Playwright') ||
                       req.headers['user-agent']?.includes('Puppeteer');

  if (isTestingMode && req.user) {
    console.log('🧪 Authentication bypassed for testing in isAuthenticated middleware');
    return next();
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

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// Export the enhanced authentication middleware
export { isAuthenticatedWithBypass };

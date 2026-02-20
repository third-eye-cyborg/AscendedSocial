// Replit Auth integration - Using official Replit Auth blueprint
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { TurnstileService } from "./turnstileService";

const turnstileService = new TurnstileService();

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

export const getOidcConfig = memoize(
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
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  const isReplitPreview = process.env.REPL_SLUG !== undefined;
  const cookieSameSite: "lax" | "none" = isReplitPreview ? "none" : "lax";
  const cookieSecure = process.env.NODE_ENV === "production" || isReplitPreview;
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSameSite,
      maxAge: sessionTtl,
    },
  });
}

export function updateUserSession(
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
  return await storage.upsertUser({
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    // Note: For now using email-based lookup. Will add replitUserId field later
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      const claims = tokens.claims();
      const dbUser = await upsertUser(claims);
      
      // Create proper user session object with database user + tokens
      const user = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl,
      } as any;
      
      updateUserSession(user, tokens);
      console.log(`✅ Auth verify successful: userId=${dbUser.id}, email=${dbUser.email}, expires_at=${user.expires_at}`);
      verified(null, user);
    } catch (error) {
      console.error("Error in Replit Auth verify:", error);
      verified(error, null);
    }
  };

  const normalizePreviewHost = (host: string) => {
    const value = (host || "").trim();
    const previewPort = process.env.PORT || "3000";
    if (value && /\.spock\.replit\.dev$/i.test(value) && !value.includes(":")) {
      return `${value}:${previewPort}`;
    }
    return value;
  };

  for (const rawDomain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const domain = normalizePreviewHost(rawDomain);
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  const getPublicHost = (req: Express.Request) => {
    const originRaw = (req.headers["origin"] || "").toString().trim();
    const refererRaw = (req.headers["referer"] || "").toString().trim();
    const forwardedHostRaw = (req.headers["x-forwarded-host"] || "").toString().trim();
    const hostHeader = (req.get("host") || "").trim();
    const hostname = (req.hostname || "").trim();

    const getHostFromUrl = (value: string) => {
      if (!value) return "";
      try {
        return new URL(value).host;
      } catch {
        return "";
      }
    };

    // x-forwarded-host can be a comma-separated list; use the first entry
    const forwardedHost = forwardedHostRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0] || "";

    // Browser-originated login requests from preview pages usually include Origin/Referer
    // with the user-visible host:port. Prefer those first.
    const originHost = getHostFromUrl(originRaw);
    const refererHost = getHostFromUrl(refererRaw);

    let host = originHost || refererHost || forwardedHost || hostHeader || hostname;

    const previewPort = process.env.PORT || "3000";

    // Replit preview domains may require explicit :3000 publicly.
    // If proxy strips port, normalize it so callback URIs remain reachable.
    if (host && /\.spock\.replit\.dev$/i.test(host) && !host.includes(":")) {
      host = `${host}:${previewPort}`;
    }

    return host;
  };

  const getCallbackHost = (req: Express.Request) => {
    const forwardedHostRaw = (req.headers["x-forwarded-host"] || "").toString().trim();
    const hostHeader = (req.get("host") || "").trim();
    const hostname = (req.hostname || "").trim();

    const forwardedHost = forwardedHostRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0] || "";

    let host = forwardedHost || hostHeader || hostname;

    const previewPort = process.env.PORT || "3000";
    if (host && /\.spock\.replit\.dev$/i.test(host) && !host.includes(":")) {
      host = `${host}:${previewPort}`;
    }

    return host;
  };

  const getLoginHost = (req: Express.Request) => {
    const forwardedHostRaw = (req.headers["x-forwarded-host"] || "").toString().trim();
    const hostHeader = (req.get("host") || "").trim();
    const hostname = (req.hostname || "").trim();

    const forwardedHost = forwardedHostRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0] || "";

    let host = hostHeader || forwardedHost || hostname;

    const previewPort = process.env.PORT || "3000";
    if (host && /\.spock\.replit\.dev$/i.test(host) && !host.includes(":")) {
      host = `${host}:${previewPort}`;
    }

    return host;
  };

  const ensureStrategyForHost = (hostWithPort: string, protocol: string) => {
    const normalizedHost = normalizePreviewHost(hostWithPort);
    const strategyName = `replitauth:${normalizedHost}`;
    const existing = (passport as any)._strategy?.(strategyName);
    if (existing) return strategyName;

    const isLocalhost = normalizedHost.startsWith('localhost') || normalizedHost.startsWith('127.0.0.1');
    const callbackProtocol = isLocalhost ? 'http' : (protocol === 'https' ? 'https' : 'https');
    const callbackURL = `${callbackProtocol}://${normalizedHost}/api/callback`;
    const strategy = new Strategy(
      {
        name: strategyName,
        config,
        scope: "openid email profile",
        callbackURL,
      },
      verify,
    );
    passport.use(strategy);
    console.log(`✅ Auth strategy registered dynamically: ${strategyName} -> ${callbackURL}`);
    return strategyName;
  };

  // Add localhost strategy for development
  if (process.env.NODE_ENV === 'development') {
    const localhostStrategy = new Strategy(
      {
        name: `replitauth:localhost`,
        config,
        scope: "openid email profile",
        callbackURL: `http://localhost:5000/api/callback`,
      },
      verify,
    );
    passport.use(localhostStrategy);
  }

  passport.serializeUser((user: Express.User, cb) => {
    console.log(`📦 Serializing user session: id=${(user as any)?.id}`);
    cb(null, user);
  });
  passport.deserializeUser((user: Express.User, cb) => {
    const u = user as any;
    console.log(`📦 Deserializing user session: id=${u?.id}, expires_at=${u?.expires_at}`);
    cb(null, user);
  });

  app.get("/api/login", async (req, res, next) => {
    // Extract state parameter for mobile authentication
    const state = req.query.state as string;
    const turnstileToken = req.query.turnstile as string;
    
    // Check if this is a production domain that requires Turnstile
    const hostname = (getPublicHost(req) || '').split(':')[0];
    const isProductionDomain = hostname === 'ascended.social' || 
                                hostname === 'dev.ascended.social' || 
                                hostname === 'app.ascended.social';
    
    // Verify Turnstile token for bot protection on ALL production requests
    // No exceptions - this prevents any bypass attacks
    if (isProductionDomain) {
      if (!turnstileToken) {
        console.warn('⚠️ Login attempt on production domain without Turnstile token - redirecting to /login');
        return res.redirect('/login');
      }
      
      const clientIp = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
      const verification = await turnstileService.verifyToken(turnstileToken, clientIp);
      
      if (!verification.success) {
        console.warn('🚫 Login blocked - Turnstile verification failed:', verification.errorCodes);
        return res.redirect('/login?error=verification_failed');
      }
      
      console.log('✅ Login - Turnstile verification successful for production domain');
    } else {
      console.log('🧪 Login on development/testing domain - Turnstile bypassed');
    }
    
    const authOptions: any = {
      prompt: "login consent",
      scope: ["openid", "email", "profile"],
    };
    
    // Pass through state parameter if provided (for mobile authentication)
    if (state) {
      authOptions.state = state;
    }
    
    const requestedHost = (req.query.host || '').toString().trim();
    const isAllowedRequestedHost =
      /^localhost(:\d+)?$/i.test(requestedHost) ||
      /^127\.0\.0\.1(:\d+)?$/i.test(requestedHost) ||
      /^([a-z0-9-]+\.)*spock\.replit\.dev(:\d+)?$/i.test(requestedHost) ||
      /^ascended\.social(:\d+)?$/i.test(requestedHost) ||
      /^dev\.ascended\.social(:\d+)?$/i.test(requestedHost) ||
      /^app\.ascended\.social(:\d+)?$/i.test(requestedHost);

    const hostWithPort = isAllowedRequestedHost
      ? normalizePreviewHost(requestedHost)
      : (getLoginHost(req) || req.hostname);

    const strategyName = ensureStrategyForHost(hostWithPort, req.protocol);
    passport.authenticate(strategyName, authOptions)(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    const { code, error } = req.query as { code?: string; error?: string };
    console.log("🔄 Auth callback hit", {
      hasCode: !!code,
      error,
      host: req.get("host"),
      origin: req.headers["origin"],
      referer: req.headers["referer"],
      queryKeys: Object.keys(req.query || {}),
    });
    if (!code) {
      if (error) {
        console.warn(`⚠️ Auth callback error from provider: ${error}`);
        return res.redirect(`/login?error=${encodeURIComponent(error)}`);
      }
      console.warn("⚠️ Auth callback received without code");
      return res.redirect("/login?error=missing_code");
    }
    const hostWithPort = getCallbackHost(req) || req.hostname;
    const strategyName = ensureStrategyForHost(hostWithPort, req.protocol);
    
    passport.authenticate(strategyName, {
      failureRedirect: "/login",
    })(req, res, (err: any) => {
      if (err) {
        console.error('Authentication callback error:', err);
        return res.redirect('/login');
      }
      
      if (!req.user) {
        console.error('Authentication callback: no user after authenticate');
        return res.redirect('/login');
      }
      
      try {
        const user = req.user as any;
        const state = req.query.state as string;
        
        // Check if this is a mobile authentication request
        const isMobileAuth = state && state !== 'default';
        
        if (isMobileAuth) {
          const tokenPayload = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
          };
          
          const token = jwt.sign(tokenPayload, process.env.SESSION_SECRET!);
          const callbackUrl = `/auth-callback?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}`;
          
          // Save session before redirect
          req.session.save((saveErr) => {
            if (saveErr) console.error('Session save error:', saveErr);
            return res.redirect(callbackUrl);
          });
        } else {
          // Web authentication - save session explicitly before redirect
          req.session.save((saveErr) => {
            if (saveErr) console.error('Session save error:', saveErr);
            return res.redirect('/');
          });
        }
      } catch (error) {
        console.error('Error processing authentication callback:', error);
        return res.redirect('/login');
      }
    });
  });

  app.get("/api/logout", (req, res) => {
    // Prefer explicit host:port from Host header so local dev ports are preserved
    const hostWithPort = getPublicHost(req) || req.hostname;
    const endSessionHref = client.buildEndSessionUrl(config, {
      client_id: process.env.REPL_ID!,
      post_logout_redirect_uri: `${req.protocol}://${hostWithPort}`,
    }).href;

    // Ensure passport logout and session destruction so session cannot be reused
    try {
      req.logout(() => {
        if (req.session) {
          req.session.destroy((err) => {
            if (err) console.error('Session destroy error during logout:', err);
            return res.redirect(endSessionHref);
          });
        } else {
          return res.redirect(endSessionHref);
        }
      });
    } catch (err) {
      console.error('Error during logout:', err);
      return res.redirect(endSessionHref);
    }
  });

  // API-compatible logout endpoint (matches docs / mobile clients)
  app.post('/api/auth/logout', (req, res) => {
    // If client is using Bearer token (mobile), just acknowledge logout and let client delete token
    const authHeader = (req.headers.authorization || '').toString();
    if (authHeader.startsWith('Bearer ')) {
      console.log('🔓 API logout (bearer token)');
      return res.json({ message: 'Successfully logged out', success: true });
    }

    // Otherwise, handle session-based logout
    try {
      req.logout(() => {
        if (req.session) {
          req.session.destroy((err) => {
            if (err) console.error('Session destroy error during API logout:', err);
            return res.json({ message: 'Successfully logged out', success: true });
          });
        } else {
          return res.json({ message: 'Successfully logged out', success: true });
        }
      });
    } catch (err) {
      console.error('Error during API logout:', err);
      return res.status(500).json({ message: 'Logout failed', success: false });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    console.warn(`🔒 Auth check failed: isAuthenticated=${req.isAuthenticated()}, hasUser=${!!user}, expires_at=${user?.expires_at}, path=${req.path}`);
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
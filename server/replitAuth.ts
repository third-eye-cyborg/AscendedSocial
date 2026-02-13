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

function resolveReplitAuthDomain(hostname: string | undefined) {
  const normalizedHost = (hostname || "").toLowerCase().split(":")[0];
  const domains = process.env.REPLIT_DOMAINS!
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);

  if (process.env.NODE_ENV === "development" && !domains.includes("localhost")) {
    domains.push("localhost");
  }

  if (domains.includes(normalizedHost)) {
    return normalizedHost;
  }

  const subdomainMatch = domains.find((domain) => normalizedHost.endsWith(`.${domain}`));
  if (subdomainMatch) {
    return subdomainMatch;
  }

  return domains[0] || normalizedHost || "localhost";
}

function getReplitAuthStrategyName(hostname: string | undefined) {
  return `replitauth:${resolveReplitAuthDomain(hostname)}`;
}

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
      secure: 'auto',
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

function getHostStrategyKey(hostHeader: string | undefined, hostname: string | undefined) {
  const raw = (hostHeader || hostname || "").toLowerCase();
  return raw || "localhost";
}

function resolveCallbackProtocol(hostHeader: string | undefined, requestProtocol: string | undefined) {
  const host = (hostHeader || "").toLowerCase();
  if (host.includes("localhost") || host.startsWith("127.0.0.1")) {
    return "http";
  }
  return requestProtocol || "https";
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
      verified(null, user);
    } catch (error) {
      console.error("Error in Replit Auth verify:", error);
      verified(error, null);
    }
  };

  const ensureStrategyForRequest = (req: any) => {
    const hostHeader = req.get('host');
    const hostname = req.hostname;
    const strategyKey = getHostStrategyKey(hostHeader, hostname);
    const strategyName = `replitauth:${strategyKey}`;

    const existing = (passport as any)?._strategy?.(strategyName);
    if (existing) {
      return strategyName;
    }

    const protocol = resolveCallbackProtocol(hostHeader, req.protocol);
    const callbackHost = hostHeader || hostname;
    const callbackURL = `${protocol}://${callbackHost}/api/callback`;

    const dynamicStrategy = new Strategy(
      {
        name: strategyName,
        config,
        scope: "openid email profile offline_access",
        callbackURL,
      },
      verify,
    );

    passport.use(dynamicStrategy);
    return strategyName;
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

  // Add localhost strategy for development
  if (process.env.NODE_ENV === 'development') {
    const devPort = Number(process.env.PORT) || 5000;
    const localhostStrategy = new Strategy(
      {
        name: `replitauth:localhost`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `http://localhost:${devPort}/api/callback`,
      },
      verify,
    );
    passport.use(localhostStrategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", async (req, res, next) => {
    // Extract state parameter for mobile authentication
    const state = req.query.state as string;
    const turnstileToken = req.query.turnstile as string;
    
    // Check if this is a production domain that requires Turnstile
    const hostname = req.get('host') || '';
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
      
    } else {
    }
    
    const authOptions: any = {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    };

    // Ensure session cookie survives replit.dev iframe contexts
    const host = (req.get('host') || '').toLowerCase();
    const isReplitHosted = host.includes('.replit.dev') || host.includes('.replit.app') || host.includes('.repl.co');
    if (req.session?.cookie) {
      if (isReplitHosted || req.secure) {
        req.session.cookie.sameSite = 'none';
        req.session.cookie.secure = true;
      }
    }
    
    // Pass through state parameter if provided (for mobile authentication)
    if (state) {
      authOptions.state = state;
    }
    
    const strategyName = ensureStrategyForRequest(req);
    passport.authenticate(strategyName, authOptions)(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    const strategyName = ensureStrategyForRequest(req);
    passport.authenticate(strategyName, (err: any, user: any, info: any) => {
      if (err) {
        console.error('Authentication callback error:', err);
        return res.redirect('/api/login');
      }

      if (!user) {
        if (info) {
          console.error('Authentication callback failed:', info);
        }
        console.error('No user returned from authentication callback');
        return res.redirect('/api/login');
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login session error:', loginErr);
          return res.redirect('/api/login');
        }

        try {
          const state = req.query.state as string;
          
          // Check if this is a mobile authentication request
          const isMobileAuth = state && state !== 'default';
          
          if (isMobileAuth) {
            // Generate JWT token for mobile authentication
            const tokenPayload = {
              userId: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImageUrl: user.profileImageUrl,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
            };
            
            const token = jwt.sign(tokenPayload, process.env.SESSION_SECRET!);
            
            // Redirect to auth-callback with token and state
            const callbackUrl = `/auth-callback?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}`;
            return res.redirect(callbackUrl);
          }

          // Web authentication - redirect to home
          return res.redirect('/');
        } catch (error) {
          console.error('Error processing authentication callback:', error);
          return res.redirect('/api/login');
        }
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
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
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
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
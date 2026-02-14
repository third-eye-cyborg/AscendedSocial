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
    conString: (process.env.DATABASE_URL || '').replace(/sslmode=(require|prefer|verify-ca)\b/, 'sslmode=verify-full'),
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
  const DEBUG = process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV === 'development';
  const timestamp = new Date().toISOString();
  
  if (DEBUG) {
    console.log(`👤 [UPSERT USER ${timestamp}] Upserting user from claims:`);
    console.log(`   Email: ${claims["email"]}`);
    console.log(`   Name: ${claims["first_name"]} ${claims["last_name"]}`);
    console.log(`   Profile image: ${!!claims["profile_image_url"]}`);
  }
  
  try {
    const user = await storage.upsertUser({
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"],
      profileImageUrl: claims["profile_image_url"],
      // Note: For now using email-based lookup. Will add replitUserId field later
    });
    
    if (DEBUG) {
      console.log(`✅ [UPSERT USER ${timestamp}] User upserted successfully: ${user.id}`);
    }
    
    return user;
  } catch (error) {
    console.error(`❌ [UPSERT USER ${timestamp}] Error upserting user:`, error);
    throw error;
  }
}

export async function setupAuth(app: Express) {
  const DEBUG = process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV === 'development';
  
  if (DEBUG) {
    console.log('🔐 [AUTH SETUP] Initializing Replit Auth with DEBUG mode enabled');
  }
  
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const timestamp = new Date().toISOString();
    try {
      const claims = tokens.claims();
      
      if (DEBUG) {
        console.log(`\n🔐 [VERIFY CALLBACK ${timestamp}] Passport verify function called`);
        console.log(`   Email from token: ${claims["email"]}`);
        console.log(`   Token expiry: ${claims.exp}`);
      }
      
      const dbUser = await upsertUser(claims);
      
      // Create proper user session object with database user + tokens
      const user = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl,
      } as any;
      
      if (DEBUG) {
        console.log(`✅ [VERIFY CALLBACK ${timestamp}] User session created: ${user.id}`);
      }
      
      updateUserSession(user, tokens);
      verified(null, user);
    } catch (error) {
      console.error(`❌ [VERIFY CALLBACK ${timestamp}] Error in Replit Auth verify:`, error);
      if (DEBUG) {
        console.error('   Full error:', error);
      }
      verified(error, null);
    }
  };

  const ensureStrategyForRequest = (req: any) => {
    const forwardedHost = req.get('x-forwarded-host');
    const forwardedProto = req.get('x-forwarded-proto');
    const hostHeader = forwardedHost || req.get('host');
    const hostname = req.hostname;
    const strategyKey = getHostStrategyKey(hostHeader, hostname);
    const strategyName = `replitauth:${strategyKey}`;

    const existing = (passport as any)?._strategy?.(strategyName);
    if (existing) {
      return strategyName;
    }

    const protocol = resolveCallbackProtocol(hostHeader, forwardedProto || req.protocol);
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
    const DEBUG = process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV === 'development';
    const timestamp = new Date().toISOString();
    
    if (DEBUG) {
      console.log(`\n🔐 [AUTH CALLBACK ${timestamp}] Received OAuth callback`);
      console.log(`   Query params: code=${!!req.query.code}, state=${req.query.state}`);
      console.log(`   From: ${req.get('referer')}`);
      console.log(`   Host: ${req.get('host')}`);
      console.log(`   X-Forwarded-Host: ${req.get('x-forwarded-host')}`);
      console.log(`   X-Forwarded-Proto: ${req.get('x-forwarded-proto')}`);
    }
    
    const strategyName = ensureStrategyForRequest(req);
    if (DEBUG) {
      console.log(`   Using strategy: ${strategyName}`);
    }
    
    passport.authenticate(strategyName, (err: any, user: any, info: any) => {
      if (DEBUG) {
        console.log(`🔐 [AUTH CALLBACK ${timestamp}] Passport authenticate callback:`);
        console.log(`   Error: ${err ? err.message : 'none'}`);
        console.log(`   User returned: ${!!user}`);
        console.log(`   Info: ${JSON.stringify(info)}`);
      }
      
      if (err) {
        console.error(`❌ [AUTH CALLBACK ${timestamp}] Authentication error:`, err);
        if (DEBUG) {
          console.error(`   Full error:`, err);
          console.error(`   Callback URL expected: ${req.protocol}://${req.get('host')}/api/callback`);
          console.error(`   Make sure this URL is registered in your Replit OAuth app settings!`);
        }
        return res.redirect('/login?error=auth_error');
      }

      if (!user) {
        if (info) {
          console.error(`❌ [AUTH CALLBACK ${timestamp}] Authentication failed:`, info);
        }
        console.error(`❌ [AUTH CALLBACK ${timestamp}] No user returned from authentication`);
        if (DEBUG) {
          console.error(`   This might indicate a mismatch between the callback URL and registered URLs`);
          console.error(`   Current callback: ${req.protocol}://${req.get('host')}/api/callback`);
        }
        return res.redirect('/login?error=no_user');
      }

      if (DEBUG) {
        console.log(`✅ [AUTH CALLBACK ${timestamp}] User authenticated: ${user.id} (${user.email})`);
        console.log(`   Calling req.logIn...`);
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error(`❌ [AUTH CALLBACK ${timestamp}] Login session error:`, loginErr);
          return res.redirect('/login?error=session_error');
        }

        if (DEBUG) {
          console.log(`✅ [AUTH CALLBACK ${timestamp}] Session created, user logged in`);
        }

        try {
          const state = req.query.state as string;
          
          // Check if this is a mobile authentication request
          const isMobileAuth = state && state !== 'default';
          
          if (DEBUG) {
            console.log(`   Mobile auth: ${isMobileAuth}, state: ${state}`);
          }
          
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
            
            if (DEBUG) {
              console.log(`📱 [AUTH CALLBACK ${timestamp}] Generated mobile token, redirecting to /auth-callback`);
            }
            
            // Redirect to auth-callback with token and state
            const callbackUrl = `/auth-callback?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}`;
            return res.redirect(callbackUrl);
          }

          // Web authentication - redirect to home
          if (DEBUG) {
            console.log(`🏠 [AUTH CALLBACK ${timestamp}] Web auth complete, redirecting to /`);
          }
          return res.redirect('/');
        } catch (error) {
          console.error(`❌ [AUTH CALLBACK ${timestamp}] Error processing authentication callback:`, error);
          return res.redirect('/login?error=processing_error');
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
  const DEBUG = process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV === 'development';
  const clientIP = req.ip;
  const userAgent = req.get('User-Agent')?.substring(0, 80) || 'unknown';
  const timestamp = new Date().toISOString();
  
  if (DEBUG) {
    console.log(`\n🔐 [AUTH DEBUG ${timestamp}] Checking authentication for ${req.path}`);
    console.log(`   Client IP: ${clientIP}`);
    console.log(`   User Agent: ${userAgent}`);
    console.log(`   req.isAuthenticated(): ${req.isAuthenticated ? req.isAuthenticated() : 'function not available'}`);
    console.log(`   req.user exists: ${!!user}`);
    if (user) {
      console.log(`   req.user.id: ${user.id}`);
      console.log(`   req.user.email: ${user.email}`);
      console.log(`   req.user.expires_at: ${user.expires_at}`);
      console.log(`   req.user has access_token: ${!!user.access_token}`);
      console.log(`   req.user has refresh_token: ${!!user.refresh_token}`);
      console.log(`   req.user has claims: ${!!user.claims}`);
    }
  }

  if (!req.isAuthenticated() || !user?.expires_at) {
    if (DEBUG) {
      console.log(`❌ [AUTH DEBUG ${timestamp}] Authentication check failed:`);
      console.log(`   - req.isAuthenticated(): ${req.isAuthenticated ? req.isAuthenticated() : false}`);
      console.log(`   - user object: ${user ? 'exists' : 'missing'}`);
      console.log(`   - expires_at: ${user?.expires_at || 'missing'}`);
      console.log(`   - Session ID: ${(req.session as any)?.id || 'none'}`);
      console.log(`   - Has session passport: ${!!(req.session as any)?.passport}`);
      console.log(`   - Cookie header: ${req.get('cookie') ? 'present' : 'none'}`);
    }
    
    // Provide more detailed error messages
    let errorReason = 'Not logged in';
    if (req.isAuthenticated && req.isAuthenticated() && !user?.expires_at) {
      errorReason = 'Token expiration missing';
    } else if (!req.isAuthenticated || !req.isAuthenticated()) {
      errorReason = 'No active session';
    }
    
    return res.status(401).json({ 
      message: "Unauthorized",
      reason: errorReason,
      nextAction: "Please visit /api/login to authenticate",
      debug: DEBUG ? {
        isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
        hasUser: !!user,
        hasExpiration: !!user?.expires_at,
        sessionExists: !!req.session,
        cookiePresent: !!req.get('cookie')
      } : undefined
    });
  }

  const now = Math.floor(Date.now() / 1000);
  if (DEBUG) {
    const timeUntilExpiry = user.expires_at - now;
    console.log(`🕐 [AUTH DEBUG ${timestamp}] Token expiry check:`);
    console.log(`   - Current time: ${now}`);
    console.log(`   - Expires at: ${user.expires_at}`);
    console.log(`   - Seconds until expiry: ${timeUntilExpiry}`);
  }
  
  if (now <= user.expires_at) {
    if (DEBUG) {
      console.log(`✅ [AUTH DEBUG ${timestamp}] Token is valid, allowing request`);
    }
    return next();
  }

  // Token is expired, try to refresh
  if (DEBUG) {
    console.log(`⏳ [AUTH DEBUG ${timestamp}] Token expired, attempting refresh...`);
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    if (DEBUG) {
      console.log(`❌ [AUTH DEBUG ${timestamp}] No refresh token available`);
      console.log(`   - Token cannot be refreshed automatically`);
      console.log(`   - User must log in again`);
    }
    return res.status(401).json({ 
      message: "Unauthorized",
      reason: 'Token expired and cannot be refreshed',
      nextAction: "Please visit /api/login to authenticate again",
      debug: DEBUG ? { reason: 'No refresh token available' } : undefined
    });
  }

  try {
    if (DEBUG) {
      console.log(`🔄 [AUTH DEBUG ${timestamp}] Calling OIDC token refresh endpoint...`);
    }
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    
    if (DEBUG) {
      console.log(`✅ [AUTH DEBUG ${timestamp}] Token refresh successful`);
      console.log(`   - New expiry: ${tokenResponse.claims().exp}`);
    }
    
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error: any) {
    if (DEBUG) {
      console.log(`❌ [AUTH DEBUG ${timestamp}] Token refresh failed:`);
      console.log(`   - Error type: ${error.name}`);
      console.log(`   - Error message: ${error.message}`);
      console.log(`   - Error code: ${error.code}`);
      console.log(`   - Full error:`, error);
    }
    return res.status(401).json({ 
      message: "Unauthorized",
      reason: 'Token refresh failed',
      nextAction: "Please visit /api/login to authenticate again",
      debug: DEBUG ? { 
        reason: 'Token refresh failed',
        error: error.message,
        errorType: error.name,
        errorCode: error.code
      } : undefined
    });
  }
};
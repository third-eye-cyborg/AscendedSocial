// Replit Auth integration - Using official Replit Auth blueprint
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import memoize from "memoizee";
import crypto from "crypto";
import connectPg from "connect-pg-simple";
import memorystore from "memorystore";
import { storage } from "./storage";
import { TurnstileService } from "./turnstileService";

const turnstileService = new TurnstileService();

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

export const getOidcConfig = memoize(
  async () => {
    const issuerUrl = process.env.ISSUER_URL ?? "https://replit.com/oidc";
    const replId = process.env.REPL_ID;
    
    if (!replId) {
      throw new Error('REPL_ID environment variable is not set');
    }
    
    console.log(`🔍 [OIDC DISCOVERY] Discovering OIDC config from: ${issuerUrl} with REPL_ID: ${replId.substring(0, 20)}...`);
    
    try {
      const config = await client.discovery(
        new URL(issuerUrl),
        replId
      );
      
      console.log(`✅ [OIDC DISCOVERY] Config received, type: ${typeof config}, keys: ${Object.keys(config || {}).slice(0, 5).join(', ')}`);
      return config;
    } catch (error) {
      console.error('❌ [OIDC DISCOVERY] Failed to discover OIDC config:', error);
      throw error;
    }
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
  const useMemoryStore = process.env.NODE_ENV === 'development' && process.env.USE_DB_SESSIONS !== 'true';
  
  const sessionStore = (() => {
    if (useMemoryStore) {
      const MemoryStore = memorystore(session);
      console.log('⚠️ Using memory-based session store (development mode)');
      return new MemoryStore({
        checkPeriod: sessionTtl,
      });
    }

    console.log('✅ Using PostgreSQL session store');
    const pgStore = connectPg(session);
    return new pgStore({
      conString: (process.env.DATABASE_URL || '').replace(/sslmode=(require|prefer|verify-ca)\b/, 'sslmode=verify-full'),
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  })();
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,              // Don't save session if unmodified (passport best practice)
    saveUninitialized: false,   // Don't create session until something stored (passport best practice)
    rolling: true,              // Reset expiration on every request
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
  const normalized = raw.split(":")[0];
  return normalized || "localhost";
}

function resolveCallbackProtocol(hostHeader: string | undefined, requestProtocol: string | undefined) {
  const host = (hostHeader || "").toLowerCase();
  if (host.includes("localhost") || host.startsWith("127.0.0.1")) {
    return "http";
  }
  return requestProtocol || "https";
}

function isReplitHostedDomain(hostname: string | undefined) {
  const host = (hostname || "").toLowerCase();
  return host.includes('.replit.dev') || host.includes('.replit.app') || host.includes('.repl.co');
}

function createSessionToken(user: any) {
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };

  return jwt.sign(tokenPayload, process.env.SESSION_SECRET!);
}

function getBearerUser(req: any) {
  const header = req.get('authorization') || '';
  if (!header.toLowerCase().startsWith('bearer ')) return null;

  const token = header.slice(7).trim();
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.SESSION_SECRET!) as any;
    return {
      id: payload.userId || payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      profileImageUrl: payload.profileImageUrl,
      expires_at: payload.exp,
    };
  } catch {
    return null;
  }
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
    if (process.env.REPL_ID) {
      console.log(`   REPL_ID: ${process.env.REPL_ID.substring(0, 20)}...`);
    }
  }
  
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Ensure cookies work inside Replit iframe/browser contexts
  app.use((req, _res, next) => {
    const isReplitHosted = isReplitHostedDomain(req.get('host'));

    if (isReplitHosted && req.session?.cookie) {
      req.session.cookie.sameSite = 'none';
      req.session.cookie.secure = true;
    }

    next();
  });

  let config;
  try {
    config = await getOidcConfig();
    if (!config) {
      throw new Error('OIDC config is null or undefined');
    }
    if (DEBUG) {
      console.log('✅ [AUTH SETUP] OIDC config loaded successfully');
    }
  } catch (error) {
    console.error('❌ [AUTH SETUP] Failed to load OIDC config:', error);
    console.error('   This is CRITICAL - authentication cannot work without OIDC config');
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('   Error details:', errorMsg);
    if (DEBUG) {
      console.error('   Full error object:', error);
    }
    throw error;
  }

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

  if (DEBUG) {
    console.log(`\n🔐 [AUTH SETUP] Registering strategies for domains:`);
    const domains = process.env.REPLIT_DOMAINS!.split(',').map(d => d.trim());
    console.log(`   Total domains: ${domains.length}`);
    domains.forEach(d => console.log(`     - ${d}`));
  }

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const trimmedDomain = domain.trim();
    const strategyName = `replitauth:${trimmedDomain}`;
    try {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${trimmedDomain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
      if (DEBUG) {
        console.log(`   ✅ Registered strategy: ${strategyName}`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to register strategy ${strategyName}:`, (error as any).message || error);
    }
  }

  // Add localhost strategy for development
  if (process.env.NODE_ENV === 'development') {
    const devPort = Number(process.env.PORT) || 5000;
    const localhostStrategyName = `replitauth:localhost`;
    try {
      const localhostStrategy = new Strategy(
        {
          name: localhostStrategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `http://localhost:${devPort}/api/callback`,
        },
        verify,
      );
      passport.use(localhostStrategy);
      if (DEBUG) {
        console.log(`   ✅ Registered strategy: ${localhostStrategyName}`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to register localhost strategy:`, error);
    }
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", async (req, res, next) => {
    // Extract state parameter for mobile authentication
    const rawState = req.query.state as string | undefined;
    const providedState = typeof rawState === 'string' && rawState.trim().length > 0 ? rawState : undefined;
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
    const isReplitHosted = isReplitHostedDomain(req.get('host'));
    if (req.session?.cookie) {
      if (isReplitHosted || req.secure) {
        req.session.cookie.sameSite = 'none';
        req.session.cookie.secure = true;
      }
    }

    // Force session creation before redirecting to Replit Auth
    if (req.session && !req.session.replitAuthInit) {
      req.session.replitAuthInit = true;
      await new Promise<void>((resolve, reject) => {
        req.session!.save((err) => (err ? reject(err) : resolve()));
      }).catch((error) => {
        if (DEBUG) {
          console.warn('⚠️ Failed to persist session before auth redirect:', error);
        }
      });
    }
    
    // Always set an explicit state (required for reliable verification in embedded browsers)
    const authState = providedState || `state_${crypto.randomUUID()}`;
    authOptions.state = authState;
    if (req.session) {
      (req.session as any).replitAuthState = authState;
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
          console.log(`✅ [AUTH CALLBACK ${timestamp}] req.logIn() completed successfully`);
          console.log(`   User ID: ${(user as any)?.id || (user as any)?.sub}`);
          console.log(`   About to call req.session.save()...`);
        }

        // CRITICAL: Explicitly save session after logIn() with saveUninitialized: false
        // This ensures passport user data is persisted to the session store
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error(`❌ [AUTH CALLBACK ${timestamp}] Failed to save session:`, saveErr);
            return res.redirect('/login?error=session_save_error');
          }

          if (DEBUG) {
            console.log(`✅ [AUTH CALLBACK ${timestamp}] Session saved successfully`);
            console.log(`   Session ID: ${(req.session as any).id}`);
            console.log(`   Has passport data: ${!!(req.session as any).passport}`);
            if ((req.session as any).passport) {
              console.log(`   Passport user: ${JSON.stringify((req.session as any).passport.user)}`);
            }
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
              const token = createSessionToken(user);
              
              if (DEBUG) {
                console.log(`📱 [AUTH CALLBACK ${timestamp}] Generated mobile token, redirecting to /auth-callback`);
              }
              
              // Redirect to auth-callback with token and state
              const callbackUrl = `/auth-callback?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}`;
              return res.redirect(callbackUrl);
            }

            // Web authentication - if Replit hosted, use token fallback for iframe sessions
            if (isReplitHosted) {
              const token = createSessionToken(user);
              if (DEBUG) {
                console.log(`🌐 [AUTH CALLBACK ${timestamp}] Replit hosted web auth, redirecting with token`);
              }
              return res.redirect(`/auth-callback?token=${encodeURIComponent(token)}&state=default`);
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
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      // Determine redirect URI based on current domain
      // For localhost/dev, always redirect to current domain
      // For production, use environment variable if set
      const hostname = req.get('host') || req.hostname;
      let postLogoutUri: string;
      
      // If running on localhost or dev domain, redirect to current domain
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('replit.dev')) {
        postLogoutUri = `${req.protocol}://${hostname}`;
      } else {
        // For production domains, check environment variables
        postLogoutUri = process.env.LOGOUT_REDIRECT_URI || process.env.POST_LOGOUT_URI || `${req.protocol}://${hostname}`;
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
  const bearerUser = getBearerUser(req);
  if (bearerUser) {
    req.user = bearerUser;
    return next();
  }

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
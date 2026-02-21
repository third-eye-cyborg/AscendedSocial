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
    let h = (host || "").trim();
    const isLocalhost = h.startsWith('localhost') || h.startsWith('127.0.0.1');
    if (!isLocalhost) {
      // Replit's proxy serves on standard HTTPS port externally;
      // strip internal dev ports (e.g. :3000) so the OIDC callback URL matches.
      h = h.replace(/:\d+$/, "");
    }
    return h;
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

    return host;
  };

  const getCallbackHost = (req: Express.Request) => {
    // Use same resolution order as getLoginHost for consistency
    // This ensures the same strategy is used for both login and callback
    const forwardedHostRaw = (req.headers["x-forwarded-host"] || "").toString().trim();
    const hostHeader = (req.get("host") || "").trim();
    const hostname = (req.hostname || "").trim();

    const forwardedHost = forwardedHostRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0] || "";

    let host = forwardedHost || hostHeader || hostname;
    return normalizePreviewHost(host);
  };

  const getLoginHost = (req: Express.Request) => {
    const forwardedHostRaw = (req.headers["x-forwarded-host"] || "").toString().trim();
    const hostHeader = (req.get("host") || "").trim();
    const hostname = (req.hostname || "").trim();

    const forwardedHost = forwardedHostRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0] || "";

    let host = forwardedHost || hostHeader || hostname;
    return normalizePreviewHost(host);
  };

  const ensureStrategyForHost = (hostWithPort: string, protocol: string, req?: any) => {
    const normalizedHost = normalizePreviewHost(hostWithPort);
    const strategyName = `replitauth:${normalizedHost}`;
    const existing = (passport as any)._strategy?.(strategyName);
    if (existing) return strategyName;

    const isLocalhost = normalizedHost.startsWith('localhost') || normalizedHost.startsWith('127.0.0.1');
    
    // For non-localhost (Replit preview), always use HTTPS
    // For localhost, use HTTP
    let callbackProtocol = isLocalhost ? 'http' : 'https';
    
    // Also respect x-forwarded-proto if available (for proxy scenarios)
    if (req && req.headers['x-forwarded-proto']) {
      callbackProtocol = req.headers['x-forwarded-proto'];
    }
    
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
    console.log(`✅ Auth strategy registered dynamically: ${strategyName} -> ${callbackURL} (protocol: ${callbackProtocol})`);
    return strategyName;
  };

  // Add localhost strategy for development
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '5000';
    const localhostStrategy = new Strategy(
      {
        name: `replitauth:localhost`,
        config,
        scope: "openid email profile",
        callbackURL: `http://localhost:${port}/api/callback`,
      },
      verify,
    );
    passport.use(localhostStrategy);
    console.log(`✅ Auth strategy registered for localhost: http://localhost:${port}/api/callback`);
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
    console.log("🔐🔐🔐 LOGIN ROUTE HIT - Raw request details", {
      url: req.url,
      query: req.query,
      headers: {
        host: req.get("host"),
        forwardedHost: req.headers["x-forwarded-host"],
        origin: req.headers["origin"],
        referer: req.headers["referer"],
      },
      sessionID: req.sessionID,
    });
    
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

    // Persist the host used for the authorization request so the callback can
    // reuse the exact same host/port and strategy configuration.
    (req.session as any).oidcHost = hostWithPort;

    const strategyName = ensureStrategyForHost(hostWithPort, req.protocol, req);
    console.log(`🔑 Login using strategy: ${strategyName}, host: ${hostWithPort}, requestedHost: ${requestedHost}`);
    
    // Passport's Strategy.redirect() uses res.end() directly (NOT res.redirect()).
    // Express-session's res.end() hook handles async session save before sending response.
    // We intercept res.end() to verify PKCE data was stored by the Strategy.
    const issuerHost = (() => {
      try { return new URL(config.serverMetadata().issuer).host; } catch { return 'unknown'; }
    })();
    
    const expressSessionEnd = res.end;
    let endIntercepted = false;
    (res as any).end = function loginEndIntercept(this: any, ...args: any[]) {
      if (endIntercepted) return expressSessionEnd.apply(this, args);
      endIntercepted = true;
      // Restore immediately so express-session's end handler runs normally
      res.end = expressSessionEnd;
      
      // Log PKCE state - the Strategy should have stored it in session by now
      const pkceData = (req.session as any)?.[issuerHost];
      const hasPKCE = !!pkceData?.code_verifier;
      const location = (res.getHeader('Location') || '') as string;
      
      if (res.statusCode === 302 && location.includes('replit.com')) {
        console.log(`🔐 Login → OIDC redirect. SessionID: ${req.sessionID}, PKCE stored: ${hasPKCE}, issuerKey: ${issuerHost}`);
        if (!hasPKCE) {
          console.error(`❌ CRITICAL: No PKCE code_verifier in session! Session keys: [${Object.keys(req.session || {}).join(', ')}]`);
        }
      }
      
      // Pass through to express-session's res.end handler, which will:
      // 1. Detect session modification (PKCE data added)
      // 2. Save session to PostgreSQL
      // 3. Send the response
      return expressSessionEnd.apply(this, args);
    };
    
    passport.authenticate(strategyName, authOptions)(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    console.log("🔄🔄🔄 CALLBACK ROUTE HIT - Raw request details", {
      url: req.url,
      originalUrl: req.originalUrl,
      method: req.method,
      headers: {
        host: req.get("host"),
        forwardedHost: req.headers["x-forwarded-host"],
        forwardedProto: req.headers["x-forwarded-proto"],
        origin: req.headers["origin"],
        referer: req.headers["referer"],
      },
      query: req.query,
      cookies: Object.keys(req.cookies || {}),
      session: !!req.session,
      sessionID: req.sessionID,
    });
    
    const { code, error } = req.query as { code?: string; error?: string };
    
    // Debug: inspect session state for PKCE data
    const issuerHost = (() => {
      try {
        return new URL(config.serverMetadata().issuer).host;
      } catch { return 'unknown'; }
    })();
    const sessionPKCE = (req.session as any)?.[issuerHost];
    
    console.log("🔄 Auth callback hit", {
      hasCode: !!code,
      error,
      host: req.get("host"),
      forwardedHost: req.headers["x-forwarded-host"],
      origin: req.headers["origin"],
      referer: req.headers["referer"],
      protocol: req.protocol,
      queryKeys: Object.keys(req.query || {}),
      sessionExists: !!req.session,
      sessionID: req.sessionID,
      hasPKCEState: !!sessionPKCE?.code_verifier,
      issuerSessionKey: issuerHost,
    });
    
    if (!code) {
      if (error) {
        console.warn(`⚠️ Auth callback error from provider: ${error}`);
        return res.redirect(`/login?error=${encodeURIComponent(error)}`);
      }
      console.warn("⚠️ Auth callback received without code");
      return res.redirect("/login?error=missing_code");
    }
    
    // Use same host resolution as login to ensure strategy consistency
    const sessionLoginHost = (req.session as any)?.oidcHost as string | undefined;
    const hostWithPort = sessionLoginHost || getCallbackHost(req) || req.hostname;
    const strategyName = ensureStrategyForHost(hostWithPort, req.protocol, req);
    console.log(`🔑 Auth callback using strategy: ${strategyName}, host: ${hostWithPort}, sessionHost: ${sessionLoginHost || 'none'}`);
    
    // Intercept both res.redirect AND res.end to prevent redirect loops back to IdP
    // Passport's strategy.redirect() uses res.end() directly, NOT res.redirect()
    const originalRedirect = res.redirect.bind(res);
    const originalCallbackEnd = res.end;
    let loopDetected = false;
    
    // Intercept res.end() to catch passport's strategy.redirect() which bypasses res.redirect()
    (res as any).end = function callbackEndIntercept(this: any, ...args: any[]) {
      const location = (res.getHeader('Location') || '') as string;
      if (res.statusCode === 302 && 
          (location.includes('replit.com/oidc') || (location.includes('replit.com') && location.includes('authorize')))) {
        loopDetected = true;
        console.error('🔄❌ REDIRECT LOOP DETECTED via res.end(): Strategy tried to redirect to IdP from callback.');
        console.error('🔄❌ Session keys:', Object.keys(req.session || {}));
        console.error('🔄❌ PKCE state for issuer:', sessionPKCE);
        // Override the redirect - send to login with error instead
        res.removeHeader('Location');
        res.end = originalCallbackEnd;
        return originalRedirect('/login?error=auth_state_lost');
      }
      res.end = originalCallbackEnd;
      return originalCallbackEnd.apply(this, args);
    };
    
    // Also intercept res.redirect for our own callback code  
    (res as any).redirect = function interceptedRedirect(statusOrUrl: any, url?: string) {
      const redirectUrl = typeof statusOrUrl === 'string' ? statusOrUrl : url || '';
      if (redirectUrl.includes('/oidc') || redirectUrl.includes('replit.com/oidc') || 
          (redirectUrl.startsWith('https://replit.com') && redirectUrl.includes('authorize'))) {
        loopDetected = true;
        console.error('🔄❌ REDIRECT LOOP DETECTED via res.redirect(): Trying to redirect to IdP from callback.');
        return originalRedirect('/login?error=auth_state_lost');
      }
      return typeof statusOrUrl === 'number' 
        ? originalRedirect(statusOrUrl, url!) 
        : originalRedirect(statusOrUrl);
    };
    
    passport.authenticate(strategyName, (err: any, user: any, info: any) => {
      // Restore original methods
      res.redirect = originalRedirect;
      res.end = originalCallbackEnd;
      
      if (err) {
        console.error('❌ Authentication callback error:', err?.message || err);
        console.error('❌ Error details:', {
          name: err?.name,
          code: err?.code,
          error: err?.error,
          error_description: err?.error_description,
          status: err?.status,
          cause: err?.cause?.message || err?.cause,
          response_body: err?.response?.body || err?.body,
          stack: err?.stack?.split('\n').slice(0, 5),
        });
        // Log all enumerable properties for debugging
        const errProps: Record<string, any> = {};
        for (const key of Object.getOwnPropertyNames(err)) {
          if (key !== 'stack') errProps[key] = err[key];
        }
        console.error('❌ Full error properties:', JSON.stringify(errProps, null, 2));
        return res.redirect('/login?error=auth_error');
      }
      
      if (!user) {
        console.error('❌ Authentication callback: no user returned', { info: JSON.stringify(info) });
        return res.redirect('/login?error=auth_failed');
      }

      // Clean up PKCE session state now that auth is complete
      if (issuerHost && (req.session as any)?.[issuerHost]) {
        delete (req.session as any)[issuerHost];
      }
      if ((req.session as any)?.oidcHost) {
        delete (req.session as any).oidcHost;
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('❌ Login after auth callback failed:', loginErr);
          return res.redirect('/login?error=login_failed');
        }
      
        try {
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
            
            // Save session before redirect with timeout to prevent hanging
            let sessionSaved = false;
            const saveTimeout = setTimeout(() => {
              if (!sessionSaved && !res.headersSent) {
                console.warn('⚠️ Session save timeout (mobile) - force redirecting');
                sessionSaved = true;
                res.redirect(callbackUrl);
              }
            }, 5000);
            
            req.session.save((saveErr) => {
              clearTimeout(saveTimeout);
              if (saveErr) console.error('Session save error (mobile):', saveErr);
              if (!sessionSaved && !res.headersSent) {
                sessionSaved = true;
                res.redirect(callbackUrl);
              }
            });
          } else {
            // Web authentication - save session explicitly before redirect
            console.log(`✅ Auth callback successful for user: ${user.email}, redirecting to /`);
            
            let sessionSaved = false;
            const saveTimeout = setTimeout(() => {
              if (!sessionSaved && !res.headersSent) {
                console.warn('⚠️ Session save timeout (web) - force redirecting');
                sessionSaved = true;
                res.redirect('/');
              }
            }, 5000);
            
            req.session.save((saveErr) => {
              clearTimeout(saveTimeout);
              if (saveErr) console.error('Session save error (web):', saveErr);
              if (!sessionSaved && !res.headersSent) {
                sessionSaved = true;
                res.redirect('/');
              }
            });
          }
        } catch (error) {
          console.error('Error processing authentication callback:', error);
          return res.redirect('/login?error=processing_error');
        }
      });
    })(req, res, next);
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
          let sessionDestroyed = false;
          const destroyTimeout = setTimeout(() => {
            if (!sessionDestroyed && !res.headersSent) {
              console.warn('⚠️ Session destroy timeout during logout - force redirecting');
              sessionDestroyed = true;
              res.redirect(endSessionHref);
            }
          }, 5000);
          
          req.session.destroy((err) => {
            clearTimeout(destroyTimeout);
            if (err) console.error('Session destroy error during logout:', err);
            if (!sessionDestroyed && !res.headersSent) {
              sessionDestroyed = true;
              res.redirect(endSessionHref);
            }
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
          let sessionDestroyed = false;
          const destroyTimeout = setTimeout(() => {
            if (!sessionDestroyed && !res.headersSent) {
              console.warn('⚠️ Session destroy timeout during API logout - force responding');
              sessionDestroyed = true;
              res.json({ message: 'Successfully logged out', success: true });
            }
          }, 5000);
          
          req.session.destroy((err) => {
            clearTimeout(destroyTimeout);
            if (err) console.error('Session destroy error during API logout:', err);
            if (!sessionDestroyed && !res.headersSent) {
              sessionDestroyed = true;
              res.json({ message: 'Successfully logged out', success: true });
            }
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
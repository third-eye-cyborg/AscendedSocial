import { WorkOS } from '@workos-inc/node';
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import jwt from 'jsonwebtoken';

if (!process.env.WORKOS_API_KEY) {
  throw new Error("Environment variable WORKOS_API_KEY not provided");
}

if (!process.env.WORKOS_CLIENT_ID) {
  throw new Error("Environment variable WORKOS_CLIENT_ID not provided");
}

// Initialize WorkOS
const workos = new WorkOS(process.env.WORKOS_API_KEY);

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

async function upsertUser(userInfo: any) {
  await storage.upsertUser({
    id: userInfo.id,
    email: userInfo.email,
    firstName: userInfo.firstName || userInfo.first_name || '',
    lastName: userInfo.lastName || userInfo.last_name || '',
    profileImageUrl: userInfo.profilePictureUrl || userInfo.profile_picture_url || null,
  });
  
  // Return the user from database
  return await storage.getUser(userInfo.id);
}

// Generate JWT token for mobile authentication
function generateMobileAuthToken(user: any): string {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET required for JWT generation');
  }
  
  const payload = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  
  return jwt.sign(payload, process.env.SESSION_SECRET);
}

export async function setupWorkOSAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // WorkOS AuthKit login endpoint (unified for web and mobile)
  app.get("/api/login", (req, res) => {
    const redirectUrl = req.query.redirectUrl as string;
    const state = req.query.state as string;
    const mobileBounce = req.query.mobile_bounce as string;
    const platform = req.query.platform as string;
    
    console.log('🔍 WorkOS AuthKit login endpoint called:', {
      redirectUrl,
      state,
      mobileBounce,
      platform,
      hostname: req.hostname,
      userAgent: req.get('User-Agent')?.substring(0, 50)
    });
    
    // Store redirect URL and mobile info in session for callback handling
    if (redirectUrl) {
      (req.session as any).redirectUrl = redirectUrl;
    }
    if (mobileBounce) {
      (req.session as any).isMobileBounce = true;
      (req.session as any).mobileCallbackUrl = (req.session as any).mobileCallbackUrl || redirectUrl;
    }
    if (platform) {
      (req.session as any).platform = platform;
    }
    
    // Create state parameter that includes mobile info if needed
    let authState = state || 'web';
    if (mobileBounce && platform) {
      authState = JSON.stringify({ 
        type: 'mobile',
        platform,
        originalState: state,
        callback: redirectUrl
      });
    }
    
    // Generate proper WorkOS AuthKit URL using SDK
    const callbackUri = `${req.protocol}://${req.get('host')}/api/callback`;
    const authKitUrl = workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri: callbackUri,
      state: authState
    });
    
    console.log('🔗 Redirecting to WorkOS AuthKit:', authKitUrl);
    res.redirect(authKitUrl);
  });

  // WorkOS AuthKit callback endpoint
  app.get("/api/callback", async (req, res) => {
    try {
      const { code, state, error, error_description } = req.query;
      
      console.log('🔄 WorkOS callback received:', { 
        code: !!code, 
        state, 
        error, 
        error_description,
        fullQuery: req.query,
        headers: req.headers
      });
      
      // Check for WorkOS error first
      if (error) {
        console.error('❌ WorkOS returned error:', { error, error_description });
        return res.redirect(`/?error=${error}&description=${encodeURIComponent(error_description as string || 'Authentication failed')}`);
      }
      
      if (!code) {
        console.error('No authorization code received');
        return res.redirect('/?error=auth_failed');
      }

      // Exchange code for user info
      const { user, accessToken } = await workos.userManagement.authenticateWithCode({
        clientId: process.env.WORKOS_CLIENT_ID!,
        code: code as string,
      });

      console.log('✅ WorkOS authentication successful:', {
        userId: user.id,
        email: user.email
      });

      // Upsert user in database
      let dbUser;
      try {
        dbUser = await upsertUser(user);
        if (!dbUser) {
          console.error('❌ No user returned from database upsert');
          return res.redirect('/?error=user_creation_failed&details=no_user_returned');
        }
        console.log('✅ User successfully created/updated in database:', {
          id: dbUser.id,
          email: dbUser.email
        });
      } catch (dbError: any) {
        console.error('❌ Database error during user upsert:', dbError);
        return res.redirect('/?error=user_creation_failed&details=' + encodeURIComponent(dbError.message || 'Database error'));
      }

      // Store user in session
      (req.session as any).user = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl,
        accessToken
      };

      // Handle mobile authentication flow
      const isMobileBounce = (req.session as any).isMobileBounce;
      const mobileCallbackUrl = (req.session as any).mobileCallbackUrl;
      const platform = (req.session as any).platform;
      const redirectUrl = (req.session as any).redirectUrl;
      
      // Check if this is mobile authentication
      let isMobileAuth = false;
      let mobileCallback = null;
      
      try {
        if (state && state !== 'web' && state !== 'default') {
          const stateData = JSON.parse(state as string);
          if (stateData.type === 'mobile') {
            isMobileAuth = true;
            mobileCallback = stateData.callback;
          }
        }
      } catch {
        // State is not JSON, check session data
        if (isMobileBounce || platform) {
          isMobileAuth = true;
          mobileCallback = mobileCallbackUrl || redirectUrl;
        }
      }
      
      if (isMobileAuth) {
        // Mobile app authentication - generate JWT token
        const mobileAuthToken = generateMobileAuthToken(dbUser);
        
        if (mobileCallback) {
          // Direct mobile app callback
          const separator = mobileCallback.includes('?') ? '&' : '?';
          const finalRedirectUrl = `${mobileCallback}${separator}token=${mobileAuthToken}`;
          console.log('📱 Mobile auth redirect:', finalRedirectUrl);
          return res.redirect(finalRedirectUrl);
        }
        
        // Fallback to auth callback page with token for mobile web apps
        return res.redirect(`/auth-callback?token=${mobileAuthToken}&mobile=true`);
      }

      // Regular web authentication
      console.log('🏠 Regular web auth - redirecting to auth callback');
      
      // Clear session auth data
      delete (req.session as any).isMobileBounce;
      delete (req.session as any).mobileCallbackUrl;
      delete (req.session as any).platform;
      delete (req.session as any).redirectUrl;
      
      res.redirect(redirectUrl || '/auth-callback');
      
    } catch (error) {
      console.error('❌ WorkOS callback error:', error);
      res.redirect('/?error=auth_failed');
    }
  });

  // WorkOS logout endpoint
  app.get("/api/logout", async (req, res) => {
    try {
      const user = (req.session as any).user;
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
      });
      
      // Generate WorkOS logout URL
      const logoutUrl = workos.userManagement.getLogoutUrl({
        sessionId: user?.accessToken || 'unknown'
      });
      
      console.log('🚪 WorkOS logout initiated');
      res.redirect(logoutUrl || '/');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      res.redirect('/');
    }
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    const user = (req.session as any).user;
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl
    });
  });

  // Debug endpoint to test WorkOS configuration
  app.get("/api/debug/workos", (req, res) => {
    const host = req.get('host');
    const protocol = req.protocol;
    const redirectUri = `${protocol}://${host}/api/callback`;
    
    res.json({
      clientId: process.env.WORKOS_CLIENT_ID,
      hasApiKey: !!process.env.WORKOS_API_KEY,
      redirectUri: redirectUri,
      host: host,
      protocol: protocol,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
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
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        profileImageUrl: decoded.profileImageUrl
      };
      
      console.log('✅ JWT Bearer token authentication successful for user:', user.email);
      return next();
    } catch (error) {
      console.error('❌ JWT token verification failed:', error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  // Fall back to session-based authentication (web app)
  const user = (req.session as any).user;
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Set user in request for downstream middleware
  req.user = user;
  
  return next();
};
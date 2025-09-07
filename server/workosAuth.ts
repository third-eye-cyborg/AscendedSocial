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

  // WorkOS AuthKit login endpoint
  app.get("/api/login", (req, res) => {
    const redirectUrl = req.query.redirectUrl as string;
    const state = req.query.state as string;
    
    console.log('🔍 WorkOS login endpoint called:', {
      redirectUrl,
      state,
      hostname: req.hostname
    });
    
    // Store redirect URL in session for later use
    if (redirectUrl) {
      (req.session as any).redirectUrl = redirectUrl;
    }
    
    // Store state parameter for mobile apps
    if (state) {
      (req.session as any).authState = state;
    }
    
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri: `${req.protocol}://${req.get('host')}/api/callback`,
      state: state || 'default'
    });
    
    console.log('🔗 Redirecting to WorkOS AuthKit:', authorizationUrl);
    res.redirect(authorizationUrl);
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
      const dbUser = await upsertUser(user);
      
      if (!dbUser) {
        console.error('Failed to create/update user in database');
        return res.redirect('/?error=user_creation_failed');
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

      // Handle mobile authentication with state parameter
      const authState = (req.session as any).authState || state;
      const redirectUrl = (req.session as any).redirectUrl;
      
      if (authState && authState !== 'default') {
        // Mobile app authentication - generate JWT token
        const mobileAuthToken = generateMobileAuthToken(dbUser);
        
        // Try to parse state as JSON to extract callback URL
        let mobileCallback = null;
        try {
          const stateData = JSON.parse(authState as string);
          mobileCallback = stateData.callback || stateData.redirectUri;
        } catch {
          // State is not JSON, treat as simple string
        }
        
        if (mobileCallback) {
          const separator = mobileCallback.includes('?') ? '&' : '?';
          const finalRedirectUrl = `${mobileCallback}${separator}token=${mobileAuthToken}`;
          console.log('📱 Mobile auth redirect:', finalRedirectUrl);
          return res.redirect(finalRedirectUrl);
        }
        
        // Fallback to auth callback page with token
        return res.redirect(`/auth-callback?token=${mobileAuthToken}&state=${encodeURIComponent(authState as string)}`);
      }

      // Regular web authentication
      console.log('🏠 Regular web auth - redirecting to auth callback');
      
      // Clear session auth data
      delete (req.session as any).authState;
      delete (req.session as any).redirectUrl;
      
      res.redirect('/auth-callback');
      
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
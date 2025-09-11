import type { Express, RequestHandler, Request, Response, NextFunction } from "express";
import { logAdminAction } from "./adminAuth";

/**
 * Route Segregation and Security Middleware
 * 
 * This module implements comprehensive route segregation to ensure:
 * 1. Admin routes are ONLY accessible via Replit Auth
 * 2. User routes are ONLY accessible via WorkOS AuthKit
 * 3. Prevents cross-authentication vulnerabilities
 * 4. Implements session isolation
 * 5. Provides security audit logging
 */

// Define route patterns for strict segregation
const ADMIN_ROUTE_PATTERNS = [
  /^\/api\/admin\//,
  /^\/admin\//
];

const USER_ROUTE_PATTERNS = [
  /^\/api\/auth\//,
  /^\/api\/posts/,
  /^\/api\/comments/,
  /^\/api\/engagements/,
  /^\/api\/oracle/,
  /^\/api\/visions/,
  /^\/api\/communities/,
  /^\/api\/users/,
  /^\/api\/profile/,
  /^\/api\/upload/,
  /^\/api\/objects/,
  /^\/api\/spirit/,
  /^\/api\/sparks/,
  /^\/api\/energy/,
  /^\/api\/subscription/,
  /^\/api\/payment/,
  /^\/api\/newsletter/,
  /^\/api\/notifications/,
  /^\/api\/reports/
];

// Public routes that don't require authentication
const PUBLIC_ROUTE_PATTERNS = [
  /^\/api\/debug\//,
  /^\/api\/health$/,
  /^\/api\/login$/,
  /^\/api\/callback$/,
  /^\/api\/logout$/,
  /^\/$/, // Root
  /^\/landing/,
  /^\/about/,
  /^\/pricing/,
  /^\/terms/,
  /^\/privacy/,
  /^\/auth-callback/,
  /^\/not-found/,
  /^\/static\//,
  /^\/assets\//,
  /^\/favicon/,
  /\.css$/,
  /\.js$/,
  /\.png$/,
  /\.jpg$/,
  /\.svg$/,
  /\.ico$/
];

/**
 * Authentication Type Enum
 */
export enum AuthType {
  ADMIN = 'admin',
  USER = 'user',
  PUBLIC = 'public'
}

/**
 * Determine the required authentication type for a route
 */
export function getRequiredAuthType(path: string): AuthType {
  // Check for admin routes first (most restrictive)
  if (ADMIN_ROUTE_PATTERNS.some(pattern => pattern.test(path))) {
    return AuthType.ADMIN;
  }
  
  // Check for public routes
  if (PUBLIC_ROUTE_PATTERNS.some(pattern => pattern.test(path))) {
    return AuthType.PUBLIC;
  }
  
  // Check for user routes
  if (USER_ROUTE_PATTERNS.some(pattern => pattern.test(path))) {
    return AuthType.USER;
  }
  
  // Default to user authentication for unmatched API routes
  if (path.startsWith('/api/')) {
    return AuthType.USER;
  }
  
  // All other routes are public
  return AuthType.PUBLIC;
}

/**
 * Route segregation middleware that validates authentication type matches route requirements
 */
export const routeSegregationMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const requiredAuthType = getRequiredAuthType(req.path);
  const isAdminAuthenticated = req.isAuthenticated && req.isAuthenticated() && (req.user as any)?.isAdmin;
  const isUserAuthenticated = (req.session as any)?.user || req.headers.authorization?.startsWith('Bearer ');
  
  // Log all authentication attempts for audit purposes
  const logContext = {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requiredAuthType,
    isAdminAuthenticated,
    isUserAuthenticated
  };
  
  console.log('🔍 Route segregation check:', logContext);
  
  // Handle admin routes
  if (requiredAuthType === AuthType.ADMIN) {
    if (!isAdminAuthenticated) {
      console.warn('🚫 Unauthorized admin route access attempt:', logContext);
      await logSecurityViolation(req, 'unauthorized_admin_access', logContext);
      return res.status(401).json({ 
        error: 'Admin authentication required',
        message: 'This endpoint requires admin authentication via Replit Auth'
      });
    }
    
    // Ensure user session is not interfering with admin session
    if (isUserAuthenticated && !isAdminAuthenticated) {
      console.warn('🚫 User session attempting to access admin route:', logContext);
      await logSecurityViolation(req, 'cross_auth_violation', logContext);
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'User sessions cannot access admin endpoints'
      });
    }
    
    console.log('✅ Admin route access granted:', req.path);
    return next();
  }
  
  // Handle user routes
  if (requiredAuthType === AuthType.USER) {
    // Block admin sessions from accessing user routes
    if (isAdminAuthenticated && !isUserAuthenticated) {
      console.warn('🚫 Admin session attempting to access user route:', logContext);
      await logSecurityViolation(req, 'admin_user_route_access', logContext);
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Admin sessions cannot access user endpoints. Please use regular user authentication.'
      });
    }
    
    // User routes will be handled by their specific authentication middleware
    console.log('📊 User route - proceeding to authentication middleware:', req.path);
    return next();
  }
  
  // Public routes - proceed without authentication
  console.log('🌐 Public route access:', req.path);
  return next();
};

/**
 * Session isolation middleware to prevent session leakage
 */
export const sessionIsolationMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const requiredAuthType = getRequiredAuthType(req.path);
  
  // For admin routes, ensure only admin session data is available
  if (requiredAuthType === AuthType.ADMIN) {
    // Clear any WorkOS user session data that might interfere
    if ((req.session as any)?.user && !(req.user as any)?.isAdmin) {
      console.log('🧹 Clearing user session data for admin route:', req.path);
      delete (req.session as any).user;
    }
  }
  
  // For user routes, ensure admin session doesn't interfere
  if (requiredAuthType === AuthType.USER) {
    // Don't clear admin session, but ensure it doesn't interfere with user auth
    if ((req.user as any)?.isAdmin && !(req.session as any)?.user) {
      console.log('🔄 Admin authenticated - user route requires separate user auth:', req.path);
    }
  }
  
  next();
};

/**
 * Enhanced security headers middleware for admin routes
 */
export const adminSecurityHeaders: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (getRequiredAuthType(req.path) === AuthType.ADMIN) {
    // Strict security headers for admin routes
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
    
    // Admin route specific headers
    res.setHeader('X-Admin-Route', 'true');
    res.setHeader('X-Auth-Required', 'replit-admin');
  }
  
  next();
};

/**
 * User security headers middleware
 */
export const userSecurityHeaders: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (getRequiredAuthType(req.path) === AuthType.USER) {
    // Standard security headers for user routes
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // User route specific headers
    res.setHeader('X-User-Route', 'true');
    res.setHeader('X-Auth-Required', 'workos-authkit');
  }
  
  next();
};

/**
 * Cross-authentication prevention middleware
 */
export const crossAuthPreventionMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const requiredAuthType = getRequiredAuthType(req.path);
  const hasAdminAuth = req.isAuthenticated && req.isAuthenticated() && (req.user as any)?.isAdmin;
  const hasUserAuth = (req.session as any)?.user || req.headers.authorization?.startsWith('Bearer ');
  
  // Prevent admin authenticated users from accessing user-only routes without proper user auth
  if (requiredAuthType === AuthType.USER && hasAdminAuth && !hasUserAuth) {
    console.warn('🚫 Cross-authentication violation: Admin trying to access user route without user auth');
    await logSecurityViolation(req, 'admin_accessing_user_route', {
      path: req.path,
      adminUser: (req.user as any)?.email
    });
    
    return res.status(403).json({
      error: 'Authentication type mismatch',
      message: 'Admin authentication cannot be used for user endpoints. Please authenticate as a regular user.',
      requiredAuth: 'workos-authkit',
      currentAuth: 'replit-admin'
    });
  }
  
  // Prevent user authenticated users from accessing admin-only routes
  if (requiredAuthType === AuthType.ADMIN && hasUserAuth && !hasAdminAuth) {
    console.warn('🚫 Cross-authentication violation: User trying to access admin route');
    await logSecurityViolation(req, 'user_accessing_admin_route', {
      path: req.path,
      userSession: !!(req.session as any)?.user,
      bearerToken: !!req.headers.authorization
    });
    
    return res.status(403).json({
      error: 'Authentication type mismatch', 
      message: 'User authentication cannot be used for admin endpoints. Admin access requires Replit authentication.',
      requiredAuth: 'replit-admin',
      currentAuth: 'workos-authkit'
    });
  }
  
  next();
};

/**
 * Security violation logging
 */
async function logSecurityViolation(req: Request, violationType: string, details: any) {
  try {
    console.error(`🚨 SECURITY VIOLATION [${violationType}]:`, details);
    
    // Use admin logging if available, otherwise fallback to console
    if (typeof logAdminAction === 'function') {
      await logAdminAction(req, violationType as any, details);
    }
  } catch (error) {
    console.error('Failed to log security violation:', error);
  }
}

/**
 * Comprehensive route protection setup
 */
export function setupRouteSegregation(app: Express) {
  console.log('🔐 Setting up comprehensive route segregation...');
  
  // Apply route segregation middleware to all routes
  app.use(sessionIsolationMiddleware);
  app.use(routeSegregationMiddleware);
  app.use(crossAuthPreventionMiddleware);
  app.use(adminSecurityHeaders);
  app.use(userSecurityHeaders);
  
  console.log('✅ Route segregation security middleware applied');
}

/**
 * Route information endpoint for debugging
 */
export const routeInfoEndpoint: RequestHandler = (req: Request, res: Response) => {
  const requiredAuthType = getRequiredAuthType(req.path);
  const hasAdminAuth = req.isAuthenticated && req.isAuthenticated() && (req.user as any)?.isAdmin;
  const hasUserAuth = !!(req.session as any)?.user || !!req.headers.authorization?.startsWith('Bearer ');
  
  res.json({
    path: req.path,
    requiredAuthType,
    authentication: {
      admin: hasAdminAuth,
      user: hasUserAuth,
      adminUser: hasAdminAuth ? {
        id: (req.user as any)?.id,
        email: (req.user as any)?.email
      } : null,
      userSession: hasUserAuth ? !!(req.session as any)?.user : false,
      bearerToken: hasUserAuth ? !!req.headers.authorization : false
    },
    routePatterns: {
      admin: ADMIN_ROUTE_PATTERNS.map(p => p.source),
      user: USER_ROUTE_PATTERNS.map(p => p.source),
      public: PUBLIC_ROUTE_PATTERNS.map(p => p.source)
    }
  });
};
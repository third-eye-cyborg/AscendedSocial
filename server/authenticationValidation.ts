import type { RequestHandler, Request, Response, NextFunction } from "express";
import { getRequiredAuthType, AuthType } from "./routeSegregation";
import { logAdminAction } from "./adminAuth";
import { storage } from "./storage";
import jwt from 'jsonwebtoken';

/**
 * Enhanced Authentication Validation Middleware
 * 
 * This module provides comprehensive authentication validation to prevent:
 * 1. Cross-authentication vulnerabilities
 * 2. Session hijacking
 * 3. Token replay attacks  
 * 4. Privilege escalation
 * 5. Authentication bypass
 */

// Track authentication attempts for security monitoring
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();
const SECURITY_CONSTANTS = {
  MAX_AUTH_ATTEMPTS: 10,
  AUTH_ATTEMPT_WINDOW: 15 * 60 * 1000, // 15 minutes
  TOKEN_GRACE_PERIOD: 5 * 60 * 1000, // 5 minutes for token expiry grace
  SESSION_VALIDATION_INTERVAL: 30 * 60 * 1000, // 30 minutes
};

/**
 * Enhanced user authentication middleware with cross-auth prevention
 */
export const enhancedUserAuthentication: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const requiredAuthType = getRequiredAuthType(req.path);
  
  // Only apply to user routes
  if (requiredAuthType !== AuthType.USER) {
    return next();
  }
  
  const clientIP = req.ip;
  const userAgent = req.get('User-Agent') || 'unknown';
  
  try {
    // Check for rate limiting on authentication attempts
    const attemptKey = `${clientIP}:${userAgent}`;
    const attempts = authAttempts.get(attemptKey);
    const now = Date.now();
    
    if (attempts && attempts.count >= SECURITY_CONSTANTS.MAX_AUTH_ATTEMPTS) {
      if (now - attempts.lastAttempt < SECURITY_CONSTANTS.AUTH_ATTEMPT_WINDOW) {
        console.warn(`🚫 Authentication rate limit exceeded for ${clientIP}`);
        await logSecurityViolation(req, 'auth_rate_limit_exceeded', { clientIP, userAgent, attempts: attempts.count });
        return res.status(429).json({
          error: 'Too many authentication attempts',
          message: 'Please wait before trying again',
          retryAfter: Math.ceil((SECURITY_CONSTANTS.AUTH_ATTEMPT_WINDOW - (now - attempts.lastAttempt)) / 1000)
        });
      } else {
        // Reset attempts after window expires
        authAttempts.delete(attemptKey);
      }
    }
    
    // Check for JWT Bearer token authentication (mobile apps)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
        
        // Additional token validation
        if (!decoded.userId || !decoded.email) {
          throw new Error('Invalid token payload');
        }
        
        // Check token expiry with grace period
        const tokenAge = Date.now() / 1000 - decoded.iat;
        const maxAge = 7 * 24 * 60 * 60; // 7 days
        if (tokenAge > maxAge + (SECURITY_CONSTANTS.TOKEN_GRACE_PERIOD / 1000)) {
          throw new Error('Token expired beyond grace period');
        }
        
        // Validate user still exists and is active
        const user = await storage.getUser(decoded.userId);
        if (!user) {
          await logSecurityViolation(req, 'invalid_user_token', { userId: decoded.userId, email: decoded.email });
          throw new Error('User no longer exists');
        }
        
        // Removed admin check since we're using Replit Auth for all users now
        
        // Set user in request for downstream middleware
        (req as any).user = {
          id: decoded.userId,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          profileImageUrl: decoded.profileImageUrl,
          authMethod: 'jwt'
        };
        
        console.log(`✅ JWT authentication successful for user: ${user.email} on ${req.path}`);
        return next();
        
      } catch (jwtError: any) {
        console.error(`❌ JWT token verification failed: ${jwtError.message}`);
        await trackFailedAuthAttempt(attemptKey);
        await logSecurityViolation(req, 'invalid_jwt_token', { 
          error: jwtError.message, 
          token: token.substring(0, 20) + '...' 
        });
        
        return res.status(401).json({
          error: 'Invalid authentication token',
          message: 'Please login again',
          authMethod: 'jwt'
        });
      }
    }
    
    // Check for passport authentication (Replit Auth) first
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      const passportUser = req.user as any;
      
      // Validate passport user has required fields
      if (!passportUser.id || !passportUser.email) {
        console.error('❌ Invalid passport user structure:', passportUser);
        await logSecurityViolation(req, 'corrupted_passport_user', { user: passportUser });
        return res.status(401).json({
          error: 'Session corrupted',
          message: 'Please login again',
          authMethod: 'passport'
        });
      }
      
      // Check if token has expired (for Replit Auth tokens)
      if (passportUser.expires_at) {
        const now = Math.floor(Date.now() / 1000);
        if (now > passportUser.expires_at) {
          console.warn(`🚫 Expired passport session: ${passportUser.email}`);
          await logSecurityViolation(req, 'expired_passport_session', { 
            userId: passportUser.id,
            email: passportUser.email,
            expiredBy: now - passportUser.expires_at
          });
          
          // Try to refresh token if refresh_token is available
          if (passportUser.refresh_token) {
            try {
              const client = await import("openid-client");
              const { getOidcConfig, updateUserSession } = await import("./replitAuth");
              const config = await getOidcConfig();
              const tokenResponse = await client.refreshTokenGrant(config, passportUser.refresh_token);
              
              // Update user session with new tokens
              updateUserSession(passportUser, tokenResponse);
              
              console.log(`✅ Refreshed passport token for user: ${passportUser.email}`);
            } catch (refreshError) {
              console.error('❌ Failed to refresh passport token:', refreshError);
              return res.status(401).json({
                error: 'Session expired',
                message: 'Please login again',
                authMethod: 'passport'
              });
            }
          } else {
            return res.status(401).json({
              error: 'Session expired',
              message: 'Please login again',
              authMethod: 'passport'
            });
          }
        }
      }
      
      // Verify user still exists in database (only for critical operations)
      // Skip database check for frequently accessed routes to improve performance
      const skipDbCheck = req.path.includes('/api/auth/user') || req.path.includes('/api/posts') || req.path.includes('/api/user/');
      
      if (!skipDbCheck) {
        const dbUser = await storage.getUser(passportUser.id);
        if (!dbUser) {
          console.error(`❌ Passport user not found in database: ${passportUser.id}`);
          await logSecurityViolation(req, 'nonexistent_passport_user', { userId: passportUser.id });
          return res.status(401).json({
            error: 'User not found',
            message: 'Please login again',
            authMethod: 'passport'
          });
        }
      }
      
      // Set user in request for downstream middleware (preserve all passport properties)
      (req as any).user = {
        ...passportUser,
        authMethod: 'passport'
      };
      
      console.log(`✅ Passport authentication successful for user: ${passportUser.email} on ${req.path}`);
      return next();
    }
    
    // Special case: If this is a simple user info request and there's a user in req.user but isAuthenticated fails
    // This can happen during token transitions
    if (req.path === '/api/auth/user' && req.user && !(req as any).authMethodOverride) {
      const user = req.user as any;
      if (user.id && user.email) {
        console.log(`🔄 Allowing user info request for ${user.email} (authentication transition)`);
        return next();
      }
    }
    
    // Fall back to session-based authentication (legacy web app)
    const userSession = (req.session as any)?.user;
    
    if (!userSession) {
      // For user routes, if no authentication is found in enhanced middleware,
      // let the request continue to individual route middleware instead of immediately failing
      // This allows routes with their own authentication middleware to handle auth properly
      if (requiredAuthType === AuthType.USER) {
        return next();
      }
      
      await trackFailedAuthAttempt(attemptKey);
      await logSecurityViolation(req, 'no_authentication', { path: req.path });
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource',
        authMethod: 'session'
      });
    }
    
    // Validate session integrity
    if (!userSession.id || !userSession.email) {
      console.error('❌ Invalid user session structure');
      await logSecurityViolation(req, 'corrupted_user_session', { session: userSession });
      
      // Clear corrupted session
      delete (req.session as any).user;
      
      return res.status(401).json({
        error: 'Session corrupted',
        message: 'Please login again',
        authMethod: 'session'
      });
    }
    
    // Ensure this is not an admin session masquerading as user session
    if (req.isAuthenticated && req.isAuthenticated() && (req.user as any)?.isAdmin) {
      console.warn(`🚫 Admin session attempting to access user route: ${req.path}`);
      await logSecurityViolation(req, 'admin_session_user_route', { 
        adminUser: (req.user as any)?.email, 
        path: req.path 
      });
      
      return res.status(403).json({
        error: 'Authentication type mismatch',
        message: 'Admin sessions cannot access user endpoints. Please use regular user authentication.',
        currentAuth: 'admin',
        requiredAuth: 'user'
      });
    }
    
    // Verify user still exists in database
    const dbUser = await storage.getUser(userSession.id);
    if (!dbUser) {
      console.error(`❌ User not found in database: ${userSession.id}`);
      await logSecurityViolation(req, 'nonexistent_user_session', { userId: userSession.id });
      
      // Clear invalid session
      delete (req.session as any).user;
      
      return res.status(401).json({
        error: 'User not found',
        message: 'Please login again',
        authMethod: 'session'
      });
    }
    
    // Set user in request for downstream middleware
    (req as any).user = {
      ...userSession,
      authMethod: 'session'
    };
    
    console.log(`✅ Session authentication successful for user: ${dbUser.email} on ${req.path}`);
    return next();
    
  } catch (error: any) {
    console.error('❌ Enhanced user authentication error:', error);
    await logSecurityViolation(req, 'auth_middleware_error', { error: error.message });
    
    return res.status(500).json({
      error: 'Authentication system error',
      message: 'Please try again later'
    });
  }
};

/**
 * Enhanced admin authentication middleware with additional security checks
 */
export const enhancedAdminAuthentication: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const requiredAuthType = getRequiredAuthType(req.path);
  
  // Only apply to admin routes
  if (requiredAuthType !== AuthType.ADMIN) {
    return next();
  }
  
  try {
    // Verify passport authentication is present
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      console.warn(`🚫 Unauthenticated admin route access attempt: ${req.path}`);
      await logSecurityViolation(req, 'unauthenticated_admin_access', { path: req.path });
      
      return res.status(401).json({
        error: 'Admin authentication required',
        message: 'Please login as an administrator',
        loginUrl: '/api/admin/login'
      });
    }
    
    const adminUser = req.user as any;
    
    // Verify admin user structure
    if (!adminUser || !adminUser.isAdmin) {
      console.warn(`🚫 Non-admin user attempting admin route access: ${req.path}`);
      await logSecurityViolation(req, 'non_admin_user_access', { 
        path: req.path,
        user: adminUser ? { id: adminUser.id, email: adminUser.email } : null
      });
      
      return res.status(403).json({
        error: 'Admin privileges required',
        message: 'This endpoint requires administrator access'
      });
    }
    
    // Ensure user session is not interfering with admin session
    if ((req.session as any)?.user && !adminUser.isAdmin) {
      console.warn(`🚫 User session interfering with admin authentication: ${req.path}`);
      await logSecurityViolation(req, 'session_interference', { 
        path: req.path,
        adminUser: adminUser.email,
        userSession: (req.session as any).user.email
      });
      
      // Clear interfering user session
      delete (req.session as any).user;
    }
    
    // Validate admin privileges are still valid
    const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS ? process.env.ADMIN_USER_IDS.split(',') : ["25531750"];
    if (!ADMIN_USER_IDS.includes(adminUser.id)) {
      console.warn(`🚫 Admin access revoked for user: ${adminUser.id} (${adminUser.email})`);
      await logSecurityViolation(req, 'revoked_admin_access', { 
        userId: adminUser.id, 
        email: adminUser.email,
        path: req.path
      });
      
      return res.status(403).json({
        error: 'Admin access revoked',
        message: 'Your administrator privileges have been revoked'
      });
    }
    
    // Check token expiry
    if (!adminUser.expires_at) {
      await logSecurityViolation(req, 'missing_token_expiry', { 
        userId: adminUser.id,
        path: req.path
      });
      
      return res.status(401).json({
        error: 'Invalid admin session',
        message: 'Please login again'
      });
    }
    
    const now = Math.floor(Date.now() / 1000);
    if (now > adminUser.expires_at) {
      console.warn(`🚫 Expired admin session: ${adminUser.email}`);
      await logSecurityViolation(req, 'expired_admin_session', { 
        userId: adminUser.id,
        email: adminUser.email,
        expiredBy: now - adminUser.expires_at
      });
      
      return res.status(401).json({
        error: 'Admin session expired',
        message: 'Please login again',
        loginUrl: '/api/admin/login'
      });
    }
    
    // Log successful admin access for audit trail
    if (req.method !== 'GET' || req.path.includes('/analytics') || req.path.includes('/reports')) {
      await logAdminAction(req, 'admin_route_access', {
        method: req.method,
        path: req.path,
        userAgent: req.get('User-Agent')
      });
    }
    
    console.log(`🔐 Admin authentication successful: ${adminUser.email} accessing ${req.method} ${req.path}`);
    return next();
    
  } catch (error: any) {
    console.error('❌ Enhanced admin authentication error:', error);
    await logSecurityViolation(req, 'admin_auth_error', { error: error.message });
    
    return res.status(500).json({
      error: 'Admin authentication system error',
      message: 'Please try again later'
    });
  }
};

/**
 * Security headers middleware with enhanced protections
 */
export const enhancedSecurityHeaders: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const requiredAuthType = getRequiredAuthType(req.path);
  
  // Base security headers for all routes
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Route-Auth-Type', requiredAuthType);
  res.setHeader('X-Powered-By', 'Ascended Social'); // Override default Express header
  
  // Enhanced headers for admin routes
  if (requiredAuthType === AuthType.ADMIN) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Admin-Protected', 'true');
    
    // HSTS for production admin routes
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
  }
  
  // Standard headers for user routes
  if (requiredAuthType === AuthType.USER) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cache-Control', 'private, max-age=300'); // 5 minute cache for user content
    res.setHeader('X-User-Protected', 'true');
  }
  
  // Public route headers
  if (requiredAuthType === AuthType.PUBLIC) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache for public content
  }
  
  next();
};

/**
 * Comprehensive error handling middleware
 */
export const securityErrorHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  // This middleware should be applied at the end to catch any unhandled security errors
  const originalSend = res.send;
  
  res.send = function(data: any) {
    if (res.statusCode === 401 || res.statusCode === 403) {
      const expectedUnauthPaths = ['/api/auth/user', '/api/auth/status'];
      const isExpected = res.statusCode === 401 && expectedUnauthPaths.some(p => req.path === p);
      if (!isExpected) {
        logSecurityViolation(req, 'security_error_response', {
          statusCode: res.statusCode,
          path: req.path,
          method: req.method,
          response: typeof data === 'string' ? data.substring(0, 200) : 'non-string-response'
        }).catch(console.error);
      }
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Track failed authentication attempts for rate limiting
 */
async function trackFailedAuthAttempt(attemptKey: string) {
  const now = Date.now();
  const attempts = authAttempts.get(attemptKey);
  
  if (!attempts || now - attempts.lastAttempt > SECURITY_CONSTANTS.AUTH_ATTEMPT_WINDOW) {
    authAttempts.set(attemptKey, { count: 1, lastAttempt: now });
  } else {
    authAttempts.set(attemptKey, { count: attempts.count + 1, lastAttempt: now });
  }
}

/**
 * Enhanced security violation logging
 */
async function logSecurityViolation(req: Request, violationType: string, details: any) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      violationType,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
      headers: {
        authorization: req.headers.authorization ? 'Bearer [REDACTED]' : 'none',
        cookie: req.headers.cookie ? '[REDACTED]' : 'none'
      },
      details
    };
    
    console.error(`🚨 SECURITY VIOLATION [${violationType}]:`, logEntry);
    
    // Store in admin audit log if available - use 'other_action' enum value
    // since security violation types may not match the audit_action enum
    if (typeof logAdminAction === 'function') {
      await logAdminAction(req, 'other_action' as any, { ...logEntry, violationType });
    }
    
    // Could also send to external security monitoring service here
    
  } catch (error) {
    console.error('Failed to log security violation:', error);
  }
}
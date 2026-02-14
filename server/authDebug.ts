import type { Request, Response, RequestHandler, NextFunction } from "express";

/**
 * Authentication Debug Endpoint
 * This endpoint provides comprehensive information about the current authentication state
 * Useful for diagnosing authentication issues in development
 */

export const authDebugEndpoint: RequestHandler = async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  
  // Collect all authentication information
  const debugInfo = {
    timestamp,
    path: req.path,
    method: req.method,
    clientIP: req.ip,
    userAgent: req.get('User-Agent') || 'unknown',
    
    // Express request info
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : 'function not available',
    hasUser: !!req.user,
    
    // User object details
    user: req.user ? {
      id: (req.user as any)?.id,
      email: (req.user as any)?.email,
      firstName: (req.user as any)?.firstName,
      lastName: (req.user as any)?.lastName,
      expiresAt: (req.user as any)?.expires_at,
      has_access_token: !!(req.user as any)?.access_token,
      has_refresh_token: !!(req.user as any)?.refresh_token,
      has_claims: !!(req.user as any)?.claims
    } : null,
    
    // Session info
    sessionID: (req.session as any)?.id,
    sessionCookie: {
      present: !!req.headers.cookie,
      value: req.headers.cookie ? '[REDACTED]' : 'none'
    },
    passportSession: {
      hasPassportData: !!(req.session as any)?.passport,
      userInSession: !!(req.session as any)?.passport?.user
    },
    
    // Headers
    headers: {
      authorization: req.get('authorization') ? `${req.get('authorization')?.substring(0, 20)}...` : 'none',
      contentType: req.get('content-type'),
      cookie: req.get('cookie') ? 'present' : 'none',
      xForwardedFor: req.get('x-forwarded-for'),
      xForwardedProto: req.get('x-forwarded-proto'),
      xForwardedHost: req.get('x-forwarded-host'),
      host: req.get('host'),
      origin: req.get('origin'),
      referer: req.get('referer')
    },
    
    // Passport info
    passport: {
      initialized: !!(req as any).passport,
      sessionPropertyName: (req as any)?.passport?._sessionPropertyName,
      strategyCount: Object.keys((req as any)?.passport?._strategies || {}).length
    },
    
    // Detailed session structure
    sessionStructure: {
      id: (req.session as any)?.id ? 'present' : 'missing',
      cookie: (req.session as any)?.cookie ? 'present' : 'missing',
      passport: (req.session as any)?.passport ? JSON.stringify(Object.keys((req.session as any)?.passport || {})) : 'missing'
    },
    
    // Environment info
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DEBUG_AUTH: process.env.DEBUG_AUTH,
      REPLIT_DOMAINS: process.env.REPLIT_DOMAINS ? '[CONFIGURED]' : 'missing'
    }
  };
  
  // Return debug info with proper formatting
  res.status(200).json({
    success: true,
    debug: debugInfo,
    diagnosis: {
      isUserLoggedIn: req.isAuthenticated ? req.isAuthenticated() : false,
      hasSessionCookie: !!req.headers.cookie,
      hasActiveSession: !!(req.session as any)?.passport?.user,
      status: req.isAuthenticated ? req.isAuthenticated() ? '✅ AUTHENTICATED' : '❌ NOT AUTHENTICATED' : '⚠️ UNKNOWN'
    },
    tips: [
      "Step 1: Check if 'isUserLoggedIn' is true",
      "Step 2: If false, check if you have completed the Replit Auth login flow (/api/login)",
      "Step 3: Verify session cookie is being sent (check 'hasSessionCookie')",
      "Step 4: Make sure SESSION_SECRET environment variable is set",
      "Step 5: Check REPLIT_DOMAINS includes your domain",
      "Step 6: Try visiting /api/login to start the authentication flow",
      "Step 7: After login, you should be redirected with a session cookie"
    ]
  });
};

/**
 * Session debug endpoint for detailed session information
 */
export const sessionDebugEndpoint: RequestHandler = async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  
  // Get raw session data (without serialization issues)
  const sessionData: any = {};
  if (req.session) {
    Object.keys(req.session).forEach(key => {
      try {
        sessionData[key] = (req.session as any)[key];
      } catch (e) {
        sessionData[key] = '[Unable to serialize]';
      }
    });
  }
  
  res.json({
    timestamp,
    message: 'Session debug information',
    sessionExists: !!req.session,
    sessionId: (req.session as any)?.id,
    sessionData: sessionData,
    cookie: (req.session as any)?.cookie ? {
      httpOnly: (req.session as any)?.cookie?.httpOnly,
      secure: (req.session as any)?.cookie?.secure,
      sameSite: (req.session as any)?.cookie?.sameSite,
      maxAge: (req.session as any)?.cookie?.maxAge,
      path: (req.session as any)?.cookie?.path
    } : null
  });
};

/**
 * Enable verbose authentication logging
 * Adds middleware that logs every authentication check
 */
export const createAuthLoggingMiddleware = () => {
  return (req: Request, res: Response, next: Function) => {
    // Skip logging for Vite dev server requests (HMR, module loads, source files)
    const p = req.path;
    if (
      p.startsWith('/@vite') ||
      p.startsWith('/@fs') ||
      p.startsWith('/@react-refresh') ||
      p.startsWith('/src/') ||
      p.startsWith('/node_modules/') ||
      p.endsWith('.js.map') ||
      p.endsWith('.css.map') ||
      p.endsWith('.ico') ||
      p.endsWith('.png') ||
      p.endsWith('.svg') ||
      p.endsWith('.woff') ||
      p.endsWith('.woff2')
    ) {
      return next();
    }

    const timestamp = new Date().toISOString();
    
    console.log(`\n📊 [AUTH LOG ${timestamp}] ${req.method} ${req.path}`);
    console.log(`   IP: ${req.ip}`);
    console.log(`   Has Authorization header: ${!!req.get('authorization')}`);
    console.log(`   Has Cookie: ${!!req.get('cookie')}`);
    console.log(`   isAuthenticated(): ${req.isAuthenticated ? req.isAuthenticated() : false}`);
    console.log(`   Has req.user: ${!!req.user}`);
    console.log(`   Has session: ${!!req.session}`);
    if (req.user) {
      const user = req.user as any;
      console.log(`   ✅ User logged in: ${user.email || user.id || 'unknown'}`);
    } else {
      console.log(`   ❌ No user object attached`);
    }
    
    // Log response status when finished
    const originalJson = res.json;
    res.json = function(data: any) {
      if (res.statusCode >= 400) {
        console.log(`   Response: ${res.statusCode} ${data?.message || data?.error || ''}`);
      }
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Comprehensive auth validation endpoint for debugging OAuth flow
 */
export const authFlowDebugEndpoint: RequestHandler = async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  
  const flowInfo = {
    timestamp,
    currentState: {
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      hasUser: !!req.user,
      hasSession: !!req.session,
      sessionId: (req.session as any)?.id
    },
    
    nextSteps: [] as string[]
  };
  
  // Determine current state and provide appropriate next steps
  if (req.isAuthenticated && req.isAuthenticated()) {
    flowInfo.nextSteps.push('✅ You are already authenticated!');
    flowInfo.nextSteps.push('Try making a request to /api/auth/user to get your user data');
  } else {
    flowInfo.nextSteps.push('❌ You are not authenticated');
    flowInfo.nextSteps.push('1️⃣ Click the login button on the homepage');
    flowInfo.nextSteps.push('2️⃣ This will redirect you to /api/login');
    flowInfo.nextSteps.push('3️⃣ You will be redirected to Replit\'s OAuth page');
    flowInfo.nextSteps.push('4️⃣ After approving, you\'ll return to /api/callback');
    flowInfo.nextSteps.push('5️⃣ This sets your session cookie');
    flowInfo.nextSteps.push('6️⃣ Your browser will have the session cookie for future requests');
    flowInfo.nextSteps.push('');
    flowInfo.nextSteps.push('Quick Test: Load this endpoint after logging in');
  }
  
  res.json(flowInfo);
};



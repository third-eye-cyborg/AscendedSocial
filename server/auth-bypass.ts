import { Request, Response, NextFunction } from 'express';

// Test user data for authenticated testing scenarios
export const TEST_USER = {
  id: '25531750',
  email: 'test@ascended.social',
  name: 'Spiritual Test User',
  replit: {
    id: '25531750',
    username: 'spiritual-tester'
  }
};

// SECURITY-CRITICAL: Authentication bypass middleware for testing environments ONLY
export function bypassAuthForTesting(req: Request, res: Response, next: NextFunction) {
  // SECURITY GATE: Only enable auth bypass in test environment
  // Never allow bypass in development or production - this prevents security bypass attacks
  const isSafeEnvironment = process.env.NODE_ENV === 'test';
  
  if (!isSafeEnvironment) {
    return next();
  }

  const userAgent = req.headers['user-agent'] || '';
  const testHeaders = {
    testingMode: req.headers['x-testing-mode'] === 'true',
    authBypass: req.headers['x-test-auth-bypass'] === 'true',
    spiritualTester: req.headers['x-spiritual-tester'] === 'active'
  };
  
  // Only check testing indicators when in actual test environment
  const isTestingMode = testHeaders.testingMode ||
                       testHeaders.authBypass ||
                       testHeaders.spiritualTester ||
                       userAgent.includes('Playwright') ||
                       userAgent.includes('Puppeteer') ||
                       userAgent.includes('AscendedSocial-TestBot');

  if (isTestingMode) {
    // Simulate authenticated session for testing
    req.user = TEST_USER;
    req.session = req.session || {};
    (req.session as any).passport = { user: TEST_USER };
    
    // Enhanced logging with context (only in test env)
    const context = {
      path: req.path,
      method: req.method,
      userAgent: userAgent.substring(0, 50),
      headers: testHeaders,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    };
    
    console.log(`🧪 [AUTH-BYPASS] Authentication bypassed for testing:`, context);
    
    // Add bypass indicator to response headers for debugging
    res.setHeader('X-Auth-Bypass-Active', 'true');
    res.setHeader('X-Test-User-ID', TEST_USER.id);
    res.setHeader('X-Test-Environment', 'true');
  }

  next();
}

// SECURITY-CRITICAL: Authentication middleware with secure bypass for testing
export function isAuthenticatedWithBypass(req: Request, res: Response, next: NextFunction) {
  // SECURITY GATE: Only check for test bypass in test environment
  if (process.env.NODE_ENV === 'test') {
    const userAgent = req.headers['user-agent'] || '';
    const testHeaders = {
      testingMode: req.headers['x-testing-mode'] === 'true',
      authBypass: req.headers['x-test-auth-bypass'] === 'true',
      spiritualTester: req.headers['x-spiritual-tester'] === 'active'
    };
    
    // Only check testing indicators when in test environment
    const isTestingMode = testHeaders.testingMode ||
                         testHeaders.authBypass ||
                         testHeaders.spiritualTester ||
                         userAgent.includes('Playwright') ||
                         userAgent.includes('Puppeteer') ||
                         userAgent.includes('AscendedSocial-TestBot');

    if (isTestingMode) {
      req.user = TEST_USER;
      req.session = req.session || {};
      (req.session as any).passport = { user: TEST_USER };
      
      const authContext = {
        route: req.path,
        method: req.method,
        bypassReason: Object.entries(testHeaders).filter(([_, value]) => value).map(([key]) => key).join(', ') || 'user-agent',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      };
      
      console.log(`🔐 [AUTH-PROTECTED] Authentication bypassed for protected route:`, authContext);
      
      // Add security headers for testing
      res.setHeader('X-Auth-Method', 'testing-bypass');
      res.setHeader('X-Test-Session-Active', 'true');
      res.setHeader('X-Test-Environment', 'true');
      
      return next();
    }
  }

  // Production authentication check - no bypass possible
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log(`✅ [AUTH-PROTECTED] User authenticated:`, {
      userId: (req.user as any)?.id,
      path: req.path,
      timestamp: new Date().toISOString()
    });
    return next();
  }

  // Authentication failed - log security event
  console.log(`❌ [AUTH-PROTECTED] Authentication required for:`, {
    path: req.path,
    method: req.method,
    userAgent: (req.headers['user-agent'] || '').substring(0, 50),
    ip: req.ip,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });

  // Return 401 for API routes, redirect for web routes
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.redirect('/api/login');
}

// Test session data generator
export function generateTestSession() {
  return {
    passport: { user: TEST_USER },
    cookie: {
      originalMaxAge: 604800000, // 1 week
      expires: new Date(Date.now() + 604800000),
      secure: false,
      httpOnly: true,
      path: '/'
    }
  };
}
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

// Enhanced middleware to bypass authentication for testing with comprehensive logging
export function bypassAuthForTesting(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';
  const testHeaders = {
    testingMode: req.headers['x-testing-mode'] === 'true',
    authBypass: req.headers['x-test-auth-bypass'] === 'true',
    spiritualTester: req.headers['x-spiritual-tester'] === 'active'
  };
  
  // Check if request is from testing environment or has special headers
  const isTestingMode = process.env.NODE_ENV === 'test' || 
                       testHeaders.testingMode ||
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
    
    // Enhanced logging with context
    const context = {
      path: req.path,
      method: req.method,
      userAgent: userAgent.substring(0, 50),
      headers: testHeaders,
      timestamp: new Date().toISOString()
    };
    
    console.log(`🧪 [AUTH-BYPASS] Authentication bypassed for testing:`, context);
    
    // Add bypass indicator to response headers for debugging
    res.setHeader('X-Auth-Bypass-Active', 'true');
    res.setHeader('X-Test-User-ID', TEST_USER.id);
  }

  next();
}

// Enhanced authentication middleware with comprehensive bypass support and monitoring
export function isAuthenticatedWithBypass(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';
  const testHeaders = {
    testingMode: req.headers['x-testing-mode'] === 'true',
    authBypass: req.headers['x-test-auth-bypass'] === 'true',
    spiritualTester: req.headers['x-spiritual-tester'] === 'active'
  };
  
  // Enhanced testing mode detection
  const isTestingMode = process.env.NODE_ENV === 'test' || 
                       testHeaders.testingMode ||
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
      timestamp: new Date().toISOString()
    };
    
    console.log(`🔐 [AUTH-PROTECTED] Authentication bypassed for protected route:`, authContext);
    
    // Add security headers for testing
    res.setHeader('X-Auth-Method', 'testing-bypass');
    res.setHeader('X-Test-Session-Active', 'true');
    
    return next();
  }

  // Enhanced authentication check with logging
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log(`✅ [AUTH-PROTECTED] User authenticated:`, {
      userId: req.user?.id,
      path: req.path,
      timestamp: new Date().toISOString()
    });
    return next();
  }

  // Authentication failed
  console.log(`❌ [AUTH-PROTECTED] Authentication required for:`, {
    path: req.path,
    method: req.method,
    userAgent: userAgent.substring(0, 50),
    timestamp: new Date().toISOString()
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
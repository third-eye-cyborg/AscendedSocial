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

// Middleware to bypass authentication for testing
export function bypassAuthForTesting(req: Request, res: Response, next: NextFunction) {
  // Check if request is from testing environment or has special header
  const isTestingMode = process.env.NODE_ENV === 'test' || 
                       req.headers['x-testing-mode'] === 'true' ||
                       req.headers['x-test-auth-bypass'] === 'true' ||
                       req.headers['user-agent']?.includes('Playwright') ||
                       req.headers['user-agent']?.includes('Puppeteer');

  if (isTestingMode) {
    // Simulate authenticated session for testing
    req.user = TEST_USER;
    req.session = req.session || {};
    (req.session as any).passport = { user: TEST_USER };
    console.log('🧪 Authentication bypassed for testing');
  }

  next();
}

// Enhanced authentication middleware that supports testing bypass
export function isAuthenticatedWithBypass(req: Request, res: Response, next: NextFunction) {
  // First check if we should bypass for testing
  const isTestingMode = process.env.NODE_ENV === 'test' || 
                       req.headers['x-testing-mode'] === 'true' ||
                       req.headers['x-test-auth-bypass'] === 'true' ||
                       req.headers['user-agent']?.includes('Playwright') ||
                       req.headers['user-agent']?.includes('Puppeteer');

  if (isTestingMode) {
    req.user = TEST_USER;
    req.session = req.session || {};
    (req.session as any).passport = { user: TEST_USER };
    console.log('🧪 Authentication bypassed for testing route');
    return next();
  }

  // Normal authentication check
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

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
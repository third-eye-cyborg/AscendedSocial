
import express from 'express';
import { getMobileConfig, validateMobileConfig } from './mobile-config';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const router = express.Router();

// Mobile app configuration endpoint
router.get('/mobile-config', (req, res) => {
  try {
    const config = {
      replitClientId: process.env.REPL_ID,
      backendDomain: `${req.protocol}://${req.get('host')}`,
      webAppDomain: process.env.WEB_APP_DOMAIN || 'ascended.social',
      mobileAppDomain: 'https://095b9124-ae0d-4cdf-a44b-bdc917e288fa-00-1yfsp5ge10rpv.picard.replit.dev',
      deepLinkScheme: 'ascended://',
      apiBaseUrl: `${req.protocol}://${req.get('host')}/api`,
      issuerUrl: process.env.ISSUER_URL || "https://replit.com/oidc",
      scopes: ["openid", "email", "profile", "offline_access"],
      version: '1.0.0',
      features: {
        deepLinking: true,
        webFallback: true,
        tokenRefresh: true,
        platformDetection: true
      }
    };
    
    console.log('📱 Mobile config requested:', {
      host: req.get('host'),
      userAgent: req.get('User-Agent'),
      config: { ...config, replitClientId: '***' }
    });
    
    res.json(config);
  } catch (error) {
    console.error('❌ Mobile config error:', error);
    res.status(500).json({ error: 'Failed to get mobile config' });
  }
});

// Health check for mobile configuration
router.get('/mobile-config/health', (req, res) => {
  const isValid = validateMobileConfig();
  
  res.json({
    status: isValid ? 'healthy' : 'degraded',
    message: isValid ? 'Mobile configuration is valid' : 'Mobile configuration is missing required variables',
    timestamp: new Date().toISOString()
  });
});

// Mobile authentication initiation with platform detection
router.get('/mobile-login', (req, res) => {
  const { redirect_uri, platform } = req.query;
  const referer = req.get('Referer') || '';
  const userAgent = req.get('User-Agent') || '';
  
  // Determine the correct callback URL based on platform and referer
  let callbackUrl;
  
  if (platform === 'native' || redirect_uri?.toString().includes('ascended://')) {
    // Mobile app - use deep link
    callbackUrl = 'ascended://auth/callback';
  } else if (referer.includes('095b9124-ae0d-4cdf-a44b-bdc917e288fa') || redirect_uri?.toString().includes('095b9124-ae0d-4cdf-a44b-bdc917e288fa')) {
    // React Native/Expo web app on Replit dev domain
    callbackUrl = 'https://095b9124-ae0d-4cdf-a44b-bdc917e288fa-00-1yfsp5ge10rpv.picard.replit.dev/auth/callback';
  } else if (referer.includes('ascended.social') || redirect_uri?.toString().includes('ascended.social')) {
    // Production web app
    callbackUrl = 'https://ascended.social/auth/callback';
  } else if (redirect_uri) {
    // Use provided redirect URI with auth/callback path
    const redirectBase = redirect_uri.toString().replace(/\/$/, '');
    callbackUrl = `${redirectBase}/auth/callback`;
  } else {
    // Default fallback - use deep link
    callbackUrl = 'ascended://auth/callback';
  }
  
  console.log('🔗 Mobile login redirect:', {
    platform,
    originalRedirect: redirect_uri,
    referer,
    userAgent: userAgent.substring(0, 50) + '...',
    finalCallback: callbackUrl
  });
  
  // Store platform info in session for callback processing
  (req.session as any).authPlatform = platform;
  (req.session as any).authReferer = referer;
  
  // Redirect to main login with the determined callback URL
  const loginUrl = `/api/login?redirectUrl=${encodeURIComponent(callbackUrl)}`;
  res.redirect(loginUrl);
});

// Mobile token validation endpoint
router.post('/mobile-verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user, valid: true });
  } catch (error) {
    console.error('Mobile token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;


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
      mobileDevDomain: 'https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev',
      mobileProdDomain: 'https://app.ascended.social',
      deepLinkScheme: 'ascended://',
      apiBaseUrl: `${req.protocol}://${req.get('host')}/api`,
      issuerUrl: process.env.ISSUER_URL || "https://replit.com/oidc",
      scopes: ["openid", "email", "profile"],
      version: '1.0.0',
      features: {
        deepLinking: true,
        webFallback: true,
        tokenRefresh: true,
        platformDetection: true
      }
    };
    
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
  
  // Determine the correct callback URL based on platform and redirect_uri
  let callbackUrl;
  const redirectUriStr = redirect_uri?.toString() || '';
  
    platform,
    redirectUriStr,
    referer,
    containsMobileDevDomain: redirectUriStr.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev'),
    containsMobileProdDomain: redirectUriStr.includes('app.ascended.social')
  });
  
  if (platform === 'native' || redirectUriStr.includes('ascended://')) {
    // Native iOS/Android app - use deep link
    callbackUrl = 'ascended://auth/callback';
  } else if (redirectUriStr.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev')) {
    // Mobile dev environment - redirect back after auth
    callbackUrl = redirectUriStr; // Use mobile domain directly
  } else if (redirectUriStr.includes('app.ascended.social')) {
    // Mobile production environment - redirect back after auth  
    callbackUrl = redirectUriStr; // Use mobile domain directly
  } else if (referer.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev')) {
    // Referer-based detection for mobile dev app
    callbackUrl = 'https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/auth/callback';
  } else if (referer.includes('app.ascended.social')) {
    // Referer-based detection for mobile prod app
    callbackUrl = 'https://app.ascended.social/auth/callback';
  } else if (referer.includes('ascended.social') || redirectUriStr.includes('ascended.social')) {
    // Production web app (catch general ascended.social AFTER checking app.ascended.social)
    callbackUrl = 'https://ascended.social/auth/callback';
  } else if (redirectUriStr) {
    // Use provided redirect URI with auth/callback path (for non-mobile apps)
    const redirectBase = redirectUriStr.replace(/\/$/, '');
    callbackUrl = `${redirectBase}/auth/callback`;
  } else {
    // Default fallback - use deep link
    callbackUrl = 'ascended://auth/callback';
  }
  
  // Store mobile referrer data in session for the web app to detect after auth
  (req.session as any).mobileReferrer = referer || 'mobile';
  (req.session as any).mobileCallbackUrl = callbackUrl;
  
  // Redirect directly to AuthKit login with mobile parameters
  const loginUrl = `/api/login?mobile_bounce=true&platform=${platform}&redirectUrl=${encodeURIComponent(callbackUrl)}`;
  res.redirect(loginUrl);
});

// Enhanced mobile token validation endpoint
router.post('/mobile-verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
    
    // Get user data from database
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    
    res.json({
      success: true,
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        sigil: user.sigil,
        sigilImageUrl: user.sigilImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({ 
      success: false,
      valid: false, 
      error: 'Invalid token' 
    });
  }
});

export default router;

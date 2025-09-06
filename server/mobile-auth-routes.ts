
import express from 'express';
import { getMobileConfig, validateMobileConfig } from './mobile-config';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const router = express.Router();

// Mobile app configuration endpoint
router.get('/mobile-config', (req, res) => {
  const config = getMobileConfig();
  
  // Only return safe configuration data (no secrets)
  res.json({
    clientId: config.REPLIT_AUTH_CLIENT_ID,
    apiBaseUrl: config.API_BASE_URL,
    redirectUri: config.MOBILE_AUTH_REDIRECT_URI,
    deepLinkScheme: config.MOBILE_DEEP_LINK_SCHEME,
    issuerUrl: process.env.ISSUER_URL || "https://replit.com/oidc",
    scopes: ["openid", "email", "profile", "offline_access"],
    // React Native/Expo web app URL for mobile web redirects
    mobileWebUrl: 'https://095b9124-ae0d-4cdf-a44b-bdc917e288fa-00-1yfsp5ge10rpv.picard.replit.dev/'
  });
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

// Mobile authentication initiation with deep link support
router.get('/mobile-login', (req, res) => {
  const redirectUrl = req.query.redirectUrl as string || 'ascended://auth/callback';
  const loginUrl = `/api/login?redirectUrl=${encodeURIComponent(redirectUrl)}`;
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

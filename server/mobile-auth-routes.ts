
import express from 'express';
import { getMobileConfig, validateMobileConfig } from './mobile-config';

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
    scopes: ["openid", "email", "profile", "offline_access"]
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

export default router;

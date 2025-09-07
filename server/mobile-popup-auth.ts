import express from 'express';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const router = express.Router();

/**
 * Mobile Popup Authentication Routes
 * 
 * These routes handle cross-domain authentication for mobile apps using popup windows
 * and JWT tokens, bypassing Replit Auth's single-project domain limitations.
 */

// Popup authentication initiation
router.get('/mobile-popup', (req, res) => {
  const { origin } = req.query;
  
  console.log('🔄 Mobile popup auth request:', {
    origin,
    userAgent: req.get('User-Agent')?.substring(0, 50) + '...'
  });

  // Store origin in session for callback
  if (origin) {
    (req.session as any).mobileOrigin = origin.toString();
  }

  // Redirect to main auth with popup flag
  const redirectUrl = `/auth/popup-callback`;
  const authUrl = `/api/login?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  
  res.redirect(authUrl);
});

// Popup authentication callback
router.get('/popup-callback', (req, res) => {
  const user = req.user as any;
  const mobileOrigin = (req.session as any).mobileOrigin;

  console.log('📱 Popup auth callback:', {
    hasUser: !!user,
    mobileOrigin,
    userAgent: req.get('User-Agent')?.substring(0, 50) + '...'
  });

  if (!user) {
    // Authentication failed
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Failed</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .container { text-align: center; max-width: 400px; padding: 2rem; }
          .error { color: #fca5a5; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚫 Authentication Failed</h1>
          <p class="error">Unable to authenticate. Please try again.</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'AUTH_ERROR',
                message: 'Authentication failed'
              }, '*');
              window.close();
            }
          </script>
        </div>
      </body>
      </html>
    `);
  }

  // Generate JWT token for mobile app
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    },
    process.env.SESSION_SECRET!
  );

  console.log('✅ Mobile popup auth successful:', {
    userId: user.id,
    email: user.email,
    mobileOrigin
  });

  // Clear session data
  delete (req.session as any).mobileOrigin;

  // Send success page that posts message to parent
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authentication Successful</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .container { text-align: center; max-width: 400px; padding: 2rem; }
        .success { color: #86efac; margin-top: 1rem; }
        .loading { 
          width: 24px; 
          height: 24px; 
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 1rem auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Authentication Successful!</h1>
        <div class="loading"></div>
        <p class="success">Returning to your app...</p>
      </div>
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'AUTH_SUCCESS',
            token: '${token}'
          }, '${mobileOrigin || '*'}');
          
          setTimeout(() => window.close(), 1000);
        } else {
          setTimeout(() => window.location.href = '${mobileOrigin || '/'}', 2000);
        }
      </script>
    </body>
    </html>
  `);
});

// JWT token verification endpoint
router.post('/mobile-verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
    
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Invalid token format'
      });
    }

    // Get user from database to ensure they still exist
    const user = await storage.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'User no longer exists'
      });
    }

    res.json({
      success: true,
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || user.displayName,
        isPremium: user.isPremium || false
      }
    });

  } catch (error) {
    console.error('JWT verification error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Invalid token'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      valid: false,
      message: 'Server error during verification'
    });
  }
});

export default router;
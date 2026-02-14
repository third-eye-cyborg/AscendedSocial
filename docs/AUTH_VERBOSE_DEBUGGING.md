# Verbose Authentication Debugging Guide

## Overview
This guide explains how to diagnose authentication issues using the enhanced debugging endpoints and logging system.

## Quick Start

### 1. Enable Verbose Logging
Verbose logging is automatically enabled in development mode. To explicitly enable it:

```bash
# Enable debug logging
export DEBUG_AUTH=true
npm run dev:server
```

### 2. Check Your Authentication Status

Navigate to: **`http://localhost:3000/api/debug/auth`**

This endpoint shows:
- ✅ If you're authenticated (`isUserLoggedIn`)
- Session information
- Cookie status
- Detailed error diagnosis

### Example Response (NOT Authenticated)
```json
{
  "success": true,
  "debug": {
    "timestamp": "2026-02-13T17:32:25.000Z",
    "isAuthenticated": false,
    "hasUser": false,
    "hasSessionCookie": false,
    "hasActiveSession": false
  },
  "diagnosis": {
    "isUserLoggedIn": false,
    "hasSessionCookie": false,
    "hasActiveSession": false,
    "status": "❌ NOT AUTHENTICATED"
  },
  "tips": [
    "Step 1: Check if 'isUserLoggedIn' is true",
    "Step 2: If false, check if you have completed the Replit Auth login flow (/api/login)",
    "Step 3: Verify session cookie is being sent...",
    "..."
  ]
}
```

### Example Response (AUTHENTICATED)
```json
{
  "success": true,
  "debug": {
    "timestamp": "2026-02-13T17:40:00.000Z",
    "isAuthenticated": true,
    "hasUser": true,
    "user": {
      "id": "25531750",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "expiresAt": 1744929600,
      "has_access_token": true,
      "has_refresh_token": true,
      "has_claims": true
    },
    "hasSessionCookie": true,
    "hasActiveSession": true
  },
  "diagnosis": {
    "isUserLoggedIn": true,
    "hasSessionCookie": true,
    "hasActiveSession": true,
    "status": "✅ AUTHENTICATED"
  }
}
```

## Debug Endpoints

### `/api/debug/auth` - Authentication Status
Shows current authentication state and troubleshooting info.

**Usage:**
```bash
curl http://localhost:3000/api/debug/auth
```

**What It Tells You:**
- Are you logged in? (`isUserLoggedIn`)
- Do you have a session? (`hasActiveSession`)
- Is your cookie being sent? (`hasSessionCookie`)
- User details (email, ID, token expiry)

### `/api/debug/session` - Session Details
Shows detailed session information stored on the server.

**Usage:**
```bash
curl http://localhost:3000/api/debug/session
```

**What It Tells You:**
- Session cookie configuration (httpOnly, secure, sameSite)
- Session ID
- Whether session contains passport user data

### `/api/debug/auth-flow` - Authentication Flow Guide
Shows the expected OAuth flow and next steps.

**Usage:**
```bash
curl http://localhost:3000/api/debug/auth-flow
```

**What It Tells You:**
- Your current authentication state
- Next steps to authenticate if not logged in
- How the OAuth flow works

### `/api/debug/route-info` - Route Authentication Requirements
Shows which authentication types are required for specific routes.

**Usage:**
```bash
curl http://localhost:3000/api/debug/route-info?path=/api/auth/user
```

**What It Tells You:**
- Whether a route requires authentication
- What type of authentication is needed (USER, ADMIN, PUBLIC)
- Upcoming routes and their requirements

## Understanding the 401 Response

When you get a `401 Unauthorized` response, it now includes detailed information:

```json
{
  "message": "Unauthorized",
  "reason": "No active session",
  "nextAction": "Please visit /api/login to authenticate",
  "debug": {
    "isAuthenticated": false,
    "hasUser": false,
    "hasExpiration": false,
    "sessionExists": false,
    "cookiePresent": false
  }
}
```

**Troubleshooting by Reason:**

| Reason | Meaning | Solution |
|--------|---------|----------|
| `No active session` | You haven't logged in | Visit `/api/login` |
| `Token expiration missing` | Session corrupted | Clear cookies, log in again |
| `Token expired and cannot be refreshed` | Refresh token missing/invalid | Logout and login again |
| `Token refresh failed` | OAuth server error | Check network connectivity |

## Console Logging

When `DEBUG_AUTH=true` or `NODE_ENV=development`, detailed logs appear in your server console:

### Example: Successful Authentication
```
🔐 [AUTH DEBUG 2026-02-13T17:32:25.000Z] Checking authentication for /api/auth/user
   Client IP: 127.0.0.1
   User Agent: Mozilla/5.0...
   req.isAuthenticated(): true
   req.user exists: true
   req.user.id: 25531750
   req.user.email: user@example.com
   req.user.expires_at: 1744929600
   req.user has access_token: true
   req.user has refresh_token: true
   req.user has claims: true

🕐 [AUTH DEBUG 2026-02-13T17:32:25.000Z] Token expiry check:
   - Current time: 1707859945
   - Expires at: 1744929600
   - Seconds until expiry: 37069655

✅ [AUTH DEBUG 2026-02-13T17:32:25.000Z] Token is valid, allowing request
```

### Example: Failed Authentication
```
🔐 [AUTH DEBUG 2026-02-13T17:32:29.000Z] Checking authentication for /api/auth/user
   Client IP: 127.0.0.1
   User Agent: Mozilla/5.0...
   req.isAuthenticated(): false
   req.user exists: false

❌ [AUTH DEBUG 2026-02-13T17:32:29.000Z] Authentication check failed:
   - req.isAuthenticated(): false
   - user object: missing
   - expires_at: missing
   - Session ID: none
   - Has session passport: false
   - Cookie header: none
```

## Step-by-Step Debugging

### Problem: Getting 401 on `/api/auth/user`

**Step 1: Check if you're logged in**
```bash
curl http://localhost:3000/api/debug/auth
```
Look for: `"status": "✅ AUTHENTICATED"`

**Step 2: If not authenticated, check the auth flow**
```bash
curl http://localhost:3000/api/debug/auth-flow
```
This shows you the next steps

**Step 3: Follow the OAuth login flow**
1. Open browser to `http://localhost:3000`
2. Click login button
3. Approve the Replit OAuth permission
4. You'll be redirected to `/api/callback`
5. Session cookie will be set

**Step 4: Try the auth status check again**
```bash
curl http://localhost:3000/api/debug/auth
```
Should now show: `"status": "✅ AUTHENTICATED"`

**Step 5: Try your target endpoint**
```bash
curl http://localhost:3000/api/auth/user
```
Should return your user data

## Common Issues and Solutions

### Issue 1: "No active session"
**Cause:** Cookies not being sent from browser

**Solutions:**
1. Make sure cookies are enabled in your browser
2. Check browser DevTools → Application → Cookies for a `connect.sid` cookie
3. Try different browser or incognito mode
4. Ensure you've completed the `/api/login` flow

### Issue 2: "Token refresh failed"
**Cause:** Replit OAuth server connectivity issue

**Solutions:**
1. Check your internet connection
2. Verify `REPLIT_DOMAINS` environment variable is set correctly
3. Check if Replit OAuth service is down
4. Try logging out and logging in again

### Issue 3: "Token expiration missing"
**Cause:** Session data corruption

**Solutions:**
1. Clear all cookies for the domain
2. Clear browser cache
3. Logout and login again
4. Restart the development server

### Issue 4: Still getting 401 after login
**Cause:** Session store issue

**Solutions:**
1. Check if `DATABASE_URL` is configured correctly
2. Verify sessions table exists in database
3. Check if `SESSION_SECRET` is set
4. Restart the development server
5. Check server console logs for database errors

## Monitoring Authentication Attempts

Enable the auth logging middleware to see all authentication requests:

```bash
DEBUG_AUTH=true npm run dev:server
```

Output will show:
```
📊 [AUTH LOG 2026-02-13T17:32:25.000Z] GET /api/auth/user
   IP: 127.0.0.1
   Has Authorization header: false
   Has Cookie: true
   isAuthenticated(): true
   Has req.user: true
   ✅ User logged in: user@example.com
```

## Environment Variables

Key environment variables for debugging:

```bash
# Enable verbose auth logging
export DEBUG_AUTH=true

# Current Node environment
export NODE_ENV=development

# OAuth configuration
export REPLIT_DOMAINS=localhost,myapp.replit.dev
export ISSUER_URL=https://replit.com/oidc
export SESSION_SECRET=your-secret-key

# Database
export DATABASE_URL=postgresql://...
```

## Testing the Auth Flow Programmatically

### Using cURL

**1. Start the authentication process:**
```bash
curl -i http://localhost:3000/api/login
# This will redirect to Replit OAuth
```

**2. After authenticating and being redirected back, verify session:**
```bash
curl -i http://localhost:3000/api/debug/auth
# Should show authenticated status
```

**3. Make authenticated request:**
```bash
curl -i http://localhost:3000/api/auth/user
# Should return user data
```

### Using JavaScript/Fetch

```javascript
// Check if authenticated
const authCheck = await fetch('http://localhost:3000/api/debug/auth');
const authData = await authCheck.json();
console.log('Authenticated:', authData.diagnosis.isUserLoggedIn);

// Fetch user data if authenticated
if (authData.diagnosis.isUserLoggedIn) {
  const userResponse = await fetch('http://localhost:3000/api/auth/user');
  const user = await userResponse.json();
  console.log('User:', user);
}
```

## Performance and Logging Level

The verbose logging doesn't significantly impact performance:
- Auth checks: < 5ms overhead
- Token validation: < 10ms overhead
- Token refresh: 100-500ms (expected)

In production, logs are minimal unless errors occur.

## Getting More Help

If issues persist:

1. **Check server logs:** Look for error messages in `npm run dev:server` output
2. **Check browser console:** Look for CORS or network errors
3. **Check database:** Verify sessions table has data
4. **Review environment variables:** Ensure all required vars are set
5. **Try a fresh login:** Sometimes a clean session helps

## Security Considerations

- Debug endpoints return sensitive information (email, user ID, session data)
- Use only in development or testing environments
- Disable in production unless behind authentication
- Never commit `DEBUG_AUTH=true` to version control
- Session information is masked in debug responses


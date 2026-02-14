# Authentication Debugging Guide

## Overview
This guide explains how to use the enhanced authentication debugging features added to diagnose and troubleshoot authentication issues.

## Enabling Verbose Debugging

### Method 1: Environment Variable
Set the `DEBUG_AUTH` environment variable to enable verbose logging:

```bash
DEBUG_AUTH=true npm run dev:server
```

### Method 2: Manual in Development
In development mode (`NODE_ENV=development`), verbose logging is automatically enabled.

## What Gets Logged

### 1. **isAuthenticated Middleware** (`replitAuth.ts`)
When a request arrives at the `/api/auth/user` endpoint or any authenticated route:
- Whether `req.isAuthenticated()` returns true/false
- User object details (id, email, expiration time)
- Token expiry calculations
- Token refresh attempts and results

Example output:
```
🔐 [AUTH DEBUG 2026-02-13T17:32:25.000Z] Checking authentication for /api/auth/user
   Client IP: ::1
   User Agent: Mozilla/5.0...
   req.isAuthenticated(): true
   req.user exists: true
   req.user.id: user-123
   req.user.email: user@example.com
   req.user.expires_at: 1676286745
   req.user has access_token: true
   req.user has refresh_token: true

🕐 [AUTH DEBUG 2026-02-13T17:32:25.000Z] Token expiry check:
   - Current time: 1676286545
   - Expires at: 1676286745
   - Seconds until expiry: 200

✅ [AUTH DEBUG 2026-02-13T17:32:25.000Z] Token is valid, allowing request
```

### 2. **OAuth Callback** (`/api/callback`)
Logs the complete OAuth flow:
- Callback received with code and state
- Passport authentication results
- Session creation
- JWT token generation (for mobile)
- Mobile vs web authentication routing

Example output:
```
🔐 [AUTH CALLBACK 2026-02-13T17:32:25.000Z] Received OAuth callback
   Query params: code=wptZnWUmm3lE01ky6bshgbtL4lLCR8nerL2usE4pv_4, state=default
   From: https://myapp.replit.dev/api/login

🔐 [AUTH CALLBACK 2026-02-13T17:32:25.000Z] Passport authenticate callback:
   Error: none
   User returned: true
   Info: undefined

✅ [AUTH CALLBACK 2026-02-13T17:32:25.000Z] User authenticated: user-123 (user@example.com)
   Calling req.logIn...

✅ [AUTH CALLBACK 2026-02-13T17:32:25.000Z] Session created, user logged in
   Mobile auth: false, state: default
```

### 3. **User Verification** (`replitAuth.ts`)
Logs the verify callback during OAuth:
- Claims received from OIDC token
- User upsert in database
- Session creation

Example output:
```
👤 [UPSERT USER 2026-02-13T17:32:25.000Z] Upserting user from claims:
   Email: user@example.com
   Name: John Doe
   Profile image: true

✅ [UPSERT USER 2026-02-13T17:32:25.000Z] User upserted successfully: user-123

🔐 [VERIFY CALLBACK 2026-02-13T17:32:25.000Z] Passport verify function called
   Email from token: user@example.com
   Token expiry: 1676286745

✅ [VERIFY CALLBACK 2026-02-13T17:32:25.000Z] User session created: user-123
```

### 4. **Enhanced User Authentication Middleware** (`authenticationValidation.ts`)
Logs JWT token validation and Passport session checks:
- Authorization header presence
- JWT token parsing and verification
- Passport session validation
- Database user lookup
- Token expiry and refresh

Example output:
```
🔐 [ENHANCED AUTH 2026-02-13T17:32:25.000Z] Enhanced user authentication middleware for /api/posts

   Authorization header: missing
   Passport authentication found for: user@example.com
   User ID: user-123
   Has expires_at: true
   Token expires in: 200 seconds

✅ Token is valid, allowing request
```

## Debug Endpoints

### 1. **Authentication Debug Endpoint**
```
GET /api/debug/auth
```

Returns comprehensive authentication state information:
```json
{
  "success": true,
  "debug": {
    "timestamp": "2026-02-13T17:32:25.000Z",
    "path": "/api/auth/user",
    "method": "GET",
    "clientIP": "::1",
    "isAuthenticated": true,
    "hasUser": true,
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "access_token": "[REDACTED]",
      "refresh_token": "[REDACTED]"
    },
    "headers": {
      "authorization": "Bearer eyJhbGc...",
      "cookie": "present",
      "host": "localhost:3000"
    },
    "passport": {
      "initialized": true,
      "sessionPropertyName": "user"
    }
  },
  "tips": [
    "Check if req.isAuthenticated() returns true",
    "If hasUser is false, the session may not have been established",
    "Check the authorization header format: 'Bearer <token>'",
    "Verify the SESSION_SECRET environment variable matches between instances",
    "Check if the cookie is being sent from the client"
  ]
}
```

### 2. **Session Debug Endpoint**
```
GET /api/debug/session
```

Returns detailed session information:
```json
{
  "success": true,
  "session": {
    "timestamp": "2026-02-13T17:32:25.000Z",
    "sessionExists": true,
    "sessionID": "session-uuid-123",
    "sessionKeys": ["passport", "user", "cookie"],
    "sessionCookie": {
      "httpOnly": true,
      "secure": false,
      "sameSite": "lax",
      "maxAge": 604800000
    },
    "requestCookie": "present"
  }
}
```

## Common Authentication Failures

### Issue: 401 Unauthorized on `/api/auth/user`

**Debug Steps:**
1. Check `/api/debug/auth` output:
   - Is `isAuthenticated` true?
   - Is `hasUser` true?
   - Does the user object have an `id` and `email`?

2. Check `/api/debug/session` output:
   - Is `sessionExists` true?
   - Can you see the session cookie?

3. Check browser console and network tab:
   - Is the cookie being sent with requests?
   - Are there any CORS errors?

4. Check server logs:
   - Look for `[AUTH DEBUG]` entries
   - Check if session creation logs are present
   - Look for token expiry messages

### Issue: Session Not Persisting Across Requests

**Debug Steps:**
1. Verify `SESSION_SECRET` is set correctly
2. Check that `httpOnly` cookies are being sent
3. Verify the session store (PostgreSQL) is working:
   ```sql
   SELECT * FROM sessions;
   ```
4. Check cookie domain settings in `replitAuth.ts`

### Issue: Token Refresh Failing

**Debug Steps:**
1. Check the `[AUTH DEBUG]` logs for refresh attempts
2. Verify `ISSUER_URL` environment variable
3. Check if the refresh token is present in logs
4. Look for OIDC configuration errors

## Environment Variables for Debugging

```bash
# Enable verbose authentication logging
DEBUG_AUTH=true

# Standard node environment debug
DEBUG=ascended-social:* npm run dev:server

# Combination
DEBUG=* DEBUG_AUTH=true npm run dev:server
```

## Log Output Indicators

### Success Indicators ✅
- `✅ [AUTH DEBUG]` - Authentication succeeded
- `✅ [AUTH CALLBACK]` - OAuth callback successful
- `✅ [VERIFY CALLBACK]` - User verification succeeded
- `✅ Token is valid, allowing request`

### Warning Indicators ⚠️
- `⏳ [AUTH DEBUG]` - Token refresh in progress
- `🚫 [AUTH DEBUG]` - Authentication check failed
- `❌ [AUTH DEBUG]` - Token verification failed

### Info Indicators 🔐
- `🔐 [AUTH DEBUG]` - Authentication check initating
- `👤 [UPSERT USER]` - User being created/updated
- `🕐 [AUTH DEBUG]` - Token expiry calculation

## Production Considerations

⚠️ **Important:** Verbose debugging logs may contain sensitive information:
- Email addresses
- User IDs
- Authorization headers (partially redacted)
- Session information

In production, keep `DEBUG_AUTH=false` and only enable when investigating issues with proper security protocols.

## Troubleshooting Checklist

- [ ] Verify `SESSION_SECRET` is set and consistent
- [ ] Check that database session store is initialized
- [ ] Verify `REPLIT_DOMAINS` includes your domain
- [ ] Check REPLIT OIDC configuration
- [ ] Verify OAuth callback URL matches configuration
- [ ] Check browser cookies are enabled
- [ ] Verify clock sync between client and server
- [ ] Check for CORS issues in network tab
- [ ] Verify port forwarding if using SSH connections
- [ ] Test with `/api/debug/auth` endpoint

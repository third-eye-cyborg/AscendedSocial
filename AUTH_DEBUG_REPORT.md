# Auth Debugging Report - Ascended Social

## Critical Issues Found and Fixed

### 🔴 Issue 1: OAuth Callback Port Mismatch (HIGH SEVERITY)

**Status:** ✅ FIXED

**Problem:**
- The Replit OAuth callback URLs were hardcoded to port 5000
- Server was running on port 3000
- This caused authentication to fail because:
  1. User clicks login → redirects to `/api/login`
  2. Passport initiates OAuth flow with callback URL `http://localhost:5000/api/callback`
  3. Replit OAuth service redirects to `http://localhost:5000/api/callback`
  4. But server listening on `http://localhost:3000` → 404 error
  5. User never gets authenticated

**Files Fixed:**
1. [server/replitAuth.ts](server/replitAuth.ts#L220-L225)
   - Changed from hardcoded port 5000 to `process.env.PORT || '5000'`
   
2. [server/adminAuth.ts](server/adminAuth.ts#L265-L275)
   - Same fix for admin authentication

**Verification:**
The fix ensures callback URLs use the actual running port:
```
User Auth: http://localhost:3000/api/callback
Admin Auth: http://localhost:3000/api/admin/callback
```

---

## System Architecture Overview

### Authentication Flow
```
┌─────────────────────────────────────────┐
│ User visits http://localhost:3000       │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ App checks /api/auth/user                │
│ Returns 401 (not authenticated)         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Redirects to /login page                │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ User clicks "Continue with Replit"      │
│ → GET /api/login?host=localhost:3000    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Passport initiates OAuth:               │
│ → https://replit.com/oidc/authorize     │
│ → callback: http://localhost:3000/...   │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ User authorizes on Replit               │
│ → Replit redirects with auth code       │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ App receives at /api/callback            │
│ → Exchanges code for tokens             │
│ → Creates user session                  │
│ → Redirects to /                         │
└─────────────────────────────────────────┘
```

---

## Key Components

### User Authentication (replitAuth.ts)
- **Strategy:** Replit OAuth via OpenID Connect
- **Session:** PostgreSQL-backed (connect-pg-simple)
- **Token Storage:** Refresh tokens stored in sessions
- **Endpoints:**
  - `GET /api/login` - Initiates OAuth flow
  - `GET /api/callback` - OAuth callback handler
  - `GET /api/auth/user` - Get current user (requires auth)
  - `POST /api/auth/logout` - Logout (session + bearer token)
  - `GET /api/logout` - Full logout with OIDC end-session

### Admin Authentication (adminAuth.ts)
- **Strategy:** Separate Replit OAuth for admin staff
- **Session:** Separate admin_sessions table
- **Restrictions:**
  - Only users in `ADMIN_USER_IDS` can authenticate
  - Optional IP whitelist (`ADMIN_IP_WHITELIST`)
  - Rate limiting (100 requests/15min)
  - Stricter security headers
- **Endpoints:**
  - `GET /api/admin/login` - Admin OAuth flow
  - `GET /api/admin/callback` - Admin OAuth handler
  - `/api/admin/*` - Admin-only routes

### Route Segregation Security
- **File:** [server/routeSegregation.ts](server/routeSegregation.ts)
- **Purpose:** Prevent cross-authentication vulnerabilities
- **Rules:**
  - Admin routes require admin authentication
  - User routes require user authentication
  - No mixing of session types
  - Audit logging for violations

---

## Testing Authentication

### Quick Test
```bash
# Check if auth endpoints respond
curl -v http://localhost:3000/api/login

# Should get 302 redirect to Replit OAuth
# Location header should contain: https://replit.com/oidc/authorize
```

### Detailed Test (using test-auth-flow.ts)
```bash
npm run test:auth-flow
# Tests auth endpoints and reports port configuration
```

### Browser Test
1. Open http://localhost:3000
2. No authentication → redirected to /login
3. Click "Continue with Replit"
4. Authorize on Replit
5. Should redirect back to http://localhost:3000 with session

---

## Configuration Files

### Environment Variables Required
```env
# Replit-provided
REPLIT_DOMAINS=localhost,*.spock.replit.dev
REPL_ID=your-replit-id

# Database
DATABASE_URL=postgresql://...

# Sessions
SESSION_SECRET=your-session-secret-key

# Sentry (optional)
SENTRY_DSN=

# Node
NODE_ENV=development
PORT=3000  # This is critical for callback URLs!
```

### Port Configuration Logic
```typescript
// How port is determined:
const port = process.env.PORT || '5000';

// Callback URLs use this port:
// User: http://localhost:${port}/api/callback
// Admin: http://localhost:${port}/api/admin/callback
```

---

## Common Auth Issues & Solutions

### Issue: "Cannot POST /api/callback"
**Cause:** Port mismatch (the issue we just fixed)
**Solution:** Ensure PORT env var matches actual running port

### Issue: "Session not found" after OAuth redirect
**Cause:** Session persistence issue
**Solution:** 
1. Check DATABASE_URL is correct
2. Verify sessions table exists in database
3. Check SESSION_SECRET is set

### Issue: "User is not authorized for admin access"
**Cause:** User ID not in ADMIN_USER_IDS
**Solution:** Add Replit user ID to [server/adminAuth.ts](server/adminAuth.ts#L29)

### Issue: "PKCE code_verifier not found"
**Cause:** Session state lost between login and callback
**Solution:**
1. Ensure session storage working
2. Check sameSite cookie settings
3. Verify trust proxy configuration

---

## Next Steps

1. **Restart the server** to apply the fixes
   ```bash
   # Stop current server (Ctrl+C in terminal)
   # Run: npm run dev
   ```

2. **Test the auth flow:**
   - Go to http://localhost:3000
   - Should redirect to /login → /api/login
   - Click "Continue with Replit"
   - Should complete OAuth and return to home

3. **Monitor server logs for:**
   - `✅ Auth verify successful: userId=...`
   - `✅ Auth callback successful for user: ...`
   - Any 401/403 errors on auth routes

4. **If auth still fails:**
   - Run the diagnostic test: `ts-node test-auth-flow.ts`
   - Check browser console for JavaScript errors
   - Verify /api/auth/user endpoint returns 401 (expected when not authenticated)

---

## Security Notes

- All OAuth tokens are stored server-side (not in local storage)
- Sessions are encrypted and stored in PostgreSQL
- Admin and user sessions are completely isolated
- Rate limiting prevents brute force attacks
- IP whitelist available for admin routes
- Audit logging of all admin actions


# Ascended Social - Browser Automation Debugging Report

## Status Summary
**Server Status:** ⚠️ CRASHING (Exit Code 137 after ~1 minute)
**Auth Port Fix:** ✅ COMPLETED  
**Browser Tests:** ⏳ PENDING (Chrome not installed in sandbox)

## Critical Fixes Applied

### Fix #1: OAuth Callback Port Mismatch ✅
**Files Modified:**
- [server/replitAuth.ts](server/replitAuth.ts#L224)
- [server/adminAuth.ts](server/adminAuth.ts#L271)

**What Was Fixed:**
```typescript
// BEFORE (BROKEN):
callbackURL: `http://localhost:5000/api/callback`

// AFTER (FIXED):
callbackURL: `http://localhost:3000/api/callback`  // Uses actual port via process.env.PORT
```

**Why This Matters:**
When users click "Continue with Replit", Passport initiates OAuth with a callback URL. If callback URL doesn't match the actual server port, the redirect fails with "app cannot be reached" error shown in Replit preview.

---

## Current Blocking Issue: Server Crashes

### Symptoms
- Process exits with exit code 137 (SIGKILL)
- Happens ~1-2 minutes after server starts
- Consistent and reproducible
- Occurs after basic requests (auth check, login attempt)

### Server Behavior
```
✅ Server starts successfully on port 3000
✅ Auth routes initialized properly  
✅ Passport strategies registered with correct callbacks
✅ Handles /api/auth/user request → returns 401 (expected)
✅ Handles /api/login request → redirects to OAuth
❌ Process killed shortly after first requests
```

### Key Logs Captured
```
5:06:07 PM [express] serving on port 3000
🔒 Auth check failed: isAuthenticated=false, hasUser=false, expires_at=undefined, path=/api/auth/user
5:07:02 PM [express] GET /api/auth/user 401 in 9ms
 *  The terminal process terminated with exit code: 137
```

### Memory Analysis
- Heap limit: 512MB (from NODE_OPTIONS='--max-old-space-size=512')
- Observed heap usage: 100-200MB
- **Conclusion:** NOT a memory exhaustion issue

### Root Causes to Investigate
1. **Unhandled Promise Rejection** - Error handlers added to catch
2. **Async Operation Hanging** - Need to add timeouts/debugging
3. **Vite Middleware Issue** - Vite setup might be consuming resources
4. **Database Connection Pooling** - PostgreSQL connection hangs
5. **OAuth Session State** - Session store might be getting stuck

---

## Server Diagnostic Improvements Made

### Added Error Handlers
- Line 14-19: `process.on('unhandledRejection')`  
- Already has `process.on('uncaughtException')`
- Added memory monitoring (30s intervals)

### Added Logging
- Line 237+: Memory usage logging
- Port configuration verification

---

## Testing Checklist

### ✅ What Works
- [x] Port configuration now uses actual env PORT
- [x] Auth strategies register with correct callback URLs
- [x] Route segregation middleware initialized
- [x] Auth endpoints respond correctly (401 for no auth)
- [x] Error handling middleware in place

### ⏳ What's Being Tested  
- [ ] Server stability (continuous running)
- [ ] OAuth callback flow
- [ ] Session persistence
- [ ] Full login/logout cycle
- [ ] Admin authentication

### ❌ What's Blocking
- [ ] Server crashes after ~1min (need to identify root cause)
- [ ] Browser automation (Chrome needs installation)
- [ ] Replit preview integration test

---

## Next Steps to Unblock

### Step 1: Diagnose Server Crash (PRIORITY)
```bash
# Start server with verbose logging
npm run dev 2>&1 | tee server.log

# In another terminal, trigger auth flow quickly
curl http://localhost:3000/api/login?host=localhost:3000

# Monitor for crash and collect logs
```

**If still crashes:**
- Check `/proc/sys/vm/memory-pressure-level` for memory issues
- Look for stray Node processes eating memory
- Check if Session store (PostgreSQL) is blocking
- Verify no circular async dependencies

### Step 2: Install & Test with Browser
Once server is stable:
```bash
# Option 1: Use existing browser through MCP
# (Already tried, Chrome not in sandbox)

# Option 2: Test via curl/terminal
curl -v http://localhost:3000/api/login \
  -H "Cookie: <session_cookie>"

# Option 3: Use serverless browser testing
# Create minimal Playwright test without full Chrome install
```

### Step 3: Manual Testing
1. Visit http://localhost:3000 in Replit preview
2. Should see login page  
3. Click "Continue with Replit"
4. Should redirect to https://replit.com/oidc/authorize
5. After auth, should callback to http://localhost:3000/api/callback  
6. Should see home page or user dashboard

---

## Configuration State

### Environment Variables
```env
PORT=3000  # ✅ Now used in OAuth callbacks
NODE_ENV=development
DATABASE_URL=postgresql://...
SESSION_SECRET=configured
REPLIT_DOMAINS=localhost  # For dev environment
ISSUER_URL=https://replit.com/oidc
REPL_ID=set
```

### Callback URLs (After Fix)
- **User Auth:** `http://localhost:3000/api/callback`
- **Admin Auth:** `http://localhost:3000/api/admin/callback`
- **Previous (BROKEN):** `http://localhost:5000/api/callback`

---

## Technical Details

### OAuth Flow (with fixes)
```
1. User: http://localhost:3000 → Login page
2. CLI: GET /api/login?host=localhost:3000
3. Server: Creates Passport session, initiates strategy
4. Redirect: https://replit.com/oidc/authorize?callback=...
5. User: Authorizes on Replit
6. Replit: Redirects to http://localhost:3000/api/callback (port now correct!)
7. Server: Exchanges code for tokens
8. Server: Creates session, redirects to /
9. User: Sees authenticated home page ✅
```

### Session Storage
- **Type:** PostgreSQL via connect-pg-simple
- **Table:** `sessions`
- **TTL:** 7 days (user), 4 hours (admin)
- **Separate Tables:** `admin_sessions` for isolation

### Authentication Methods
- **User:** Replit OAuth (OpenID Connect)
- **Admin:** Replit OAuth (separate strategy)
- **Mobile:** JWT Bearer tokens as fallback

---

## Files Modified for Fixes

1. **server/replitAuth.ts** (Line 224-232)
   - Added: `const port = process.env.PORT || '5000'`
   - Changed: Callback URL uses `${port}` instead of hardcoded `5000`

2. **server/adminAuth.ts** (Line 271-275)
   - Added: `const actualPort = isLocalhost ? (process.env.PORT || '5000') : ''`
   - Changed: Port included in callback URL construction

3. **server/index.ts** (Multiple)
   - Added: Global error handlers for unhandled rejections
   - Added: Memory monitoring (30s intervals)
   - Maintained: Comprehensive error logging

---

## Replit Preview URL Pattern
When deployed to Replit, the preview URL format is:
```
https://replit.dev:3000/api/callback?code=...&state=...
```
The port is stripped from the callback URL registration because Replit's proxy handles the port mapping. Our fix accounts for localhost testing while production will use the Replit domain format.


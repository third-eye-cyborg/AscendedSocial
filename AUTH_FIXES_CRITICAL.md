# Critical Auth Fixes Applied - Ascended Social

## Issues Found & Fixed

### ✅ FIXED: Port Mismatch in Auth Strategies
**Location:** `server/replitAuth.ts` line 220-225
**Fix:** Changed hardcoded port 5000 to use `process.env.PORT || '5000'`

### ✅ FIXED: Admin Auth Port Mismatch  
**Location:** `server/adminAuth.ts` line 265-275
**Fix:** Changed hardcoded port to dynamically use actual PORT variable

### ✅ FIXED: HMR WebSocket Errors
**Location:** `vite.config.ts`
**Fix:** Disabled HMR overlay and configured proper HMR settings

**Location:** `server/vite.ts`
**Fix:** Disabled HMR on Replit/production environments

### ⚠️ CURRENTLY FIXING: Protocol Mismatch on Replit Preview
**Location:** `server/replitAuth.ts` line 200-227 (ensureStrategyForHost function)
**Issue:** When on Replit preview (HTTPS), the auth strategy was using wrong protocol
**Fix:** Updated to detect x-forwarded-proto header and always use HTTPS for non-localhost

## Remaining Work
1. Update calls to `ensureStrategyForHost` at lines 329 & 424 to pass `req` parameter
2. Restart server and test login flow
3. Verify Replit OAuth callback works correctly

## Critical Code to Apply

### Line 329 in replitAuth.ts (in /api/login route):
```typescript
const strategyName = ensureStrategyForHost(hostWithPort, req.protocol, req);
```

### Line 424 in replitAuth.ts (in /api/callback route):
```typescript
const strategyName = ensureStrategyForHost(hostWithPort, req.protocol, req);
```

## Test URLs
- Local: http://localhost:3000/login
- Replit Preview: https://6aaaa561-0065-42b7-9a43-fa52389738ae-00-123k4q64cdvhw.spock.replit.dev/login

## Expected Behavior After Fix
1. User clicks "Continue with Replit"
2. Gets redirected to https://replit.com/oidc/authorize with callback URL: `https://[replit-domain]/api/callback`
3. Replit OAuth service recognizes the callback URL (no 400 error)
4. User completes auth
5. Returns to app authenticated

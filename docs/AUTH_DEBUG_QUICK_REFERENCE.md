# Authentication Debug Quick Reference

## One-Minute Diagnostic

```bash
# 1. Check if you're logged in
curl http://localhost:3000/api/debug/auth | jq '.diagnosis'

# Expected output if logged in:
# {
#   "isUserLoggedIn": true,
#   "status": "✅ AUTHENTICATED"
# }

# Expected output if NOT logged in:
# {
#   "isUserLoggedIn": false,
#   "status": "❌ NOT AUTHENTICATED"
# }
```

## Quick Fixes by Error

| Error | Quick Fix |
|-------|-----------|
| `401 Unauthorized` | Visit http://localhost:3000/api/debug/auth-flow |
| `No active session` | Click login button, then try again |
| `Token expired` | Logout and login again |
| `Token refresh failed` | Restart server, check internet connection |
| Getting 401 after login | Clear cookies, logout, login again |

## Debug Endpoints Cheat Sheet

| Endpoint | Purpose | Use When |
|----------|---------|----------|
| `/api/debug/auth` | Check login status | Debugging 401 errors |
| `/api/debug/session` | View session details | Session not persisting |
| `/api/debug/auth-flow` | See OAuth flow guide | Need to understand login flow |
| `/api/debug/route-info?path=/api/auth/user` | Check route requirements | Unsure which routes need auth |

## Enable Verbose Logging

```bash
# In terminal where you're running the server:
DEBUG_AUTH=true npm run dev:server

# Then watch the console logs when making requests
```

## Browser Network Debugging

1. Open DevTools (F12)
2. Go to Network tab
3. Click on `/api/auth/user` request
4. Check Response tab for `debug` field
5. Check if request has Cookie header

## Common Reasons for 401

```json
// Not logged in
{
  "reason": "No active session",
  "nextAction": "Please visit /api/login to authenticate"
}

// Token expired
{
  "reason": "Token expired and cannot be refreshed",
  "nextAction": "Please visit /api/login to authenticate again"
}

// Refresh failed
{
  "reason": "Token refresh failed",
  "error": "[specific error]"
}
```

## Environment Variables Needed

```bash
SESSION_SECRET=any-random-string
DATABASE_URL=postgresql://...
REPLIT_DOMAINS=localhost,myapp.replit.dev
NODE_ENV=development
```

## Session Cookie Info

- **Name:** `connect.sid`
- **httpOnly:** true (cannot access from JavaScript)
- **sameSite:** lax (sent with same-site cross-origin requests)
- **Secure:** auto (true on HTTPS, false on HTTP localhost)

Check in DevTools → Application → Cookies


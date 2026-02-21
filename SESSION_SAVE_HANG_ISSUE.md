# CRITICAL FINDING: Session Save Hanging Issue

## Root Cause Hypothesis
The server crash (exit 137) is likely caused by **req.session.save() callback never firing**, causing requests to hang indefinitely until killed.

### Evidence in Code

#### replitAuth.ts Lines 523-531 (Potential Hang Point)
```typescript
req.session.save((saveErr) => {
  if (saveErr) console.error('Session save error:', saveErr);
  return res.redirect(callbackUrl);  // This redirect never happens if save hangs!
});
```

If `req.session.save()` hangs (e.g., PostgreSQL connection pool exhausted), the callback never fires and the response is never sent. Request hangs until Node process timeout or system kills it.

### Same Pattern in Multiple Places
- Line 523-526: Mobile auth session save
- Line 531-534: Web auth session save  
- Line 569: Logout session destroy

### Database Connection Issue
The session store uses PostgreSQL via connect-pg-simple configured in [server/replitAuth.ts](server/replitAuth.ts#L30-L40):
```typescript
const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  ttl: sessionTtl,
  tableName: "sessions",
});
```

If DATABASE_URL connection pool exhausts or has issues:
- Session save operations timeout
- Requests hang forever
- Node process eventually killed by system (exit 137)

## Solution

### Add Timeout to Session Save
Replace:
```typescript
req.session.save((saveErr) => {
  if (saveErr) console.error('Session save error:', saveErr);
  return res.redirect(callbackUrl);
});
```

With:
```typescript
const saveTimeout = setTimeout(() => {
  console.error('⚠️ Session save timeout - force redirecting');
  return res.redirect(callbackUrl);
}, 5000);

req.session.save((saveErr) => {
  clearTimeout(saveTimeout);
  if (saveErr) console.error('Session save error:', saveErr);
  return res.redirect(callbackUrl);
});
```

### Verify Database Connection
Check if DATABASE_URL is correct and connection pool has available connections.

### Alternative: Use res.redirect() Instead of session.save()
Express-session will auto-save the session if modified. So you might not need explicit session.save().

## Files to Fix
1. server/replitAuth.ts - Lines 523, 531, 569 (session.save calls)
2. server/adminAuth.ts - Similar lines (session.save calls)

## How to Verify Fix Works
After implementing timeouts:
- npm run dev
- Trigger login manually
- Watch for logs showing session save operations
- Server should stay running > 5 minutes consistently
- If "Session save timeout" appears in logs, then that's the issue

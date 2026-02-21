# ASCENDED SOCIAL AUTH FIX - QUICK REFERENCE

## ✅ FIXES APPLIED TO DATE

### 1. Port Mismatch in OAuth Callbacks (FIXED)
**server/replitAuth.ts line 224:**
```typescript
const port = process.env.PORT || '5000';
callbackURL: `http://localhost:${port}/api/callback`,
```
**server/adminAuth.ts line 271:**
```typescript
const actualPort = isLocalhost ? (process.env.PORT || '5000') : '';
const port = isLocalhost ? `:${actualPort}` : '';
```

## 🔴 BLOCKING ISSUE - SERVER CRASHES (Exit Code 137)

### ROOT CAUSE IDENTIFIED
**Session Save Hanging** - req.session.save() callback never fires, requests hang until killed

### AFFECTED LINES
- server/replitAuth.ts: Lines 523-526, 531-534, 569
- server/adminAuth.ts: Similar lines

### FIX NEEDED
Wrap session.save() calls with timeout to prevent infinite hangs:
```typescript
const saveTimeout = setTimeout(() => {
  console.error('Session save timeout - force redirecting');
  res.redirect(targetUrl);
}, 5000);

req.session.save((err) => {
  clearTimeout(saveTimeout);
  if (!res.headersSent) {
    res.redirect(targetUrl);
  }
});
```

## 📋 BROWSER TEST STATUS
- Port 3000 fixed ✅
- Auth endpoints work ✅  
- Session save hangs ❌ (FIX ABOVE)
- Browser tests blocked until server stable ❌

## NEXT IMMEDIATE STEPS
1. Apply session save timeout fix
2. Restart server - should run >5 min without crash 
3. Then test with browser automation

## CRITICAL FILES
- [server/replitAuth.ts](server/replitAuth.ts) - USER AUTH
- [server/adminAuth.ts](server/adminAuth.ts) - ADMIN AUTH
- SESSION_SAVE_HANG_ISSUE.md - Detailed root cause analysis

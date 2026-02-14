# Replit Auth Setup Guide

## Issue Fixed
The missing `REPLIT_DOMAINS` environment variable has been added to your `.env` file.

## Current Configuration

### Environment Variables (.env)
```
REPLIT_DOMAINS="ascended.social,dev.ascended.social,app.ascended.social,f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev"
```

### OAuth Callback URLs
Your Replit OAuth application MUST have these callback URLs registered:

1. **Production**: `https://ascended.social/api/callback`
2. **Dev**: `https://dev.ascended.social/api/callback`
3. **App**: `https://app.ascended.social/api/callback`
4. **Replit Dev**: `https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api/callback`
5. **Localhost** (auto-added in dev): `http://localhost:3000/api/callback`

## How to Configure Replit OAuth Application

1. **Go to Replit Account Settings**
   - Visit: https://replit.com/account
   - Click on "Authentication" or "OAuth Apps"

2. **Find Your OAuth Application**
   - Look for the app with `REPL_ID` matching your `process.env.REPL_ID`
   - Or create a new OAuth app if needed

3. **Add Redirect URIs**
   - Add ALL the callback URLs listed above
   - Make sure each URL ends with `/api/callback`
   - **Important**: The URLs must match EXACTLY (including protocol, domain, and path)

4. **Copy Credentials to Replit Secrets**
   - Copy your `REPL_ID` (Client ID)
   - These should be automatically available if you're using the "Log in with Replit" integration
   - If not, add them as Replit Secrets

## Testing the Setup

### 1. Enable Debug Mode
```bash
# Add to your Replit Secrets or .env (already set for development)
DEBUG_AUTH=true
```

### 2. Restart Your Server
```bash
npm run dev
```

### 3. Test the Auth Flow
1. Visit your app: `https://your-replit-url.replit.dev`
2. Click "Login" or visit `/login`
3. You should be redirected to Replit's OAuth page
4. After authorizing, you should be redirected back to your app
5. Check the server logs for detailed debug information

### 4. Check Debug Endpoints
With `DEBUG_AUTH=true`, you can visit:
- `/api/debug/auth` - Check authentication status
- `/api/debug/session` - View session information
- `/api/debug/auth-flow` - See the auth flow guide

## Common Issues

### Issue: "invalid_redirect_uri" error
**Solution**: The callback URL in your OAuth app settings doesn't match the one being used. Check:
1. Protocol (http vs https)
2. Domain (exact match)
3. Path (must be `/api/callback`)

### Issue: Auth succeeds but session not created
**Solution**: Check your session store (PostgreSQL):
```sql
SELECT * FROM sessions LIMIT 10;
```

### Issue: Redirect loops
**Solution**: Clear your browser cookies and try again:
1. Open DevTools (F12)
2. Application → Cookies → Clear all
3. Try logging in again

### Issue: "REPLIT_DOMAINS not provided" error
**Solution**: Already fixed! The variable is now in your `.env` file.

## Environment-Specific Configuration

### Development (Replit Dev)
- Domain: `f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev`
- Callback: `https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api/callback`

### Production
- Domain: `ascended.social` (or your custom domain)
- Callback: `https://ascended.social/api/callback`

## Next Steps

1. **Verify OAuth App Settings** in Replit dashboard
2. **Restart your server** to apply the new environment variables
3. **Test the login flow** on your Replit dev URL
4. **Check the logs** for any remaining issues

## Need Help?

If you're still having issues:
1. Check the server logs for detailed error messages
2. Verify all callback URLs are registered in your OAuth app
3. Make sure `REPL_ID` is available (should be automatic with Replit integration)
4. Try clearing browser cookies and attempting auth again

---

**Files Modified:**
- `.env` - Added `REPLIT_DOMAINS` configuration
- `server/replitAuth.ts` - Improved error handling and logging

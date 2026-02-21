# CRITICAL: Replit OAuth App Configuration Required

## The 400 Error Means Callback URL Mismatch

The OAuth server (Replit) is rejecting the request because the `redirect_uri` parameter in the authorization request doesn't match the callback URLs you've registered in your Replit OAuth app settings.

## What You Need to Register

Go to your Replit OAuth app settings (https://replit.com/account/settings/apps) and register these callback URLs:

### For Local Development:
```
http://localhost:3000/api/callback
```

### For Replit Preview:
```
https://6aaaa561-0065-42b7-9a43-fa52389738ae-00-123k4q64cdvhw.spock.replit.dev/api/callback
```

### For Production Domains:
```
https://ascended.social/api/callback
https://dev.ascended.social/api/callback
https://app.ascended.social/api/callback
```

## How to Add Them

1. Go to https://replit.com/account/settings
2. Navigate to "Apps" or "OAuth Applications" section
3. Find your app (REPL_ID: f9f72fa6-d1fb-425c-b9c8-6acf959c3a51)
4. Add ALL the callback URLs listed above  
5. Save changes

## Why This is Required

OAuth 2.0 security requires that:
- The `redirect_uri` in the authorization request
- EXACTLY matches one of the registered callback URLs
- Including protocol (http vs https), domain, port, and path

If they don't match → 400 Bad Request

## After Registering

Once you've added the callback URLs to your Replit OAuth app settings:
1. Refresh/restart your dev server
2. Try login again
3. Should work without 400 error

## Alternative: Use Replit's Auto-Discovery

If you're using Replit's OIDC discovery (which you are), it should automatically register the callback URLs. But sometimes you need to manually configure them in the Replit dashboard.

## Quick Check

Run this to see what callback URL is being sent:
```bash
# Start server and watch logs
npm run dev

# Then access http://localhost:3000/login
# Look for log: "🔑 Login using strategy: ..."
# It will show which callback URL is being used
```

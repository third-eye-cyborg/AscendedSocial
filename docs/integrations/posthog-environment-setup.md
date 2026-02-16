# PostHog Environment Variables Configuration

## Required Environment Variables for Ascended Social

### PostHog Analytics Configuration

These environment variables must be configured in **Replit Secrets** or your local `.env.local` file.

---

## Production Configuration

### PostHog API Keys

```bash
# PostHog Project API Key
# Used for both client and server-side tracking
POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB

# PostHog Host URL
# Default: https://app.posthog.com
POSTHOG_HOST=https://app.posthog.com

# Client-side PostHog Configuration (Vite-prefixed)
# These are exposed to the browser via import.meta.env
VITE_POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
VITE_POSTHOG_HOST=https://app.posthog.com
```

---

## How to Configure in Replit

### Step 1: Open Replit Secrets

1. Open your Replit project for Ascended Social
2. Click on **Tools** in the left sidebar
3. Search for "Secrets" and open the Secrets tool
4. Click "+ New Secret" to add each variable

### Step 2: Add Each Secret

Add these key-value pairs:

| Key | Value | Notes |
|-----|-------|-------|
| `POSTHOG_API_KEY` | `phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB` | Server-side tracking |
| `POSTHOG_HOST` | `https://app.posthog.com` | PostHog instance URL |
| `VITE_POSTHOG_API_KEY` | `phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB` | Client-side tracking |
| `VITE_POSTHOG_HOST` | `https://app.posthog.com` | Client PostHog URL |

### Step 3: Restart Application

After adding secrets:
```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

The application will automatically load the secrets from Replit.

---

## Local Development Setup

### Option 1: Create `.env.local` file

```bash
# Create .env.local in project root
touch .env.local
```

Add the following content:

```bash
# PostHog Analytics
POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
POSTHOG_HOST=https://app.posthog.com
VITE_POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
VITE_POSTHOG_HOST=https://app.posthog.com
```

**Important:** `.env.local` is in `.gitignore` and will NOT be committed to version control.

### Option 2: Use `.env` file

Alternatively, you can use `.env` file (also gitignored):

```bash
cp .env_example .env
# Edit .env and add the PostHog keys above
```

---

## Verification

### Client-Side Verification

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open browser console (F12)

3. Look for initialization message:
   ```
   ✅ PostHog client analytics initialized with privacy protection
   ```

4. Run this in console:
   ```javascript
   console.log(import.meta.env.VITE_POSTHOG_API_KEY);
   // Should output: phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
   ```

### Server-Side Verification

1. Check server console output:
   ```
   ✅ PostHog server analytics initialized
   ```

2. In server code, verify:
   ```javascript
   console.log('PostHog configured:', !!process.env.POSTHOG_API_KEY);
   // Should output: PostHog configured: true
   ```

### Test Event Capture

Run this in browser console:

```javascript
// Import PostHog
const posthog = window.posthog;

// Capture test event
posthog.capture('test_event', {
  test: true,
  timestamp: new Date().toISOString()
});

console.log('Test event sent to PostHog');
```

Check PostHog dashboard at https://app.posthog.com/project/122488/events to see the event.

---

## Environment Variable Details

### PostHog API Key (`POSTHOG_API_KEY`)

- **Type:** Project API Token
- **Format:** `phc_` followed by 43 alphanumeric characters
- **Scope:** Server-side tracking
- **Security:** Keep secret, never commit to git
- **Where to find:** PostHog Dashboard → Project Settings → API Keys

**Example:**
```
phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
```

### PostHog Host (`POSTHOG_HOST`)

- **Type:** URL
- **Default:** `https://app.posthog.com`
- **Purpose:** PostHog instance location
- **Self-hosted:** If using self-hosted PostHog, change to your instance URL

**Example:**
```
https://app.posthog.com
```

### Vite PostHog Variables

Variables prefixed with `VITE_` are:
- Exposed to the browser
- Accessible via `import.meta.env.VITE_*`
- Bundled into client JavaScript
- **Security Note:** Don't put sensitive secrets here

**Usage in Code:**
```typescript
// ✅ Correct - using VITE_ prefix
const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;

// ❌ Wrong - won't work in browser
const apiKey = process.env.POSTHOG_API_KEY;
```

---

## Project Information

### PostHog Organization Details

- **Organization Name:** Third Eye Cyborg
- **Organization ID:** `0194b522-eca9-0000-1bd4-87f3c600a8d4`
- **Projects:**
  - **Ascended Social** - ID: 122488 (active)
  - TEC-Head - ID: 149495
  - Flaresmith - ID: 253475

### PostHog Dashboard Links

- **Main Dashboard:** https://app.posthog.com/project/122488
- **Events:** https://app.posthog.com/project/122488/events
- **Insights:** https://app.posthog.com/project/122488/insights
- **Feature Flags:** https://app.posthog.com/project/122488/feature_flags
- **Settings:** https://app.posthog.com/project/122488/settings

---

## Security Best Practices

### ✅ Do's

- Store API keys in Replit Secrets
- Use `.env.local` for local development
- Add `.env.local` and `.env` to `.gitignore`
- Rotate API keys if compromised
- Use environment-specific keys (dev vs prod)
- Document which keys are required

### ❌ Don'ts

- Never commit API keys to Git
- Don't hardcode keys in source code
- Don't share keys in chat or email
- Don't use production keys in development
- Don't expose server-side keys to client

---

## Troubleshooting

### Issue: PostHog not initializing

**Symptoms:**
- No initialization message in console
- Events not appearing in dashboard

**Solutions:**

1. **Check environment variables:**
   ```bash
   # In Replit shell
   echo $POSTHOG_API_KEY
   echo $VITE_POSTHOG_API_KEY
   ```

2. **Verify in browser:**
   ```javascript
   console.log(import.meta.env.VITE_POSTHOG_API_KEY);
   ```

3. **Check for typos:**
   - Variable name: `POSTHOG_API_KEY` (not `POSTHOG_KEY`)
   - Prefix: `VITE_` for client-side (not `VITE_PUBLIC_`)

4. **Restart development server:**
   ```bash
   # Environment changes require restart
   npm run dev
   ```

### Issue: API Key Invalid

**Symptoms:**
- `401 Unauthorized` errors
- "Invalid API key" message

**Solutions:**

1. **Verify API key format:**
   - Should start with `phc_`
   - Should be 46 characters total
   - No spaces or extra characters

2. **Check PostHog dashboard:**
   - Go to Settings → API Keys
   - Verify key exists and is active
   - Copy key directly from dashboard

3. **Regenerate key if needed:**
   - PostHog Dashboard → Settings → API Keys
   - Click "Regenerate" on Project API Key
   - Update all environment variables

### Issue: Client events not tracked

**Symptoms:**
- Server events work
- Client events don't appear

**Solutions:**

1. **Check VITE_ prefix:**
   ```bash
   # Must have VITE_ prefix for client
   VITE_POSTHOG_API_KEY=phc_...
   ```

2. **Rebuild client:**
   ```bash
   # Environment variables are bundled at build time
   npm run build
   npm run dev
   ```

3. **Check consent manager:**
   ```javascript
   // Verify analytics consent
   console.log(consentManager.hasAnalyticsConsent());
   ```

---

## Additional Configuration

### Development vs Production

For different environments:

```bash
# Development (optional)
POSTHOG_API_KEY=phc_DEV_KEY_HERE
VITE_POSTHOG_API_KEY=phc_DEV_KEY_HERE

# Production (required)
POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
VITE_POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
```

### Self-Hosted PostHog

If using self-hosted PostHog:

```bash
POSTHOG_HOST=https://your-posthog-instance.com
VITE_POSTHOG_HOST=https://your-posthog-instance.com
```

---

## Complete Environment File

Here's the complete `.env.local` template with all PostHog variables:

```bash
# =================================
# PostHog Analytics Configuration
# =================================

# Server-side tracking
POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
POSTHOG_HOST=https://app.posthog.com

# Client-side tracking (exposed to browser)
VITE_POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
VITE_POSTHOG_HOST=https://app.posthog.com

# =================================
# Other Ascended Social Variables
# =================================
# See .env_example for complete list
```

---

## Related Documentation

- [PostHog + ClickUp + Postman Integration Guide](./posthog-clickup-postman-integration.md)
- [PostHog Analytics Documentation](../../client/src/lib/analytics.ts)
- [Server Analytics Service](../../server/analytics.ts)
- [Environment Variables Overview](../../.env_example)
- [Privacy & Consent Management](../../client/src/lib/consent.ts)

---

*Last Updated: February 8, 2026*  
*Owner: Third Eye Cyborg LLC*  
*Project: Ascended Social*

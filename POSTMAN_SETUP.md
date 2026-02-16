# Postman Environment Setup - Ascended Social

This directory contains Postman environment files for testing the Ascended Social API.

## 🎯 NEW: GUI Walkthrough Available!

**👉 [Click here for detailed GUI instructions with visual diagrams](./POSTMAN_GUI_WALKTHROUGH.md)**

The walkthrough includes:
- Step-by-step screenshots and diagrams
- How to import environments through Postman UI
- How to inject secrets via the GUI
- Getting AUTH_TOKEN for testing
- Troubleshooting common issues

## 📁 Available Environments

1. **`postman-environment-dev.json`** - DEV (localhost:5000)
2. **`postman-environment-prod.json`** - PROD (live production)

## 🚀 Quick Start

### 1. Import Environments into Postman

**⚡ Fast Import: All variables are imported automatically from the JSON file!**

1. Open Postman Desktop or Web
2. Click **Environments** in the left sidebar
3. Click **Import** button
4. Select the environment file(s) you need:
   - `postman-environment-dev.json` (Development) - imports all 31 variables
   - `postman-environment-prod.json` (Production) - imports all 16 variables
5. Click **Import**
6. ✅ Done! All variables are now in Postman - you just need to fill secret values

**Need help?** See the [detailed GUI walkthrough](./POSTMAN_GUI_WALKTHROUGH.md)

### 2. Configure Secrets

After importing, you need to inject your actual secret values:

1. Select the imported environment
2. Click **Edit** (pencil icon)
3. Fill in the empty `CURRENT VALUE` fields for secrets:

**⚠️ IMPORTANT:** Always put secrets in **CURRENT VALUE** (local only), never in **INITIAL VALUE** (syncs to cloud)

#### Required Secrets for Development

| Variable | Where to Get It | Required? |
|----------|----------------|-----------|
| `DATABASE_URL` | Replit Database or Neon Console | ✅ Yes |
| `SESSION_SECRET` | Generate with `openssl rand -hex 32` | ✅ Yes |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) | ✅ Yes |
| `AUTH_TOKEN` | Login to app, get from browser DevTools | For authenticated requests |
| `ADMIN_TOKEN` | Same as AUTH_TOKEN, but for admin user | For admin endpoints |
| `POSTHOG_API_TOKEN` | [PostHog Settings](https://app.posthog.com/settings) | For analytics testing |
| `BUILDER_API_KEY` | [Builder.io Account](https://builder.io/account/organization) | For CMS features |
| `FIGMA_ACCESS_TOKEN` | [Figma Settings](https://www.figma.com/developers/api#access-tokens) | For design integration |
| `NOTION_INTEGRATION_SECRET` | [Notion Integrations](https://www.notion.so/my-integrations) | For content sync |
| `CLOUDFLARE_API_TOKEN` | [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) | For CDN/D1 database |
| `SENTRY_DSN` | [Sentry Project Settings](https://sentry.io/settings/) | For error tracking |

### 3. Activate Environment

1. In Postman, use the environment dropdown (top right)
2. Select the environment you want to use
3. All requests will now use variables from that environment

## 🔐 Security Best Practices

### DO NOT:
- ❌ Commit environments with secrets to version control
- ❌ Share production secrets in team workspace
- ❌ Use production tokens in development
- ❌ Store secrets in INITIAL VALUE (visible to team)

### DO:
- ✅ Store secrets only in CURRENT VALUE (local only)
- ✅ Use different API keys per environment
- ✅ Rotate secrets regularly
- ✅ Use Replit Secrets or `.env.local` for local development
- ✅ Keep production environment file in a secure vault

## 📝 Environment Variables Reference

### Base URLs
- `BASE_URL` - Backend server base URL
- `API_BASE_URL` - Full API path (includes `/api`)
- `WEB_URL` - Frontend application URL

### Authentication
- `AUTH_TOKEN` - Bearer token for user authentication
- `ADMIN_TOKEN` - Token for admin-level operations
- `SESSION_SECRET` - JWT signing secret
- `REPL_ID` - Replit OIDC application ID
- `ISSUER_URL` - Replit OIDC issuer

### Database
- `DATABASE_URL` - PostgreSQL connection string (Neon/Replit)

### AI & Spiritual Features
- `OPENAI_API_KEY` - Powers chakra analysis, oracle readings, sigil generation

### Analytics & Monitoring
- `POSTHOG_API_TOKEN` - Analytics tracking
- `POSTHOG_HOST` - PostHog instance URL
- `POSTHOG_PROJECT_ID` - Project identifier
- `SENTRY_DSN` - Error tracking

### Third-Party Integrations
- `BUILDER_API_KEY` - Visual CMS
- `WORKOS_API_KEY` / `WORKOS_CLIENT_ID` - Enterprise SSO
- `FIGMA_ACCESS_TOKEN` - Design integration
- `NOTION_INTEGRATION_SECRET` - Content sync
- `POLAR_WEBHOOK_SECRET` - Payment webhooks
- `ONESIGNAL_APP_ID` / `ONESIGNAL_API_KEY` - Push notifications
- `TURNSTILE_SECRET_KEY` - Bot protection

### Cloudflare
- `CLOUDFLARE_ACCOUNT_ID` - Account identifier
- `CLOUDFLARE_API_TOKEN` - API access
- `CLOUDFLARE_D1_DATABASE_ID` - Edge database ID

### Testing Variables
- `TEST_USER_ID` - Auto-generated test user ID
- `TEST_USER_EMAIL` - Auto-generated test email
- `NODE_ENV` - Environment name (development/production)

## 🔄 Getting AUTH_TOKEN

To get a valid `AUTH_TOKEN` for making authenticated requests:

### Method 1: Browser DevTools
1. Login to Ascended Social in your browser
2. Open DevTools (F12)
3. Go to **Application** → **Cookies** or **Local Storage**
4. Find the session token or JWT
5. Copy and paste into Postman environment

### Method 2: Postman Auth Request
1. Create a POST request to `{{BASE_URL}}/api/auth/login`
2. Send credentials in request body
3. Copy token from response
4. Set as `AUTH_TOKEN` variable

### Method 3: Use Pre-request Script
Add to your collection's pre-request script:
```javascript
// Auto-login if no token exists
if (!pm.environment.get("AUTH_TOKEN")) {
  pm.sendRequest({
    url: pm.environment.get("BASE_URL") + "/api/auth/login",
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        email: pm.environment.get("TEST_USER_EMAIL"),
        password: "your-test-password"
      })
    }
  }, (err, res) => {
    if (!err) {
      pm.environment.set("AUTH_TOKEN", res.json().token);
    }
  });
}
```

## 📦 Import Postman Collection

Along with the environment, import the API collection:

1. Import `docs/integrations/postman-posthog-collection.json`
2. This contains pre-configured requests for PostHog integration
3. Expand with your own requests for all Ascended Social endpoints

## 🏗️ Main API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout

### Posts (Spiritual Content)
- `GET /api/posts` - List posts
- `POST /api/posts` - Create post (with chakra analysis)
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Oracle & Spiritual Features
- `POST /api/oracle/daily-reading` - Generate daily oracle reading
- `POST /api/oracle/tarot-reading` - Generate tarot reading
- `POST /api/oracle/sigil` - Generate user sigil
- `POST /api/oracle/spirit` - Generate spirit animal

### Admin
- `GET /api/admin/analytics` - Admin analytics dashboard
- `GET /api/admin/users` - Manage users
- `GET /api/admin/posts` - Moderate posts
- `GET /api/admin/reports` - Review reports
- `PATCH /api/admin/users/:id/status` - Update user status

### File Upload
- `POST /api/upload-profile-image` - Upload profile image
- `POST /api/objects/upload` - Upload media files
- `GET /objects/:objectPath` - Retrieve uploaded files

## 🧪 Testing Workflow

1. **Select Environment** - Choose dev or prod
2. **Inject Secrets** - Fill in required API keys
3. **Authenticate** - Get AUTH_TOKEN
4. **Test Endpoints** - Use collection requests
5. **Monitor** - Check PostHog/Sentry for events

## 🔧 Troubleshooting

### "Unauthorized" Error
- Check `AUTH_TOKEN` is set and valid
- Token may have expired - re-login
- Verify you're using correct environment

### "Missing API Key" Error
- Check the specific secret is filled in CURRENT VALUE
- Verify the key is valid (not expired)
- Ensure no extra spaces in the key

### Variables Not Resolving
- Check environment is selected (top right dropdown)
- Verify variable names match (case-sensitive)
- Use `{{VARIABLE_NAME}}` syntax in requests

### CORS Errors
- Ensure `BASE_URL` matches your running server
- Check server CORS configuration
- Try using Postman Desktop instead of Web

## 📚 Additional Resources

- [Postman Environments Documentation](https://learning.postman.com/docs/sending-requests/managing-environments/)
- [PostHog Integration Guide](./docs/integrations/README.md)
- [Security & Secrets Guide](./docs/developer/security-and-secrets.md)
- [API Documentation](./docs/api/)

## 🤝 Contributing

When adding new endpoints that require secrets:

1. Add the variable to all environment files
2. Document it in this README
3. Add to `.env.example` if needed
4. Update the API collection with example requests

---

**Remember:** Keep your secrets secret! Never commit filled environment files to version control.

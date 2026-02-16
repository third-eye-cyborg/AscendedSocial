# Ascended Social - Postman Workspace Quick Reference

## 📁 Workspace Information

| Property | Value |
|----------|-------|
| **Workspace Name** | Ascended Social |
| **Team** | third-eye-cyborg |
| **Project** | AscendedSocial |
| **Repository** | https://github.com/third-eye-cyborg/AscendedSocial |
| **Branch** | main |
| **License** | Third Eye Cyborg LLC |

## 🌐 Environment URLs

| Environment | Base URL | Description |
|-------------|----------|-------------|
| **DEV** | `http://localhost:5000` | Local development on Replit |
| **PROD** | `https://ascended.social` | Live production (restricted) |

## 📦 Files in This Workspace

### Environment Files
- **[postman-environment-dev.json](./postman-environment-dev.json)** - Development environment (31 variables)
- **[postman-environment-prod.json](./postman-environment-prod.json)** - Production environment (16 variables)

### Collection Files
- **[postman-posthog-collection.json](./docs/integrations/postman-posthog-collection.json)** - PostHog analytics testing

### Documentation
- **[POSTMAN_GUI_WALKTHROUGH.md](./POSTMAN_GUI_WALKTHROUGH.md)** - Visual step-by-step guide
- **[POSTMAN_SETUP.md](./POSTMAN_SETUP.md)** - Complete reference documentation
- **[POSTMAN_MCP_GUIDE.md](./POSTMAN_MCP_GUIDE.md)** - MCP integration guide

### Workspace Configuration
- **[.postman-workspace.json](./.postman-workspace.json)** - Workspace metadata and settings

## 🔑 Required Secrets (DEV)

| Secret | Source | Priority |
|--------|--------|----------|
| `DATABASE_URL` | Replit Database | 🔴 Required |
| `SESSION_SECRET` | Generate with `openssl rand -hex 32` | 🔴 Required |
| `OPENAI_API_KEY` | platform.openai.com/api-keys | 🔴 Required |
| `POSTHOG_API_TOKEN` | app.posthog.com/settings | 🟡 Analytics |
| `BUILDER_API_KEY` | builder.io/account | 🟡 CMS |
| `AUTH_TOKEN` | Get after login | 🟢 Testing |

## 🚀 Quick Setup (3 Steps)

### 1. Import to Postman (⚡ All variables imported automatically!)
```
Postman → Environments → Import → Select both .json files
```
✅ This imports ALL 31 variables (DEV) or 16 variables (PROD) at once!

### 2. Fill Secrets (Only empty fields need values)
```
Click environment → Edit → Fill CURRENT VALUE for secrets → Save
```
⏭️ Only fill the empty secret fields - everything else is already configured!

### 3. Activate
```
Top right dropdown → Select "Ascended Social - DEV (localhost)"
```

## 🔐 Security Reminders

- ✅ **DO**: Store secrets in CURRENT VALUE (local only)
- ✅ **DO**: Use different secrets for DEV vs PROD
- ✅ **DO**: Keep production access restricted
- ❌ **DON'T**: Put secrets in INITIAL VALUE (syncs to cloud!)
- ❌ **DON'T**: Commit filled environment files to git
- ❌ **DON'T**: Share production credentials

## 🛠️ Integrations in This Workspace

| Service | Purpose | Config Variable |
|---------|---------|----------------|
| **PostHog** | Analytics & tracking | `POSTHOG_API_TOKEN` |
| **Neon/Replit** | PostgreSQL database | `DATABASE_URL` |
| **OpenAI** | AI features (chakra, oracle, sigil) | `OPENAI_API_KEY` |
| **Builder.io** | Visual CMS | `BUILDER_API_KEY` |
| **Sentry** | Error monitoring | `SENTRY_DSN` |
| **Cloudflare** | CDN & edge computing | `CLOUDFLARE_API_TOKEN` |
| **Figma** | Design integration | `FIGMA_ACCESS_TOKEN` |
| **Notion** | Content sync | `NOTION_INTEGRATION_SECRET` |
| **OneSignal** | Push notifications | `ONESIGNAL_API_KEY` |

## 📊 Available API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout

### Spiritual Features
- `POST /api/posts` - Create post with chakra analysis
- `POST /api/oracle/daily-reading` - Generate oracle reading
- `POST /api/oracle/tarot-reading` - Tarot reading
- `POST /api/oracle/sigil` - Generate user sigil

### Admin
- `GET /api/admin/analytics` - Analytics dashboard
- `GET /api/admin/users` - User management
- `PATCH /api/admin/users/:id/status` - Update user status

## 🔗 Quick Links

- **Replit Workspace**: View in Replit IDE
- **GitHub**: [third-eye-cyborg/AscendedSocial](https://github.com/third-eye-cyborg/AscendedSocial)
- **Live Site**: [ascended.social](https://ascended.social)
- **Postman Docs**: [learning.postman.com](https://learning.postman.com/)

## 🆘 Need Help?

1. **GUI Setup**: See [POSTMAN_GUI_WALKTHROUGH.md](./POSTMAN_GUI_WALKTHROUGH.md)
2. **API Reference**: See [POSTMAN_SETUP.md](./POSTMAN_SETUP.md)
3. **Automation**: See [POSTMAN_MCP_GUIDE.md](./POSTMAN_MCP_GUIDE.md)
4. **Issues**: Check GitHub Issues or contact team

---

**Last Updated**: February 10, 2026  
**Workspace Version**: 1.0.0  
**Maintained by**: third-eye-cyborg team

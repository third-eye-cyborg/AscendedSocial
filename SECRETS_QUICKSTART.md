# 🔄 Secrets Management Quick Start

**Goal**: Sync your secrets from `.env` → GitHub Environments → Postman

## 📋 What You Have Now

Your `.env` file contains **DEV secrets** for local development.

## 🚀 Complete Workflow (5 Minutes)

### Step 1: Install Dependencies
```bash
npm run secrets:install
```

### Step 2: Get GitHub Token
1. Go to: https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Select scopes: `repo` and `workflow`
4. Click **Generate token**
5. Copy the token

### Step 3: Set Environment Variable
```bash
export GITHUB_TOKEN=your_token_here
```

### Step 4: Sync DEV Secrets
```bash
# Your current .env has dev secrets
npm run secrets:sync:dev
```

✅ This creates a `dev` environment in GitHub with 37 secrets!

### Step 5: Switch to PROD Secrets

```bash
# Backup current (dev) .env
cp .env .env.dev.backup

# Edit .env and replace with PROD values
nano .env

# Sync PROD secrets to GitHub
npm run secrets:sync:prod
```

✅ This creates a `prod` environment in GitHub with 37 secrets!

### Step 6: Restore DEV Secrets
```bash
# Restore dev secrets for local development
cp .env.dev.backup .env
```

### Step 7: Update Postman (Optional)
The environments are already created in Postman! Just fill in the secret values:

1. Open Postman → Environments
2. Click **"Ascended Social - DEV (localhost)"**
3. Fill CURRENT VALUE for secrets (use .env.dev.backup as reference)
4. Click **"Ascended Social - PROD (live)"**
5. Fill CURRENT VALUE for prod secrets
6. Save both

## ✅ Verification

### Check GitHub
https://github.com/third-eye-cyborg/AscendedSocial/settings/environments

You should see:
- ✅ `dev` environment (37 secrets)
- ✅ `prod` environment (37 secrets)

### Check Postman
Open Postman → Environments

You should see:
- ✅ Ascended Social - DEV (localhost)
- ✅ Ascended Social - PROD (live)

## 🔑 Secret Names Reference

All these get synced automatically:

**Database**: `DATABASE_URL`, `PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`

**Auth**: `SESSION_SECRET`

**APIs**: `OPENAI_API_KEY`, `BUILDER_API_KEY`, `FIGMA_ACCESS_TOKEN`, `SENTRY_DSN`

**Cloudflare**: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_D1_DATABASE_ID`, + 5 more

**Analytics**: `POSTHOG_API_KEY`, `POSTHOG_HOST`

**Security**: `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY`, `VITE_TURNSTILE_SITE_KEY`

**Testing**: `CHROMATIC_PROJECT_TOKEN`, `PLAYWRIGHT_PROJECT_TOKEN`, `CYPRESS_PROJECT_TOKEN`

**Notifications**: `ONESIGNAL_APP_ID`, `ONESIGNAL_API_KEY`

**Storage**: `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, + 2 more

**Total**: 37 secrets synced automatically!

## 🛠️ Commands Reference

```bash
# Sync dev secrets from .env to GitHub
npm run secrets:sync:dev

# Sync prod secrets from .env to GitHub  
npm run secrets:sync:prod

# Or use the script directly
node scripts/sync-github-secrets.js dev
node scripts/sync-github-secrets.js prod

# Quick bash script
./scripts/sync-secrets-quick.sh dev
./scripts/sync-secrets-quick.sh prod
```

## 📚 Full Documentation

See [docs/GITHUB_SECRETS_SYNC.md](../docs/GITHUB_SECRETS_SYNC.md) for:
- Detailed explanations
- Troubleshooting
- Using secrets in GitHub Actions
- Security best practices
- Advanced workflows

## 🆘 Troubleshooting

### Error: "GITHUB_TOKEN not set"
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### Error: "Resource not accessible"
Your token needs `repo` and `workflow` scopes. Generate a new one.

### Need to update secrets?
Just edit `.env` and run the sync command again!

---

**Ready?** Start with Step 1 above! 🚀

# GitHub Environments & Secrets Sync Guide

This guide explains how to sync your secrets from `.env` to GitHub environments, which then allows you to easily sync them with Postman.

## 📋 Overview

**Workflow:**
```
.env (local) → GitHub Environments (dev/prod) → Postman Environments
```

**Why?**
- ✅ Single source of truth for secrets
- ✅ Easy to switch between dev and prod
- ✅ GitHub environments provide secure secret storage
- ✅ Can use in GitHub Actions workflows
- ✅ Sync to Postman environments programmatically

## 🚀 Quick Start

### Prerequisites

1. **GitHub Personal Access Token** with these permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   
   Create one at: https://github.com/settings/tokens

2. **Install dependencies:**
   ```bash
   npm install @octokit/rest libsodium-wrappers dotenv
   ```

### Step 1: Sync DEV Secrets

Your current `.env` file contains DEV secrets.

```bash
# Set your GitHub token
export GITHUB_TOKEN=your_github_token_here

# Sync dev secrets from .env to GitHub
node scripts/sync-github-secrets.js dev
```

This will:
- ✅ Create a `dev` environment in GitHub
- ✅ Upload all 37 secrets from your `.env` file
- ✅ Encrypt secrets using GitHub's public key

### Step 2: Switch to PROD Secrets

1. **Backup your current .env** (dev secrets):
   ```bash
   cp .env .env.dev.backup
   ```

2. **Replace .env with your PROD secrets**:
   - Edit `.env` file
   - Replace dev values with production values
   - Save the file

3. **Sync PROD secrets to GitHub**:
   ```bash
   node scripts/sync-github-secrets.js prod
   ```

4. **Restore DEV secrets** (optional):
   ```bash
   cp .env.dev.backup .env
   ```

### Step 3: Verify in GitHub

Go to: https://github.com/third-eye-cyborg/AscendedSocial/settings/environments

You should see:
- ✅ `dev` environment with 37 secrets
- ✅ `prod` environment with 37 secrets

## 📦 Secrets That Get Synced

The script syncs these secrets from `.env`:

### Database (Neon/Replit)
- `DATABASE_URL`
- `PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`

### Authentication
- `SESSION_SECRET`

### AI & Services
- `OPENAI_API_KEY`
- `BUILDER_API_KEY`
- `FIGMA_ACCESS_TOKEN`
- `FIGMA_FILE_KEY`

### Cloudflare
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_IMAGES_API_KEY`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_WORKERS_API_KEY`
- `CLOUDFLARE_AUD_TAG`
- `CLOUDFLARE_TEAM_DOMAIN`

### Bot Protection
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_SITE_KEY`
- `VITE_TURNSTILE_SITE_KEY`

### Analytics & Monitoring
- `POSTHOG_API_KEY`
- `POSTHOG_HOST`
- `SENTRY_DSN`

### Testing
- `CHROMATIC_PROJECT_TOKEN`
- `PLAYWRIGHT_PROJECT_TOKEN`
- `CYPRESS_PROJECT_TOKEN`

### Notifications
- `ONESIGNAL_APP_ID`
- `ONESIGNAL_API_KEY`

### Object Storage
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
- `PUBLIC_OBJECT_SEARCH_PATHS`
- `PRIVATE_OBJECT_DIR`

## 🔄 Syncing GitHub → Postman

Once secrets are in GitHub environments, you can sync them to Postman:

### Option 1: Manual Sync (Recommended for First Time)

1. Go to GitHub environment: https://github.com/third-eye-cyborg/AscendedSocial/settings/environments
2. View secret names (values are hidden)
3. In Postman:
   - Open environment (DEV or PROD)
   - Fill in CURRENT VALUE for each secret
   - Match the secret names from GitHub
   - Click Save

### Option 2: GitHub Actions → Postman API (Advanced)

Create a workflow that:
1. Reads secrets from GitHub environment
2. Uses Postman API to update environment variables
3. Triggered on secret changes or manually

See: [POSTMAN_MCP_GUIDE.md](../POSTMAN_MCP_GUIDE.md) for Postman API examples

## 🔐 Security Best Practices

### DO:
- ✅ Keep `.env` file out of version control (already in .gitignore)
- ✅ Use different secrets for dev and prod
- ✅ Rotate secrets regularly
- ✅ Use GitHub environments for access control
- ✅ Backup your `.env` files securely (encrypted)
- ✅ Use CURRENT VALUE in Postman (never INITIAL VALUE)

### DON'T:
- ❌ Commit `.env` files to git
- ❌ Use production secrets in development
- ❌ Share your GITHUB_TOKEN
- ❌ Push secrets to public repositories
- ❌ Store secrets in code or comments

## 🛠️ Troubleshooting

### Error: "GITHUB_TOKEN environment variable not set"
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### Error: "Resource not accessible by personal access token"
Your token needs `repo` and `workflow` scopes. Create a new token with these permissions.

### Error: "Not Found"
Check that the repository name is correct in the script:
- `REPO_OWNER = 'third-eye-cyborg'`
- `REPO_NAME = 'AscendedSocial'`

### Some secrets not syncing?
Check that they exist in your `.env` file and are not commented out.

## 📊 Using GitHub Secrets in Actions

Once synced, you can use these secrets in GitHub Actions:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: prod  # or dev
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy with secrets
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
        run: |
          # Your deployment script
          npm run deploy
```

## 🔄 Updating Secrets

When you need to update secrets:

1. **Update `.env` file** with new values
2. **Run sync script again**:
   ```bash
   node scripts/sync-github-secrets.js dev
   # or
   node scripts/sync-github-secrets.js prod
   ```
3. **Update Postman** environments if needed

## 📚 Related Documentation

- [POSTMAN_SETUP.md](../POSTMAN_SETUP.md) - Postman environment setup
- [POSTMAN_GUI_WALKTHROUGH.md](../POSTMAN_GUI_WALKTHROUGH.md) - Visual guide
- [POSTMAN_MCP_GUIDE.md](../POSTMAN_MCP_GUIDE.md) - Programmatic access
- [GitHub Environments Docs](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)

## 🎯 Complete Workflow Example

```bash
# 1. Start with DEV secrets in .env
cp .env .env.dev.backup

# 2. Sync DEV secrets to GitHub
export GITHUB_TOKEN=your_token
node scripts/sync-github-secrets.js dev

# 3. Switch to PROD secrets
# Edit .env with production values
nano .env

# 4. Sync PROD secrets to GitHub
node scripts/sync-github-secrets.js prod

# 5. Restore DEV secrets for local development
cp .env.dev.backup .env

# 6. Update Postman environments
#    - Go to Postman → Environments
#    - Fill in secrets from GitHub (or from your backup files)
#    - Save both DEV and PROD environments

# 7. Verify everything works
#    - Check GitHub: https://github.com/third-eye-cyborg/AscendedSocial/settings/environments
#    - Check Postman: Select environment and test API calls
```

## ✅ Checklist

Before deploying to production:

- [ ] DEV secrets synced to GitHub `dev` environment
- [ ] PROD secrets synced to GitHub `prod` environment
- [ ] Postman DEV environment updated with correct secrets
- [ ] Postman PROD environment updated with correct secrets
- [ ] `.env` file contains DEV secrets (for local development)
- [ ] Production `.env` backup stored securely
- [ ] GitHub token secured and not committed
- [ ] All secrets tested in both environments

---

**Need help?** Check the [POSTMAN_WORKSPACE_REFERENCE.md](../POSTMAN_WORKSPACE_REFERENCE.md) for quick reference.

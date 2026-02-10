# Ascended Social - Spiritual Social Media Platform

A privacy-first spiritual social media platform built with React, Express, and PostgreSQL.

> **Postman Workspace**: This project includes pre-configured Postman environments for the Ascended Social API. See [.postman-workspace.json](.postman-workspace.json) for workspace configuration.
> 
> **GitHub Secrets Sync**: Sync your `.env` secrets to GitHub environments (dev/prod) for easy management and deployment. See [docs/GITHUB_SECRETS_SYNC.md](docs/GITHUB_SECRETS_SYNC.md).

## 🔗 Quick Links

- **[Secrets Quick Start](./SECRETS_QUICKSTART.md)** - ⚡ 5-minute setup: .env → GitHub → Postman
- **[GitHub Secrets Sync Guide](./docs/GITHUB_SECRETS_SYNC.md)** - 🔄 Complete sync documentation
- **[Postman Workspace Reference](./POSTMAN_WORKSPACE_REFERENCE.md)** - 📋 Quick reference card (workspace info & setup)
- **[Postman GUI Walkthrough](./POSTMAN_GUI_WALKTHROUGH.md)** - 👉 Step-by-step visual guide for injecting secrets
- **[Postman Environment Setup](./POSTMAN_SETUP.md)** - Complete reference for managing secrets
- **[Postman MCP Integration](./POSTMAN_MCP_GUIDE.md)** - Use MCP tools with Postman environments
- **[PostHog Analytics Integration](./docs/integrations/README.md)** - Complete guide for PostHog + ClickUp + Postman

## 🔐 Postman Environments

**Workspace**: Ascended Social (third-eye-cyborg)  
**Project Repository**: github.com/third-eye-cyborg/AscendedSocial

### Two Ways to Set Up

#### ⚡ Option 1: Import JSON Files (FASTEST - Recommended)
Import these files and all variables are created automatically:
- **[DEV Environment](./postman-environment-dev.json)** - Local development (localhost:5000) - 31 variables
- **[PROD Environment](./postman-environment-prod.json)** - Production (handle with care!) - 16 variables

**How it works:** 
1. Postman → Environments → Import → Select .json files
2. ✅ All variables imported instantly
3. Fill only the empty secret fields
4. Done!

#### 🔧 Option 2: Use MCP Tools (Already Done!)
The environments are already created in your Postman workspace via MCP:
- ✅ **DEV (localhost)** - ID: `c3a8b7f8-598f-4462-89a6-c9de456acfe0`
- ✅ **PROD (live)** - ID: `d3363a04-8df8-43da-970f-867f61b52c51`

Just open Postman, go to Environments, and they'll be there!

---

**Documentation:**
See [GUI Walkthrough](./POSTMAN_GUI_WALKTHROUGH.md) for detailed visual instructions on importing and injecting secrets.

## Security Notice: API Keys

**Do not hardcode API keys in your code or configuration files.**

All API keys including PostHog, OpenAI, WorkOS, and Builder.io should be set as Replit secrets or in `.env.local` for local development.

**How to set secrets in Replit:**

1. In the Replit workspace, open the Secrets (lock icon) sidebar.
2. Add a new secret with the key `BUILDER_API_KEY` and your API key as the value.
3. The `.builder-bridge.json` file will reference this secret at runtime.

**Never commit API keys to version control.** See the fuller guidance in [Security & Secrets](./docs/developer/security-and-secrets.md).
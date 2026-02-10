# Ascended Social - Spiritual Social Media Platform

A privacy-first spiritual social media platform built with React, Express, and PostgreSQL.

> **Postman Workspace**: This project includes pre-configured Postman environments for the Ascended Social API. See [.postman-workspace.json](.postman-workspace.json) for workspace configuration.

## 🔗 Quick Links

- **[Postman Workspace Reference](./POSTMAN_WORKSPACE_REFERENCE.md)** - 📋 Quick reference card (workspace info & setup)
- **[Postman GUI Walkthrough](./POSTMAN_GUI_WALKTHROUGH.md)** - 👉 Step-by-step visual guide for injecting secrets
- **[Postman Environment Setup](./POSTMAN_SETUP.md)** - Complete reference for managing secrets
- **[Postman MCP Integration](./POSTMAN_MCP_GUIDE.md)** - Use MCP tools with Postman environments
- **[PostHog Analytics Integration](./docs/integrations/README.md)** - Complete guide for PostHog + ClickUp + Postman
- **[Environment Setup](./docs/integrations/posthog-environment-setup.md)** - Configure PostHog API keys
- **[Postman Collection](./docs/integrations/postman-posthog-collection.json)** - Import for API testing

## 🔐 Postman Environments

**Workspace**: Ascended Social (third-eye-cyborg)  
**Project Repository**: github.com/third-eye-cyborg/AscendedSocial

Import these environment files into Postman to easily manage secrets:
- **[DEV Environment](./postman-environment-dev.json)** - Local development (localhost:5000)
- **[PROD Environment](./postman-environment-prod.json)** - Production (handle with care!)

See [GUI Walkthrough](./POSTMAN_GUI_WALKTHROUGH.md) for detailed visual instructions on importing and injecting secrets.

## Security Notice: API Keys

**Do not hardcode API keys in your code or configuration files.**

All API keys including PostHog, OpenAI, WorkOS, and Builder.io should be set as Replit secrets or in `.env.local` for local development.

**How to set secrets in Replit:**

1. In the Replit workspace, open the Secrets (lock icon) sidebar.
2. Add a new secret with the key `BUILDER_API_KEY` and your API key as the value.
3. The `.builder-bridge.json` file will reference this secret at runtime.

**Never commit API keys to version control.** See the fuller guidance in [Security & Secrets](./docs/developer/security-and-secrets.md).
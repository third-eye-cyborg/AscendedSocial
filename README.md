# Ascended Social - Spiritual Social Media Platform

A privacy-first spiritual social media platform built with React, Express, and PostgreSQL.

## 🔗 Quick Links

- **[PostHog Analytics Integration](./docs/integrations/README.md)** - Complete guide for PostHog + ClickUp + Postman
- **[Environment Setup](./docs/integrations/posthog-environment-setup.md)** - Configure PostHog API keys
- **[Postman Collection](./docs/integrations/postman-posthog-collection.json)** - Import for API testing

## Security Notice: API Keys

**Do not hardcode API keys in your code or configuration files.**

All API keys including PostHog, OpenAI, WorkOS, and Builder.io should be set as Replit secrets or in `.env.local` for local development.

**How to set secrets in Replit:**

1. In the Replit workspace, open the Secrets (lock icon) sidebar.
2. Add a new secret with the key `BUILDER_API_KEY` and your API key as the value.
3. The `.builder-bridge.json` file will reference this secret at runtime.

**Never commit API keys to version control.** See the fuller guidance in [Security & Secrets](./docs/developer/security-and-secrets.md).
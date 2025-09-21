# AscendedSocial-Web-Production-

## Security Notice: API Keys

**Do not hardcode API keys in your code or configuration files.**

For the Builder Bridge integration, set your API key as a Replit secret named `BUILDER_API_KEY`.

**How to set the secret:**

1. In the Replit workspace, open the Secrets (lock icon) sidebar.
2. Add a new secret with the key `BUILDER_API_KEY` and your API key as the value.
3. The `.builder-bridge.json` file will reference this secret at runtime.

**Never commit API keys to version control.**
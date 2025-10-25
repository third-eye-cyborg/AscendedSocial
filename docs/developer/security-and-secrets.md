# Security & Secrets Guidelines

This document codifies our security practices for secret management, safe process execution, and documentation hygiene.

## Secret Management

- Do not hardcode credentials in the repository. Never commit API keys, tokens, or passwords.
- Use Replit Secrets for runtime credentials in the Replit environment. Keys are injected via `process.env`.
- For local development outside Replit, you may use a local `.env` file that is untracked by Git. Never commit `.env`.

### Builder API Key

- The file `.builder-bridge.json` now references a secret placeholder:

```
"apiKey": "${BUILDER_API_KEY}"
```

- On Replit: add a secret named `BUILDER_API_KEY` with your Builder API key value.
- Local dev (optional): define `BUILDER_API_KEY` in your shell or local `.env` (do not commit).

### Other Secrets

- `CHROMATIC_PROJECT_TOKEN` for Chromatic publishing and tests
- `DATABASE_URL` for Neon/PostgreSQL with Drizzle
- `OPENAI_API_KEY` for AI features
- Any provider-specific tokens (Cloudflare, WorkOS, Paddle, etc.)

Add these only as Replit Secrets or local environment variables.

## Avoiding Secret Leakage in Docs and Code

- Documentation and examples must not contain real tokens. Use placeholders like `TOKEN_REDACTED`.
- Example fixed: the example deep link in `server/update-existing-notion-pages.ts` uses `TOKEN_REDACTED`.
- If you need to demonstrate payload shapes, fabricate non-sensitive sample values.

## Child Process Safety (Command Injection)

We run external tools for Storybook, Chromatic, Cypress, and Playwright. To prevent command injection:

- Never pass user-controlled input to child process commands or arguments.
- We run `spawn` without `shell: true` and apply allowlists where relevant.
- In `scripts/start-mcp-servers.js`, only `npx` and `npm` are allowed as commands. Args are validated for type and forbidden shell metacharacters.
- When adding a new MCP server or command, extend the allowlist explicitly and keep args static or validated.

## Design-to-Code Automation Script

The workflow script `scripts/design-workflow.js` orchestrates Figma → Storybook → Tests → Chromatic:

- The repository uses ESM (package.json sets `"type": "module"`). The script uses ESM imports and a dynamic import for `node-fetch` v3:
  - `import { execSync } from 'child_process'`
  - `const fetch = (await import('node-fetch')).default`
- The script validates commands against a strict allowlist and does not accept user-provided commands.
- Usage examples:

```bash
# Full workflow
node scripts/design-workflow.js

# Only sync from Figma endpoints
node scripts/design-workflow.js --sync-only

# Only run tests (requires Storybook available at http://localhost:6006)
node scripts/design-workflow.js --test-only
```

## Dependency Hygiene

- We maintain modern, secure versions for core libraries (axios, node-fetch v3, chokidar v4, micromatch v4, lodash v4, @builder.io/react v8, etc.).
- Do not downgrade libraries to unmaintained or non-existent versions to satisfy scans. Validate version recommendations before applying.
- If dependency updates cause issues, prefer code adjustments or vetted patches over version reintroductions of known vulnerabilities.

## Quick Checklist

- [ ] Secrets only via Replit Secrets (or local env for non-Replit dev)
- [ ] No real API keys in code, configs, or docs
- [ ] Commands and args validated where child processes are used
- [ ] ESM-compatible imports for Node (type: module); `node-fetch` v3 via ESM
- [ ] Build + tests green after changes

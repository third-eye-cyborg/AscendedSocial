#!/bin/bash

# Quick sync script for GitHub environments
# Usage: ./scripts/sync-secrets-quick.sh dev
#    or: ./scripts/sync-secrets-quick.sh prod

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./scripts/sync-secrets-quick.sh <environment>"
  echo ""
  echo "Examples:"
  echo "  ./scripts/sync-secrets-quick.sh dev"
  echo "  ./scripts/sync-secrets-quick.sh prod"
  exit 1
fi

if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
  echo "❌ Error: Invalid environment '$ENVIRONMENT'"
  echo "Valid environments: dev, prod"
  exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN not set"
  echo ""
  echo "Get your token from: https://github.com/settings/tokens"
  echo "Then run: export GITHUB_TOKEN=your_token_here"
  exit 1
fi

echo "═══════════════════════════════════════════════════════════"
echo "  Ascended Social - Quick GitHub Secrets Sync"
echo "  Environment: ${ENVIRONMENT^^}"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Install dependencies if needed
if ! npm list @octokit/rest &>/dev/null || ! npm list libsodium-wrappers &>/dev/null; then
  echo "📦 Installing dependencies..."
  npm install --no-save @octokit/rest libsodium-wrappers dotenv
  echo ""
fi

# Run the sync script
node scripts/sync-github-secrets.js "$ENVIRONMENT"

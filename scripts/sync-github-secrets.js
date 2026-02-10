#!/usr/bin/env node

/**
 * GitHub Environment Secrets Sync Script
 * 
 * This script syncs secrets from .env file to GitHub repository environments
 * 
 * Usage:
 *   node scripts/sync-github-secrets.js dev    # Sync to dev environment
 *   node scripts/sync-github-secrets.js prod   # Sync to prod environment
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { Octokit } from '@octokit/rest';
import sodium from 'libsodium-wrappers';

// GitHub repository info
const REPO_OWNER = 'third-eye-cyborg';
const REPO_NAME = 'AscendedSocial';

// Secrets to sync to GitHub (map .env key to GitHub secret name)
const SECRETS_TO_SYNC = {
  // Database
  'DATABASE_URL': 'DATABASE_URL',
  'PGDATABASE': 'PGDATABASE',
  'PGHOST': 'PGHOST',
  'PGPORT': 'PGPORT',
  'PGUSER': 'PGUSER',
  'PGPASSWORD': 'PGPASSWORD',
  
  // Auth
  'SESSION_SECRET': 'SESSION_SECRET',
  
  // OpenAI
  'OPENAI_API_KEY': 'OPENAI_API_KEY',
  
  // Cloudflare
  'CLOUDFLARE_ACCOUNT_ID': 'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_API_TOKEN': 'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_D1_DATABASE_ID': 'CLOUDFLARE_D1_DATABASE_ID',
  'CLOUDFLARE_IMAGES_API_KEY': 'CLOUDFLARE_IMAGES_API_KEY',
  'CLOUDFLARE_R2_ACCESS_KEY_ID': 'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY': 'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_WORKERS_API_KEY': 'CLOUDFLARE_WORKERS_API_KEY',
  'CLOUDFLARE_AUD_TAG': 'CLOUDFLARE_AUD_TAG',
  'CLOUDFLARE_TEAM_DOMAIN': 'CLOUDFLARE_TEAM_DOMAIN',
  
  // Turnstile
  'TURNSTILE_SECRET_KEY': 'TURNSTILE_SECRET_KEY',
  'TURNSTILE_SITE_KEY': 'TURNSTILE_SITE_KEY',
  'VITE_TURNSTILE_SITE_KEY': 'VITE_TURNSTILE_SITE_KEY',
  
  // PostHog
  'POSTHOG_API_KEY': 'POSTHOG_API_KEY',
  'POSTHOG_HOST': 'POSTHOG_HOST',
  
  // Testing
  'CHROMATIC_PROJECT_TOKEN': 'CHROMATIC_PROJECT_TOKEN',
  'PLAYWRIGHT_PROJECT_TOKEN': 'PLAYWRIGHT_PROJECT_TOKEN',
  'CYPRESS_PROJECT_TOKEN': 'CYPRESS_PROJECT_TOKEN',
  
  // Figma
  'FIGMA_ACCESS_TOKEN': 'FIGMA_ACCESS_TOKEN',
  'FIGMA_FILE_KEY': 'FIGMA_FILE_KEY',
  
  // Builder.io
  'BUILDER_API_KEY': 'BUILDER_API_KEY',
  
  // OneSignal
  'ONESIGNAL_APP_ID': 'ONESIGNAL_APP_ID',
  'ONESIGNAL_API_KEY': 'ONESIGNAL_API_KEY',
  
  // Sentry
  'SENTRY_DSN': 'SENTRY_DSN',
  
  // Object Storage (Replit)
  'DEFAULT_OBJECT_STORAGE_BUCKET_ID': 'DEFAULT_OBJECT_STORAGE_BUCKET_ID',
  'PUBLIC_OBJECT_SEARCH_PATHS': 'PUBLIC_OBJECT_SEARCH_PATHS',
  'PRIVATE_OBJECT_DIR': 'PRIVATE_OBJECT_DIR',
};

async function encryptSecret(publicKey, secretValue) {
  await sodium.ready;
  
  // Convert from base64
  const binkey = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
  const binsec = sodium.from_string(secretValue);
  
  // Encrypt
  const encBytes = sodium.crypto_box_seal(binsec, binkey);
  
  // Convert to base64
  return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
}

async function getPublicKey(octokit, environmentName) {
  try {
    const { data } = await octokit.rest.actions.getEnvironmentPublicKey({
      repository_id: await getRepositoryId(octokit),
      environment_name: environmentName,
    });
    return data;
  } catch (error) {
    console.error(`Error getting public key for environment ${environmentName}:`, error.message);
    throw error;
  }
}

async function getRepositoryId(octokit) {
  const { data } = await octokit.rest.repos.get({
    owner: REPO_OWNER,
    repo: REPO_NAME,
  });
  return data.id;
}

async function createOrUpdateEnvironment(octokit, environmentName) {
  const repositoryId = await getRepositoryId(octokit);
  
  try {
    // Try to get the environment first
    await octokit.rest.repos.getEnvironment({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      environment_name: environmentName,
    });
    console.log(`✓ Environment '${environmentName}' already exists`);
  } catch (error) {
    if (error.status === 404) {
      // Environment doesn't exist, create it
      console.log(`Creating environment '${environmentName}'...`);
      await octokit.rest.repos.createOrUpdateEnvironment({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        environment_name: environmentName,
      });
      console.log(`✓ Environment '${environmentName}' created`);
    } else {
      throw error;
    }
  }
}

async function setEnvironmentSecret(octokit, environmentName, secretName, secretValue) {
  const repositoryId = await getRepositoryId(octokit);
  const publicKey = await getPublicKey(octokit, environmentName);
  const encryptedValue = await encryptSecret(publicKey.key, secretValue);
  
  await octokit.rest.actions.createOrUpdateEnvironmentSecret({
    repository_id: repositoryId,
    environment_name: environmentName,
    secret_name: secretName,
    encrypted_value: encryptedValue,
    key_id: publicKey.key_id,
  });
}

async function syncSecrets(environmentName) {
  // Check for GitHub token
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('❌ Error: GITHUB_TOKEN environment variable not set');
    console.error('');
    console.error('To use this script, you need a GitHub Personal Access Token with the following permissions:');
    console.error('  - repo (Full control of private repositories)');
    console.error('  - workflow (Update GitHub Action workflows)');
    console.error('');
    console.error('Create one at: https://github.com/settings/tokens');
    console.error('');
    console.error('Then run: export GITHUB_TOKEN=your_token_here');
    process.exit(1);
  }
  
  // Load .env file
  console.log('Loading secrets from .env file...');
  dotenv.config();
  
  // Initialize Octokit
  const octokit = new Octokit({ auth: githubToken });
  
  // Create or update environment
  await createOrUpdateEnvironment(octokit, environmentName);
  
  // Sync secrets
  console.log(`\nSyncing secrets to GitHub environment '${environmentName}'...`);
  console.log('');
  
  let syncedCount = 0;
  let skippedCount = 0;
  
  for (const [envKey, githubSecretName] of Object.entries(SECRETS_TO_SYNC)) {
    const secretValue = process.env[envKey];
    
    if (!secretValue) {
      console.log(`⏭️  Skipping ${githubSecretName} (not found in .env)`);
      skippedCount++;
      continue;
    }
    
    try {
      await setEnvironmentSecret(octokit, environmentName, githubSecretName, secretValue);
      console.log(`✓ Synced ${githubSecretName}`);
      syncedCount++;
    } catch (error) {
      console.error(`❌ Failed to sync ${githubSecretName}:`, error.message);
    }
  }
  
  console.log('');
  console.log(`✅ Sync complete!`);
  console.log(`   Synced: ${syncedCount} secrets`);
  console.log(`   Skipped: ${skippedCount} secrets`);
  console.log('');
  console.log(`View environment at: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/environments`);
}

// Main execution
const environmentName = process.argv[2];

if (!environmentName) {
  console.error('Usage: node scripts/sync-github-secrets.js <environment>');
  console.error('');
  console.error('Examples:');
  console.error('  node scripts/sync-github-secrets.js dev');
  console.error('  node scripts/sync-github-secrets.js prod');
  process.exit(1);
}

if (!['dev', 'prod'].includes(environmentName)) {
  console.error(`❌ Error: Invalid environment '${environmentName}'`);
  console.error('Valid environments: dev, prod');
  process.exit(1);
}

console.log('═══════════════════════════════════════════════════════════');
console.log(`  Ascended Social - GitHub Secrets Sync`);
console.log(`  Environment: ${environmentName.toUpperCase()}`);
console.log(`  Repository: ${REPO_OWNER}/${REPO_NAME}`);
console.log('═══════════════════════════════════════════════════════════');
console.log('');

syncSecrets(environmentName).catch((error) => {
  console.error('');
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});

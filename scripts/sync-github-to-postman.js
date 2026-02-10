#!/usr/bin/env node

/**
 * Sync GitHub Environment Secrets to Postman
 * 
 * This script reads secrets from GitHub environments and syncs them to Postman environments
 * 
 * Usage:
 *   node scripts/sync-github-to-postman.js dev    # Sync dev
 *   node scripts/sync-github-to-postman.js prod   # Sync prod
 */

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const REPO_OWNER = 'third-eye-cyborg';
const REPO_NAME = 'AscendedSocial';

// Postman environment IDs (from MCP creation)
const POSTMAN_ENVIRONMENTS = {
  'dev': 'c3a8b7f8-598f-4462-89a6-c9de456acfe0',
  'prod': 'd3363a04-8df8-43da-970f-867f61b52c51'
};

async function listGitHubSecrets(octokit, environmentName) {
  const { data: repo } = await octokit.rest.repos.get({
    owner: REPO_OWNER,
    repo: REPO_NAME,
  });
  
  const { data } = await octokit.rest.actions.listEnvironmentSecrets({
    repository_id: repo.id,
    environment_name: environmentName,
  });
  
  return data.secrets;
}

async function syncToPostman(environmentName) {
  const githubToken = process.env.GITHUB_TOKEN;
  const postmanApiKey = process.env.POSTMAN_API_KEY;
  
  if (!githubToken) {
    console.error('❌ GITHUB_TOKEN not set');
    process.exit(1);
  }
  
  if (!postmanApiKey) {
    console.error('❌ POSTMAN_API_KEY not set');
    console.error('Get your key from: https://go.postman.co/settings/me/api-keys');
    process.exit(1);
  }
  
  const octokit = new Octokit({ auth: githubToken });
  
  console.log('🔍 Reading secrets from GitHub environment:', environmentName);
  const secrets = await listGitHubSecrets(octokit, environmentName);
  
  console.log(`\nFound ${secrets.length} secrets in GitHub ${environmentName} environment:`);
  secrets.forEach(secret => {
    console.log(`  - ${secret.name}`);
  });
  
  console.log('\n⚠️  Note: GitHub API does not expose secret values for security.');
  console.log('You need to manually update Postman environment with the secret values.');
  console.log('\nPostman Environment ID:', POSTMAN_ENVIRONMENTS[environmentName]);
  console.log('Edit at: https://go.postman.co/environments');
  console.log('\nOr use the Postman MCP tools to update programmatically.');
}

const environmentName = process.argv[2];

if (!environmentName || !['dev', 'prod'].includes(environmentName)) {
  console.error('Usage: node scripts/sync-github-to-postman.js <dev|prod>');
  process.exit(1);
}

syncToPostman(environmentName).catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

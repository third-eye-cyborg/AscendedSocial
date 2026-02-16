/**
 * Initialize Cloudflare D1 Database Schema for Consent Audit Logs
 * Run this script once to set up the GDPR-compliant consent storage
 */

import { getD1Manager } from '../lib/cloudflare-d1-integration';

async function initializeD1Schema() {
  console.log('🚀 Starting D1 schema initialization...');

  try {
    const d1Config = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      apiToken: process.env.CLOUDFLARE_API_TOKEN!,
      databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
    };

    if (!d1Config.accountId || !d1Config.apiToken || !d1Config.databaseId) {
      throw new Error('Missing Cloudflare D1 credentials. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, and CLOUDFLARE_D1_DATABASE_ID environment variables.');
    }

    const d1Manager = getD1Manager(d1Config);
    await d1Manager.initialize();
    await d1Manager.initializeSchema();

    console.log('✅ D1 schema initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize D1 schema:', error);
    process.exit(1);
  }
}

initializeD1Schema();

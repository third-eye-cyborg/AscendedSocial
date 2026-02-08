#!/usr/bin/env node
/**
 * PostHog Integration Verification Script
 * 
 * This script verifies that PostHog is properly configured and can send events.
 * Run this to test your PostHog integration without starting the full app.
 * 
 * Usage:
 *   node scripts/verify-posthog.mjs
 * 
 * Requirements:
 *   - POSTHOG_API_KEY environment variable set
 *   - posthog-node package installed
 */

import { PostHog } from 'posthog-node';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function verifyPostHogConfiguration() {
  log('\n🔍 PostHog Configuration Verification\n', 'cyan');
  log('━'.repeat(60), 'blue');

  // Check environment variables
  log('\n1️⃣  Checking Environment Variables...', 'yellow');
  
  const apiKey = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST || 'https://app.posthog.com';
  
  if (!apiKey) {
    log('❌ POSTHOG_API_KEY not found in environment', 'red');
    log('   Add to .env.local or Replit Secrets:', 'yellow');
    log('   POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB\n', 'yellow');
    process.exit(1);
  }

  if (!apiKey.startsWith('phc_')) {
    log('⚠️  API key format warning: should start with "phc_"', 'yellow');
  }

  log(`✅ POSTHOG_API_KEY: ${apiKey.substring(0, 10)}...`, 'green');
  log(`✅ POSTHOG_HOST: ${host}`, 'green');

  // Initialize PostHog
  log('\n2️⃣  Initializing PostHog Client...', 'yellow');
  
  let client;
  try {
    client = new PostHog(apiKey, {
      host: host,
      flushAt: 1, // Flush immediately for testing
      flushInterval: 1000,
    });
    log('✅ PostHog client initialized successfully', 'green');
  } catch (error) {
    log(`❌ Failed to initialize PostHog: ${error.message}`, 'red');
    process.exit(1);
  }

  // Send test event
  log('\n3️⃣  Sending Test Event...', 'yellow');
  
  const testUserId = `test_verification_${Date.now()}`;
  const testEvent = {
    distinctId: testUserId,
    event: 'posthog_verification_test',
    properties: {
      test: true,
      timestamp: new Date().toISOString(),
      chakra_type: 'heart',
      platform: 'verification_script',
      project: 'Ascended Social'
    }
  };

  try {
    client.capture(testEvent);
    log('✅ Test event sent:', 'green');
    log(`   User ID: ${testUserId}`, 'cyan');
    log(`   Event: posthog_verification_test`, 'cyan');
    log(`   Properties: chakra_type=heart, test=true`, 'cyan');
  } catch (error) {
    log(`❌ Failed to send event: ${error.message}`, 'red');
    await client.shutdown();
    process.exit(1);
  }

  // Flush and wait
  log('\n4️⃣  Flushing Events to PostHog...', 'yellow');
  
  try {
    await client.shutdown();
    log('✅ Events flushed successfully', 'green');
  } catch (error) {
    log(`⚠️  Flush warning: ${error.message}`, 'yellow');
  }

  // Success summary
  log('\n' + '━'.repeat(60), 'blue');
  log('\n✅ PostHog Verification Complete!\n', 'green');
  
  log('📊 Next Steps:', 'cyan');
  log('   1. Check PostHog dashboard for test event:', 'reset');
  log('      https://app.posthog.com/project/122488/events', 'blue');
  log('   2. Filter by event name: "posthog_verification_test"', 'reset');
  log(`   3. Look for distinct_id: ${testUserId}`, 'reset');
  log('   4. Event should appear within 1-2 minutes\n', 'reset');

  log('🔗 Useful Links:', 'cyan');
  log('   • PostHog Dashboard: https://app.posthog.com/project/122488', 'blue');
  log('   • Documentation: docs/integrations/posthog-clickup-postman-integration.md', 'blue');
  log('   • Environment Setup: docs/integrations/posthog-environment-setup.md\n', 'blue');

  process.exit(0);
}

// Run verification
verifyPostHogConfiguration().catch((error) => {
  log(`\n❌ Verification failed: ${error.message}`, 'red');
  log(`   Stack: ${error.stack}\n`, 'yellow');
  process.exit(1);
});

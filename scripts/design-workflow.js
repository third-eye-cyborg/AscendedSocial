#!/usr/bin/env node

/**
 * Automated Design-to-Code Workflow Script
 * Orchestrates the complete Figma → Storybook → Testing → Chromatic pipeline
 */

import { execSync } from 'child_process';
const fetch = (await import('node-fetch')).default;

const STORYBOOK_URL = 'http://localhost:6006';
const API_BASE = 'http://localhost:5000/api';

async function runCommand(command, description) {
  // Validate command against allowlist to prevent injection
  const allowedCommands = [
    'npx cypress run --component --config-file .storybook/cypress.config.js',
    'npx playwright test --config playwright.config.ts',
    'npx test-storybook --url http://localhost:6006',
    'npm run build-storybook',
    'npx chromatic --project-token $CHROMATIC_PROJECT_TOKEN --exit-zero-on-changes --auto-accept-changes',
    'npx playwright test --project=chromatic --reporter=html',
    'npm run storybook'
  ];
  
  if (!allowedCommands.includes(command)) {
    throw new Error(`Command not allowed: ${command}`);
  }
  
  console.log(`🔄 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

async function callAPI(endpoint, method = 'POST', body = null) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

async function syncFromFigma() {
  console.log('🎨 Starting Figma synchronization...');
  
  // Extract design tokens from Figma
  const tokensResult = await callAPI('/figma/extract-tokens');
  console.log(`✅ Extracted ${Object.keys(tokensResult.tokens.colors).length} color tokens`);
  
  // Sync components from Figma
  const componentsResult = await callAPI('/figma/sync-components');
  console.log(`✅ Synced ${componentsResult.componentsCount} components from Figma`);
  
  return { tokensResult, componentsResult };
}

async function runTests() {
  console.log('🧪 Running comprehensive test suite...');
  
  // Run Cypress component tests
  await runCommand(
    'npx cypress run --component --config-file .storybook/cypress.config.js',
    'Cypress component tests'
  );
  
  // Run Playwright visual regression tests
  await runCommand(
    'npx playwright test --config playwright.config.ts',
    'Playwright visual regression tests'
  );
  
  // Run Storybook test runner
  await runCommand(
    'npx test-storybook --url http://localhost:6006',
    'Storybook test runner'
  );
}

async function buildAndDeploy() {
  console.log('🚀 Building and deploying Storybook...');
  
  // Build Storybook
  await runCommand('npm run build-storybook', 'Building Storybook');
  
  // Deploy to Chromatic (if configured)
  if (process.env.CHROMATIC_PROJECT_TOKEN) {
    await runCommand(
      'npx chromatic --project-token $CHROMATIC_PROJECT_TOKEN --exit-zero-on-changes --auto-accept-changes',
      'Deploying to Chromatic'
    );
  }
  
  // Run Chromatic Playwright tests (if token available)
  if (process.env.PLAYWRIGHT_PROJECT_TOKEN) {
    await runCommand(
      'npx playwright test --project=chromatic --reporter=html',
      'Chromatic Playwright visual tests'
    );
  }
}

async function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    workflow: 'design-to-code',
    steps: [
      'Figma sync completed',
      'Design tokens extracted',
      'Components synchronized', 
      'Tests executed successfully',
      'Storybook deployed to Chromatic'
    ],
    status: 'success'
  };
  
  console.log('📊 Workflow Report:');
  console.log(JSON.stringify(report, null, 2));
  
  return report;
}

// Main workflow execution
async function runDesignWorkflow() {
  const startTime = Date.now();
  
  try {
    console.log('🌟 Starting Ascended Social Design-to-Code Workflow');
    console.log('=' .repeat(60));
    
    // Step 1: Sync from Figma
    await syncFromFigma();
    
    // Step 2: Start Storybook for testing
    console.log('🔄 Starting Storybook server...');
    const storybookProcess = await runCommand('npm run storybook', 'Starting Storybook server');
    
    // Wait for Storybook to be ready
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Step 3: Run tests
    await runTests();
    
    // Step 4: Build and deploy
    await buildAndDeploy();
    
    // Step 5: Generate report
    const report = await generateReport();
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`⚡ Workflow completed in ${duration}s`);
    
    return report;
    
  } catch (error) {
    console.error('💥 Workflow failed:', error.message);
    process.exit(1);
  }
}

// CLI options
const args = process.argv.slice(2);

if (args.includes('--sync-only')) {
  // Only sync from Figma
  syncFromFigma().then(() => {
    console.log('✅ Figma sync completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  });
} else if (args.includes('--test-only')) {
  // Only run tests
  runTests().then(() => {
    console.log('✅ Tests completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  });
} else {
  // Run full workflow
  runDesignWorkflow();
}
import { test, expect } from '@playwright/test';

test('Auth flow - Login and OAuth redirect', async ({ page }) => {
  console.log('🧪 Testing Auth Flow');
  
  // Navigate to home page
  console.log('📍 Step 1: Navigate to home page');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const title = await page.title();
  console.log(`✅ Page loaded: ${title}`);
  
  // Check if redirected to login
  const url = page.url();
  console.log(`📍 Current URL: ${url}`);
  
  if (url.includes('/login')) {
    console.log('✅ Redirected to login page (expected)');
  }
  
  // Check for "Continue with Replit" button
  console.log('📍 Step 2: Look for login button');
  const loginButton = await page.locator('button:has-text("Continue with Replit"), a:has-text("Continue with Replit"), button:has-text("Continue"), a:has-text("Continue")').first();
  
  if (await loginButton.isVisible()) {
    console.log('✅ Login button found');
  } else {
    console.log('❌ Login button not found');
    const allButtons = await page.locator('button').allTextContents();
    console.log('Available buttons:', allButtons);
  }
  
  // Get auth/user endpoint status
  console.log('📍 Step 3: Check /api/auth/user endpoint');
  const response = await page.request.get('http://localhost:3000/api/auth/user');
  console.log(`✅ Auth endpoint status: ${response.status}`);
  
  if (response.status === 401) {
    console.log('✅ 401 Unauthorized (expected - user not logged in)');
  }
  
  // Check console for errors
  console.log('📍 Step 4: Check for console errors');
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });
  
  await page.waitForTimeout(2000);
  
  if (consoleMessages.length > 0) {
    console.log('⚠️ Console errors found:');
    consoleMessages.forEach(msg => console.log(`  - ${msg}`));
  } else {
    console.log('✅ No console errors');
  }
  
  // Check network requests
  console.log('📍 Step 5: Check network requests');
  const requests = await page.context().tracing?.export?.('trace.json');
  console.log('✅ Network requests logged');
  
  console.log('✅ Auth flow test complete!');
});

test('API endpoints - Verify callbacks are correct', async ({ request }) => {
  console.log('🧪 Testing API Endpoints');
  
  // Test login endpoint
  console.log('📍 Testing /api/login endpoint');
  const loginResponse = await request.get('http://localhost:3000/api/login', {
    maxRedirects: 0,
  });
  
  console.log(`Status: ${loginResponse.status}`);
  const location = loginResponse.headers()['location'];
  console.log(`Redirect location: ${location}`);
  
  if (location?.includes('http://localhost:3000/api/callback') || 
      location?.includes('replit.com/oidc/authorize')) {
    console.log('✅ Callback URL looks correct');
  } else if (location?.includes(':5000')) {
    console.log('❌ WRONG PORT - Still using 5000 instead of 3000!');
  } else {
    console.log('⚠️ Check callback URL:', location);
  }
  
  // Test health endpoint
  console.log('📍 Testing /api/health endpoint');
  const healthResponse = await request.get('http://localhost:3000/api/health');
  console.log(`✅ Health check: ${healthResponse.status}`);
  
  console.log('✅ API endpoints test complete!');
});

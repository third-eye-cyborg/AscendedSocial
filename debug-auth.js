const { chromium } = require('playwright');

import { chromium } from 'playwright';

async function debugAuthentication() {
  console.log('🔍 Starting authentication debug...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  try {
    // First, check if both servers are running
    console.log('📡 Checking frontend server...');
    try {
      await page.goto('http://localhost:3004', { timeout: 5000 });
      console.log('✅ Frontend server responding');
    } catch (e) {
      console.log('❌ Frontend server not responding:', e.message);
    }
    
    console.log('📡 Checking backend server...');
    try {
      const response = await page.goto('http://localhost:8080/api/auth/user', { timeout: 5000 });
      console.log('✅ Backend server responding with status:', response.status());
      if (response.status() === 401) {
        console.log('✅ Expected 401 - auth is working, just not authenticated');
      }
    } catch (e) {
      console.log('❌ Backend server not responding:', e.message);
    }
    
    // Now test the frontend auth flow
    console.log('🎯 Testing frontend auth flow...');
    await page.goto('http://localhost:3004');
    
    // Look for login button or auth-related elements
    const loginElements = await page.$$('[data-testid*="login"], [href*="login"], .login, button:has-text("Login"), button:has-text("Sign in")');
    console.log(`🔍 Found ${loginElements.length} potential login elements`);
    
    if (loginElements.length > 0) {
      console.log('🔗 Attempting to click login...');
      await loginElements[0].click();
      
      // Wait for navigation or changes
      await page.waitForTimeout(2000);
      
      console.log('📍 Current URL after login click:', page.url());
      
      // Check if we get redirected to auth endpoint
      if (page.url().includes('/api/login')) {
        console.log('✅ Redirected to auth endpoint');
      } else if (page.url().includes('auth') || page.url().includes('login')) {
        console.log('✅ Redirected to some auth page');
      } else {
        console.log('⚠️ No auth redirect detected');
      }
    }
    
    // Check for network errors
    const networkErrors = [];
    page.on('response', response => {
      if (!response.ok() && response.url().includes('api')) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    await page.waitForTimeout(3000);
    
    if (networkErrors.length > 0) {
      console.log('❌ Network errors detected:');
      networkErrors.forEach(error => {
        console.log(`  ${error.status} ${error.statusText}: ${error.url}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugAuth().catch(console.error);
import { chromium } from 'playwright';

async function debugAuthentication() {
  console.log('🔍 Starting authentication debug session...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for debugging
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('auth')) {
      console.log('🌐 AUTH REQUEST:', request.method(), request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('auth') || response.status() >= 400) {
      console.log('📡 RESPONSE:', response.status(), response.url());
    }
  });

  try {
    console.log('🏠 Navigating to frontend...');
    await page.goto('http://localhost:3004');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    console.log('📸 Taking screenshot of initial page...');
    await page.screenshot({ path: 'debug-initial-page.png' });
    
    // Check if login button exists
    console.log('🔍 Looking for login elements...');
    const loginButton = await page.$('button:has-text("Login"), button:has-text("Sign in"), a:has-text("Login"), a:has-text("Sign in")');
    
    if (loginButton) {
      console.log('✅ Found login button');
      await page.screenshot({ path: 'debug-before-login.png' });
      
      console.log('🖱️ Clicking login button...');
      await loginButton.click();
      
      // Wait for navigation or auth response
      await page.waitForTimeout(3000);
      
      console.log('📸 Taking screenshot after login click...');
      await page.screenshot({ path: 'debug-after-login-click.png' });
      
      // Check current URL
      console.log('🔗 Current URL:', page.url());
      
    } else {
      console.log('❌ No login button found');
      
      // Check for any auth-related elements
      const authElements = await page.$$eval('*', elements => 
        elements.filter(el => 
          el.textContent && (
            el.textContent.toLowerCase().includes('login') ||
            el.textContent.toLowerCase().includes('sign in') ||
            el.textContent.toLowerCase().includes('auth')
          )
        ).map(el => ({
          tag: el.tagName,
          text: el.textContent.substring(0, 100),
          className: el.className
        }))
      );
      
      console.log('🔍 Found auth-related elements:', authElements);
    }
    
    // Test direct API endpoints
    console.log('🧪 Testing backend API endpoints...');
    
    // Test if backend is reachable
    const backendResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/user');
        return {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('📡 Backend /api/auth/user response:', backendResponse);
    
    // Test login endpoint
    const loginResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8080/api/login');
        return {
          status: response.status,
          statusText: response.statusText,
          redirected: response.redirected,
          url: response.url
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('📡 Backend /api/login response:', loginResponse);
    
  } catch (error) {
    console.error('❌ Debug session error:', error);
    await page.screenshot({ path: 'debug-error.png' });
  } finally {
    await browser.close();
    console.log('🔍 Debug session completed');
  }
}

debugAuthentication().catch(console.error);
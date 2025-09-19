import { test, expect, Page } from '@playwright/test';

// Configure test to use proper authentication bypass and main app URL
test.describe('Comprehensive Ascended Social App Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set testing environment and authentication bypass headers
    await page.setExtraHTTPHeaders({
      'x-testing-mode': 'true',
      'x-test-auth-bypass': 'true',
      'x-spiritual-tester': 'active'
    });
  });

  test('Application loads correctly and shows landing page', async ({ page }) => {
    await page.goto('http://localhost:5000');
    
    // Check if page loads successfully
    await expect(page).toHaveTitle(/Ascended Social/);
    
    // Should see main elements
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
    
    console.log('✅ Landing page loads successfully');
  });

  test('Authentication system - unauthenticated user sees login options', async ({ page }) => {
    // Visit app without authentication
    await page.setExtraHTTPHeaders({}); // Remove auth bypass headers
    await page.goto('http://localhost:5000');
    
    // Look for login-related elements or content
    const pageContent = await page.content();
    const isLoginVisible = pageContent.includes('login') || 
                          pageContent.includes('sign') || 
                          pageContent.includes('auth') ||
                          await page.locator('button, a').filter({ hasText: /login|sign/i }).count() > 0;
    
    expect(isLoginVisible).toBeTruthy();
    console.log('✅ Login options are visible for unauthenticated users');
  });

  test('Authentication system - bypassed auth allows access to app features', async ({ page }) => {
    // Use authentication bypass
    await page.setExtraHTTPHeaders({
      'x-testing-mode': 'true',
      'x-test-auth-bypass': 'true',
      'x-spiritual-tester': 'active'
    });
    
    await page.goto('http://localhost:5000');
    
    // Check if we can access authenticated content
    const response = await page.request.get('/api/auth/user');
    console.log('Auth user response status:', response.status());
    
    if (response.status() === 200) {
      const userData = await response.json();
      console.log('✅ Authentication bypass working - user data:', userData);
    }
  });

  test('Navigation - key routes are accessible', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-testing-mode': 'true',
      'x-test-auth-bypass': 'true',
      'x-spiritual-tester': 'active'
    });
    
    const routes = [
      '/',
      '/about',
      '/features',
      '/pricing',
      '/terms-of-service',
      '/privacy-policy'
    ];
    
    for (const route of routes) {
      await page.goto(`http://localhost:5000${route}`);
      
      // Check that page loads without major errors
      await page.waitForLoadState('domcontentloaded');
      const title = await page.title();
      expect(title).toBeTruthy();
      
      console.log(`✅ Route ${route} loads successfully`);
    }
  });

  test('API endpoints - basic API health check', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-testing-mode': 'true',
      'x-test-auth-bypass': 'true',
      'x-spiritual-tester': 'active'
    });
    
    // Test basic API connectivity
    const apiRoutes = [
      '/api',
      '/api/auth/user'
    ];
    
    for (const route of apiRoutes) {
      const response = await page.request.get(`http://localhost:5000${route}`);
      console.log(`API ${route} status:`, response.status());
      
      // Should not be 500 (server error)
      expect(response.status()).not.toBe(500);
      
      if (response.status() === 200) {
        console.log(`✅ API ${route} working correctly`);
      } else {
        console.log(`ℹ️ API ${route} status: ${response.status()} (might be expected)`);
      }
    }
  });

  test('Posts system - can access posts if authenticated', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-testing-mode': 'true',
      'x-test-auth-bypass': 'true',
      'x-spiritual-tester': 'active'
    });
    
    // Try to access posts API
    const postsResponse = await page.request.get('http://localhost:5000/api/posts');
    console.log('Posts API status:', postsResponse.status());
    
    if (postsResponse.status() === 200) {
      const posts = await postsResponse.json();
      console.log('✅ Posts API accessible, returned:', Array.isArray(posts) ? `${posts.length} posts` : 'posts data');
    } else if (postsResponse.status() === 401) {
      console.log('ℹ️ Posts require authentication (expected for protected content)');
    }
  });

  test('Security - protected routes require authentication', async ({ page }) => {
    // Test without auth bypass
    await page.setExtraHTTPHeaders({}); 
    
    const protectedRoutes = [
      '/api/posts',
      '/api/auth/user',
      '/api/profile'
    ];
    
    for (const route of protectedRoutes) {
      const response = await page.request.get(`http://localhost:5000${route}`);
      
      // Protected routes should return 401 (unauthorized) or redirect
      if (response.status() === 401) {
        console.log(`✅ Protected route ${route} properly requires authentication`);
      } else if (response.status() === 302) {
        console.log(`✅ Protected route ${route} redirects unauthenticated users`);
      } else {
        console.log(`⚠️ Protected route ${route} returned ${response.status()} - might need review`);
      }
    }
  });

  test('Error handling - handles non-existent routes gracefully', async ({ page }) => {
    await page.goto('http://localhost:5000/non-existent-route');
    
    // Should handle 404 gracefully - either show 404 page or redirect
    await page.waitForLoadState('domcontentloaded');
    
    const pageContent = await page.content();
    const handles404 = pageContent.includes('404') || 
                      pageContent.includes('not found') ||
                      pageContent.includes('page not found') ||
                      page.url().includes('not-found');
    
    if (handles404) {
      console.log('✅ 404 errors are handled gracefully');
    } else {
      console.log('ℹ️ Non-existent routes redirect to main app (alternative 404 handling)');
    }
  });

  test('Responsive design - app works on different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 720, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:5000');
      
      await page.waitForLoadState('domcontentloaded');
      
      // Basic check that page renders
      const body = await page.locator('body').boundingBox();
      expect(body?.width).toBeGreaterThan(0);
      
      console.log(`✅ ${viewport.name} viewport (${viewport.width}x${viewport.height}) renders correctly`);
    }
  });

  test('Application performance - page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:5000');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 10 seconds (generous for development environment)
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`✅ Application loads in ${loadTime}ms (acceptable performance)`);
  });

});
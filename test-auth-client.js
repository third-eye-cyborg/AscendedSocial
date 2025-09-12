// Test authentication redirect functionality
console.log('🧪 [TEST] Starting authentication test...');

// Test the authentication URL generation
function testAuthUrl() {
  console.log('🧪 [TEST] Testing auth URL generation...');
  
  // Simulate environment detection
  const hostname = 'localhost:5000';  // Simulate web environment
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  
  console.log('🧪 [TEST] Environment:', { hostname, userAgent });
  
  // Mock isMobileEnvironment function
  function isMobileEnvironment() {
    if (hostname.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev')) {
      return true;
    }
    if (hostname.includes('app.ascended.social')) {
      return true;
    }
    if (userAgent.includes('Expo') || userAgent.includes('ReactNative')) {
      return true;
    }
    return false;
  }
  
  // Mock getAuthUrl function
  function getAuthUrl(redirectUrl) {
    const baseUrl = '/api/login';
    const isMobile = isMobileEnvironment();
    
    console.log('🧪 [TEST] Mobile environment check:', isMobile);
    
    if (isMobile) {
      const state = JSON.stringify({
        platform: 'mobile',
        callback: redirectUrl || `http://${hostname}/auth-callback`,
        redirectUri: redirectUrl || `http://${hostname}`
      });
      return `${baseUrl}?state=${encodeURIComponent(state)}`;
    } else {
      return redirectUrl ? `${baseUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}` : baseUrl;
    }
  }
  
  // Test auth URL generation
  const authUrl = getAuthUrl();
  console.log('🧪 [TEST] Generated auth URL:', authUrl);
  
  return authUrl;
}

// Test the redirect functionality
function testRedirect() {
  console.log('🧪 [TEST] Testing redirect functionality...');
  
  const authUrl = testAuthUrl();
  
  // Simulate what would happen in browser
  console.log('🧪 [TEST] Would redirect to:', authUrl);
  console.log('🧪 [TEST] Full URL would be:', `http://localhost:5000${authUrl}`);
}

// Run tests
testRedirect();

console.log('🧪 [TEST] Authentication test completed');
const { chromium } = require('playwright');

async function captureAuthenticatedApp() {
  const browser = await chromium.launch({
    headless: false,  // Try non-headless first
    slowMo: 1000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });

    const page = await context.newPage();
    
    console.log('🔄 Navigating to application...');
    
    // First, go to the main app
    await page.goto('http://localhost:5000');
    await page.waitForLoadState('networkidle');
    
    // Check current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // If redirected to auth, handle it
    if (currentUrl.includes('api/login') || currentUrl.includes('login')) {
      console.log('🔐 Detected auth redirect...');
      
      // Wait for potential auto-login or user interaction
      await page.waitForTimeout(3000);
      
      // Try to navigate back to main app
      await page.goto('http://localhost:5000');
      await page.waitForLoadState('networkidle');
    }
    
    // Take screenshot of main dashboard
    await page.screenshot({ 
      path: 'dashboard-auth.png',
      fullPage: true
    });
    
    console.log('📸 Main dashboard screenshot saved');
    
    // Look for specific webapp elements and take targeted screenshots
    const hasMainContent = await page.$('.max-w-2xl'); // Main feed container
    const hasSidebar = await page.$('aside'); // Sidebar
    const hasCreatePost = await page.$('[data-testid*="create"]'); // Create post
    
    console.log('🔍 Found elements:', {
      mainContent: !!hasMainContent,
      sidebar: !!hasSidebar, 
      createPost: !!hasCreatePost
    });
    
    // Take focused screenshots of different areas
    if (hasSidebar) {
      await hasSidebar.screenshot({ path: 'sidebar-contrast.png' });
      console.log('📸 Sidebar screenshot saved');
    }
    
    if (hasMainContent) {
      await hasMainContent.screenshot({ path: 'main-feed.png' });
      console.log('📸 Main feed screenshot saved');
    }
    
    // Analyze text contrast in authenticated areas
    const contrastData = await page.evaluate(() => {
      const textElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent?.trim();
        const rect = el.getBoundingClientRect();
        return text && text.length > 2 && text.length < 100 && rect.width > 0 && rect.height > 0;
      });
      
      return textElements.slice(0, 25).map(el => {
        const style = getComputedStyle(el);
        const classes = el.className;
        const isProblematic = classes.includes('gray-400') || 
                             classes.includes('gray-500') || 
                             classes.includes('text-gray-4') ||
                             style.color.includes('rgba(156, 163, 175');
        
        return {
          text: el.textContent.trim().substring(0, 60),
          color: style.color,
          bgColor: style.backgroundColor,
          classes: classes,
          tag: el.tagName.toLowerCase(),
          problematic: isProblematic,
          parent: el.parentElement?.tagName?.toLowerCase()
        };
      });
    });
    
    console.log('\n=== TEXT CONTRAST ANALYSIS (AUTHENTICATED) ===');
    const problemElements = contrastData.filter(el => el.problematic);
    
    if (problemElements.length > 0) {
      console.log('\n❌ CONTRAST ISSUES FOUND:');
      problemElements.forEach((el, i) => {
        console.log(`${i + 1}. [${el.tag}] "${el.text}"`);
        console.log(`   Classes: ${el.classes}`);
        console.log(`   Color: ${el.color}`);
        console.log(`   Parent: ${el.parent}`);
      });
    }
    
    console.log('\n📊 All text elements:');
    contrastData.forEach((el, i) => {
      const status = el.problematic ? '❌' : '✅';
      console.log(`${status} ${i + 1}. "${el.text}" - ${el.color}`);
    });
    
    return contrastData;
    
  } finally {
    await browser.close();
  }
}

// Run with error handling
captureAuthenticatedApp().catch(error => {
  console.error('❌ Error:', error.message);
  
  if (error.message.includes('connect ECONNREFUSED')) {
    console.log('🚫 Server not running on localhost:5000');
  } else if (error.message.includes('dependencies')) {
    console.log('🚫 Browser dependencies missing');
  }
  
  process.exit(1);
});
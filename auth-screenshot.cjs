const { chromium } = require('playwright');

async function takeAuthenticatedScreenshot() {
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'] 
    });
    
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      ignoreHTTPSErrors: true
    });
    
    const page = await context.newPage();
    
    console.log('Navigating to dashboard...');
    
    // Try to navigate directly to the main app
    const response = await page.goto('http://localhost:5000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('Response status:', response?.status());
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if we're redirected to auth
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // If we hit a login page, try to proceed through auth
    if (currentUrl.includes('/api/login') || currentUrl.includes('login')) {
      console.log('Detected auth redirect, waiting for auth flow...');
      
      // Wait for auth to potentially complete (in case of auto-login or session)
      await page.waitForTimeout(5000);
      
      // Try to navigate back to dashboard after potential auth
      await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
    }
    
    // Take screenshot of whatever we can see
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    
    await page.screenshot({ 
      path: 'webapp-screenshot.png',
      fullPage: true
    });
    
    console.log('Screenshot saved as webapp-screenshot.png');
    
    // Analyze text contrast issues
    const contrastAnalysis = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent?.trim();
        return text && text.length > 0 && text.length < 200;
      });
      
      const visibleElements = elements.filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none';
      });
      
      return visibleElements.slice(0, 30).map(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        // Calculate approximate contrast
        const colorMatch = style.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const bgMatch = style.backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        
        let estimatedContrast = 'unknown';
        if (colorMatch) {
          const [, r, g, b] = colorMatch.map(Number);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          estimatedContrast = luminance < 0.5 ? 'dark' : 'light';
        }
        
        return {
          text: el.textContent.trim().substring(0, 50),
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          className: el.className,
          tagName: el.tagName.toLowerCase(),
          contrast: estimatedContrast,
          position: `${Math.round(rect.top)}px from top`
        };
      });
    });
    
    console.log('\n=== TEXT CONTRAST ANALYSIS ===');
    contrastAnalysis.forEach((el, i) => {
      console.log(`\n${i + 1}. [${el.tagName}] "${el.text}"`);
      console.log(`   Color: ${el.color} | BG: ${el.backgroundColor}`);
      console.log(`   Font: ${el.fontSize}, ${el.fontWeight}`);
      console.log(`   Classes: ${el.className}`);
      console.log(`   Contrast: ${el.contrast} | Position: ${el.position}`);
    });
    
    // Check for specific problematic patterns
    const problemElements = contrastAnalysis.filter(el => 
      el.color.includes('gray-400') || 
      el.color.includes('gray-500') ||
      (el.contrast === 'dark' && el.backgroundColor.includes('rgba(0, 0, 0, 0)'))
    );
    
    if (problemElements.length > 0) {
      console.log('\n=== POTENTIAL CONTRAST ISSUES ===');
      problemElements.forEach((el, i) => {
        console.log(`${i + 1}. "${el.text}" - ${el.color}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // If browser dependencies fail, let's try a different approach
    if (error.message.includes('dependencies')) {
      console.log('\n=== BROWSER DEPENDENCIES MISSING ===');
      console.log('Cannot run Playwright browser, but I can analyze the code directly.');
      return false;
    }
  } finally {
    if (browser) await browser.close();
  }
  
  return true;
}

takeAuthenticatedScreenshot().then(success => {
  if (!success) {
    console.log('Screenshot failed, will analyze code directly instead.');
  }
});
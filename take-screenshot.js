const { chromium } = require('playwright');

async function takeScreenshot() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    // Navigate to the dashboard
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
    
    // Wait a moment for any dynamic content to load
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'dashboard-screenshot.png',
      fullPage: true
    });
    
    console.log('Screenshot saved as dashboard-screenshot.png');
    
    // Also get the page title and some basic info
    const title = await page.title();
    console.log('Page title:', title);
    
    // Get some elements that might have contrast issues
    const textElements = await page.$$eval('*', elements => {
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        return el.textContent && el.textContent.trim().length > 0;
      }).slice(0, 10).map(el => ({
        text: el.textContent.substring(0, 50),
        color: window.getComputedStyle(el).color,
        backgroundColor: window.getComputedStyle(el).backgroundColor
      }));
    });
    
    console.log('Sample text elements with styling:');
    textElements.forEach((el, i) => {
      console.log(`${i + 1}. "${el.text}" - Color: ${el.color}, BG: ${el.backgroundColor}`);
    });
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
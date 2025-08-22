const { chromium } = require('playwright');

async function takeScreenshot() {
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();
    
    // Navigate to the dashboard
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a moment for any dynamic content to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'dashboard-screenshot.png',
      fullPage: false
    });
    
    console.log('Screenshot saved as dashboard-screenshot.png');
    
    // Get the page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for text elements with potential contrast issues
    const contrastInfo = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent?.trim();
        return text && text.length > 0 && text.length < 100;
      });
      
      return elements.slice(0, 20).map(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          text: el.textContent.trim().substring(0, 40),
          color: style.color,
          backgroundColor: style.backgroundColor,
          className: el.className,
          tagName: el.tagName.toLowerCase(),
          visible: rect.width > 0 && rect.height > 0
        };
      }).filter(item => item.visible);
    });
    
    console.log('\nText elements with styling:');
    contrastInfo.forEach((el, i) => {
      console.log(`${i + 1}. [${el.tagName}] "${el.text}" - Color: ${el.color}, BG: ${el.backgroundColor}`);
      if (el.className) console.log(`   Classes: ${el.className}`);
    });
    
  } catch (error) {
    console.error('Error taking screenshot:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

takeScreenshot();
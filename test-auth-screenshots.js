import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function createScreenshotsDir() {
  const dir = './test-screenshots';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
}

async function takeAuthenticatedScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1366, height: 768 }
  });

  const page = await browser.newPage();
  const screenshotsDir = await createScreenshotsDir();

  try {
    console.log('🚀 Starting authentication flow...');
    
    // Go to the app
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `${screenshotsDir}/01-landing-page.png`, fullPage: true });
    console.log('📸 Landing page screenshot taken');

    // Click login to start auth flow
    const loginButton = await page.$('[data-testid="button-login"], .login-button, a[href*="login"]');
    if (loginButton) {
      await loginButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      await page.screenshot({ path: `${screenshotsDir}/02-auth-redirect.png`, fullPage: true });
      console.log('📸 Auth redirect screenshot taken');
    }

    // Wait for potential auth completion and redirect back
    try {
      await page.waitForFunction(
        () => window.location.pathname === '/home' || document.querySelector('[data-testid="text-sigil"]'),
        { timeout: 30000 }
      );
      console.log('✅ Authentication successful, redirected to authenticated area');
    } catch (e) {
      console.log('⚠️ Authentication timeout - might need manual intervention');
    }

    // Take authenticated home page screenshot
    await page.goto('http://localhost:5000/home', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `${screenshotsDir}/03-home-authenticated.png`, fullPage: true });
    console.log('📸 Authenticated home page screenshot taken');

    // Test contrast issues by checking computed styles
    console.log('🔍 Analyzing contrast issues...');
    const contrastIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check gray text on dark backgrounds
      const grayTexts = document.querySelectorAll('.text-gray-400, .text-gray-500');
      grayTexts.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        const bgColor = window.getComputedStyle(el.parentElement).backgroundColor;
        issues.push({
          type: 'low-contrast-text',
          element: el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''),
          textColor: styles.color,
          backgroundColor: bgColor,
          text: el.textContent?.slice(0, 50) + '...'
        });
      });

      // Check button contrast
      const buttons = document.querySelectorAll('button');
      buttons.forEach((btn, index) => {
        const styles = window.getComputedStyle(btn);
        if (styles.backgroundColor === 'rgba(0, 0, 0, 0)' || styles.backgroundColor === 'transparent') {
          issues.push({
            type: 'transparent-button',
            element: btn.tagName + (btn.className ? '.' + btn.className.split(' ').join('.') : ''),
            text: btn.textContent?.slice(0, 30) + '...'
          });
        }
      });

      return issues;
    });

    console.log('📋 Contrast issues found:', contrastIssues.length);
    fs.writeFileSync(`${screenshotsDir}/contrast-analysis.json`, JSON.stringify(contrastIssues, null, 2));

    // Test functional flows
    console.log('🧪 Testing functional flows...');
    
    // Test search functionality
    try {
      const searchTrigger = await page.$('[data-testid="search-trigger"], [data-testid="button-search-mobile"]');
      if (searchTrigger) {
        await searchTrigger.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${screenshotsDir}/04-search-modal.png`, fullPage: true });
        console.log('📸 Search modal screenshot taken');
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('❌ Search functionality error:', e.message);
    }

    // Test notifications
    try {
      const notifButton = await page.$('[data-testid="button-notifications"]');
      if (notifButton) {
        await notifButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${screenshotsDir}/05-notifications-modal.png`, fullPage: true });
        console.log('📸 Notifications modal screenshot taken');
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('❌ Notifications functionality error:', e.message);
    }

    // Test post creation
    try {
      const createPostArea = await page.$('[data-testid="textarea-content"], .create-post textarea');
      if (createPostArea) {
        await createPostArea.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${screenshotsDir}/06-create-post-expanded.png`, fullPage: true });
        console.log('📸 Create post expanded screenshot taken');
      }
    } catch (e) {
      console.log('❌ Post creation test error:', e.message);
    }

    // Test mobile view
    console.log('📱 Testing mobile view...');
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
    await page.reload({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: `${screenshotsDir}/07-mobile-home.png`, fullPage: true });
    console.log('📸 Mobile home screenshot taken');

    // Test mobile navigation
    try {
      const mobileNavButtons = await page.$$('[data-testid^="button-"]');
      if (mobileNavButtons.length > 0) {
        await page.screenshot({ path: `${screenshotsDir}/08-mobile-navigation.png` });
        console.log('📸 Mobile navigation screenshot taken');
      }
    } catch (e) {
      console.log('❌ Mobile navigation test error:', e.message);
    }

    // Check for JavaScript errors
    console.log('🐛 Checking for JavaScript errors...');
    const errors = await page.evaluate(() => {
      return window.errors || [];
    });

    // Listen for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Save error log
    const errorLog = {
      javascriptErrors: errors,
      consoleErrors: consoleErrors,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(`${screenshotsDir}/error-log.json`, JSON.stringify(errorLog, null, 2));

    console.log('✅ Screenshot testing completed!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
    console.log(`📊 Found ${contrastIssues.length} potential contrast issues`);
    console.log(`🐛 Found ${consoleErrors.length} console errors`);

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
takeAuthenticatedScreenshots().catch(console.error);
import { test as chromaticTest, takeSnapshot } from '@chromatic-com/playwright';

// Chromatic Playwright integration tests for Ascended Social components
chromaticTest.describe('Chromatic Visual Regression Tests', () => {

  chromaticTest('Button Component - All Variants', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-button--primary');
    await takeSnapshot(page, 'Button Primary');

    await page.goto('http://localhost:6006/iframe.html?id=example-button--secondary');
    await takeSnapshot(page, 'Button Secondary');

    await page.goto('http://localhost:6006/iframe.html?id=example-button--large');
    await takeSnapshot(page, 'Button Large');

    await page.goto('http://localhost:6006/iframe.html?id=example-button--small');
    await takeSnapshot(page, 'Button Small');
  });

  chromaticTest('Header Component', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-header--logged-in');
    await takeSnapshot(page, 'Header Logged In');

    await page.goto('http://localhost:6006/iframe.html?id=example-header--logged-out');
    await takeSnapshot(page, 'Header Logged Out');
  });

  chromaticTest('Page Component - Complete Stories', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-page--logged-in');
    await page.waitForLoadState('networkidle');
    await takeSnapshot(page, 'Page Logged In');

    await page.goto('http://localhost:6006/iframe.html?id=example-page--logged-out');
    await page.waitForLoadState('networkidle');
    await takeSnapshot(page, 'Page Logged Out');
  });

  chromaticTest('Interactive Components', async ({ page }) => {
    // Test button interactions
    await page.goto('http://localhost:6006/iframe.html?id=example-button--primary');
    
    // Normal state
    await takeSnapshot(page, 'Button Normal State');
    
    // Hover state
    await page.locator('button').hover();
    await takeSnapshot(page, 'Button Hover State');
    
    // Focus state
    await page.locator('button').focus();
    await takeSnapshot(page, 'Button Focus State');
  });

  chromaticTest('Responsive Design Tests', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-page--logged-in');
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await takeSnapshot(page, 'Mobile Viewport');
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await takeSnapshot(page, 'Tablet Viewport');
    
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await takeSnapshot(page, 'Desktop Viewport');
  });

});
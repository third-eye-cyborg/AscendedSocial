import { test, expect } from '@chromatic-com/playwright';

// Chromatic Playwright integration tests for Ascended Social components
test.describe('Chromatic Visual Regression Tests', () => {

  test('Button Component - All Variants', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-button--primary');
    await expect(page).toHaveScreenshot('button-primary.png');

    await page.goto('http://localhost:6006/iframe.html?id=example-button--secondary');
    await expect(page).toHaveScreenshot('button-secondary.png');

    await page.goto('http://localhost:6006/iframe.html?id=example-button--large');
    await expect(page).toHaveScreenshot('button-large.png');

    await page.goto('http://localhost:6006/iframe.html?id=example-button--small');
    await expect(page).toHaveScreenshot('button-small.png');
  });

  test('Header Component', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-header--logged-in');
    await expect(page).toHaveScreenshot('header-logged-in.png');

    await page.goto('http://localhost:6006/iframe.html?id=example-header--logged-out');
    await expect(page).toHaveScreenshot('header-logged-out.png');
  });

  test('Page Component - Complete Stories', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-page--logged-in');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('page-logged-in.png');

    await page.goto('http://localhost:6006/iframe.html?id=example-page--logged-out');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('page-logged-out.png');
  });

  test('Interactive Components', async ({ page }) => {
    // Test button interactions
    await page.goto('http://localhost:6006/iframe.html?id=example-button--primary');
    
    // Normal state
    await expect(page).toHaveScreenshot('button-normal-state.png');
    
    // Hover state
    await page.locator('button').hover();
    await expect(page).toHaveScreenshot('button-hover-state.png');
    
    // Focus state
    await page.locator('button').focus();
    await expect(page).toHaveScreenshot('button-focus-state.png');
  });

  test('Responsive Design Tests', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=example-page--logged-in');
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('mobile-viewport.png');
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('tablet-viewport.png');
    
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page).toHaveScreenshot('desktop-viewport.png');
  });

});
import { test, expect } from '@chromatic-com/playwright';

test.describe('Ascended Social Component Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set up any global test configuration
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Button component - all chakra variants', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--all-variants');
    
    // Wait for component to load
    await page.waitForSelector('[data-testid="button-root"]');
    
    // Take full page screenshot for visual comparison
    await expect(page).toHaveScreenshot('button-chakra-variants.png');
    
    // Test individual chakra variants
    const chakras = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
    
    for (const chakra of chakras) {
      await page.locator(`[data-testid="button-${chakra}"]`).hover();
      await expect(page.locator(`[data-testid="button-${chakra}"]`))
        .toHaveScreenshot(`button-${chakra}-hover.png`);
    }
  });

  test('Card component - spiritual theming', async ({ page }) => {
    await page.goto('/iframe.html?id=components-card--spiritual-post');
    
    await page.waitForSelector('[data-testid="card-spiritual-post"]');
    
    // Test initial state
    await expect(page.locator('[data-testid="card-spiritual-post"]'))
      .toHaveScreenshot('card-spiritual-post.png');
    
    // Test hover state
    await page.locator('[data-testid="card-spiritual-post"]').hover();
    await expect(page.locator('[data-testid="card-spiritual-post"]'))
      .toHaveScreenshot('card-spiritual-post-hover.png');
  });

  test('Form components - mystical styling', async ({ page }) => {
    await page.goto('/iframe.html?id=components-form--create-post');
    
    await page.waitForSelector('[data-testid="form-create-post"]');
    
    // Test form in different states
    await expect(page).toHaveScreenshot('form-create-post-initial.png');
    
    // Focus on input field
    await page.locator('[data-testid="input-content"]').focus();
    await expect(page).toHaveScreenshot('form-create-post-focused.png');
    
    // Fill in content
    await page.locator('[data-testid="input-content"]').fill('Testing mystical form input...');
    await expect(page).toHaveScreenshot('form-create-post-filled.png');
  });

  test('Navigation components - spiritual design', async ({ page }) => {
    await page.goto('/iframe.html?id=components-navigation--main-nav');
    
    await page.waitForSelector('[data-testid="navigation-main"]');
    
    // Test navigation states
    await expect(page).toHaveScreenshot('navigation-main.png');
    
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('navigation-main-mobile.png');
  });

  test('Oracle components - mystical animations', async ({ page }) => {
    await page.goto('/iframe.html?id=components-oracle--daily-reading');
    
    await page.waitForSelector('[data-testid="oracle-daily-reading"]');
    
    // Test initial state
    await expect(page).toHaveScreenshot('oracle-daily-reading.png');
    
    // Test animation trigger
    await page.locator('[data-testid="button-reveal-reading"]').click();
    await page.waitForTimeout(1500); // Wait for animation
    await expect(page).toHaveScreenshot('oracle-daily-reading-revealed.png');
  });

  test('Dark mode consistency', async ({ page }) => {
    // Test components in dark mode
    await page.addInitScript(() => {
      document.documentElement.classList.add('dark');
    });
    
    const components = [
      'components-button--primary',
      'components-card--spiritual-post',
      'components-navigation--main-nav'
    ];
    
    for (const component of components) {
      await page.goto(`/iframe.html?id=${component}`);
      await page.waitForSelector('[data-testid]');
      await expect(page).toHaveScreenshot(`${component.replace(/[^a-z0-9]/gi, '-')}-dark.png`);
    }
  });

  test('Accessibility - high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        * {
          filter: contrast(150%) !important;
        }
      `;
      document.head.appendChild(style);
    });
    
    await page.goto('/iframe.html?id=components-button--all-variants');
    await page.waitForSelector('[data-testid="button-root"]');
    await expect(page).toHaveScreenshot('button-variants-high-contrast.png');
  });
});
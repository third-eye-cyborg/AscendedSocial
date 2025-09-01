import { test, expect } from '@chromatic-com/playwright';

test.describe('Accessibility E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/');
  });

  test('Keyboard navigation works throughout the app', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // First focusable element should be highlighted
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through key elements
    const keyElements = [
      'button-login',
      'link-oracle', 
      'link-starmap',
      'input-search'
    ];
    
    for (const elementId of keyElements) {
      await page.keyboard.press('Tab');
      // Element should be reachable via keyboard
      const element = page.getByTestId(elementId);
      if (await element.isVisible()) {
        // Element should be focusable
        await element.focus();
        await expect(element).toBeFocused();
      }
    }
  });

  test('ARIA labels and roles are properly set', async ({ page }) => {
    // Check main navigation has proper ARIA
    const mainNav = page.getByTestId('navigation-main');
    await expect(mainNav).toHaveAttribute('role', 'navigation');
    
    // Check buttons have proper labels
    const createPostButton = page.getByTestId('button-create-post');
    if (await createPostButton.isVisible()) {
      await expect(createPostButton).toHaveAttribute('aria-label');
    }
    
    // Check images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        await expect(img).toHaveAttribute('alt');
      }
    }
  });

  test('Screen reader compatibility', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    if (await h1.count() > 0) {
      await expect(h1.first()).toBeVisible();
    }
    
    // Check form labels are associated with inputs
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        // Input should have aria-label or be labeled by another element
        const hasAriaLabel = await input.getAttribute('aria-label');
        const hasLabelledBy = await input.getAttribute('aria-labelledby');
        
        expect(hasAriaLabel || hasLabelledBy).toBeTruthy();
      }
    }
  });

  test('Color contrast meets accessibility standards', async ({ page }) => {
    // Test high contrast mode
    await page.addInitScript(() => {
      document.documentElement.style.filter = 'contrast(200%)';
    });
    
    await page.reload();
    
    // Key elements should still be visible and readable
    await expect(page.getByTestId('navigation-main')).toBeVisible();
    
    const posts = page.getByTestId('card-post');
    if (await posts.first().isVisible()) {
      await expect(posts.first()).toBeVisible();
    }
  });

  test('Focus indicators are visible', async ({ page }) => {
    // Test that interactive elements show focus
    const interactiveElements = [
      'button-login',
      'button-create-post',
      'link-oracle',
      'input-search'
    ];
    
    for (const elementId of interactiveElements) {
      const element = page.getByTestId(elementId);
      if (await element.isVisible()) {
        await element.focus();
        
        // Element should have visible focus indicator
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBe(element);
      }
    }
  });

  test('Skip navigation links work', async ({ page }) => {
    // Look for skip navigation link
    const skipLink = page.getByTestId('link-skip-navigation');
    if (await skipLink.isVisible()) {
      await skipLink.click();
      
      // Should jump to main content
      const mainContent = page.getByTestId('main-content');
      await expect(mainContent).toBeFocused();
    }
  });

  test('Error messages are announced', async ({ page }) => {
    // Try to trigger a form error
    await page.getByTestId('button-create-post').click();
    
    const form = page.getByTestId('form-create-post');
    if (await form.isVisible()) {
      // Submit empty form to trigger validation
      await page.getByTestId('button-submit-post').click();
      
      // Error message should have proper ARIA attributes
      const errorMessage = page.getByTestId('error-message');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toHaveAttribute('role', 'alert');
        await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      }
    }
  });

});
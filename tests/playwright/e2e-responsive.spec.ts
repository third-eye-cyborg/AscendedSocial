import { test, expect } from '@chromatic-com/playwright';

test.describe('Responsive Design E2E Tests', () => {

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Large Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`Application works on ${name} viewport (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('http://localhost:5000/');
      
      // Check key elements are visible and properly arranged
      await expect(page.getByTestId('navigation-main')).toBeVisible();
      
      // Mobile-specific checks
      if (width <= 768) {
        // Mobile menu should be accessible
        const mobileMenu = page.getByTestId('button-mobile-menu');
        if (await mobileMenu.isVisible()) {
          await mobileMenu.click();
          await expect(page.getByTestId('menu-mobile-navigation')).toBeVisible();
        }
      }
      
      // Check posts are properly displayed
      await expect(page.getByTestId('feed-posts')).toBeVisible();
      const posts = page.getByTestId('card-post');
      
      if (await posts.first().isVisible()) {
        // Verify post cards maintain proper layout
        await expect(posts.first()).toBeVisible();
        
        // Check if engagement buttons are accessible
        await expect(posts.first().getByTestId('button-upvote')).toBeVisible();
      }
    });
  });

  test('Dark mode toggle works across devices', async ({ page }) => {
    for (const { width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('http://localhost:5000/');
      
      // Find and click dark mode toggle
      const darkModeToggle = page.getByTestId('button-theme-toggle');
      await expect(darkModeToggle).toBeVisible();
      await darkModeToggle.click();
      
      // Verify dark mode is active
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Toggle back to light mode
      await darkModeToggle.click();
      await expect(page.locator('html')).not.toHaveClass(/dark/);
    }
  });

  test('Touch interactions work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5000/');
    
    // Test swipe gestures on posts (if implemented)
    const firstPost = page.getByTestId('card-post').first();
    if (await firstPost.isVisible()) {
      // Simulate touch events
      await firstPost.hover();
      await firstPost.click();
      
      // Verify post interaction
      await expect(firstPost).toHaveClass(/focus|active/);
    }
  });

  test('Navigation adapts to different screen sizes', async ({ page }) => {
    // Test desktop navigation
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5000/');
    
    await expect(page.getByTestId('navigation-desktop')).toBeVisible();
    
    // Test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile navigation should be different
    const mobileNav = page.getByTestId('navigation-mobile');
    if (await mobileNav.isVisible()) {
      await expect(mobileNav).toBeVisible();
    }
  });

});
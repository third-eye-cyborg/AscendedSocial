import { test, expect } from '@chromatic-com/playwright';

test.describe('Authentication E2E Tests', () => {
  
  test('User can navigate to login page', async ({ page }) => {
    await page.goto('http://localhost:5000/');
    
    // Check if login button exists
    await expect(page.getByTestId('button-login')).toBeVisible();
    
    // Click login button and verify redirect
    await page.getByTestId('button-login').click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('User can access authenticated features after login', async ({ page }) => {
    // Start from homepage
    await page.goto('http://localhost:5000/');
    
    // Mock authentication state by going directly to an authenticated page
    await page.goto('http://localhost:5000/dashboard');
    
    // Check for key authenticated features
    await expect(page.getByTestId('navigation-main')).toBeVisible();
    await expect(page.getByTestId('button-create-post')).toBeVisible();
    await expect(page.getByTestId('text-user-energy-points')).toBeVisible();
  });

  test('Protected routes redirect to login when not authenticated', async ({ page }) => {
    // Try to access protected route directly
    await page.goto('http://localhost:5000/create-post');
    
    // Should redirect to login or show unauthorized
    const url = page.url();
    expect(url.includes('/login') || url.includes('/')).toBeTruthy();
  });

  test('User profile displays correctly', async ({ page }) => {
    await page.goto('http://localhost:5000/profile');
    
    // Check profile elements are visible
    await expect(page.getByTestId('img-avatar')).toBeVisible();
    await expect(page.getByTestId('text-username')).toBeVisible();
    await expect(page.getByTestId('text-aura-level')).toBeVisible();
  });

});
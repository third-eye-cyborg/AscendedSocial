import { test, expect } from '@chromatic-com/playwright';

test.describe('Spiritual Content E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to main application
    await page.goto('http://localhost:5000/');
  });

  test('User can create a new spiritual post', async ({ page }) => {
    // Navigate to create post page
    await page.getByTestId('button-create-post').click();
    
    // Fill out post creation form
    await page.getByTestId('input-post-content').fill('Sharing mystical insights about the universe and spiritual awakening.');
    
    // Select chakra category
    await page.getByTestId('select-chakra').click();
    await page.getByTestId('option-heart-chakra').click();
    
    // Submit the post
    await page.getByTestId('button-submit-post').click();
    
    // Verify post was created successfully
    await expect(page.getByTestId('alert-success')).toBeVisible();
    await expect(page.getByTestId('alert-success')).toContainText('Post created successfully');
  });

  test('User can engage with spiritual posts', async ({ page }) => {
    // Find first post in feed
    const firstPost = page.getByTestId('card-post').first();
    await expect(firstPost).toBeVisible();
    
    // Test upvote functionality
    await firstPost.getByTestId('button-upvote').click();
    await expect(firstPost.getByTestId('text-upvote-count')).not.toContainText('0');
    
    // Test energy sharing
    await firstPost.getByTestId('button-share-energy').click();
    await expect(page.getByTestId('alert-energy-shared')).toBeVisible();
    
    // Test spiritual mark (bookmark)
    await firstPost.getByTestId('button-spiritual-mark').click();
    await expect(firstPost.getByTestId('button-spiritual-mark')).toHaveClass(/active/);
  });

  test('Oracle reading functionality works', async ({ page }) => {
    // Navigate to oracle section
    await page.getByTestId('link-oracle').click();
    
    // Check daily reading is displayed
    await expect(page.getByTestId('card-daily-reading')).toBeVisible();
    await expect(page.getByTestId('text-reading-title')).toBeVisible();
    await expect(page.getByTestId('text-reading-content')).toBeVisible();
    
    // Test getting personalized recommendations
    await page.getByTestId('button-get-recommendations').click();
    await expect(page.getByTestId('loading-recommendations')).toBeVisible();
    
    // Wait for recommendations to load
    await page.waitForSelector('[data-testid="card-recommendation"]', { timeout: 10000 });
    await expect(page.getByTestId('card-recommendation')).toBeVisible();
  });

  test('Chakra-based content filtering works', async ({ page }) => {
    // Test filtering by different chakras
    const chakras = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
    
    for (const chakra of chakras) {
      await page.getByTestId(`filter-${chakra}-chakra`).click();
      
      // Verify filtered posts show correct chakra
      const posts = page.getByTestId('card-post');
      const firstPost = posts.first();
      
      if (await firstPost.isVisible()) {
        await expect(firstPost.getByTestId('badge-chakra')).toContainText(chakra);
      }
      
      // Clear filter
      await page.getByTestId('button-clear-filters').click();
    }
  });

  test('User energy system works correctly', async ({ page }) => {
    // Check initial energy points
    const energyElement = page.getByTestId('text-user-energy-points');
    await expect(energyElement).toBeVisible();
    
    const initialEnergy = await energyElement.textContent();
    
    // Perform energy-consuming action (share energy with a post)
    const firstPost = page.getByTestId('card-post').first();
    await firstPost.getByTestId('button-share-energy').click();
    
    // Verify energy was consumed
    await page.waitForTimeout(1000); // Wait for update
    const newEnergy = await energyElement.textContent();
    expect(newEnergy).not.toBe(initialEnergy);
  });

  test('3D Starmap visualization loads', async ({ page }) => {
    // Navigate to starmap
    await page.getByTestId('link-starmap').click();
    
    // Wait for 3D canvas to load
    await page.waitForSelector('canvas', { timeout: 15000 });
    await expect(page.locator('canvas')).toBeVisible();
    
    // Test mode switching
    await page.getByTestId('button-fungal-mode').click();
    await expect(page.getByTestId('status-fungal-mode')).toBeVisible();
    
    await page.getByTestId('button-starmap-mode').click();
    await expect(page.getByTestId('status-starmap-mode')).toBeVisible();
  });

});
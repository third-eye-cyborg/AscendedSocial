# Testing & Quality Assurance Guide

Comprehensive testing framework for Ascended Social's spiritual platform, including unit tests, integration tests, end-to-end testing, performance monitoring, and specialized spiritual feature testing.

## 🧪 Testing Architecture Overview

### Testing Stack
- **Unit Testing**: Vitest for component and function testing
- **Integration Testing**: API endpoint testing with supertest
- **End-to-End Testing**: Playwright for user journey testing
- **Visual Testing**: Chromatic for component visual regression
- **Performance Testing**: Lighthouse and custom spiritual metrics
- **Browser Automation**: Browserless for production monitoring

### Test Environment Setup

```bash
# Install testing dependencies
npm install --save-dev @vitest/browser @playwright/test chromatic

# Run all test suites
npm run test:all

# Run specific test types
npm run test:unit        # Unit tests
npm run test:integration # API integration tests
npm run test:e2e         # End-to-end tests
npm run test:visual      # Visual regression tests
npm run test:performance # Performance benchmarks
```

## 🔬 Unit Testing Framework

### Component Testing with Vitest

```typescript
// tests/unit/components/SpiritAvatar.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpiritAvatar } from '@/components/SpiritAvatar';

describe('SpiritAvatar Component', () => {
  const mockSpirit = {
    id: 'spirit-1',
    name: 'Ignis Soulforge',
    element: 'fire',
    level: 5,
    experience: 500,
    imageUrl: 'https://example.com/spirit.png',
    evolution: {
      stage: 'awakened',
      nextEvolution: 1000
    }
  };

  it('renders spirit information correctly', () => {
    render(<SpiritAvatar spirit={mockSpirit} size={64} />);
    
    expect(screen.getByText('Ignis Soulforge')).toBeInTheDocument();
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockSpirit.imageUrl);
  });

  it('displays correct evolution stage visual effects', () => {
    render(<SpiritAvatar spirit={mockSpirit} size={64} />);
    
    const avatar = screen.getByTestId('spirit-avatar');
    expect(avatar).toHaveClass('evolution-awakened');
    expect(avatar).toHaveAttribute('data-element', 'fire');
  });

  it('calculates experience progress correctly', () => {
    render(<SpiritAvatar spirit={mockSpirit} size={64} showProgress />);
    
    const progressBar = screen.getByTestId('spirit-progress');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50'); // 500/1000 = 50%
  });
});
```

### Spiritual Logic Testing

```typescript
// tests/unit/spiritual/EnergyCalculations.test.ts
import { describe, it, expect } from 'vitest';
import { EnergyCalculationEngine } from '@/lib/spiritual/EnergyCalculationEngine';

describe('Energy Calculation System', () => {
  const energyEngine = new EnergyCalculationEngine();

  describe('Energy Transfer Calculations', () => {
    it('calculates basic energy transfer correctly', () => {
      const fromUser = { id: '1', aura: 10, dominantChakra: 'heart' };
      const toUser = { id: '2', aura: 8, dominantChakra: 'heart' };
      
      const result = energyEngine.calculateEnergyTransfer(
        fromUser, toUser, 25, 'energy_share'
      );

      expect(result.energyCost).toBe(10); // Base cost for energy share
      expect(result.energyReceived).toBe(25);
      expect(result.resonanceBonus).toBeGreaterThan(0); // Same chakra bonus
    });

    it('applies chakra resonance multipliers', () => {
      const heartUser = { id: '1', aura: 10, dominantChakra: 'heart' };
      const crownUser = { id: '2', aura: 10, dominantChakra: 'crown' };
      
      const result = energyEngine.calculateSpiritualResonance(heartUser, crownUser);
      
      expect(result).toBe(0.4); // Heart-Crown resonance from matrix
    });

    it('prevents energy transfer when insufficient balance', () => {
      const lowEnergyUser = { id: '1', aura: 1, energy: 5 };
      const targetUser = { id: '2', aura: 10 };
      
      expect(() => {
        energyEngine.calculateEnergyTransfer(
          lowEnergyUser, targetUser, 50, 'energy_share'
        );
      }).toThrow('Insufficient energy balance');
    });
  });

  describe('Chakra Analysis', () => {
    it('identifies dominant chakra from content patterns', async () => {
      const posts = [
        { content: 'Feeling so much love and compassion today' },
        { content: 'My heart is open to healing energy' },
        { content: 'Sending love to all beings' }
      ];

      const analysis = await energyEngine.analyzeChakraPatterns(posts);
      expect(analysis.dominantChakra).toBe('heart');
      expect(analysis.confidence).toBeGreaterThan(0.8);
    });
  });
});
```

## 🌐 Integration Testing

### API Endpoint Testing

```typescript
// tests/integration/api/posts.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/server/index';
import { createTestUser, createTestSession } from '@/tests/helpers/auth';

describe('Posts API Integration', () => {
  let testUser: any;
  let authHeaders: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'spiritual_seeker',
      aura: 15,
      dominantChakra: 'heart'
    });
    
    authHeaders = await createTestSession(testUser.id);
  });

  describe('POST /api/posts', () => {
    it('creates a new spiritual post successfully', async () => {
      const postData = {
        content: 'Today I experienced a profound moment of inner peace during meditation.',
        chakra: 'crown',
        isPublic: true
      };

      const response = await request(app)
        .post('/api/posts')
        .set(authHeaders)
        .send(postData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        content: postData.content,
        chakra: 'crown',
        spiritualFrequency: expect.any(Number),
        author: {
          id: testUser.id,
          username: testUser.username
        }
      });

      // Verify AI chakra categorization
      expect(response.body.spiritualFrequency).toBeGreaterThan(0);
      expect(response.body.chakra).toBe('crown');
    });

    it('applies proper chakra categorization via AI', async () => {
      const earthyPost = {
        content: 'Feeling grounded and stable after my morning walk in nature.',
        isPublic: true
      };

      const response = await request(app)
        .post('/api/posts')
        .set(authHeaders)
        .send(earthyPost)
        .expect(201);

      // AI should categorize this as root chakra content
      expect(response.body.chakra).toBe('root');
      expect(response.body.spiritualFrequency).toBeGreaterThan(0.5);
    });
  });

  describe('POST /api/posts/:id/engage', () => {
    it('handles energy sharing between users', async () => {
      // Create a post from another user
      const postAuthor = await createTestUser({ username: 'mystic_soul' });
      const post = await createTestPost(postAuthor.id, {
        content: 'Sharing loving energy with the community'
      });

      const engagementData = {
        type: 'energy',
        amount: 25
      };

      const response = await request(app)
        .post(`/api/posts/${post.id}/engage`)
        .set(authHeaders)
        .send(engagementData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        energyTransferred: 25,
        resonanceBonus: expect.any(Number),
        spiritExperience: expect.any(Number)
      });

      // Verify energy was deducted from sender
      const updatedUser = await getUserById(testUser.id);
      expect(updatedUser.energy).toBeLessThan(testUser.energy);
    });
  });
});
```

### Database Integration Testing

```typescript
// tests/integration/database/spiritual-data.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/server/db';
import { users, posts, spirits, energyTransactions } from '@/shared/schema';

describe('Spiritual Database Operations', () => {
  beforeEach(async () => {
    // Clean test database
    await db.delete(energyTransactions);
    await db.delete(posts);
    await db.delete(spirits);
    await db.delete(users);
  });

  it('creates user with spirit guide relationship', async () => {
    const userData = {
      id: 'user-1',
      username: 'seeker',
      email: 'seeker@example.com',
      aura: 10
    };

    const spiritData = {
      id: 'spirit-1',
      userId: 'user-1',
      name: 'Wisdom Keeper',
      element: 'air',
      level: 1,
      experience: 0
    };

    // Insert user and spirit
    await db.insert(users).values(userData);
    await db.insert(spirits).values(spiritData);

    // Verify relationship
    const userWithSpirit = await db
      .select()
      .from(users)
      .leftJoin(spirits, eq(users.id, spirits.userId))
      .where(eq(users.id, 'user-1'));

    expect(userWithSpirit[0]).toMatchObject({
      users: userData,
      spirits: spiritData
    });
  });

  it('tracks energy transactions between users', async () => {
    // Create test users
    await db.insert(users).values([
      { id: 'sender', username: 'sender', energy: 100 },
      { id: 'receiver', username: 'receiver', energy: 50 }
    ]);

    // Create energy transaction
    const transaction = {
      id: 'tx-1',
      fromUserId: 'sender',
      toUserId: 'receiver',
      amount: 25,
      type: 'energy_share',
      resonanceBonus: 0.2
    };

    await db.insert(energyTransactions).values(transaction);

    // Verify transaction is recorded
    const savedTransaction = await db
      .select()
      .from(energyTransactions)
      .where(eq(energyTransactions.id, 'tx-1'));

    expect(savedTransaction[0]).toMatchObject(transaction);
  });
});
```

## 🎭 End-to-End Testing

### Spiritual User Journeys

```typescript
// tests/e2e/spiritual-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Spiritual Journey', () => {
  test('user onboarding and spirit creation flow', async ({ page }) => {
    // Navigate to registration
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('[data-testid="input-username"]', 'new_seeker');
    await page.fill('[data-testid="input-email"]', 'seeker@example.com');
    await page.click('[data-testid="button-register"]');

    // Complete spiritual questionnaire
    await expect(page.locator('[data-testid="spiritual-questionnaire"]')).toBeVisible();
    
    // Answer spiritual questions
    await page.click('[data-testid="religious-background-spiritual"]');
    await page.click('[data-testid="meditation-practice-daily"]');
    await page.click('[data-testid="spiritual-path-mystical"]');
    await page.fill('[data-testid="input-sacred-offering"]', 'Compassion and understanding');
    
    await page.click('[data-testid="button-create-spirit"]');

    // Verify spirit guide creation
    await expect(page.locator('[data-testid="spirit-avatar"]')).toBeVisible();
    await expect(page.locator('[data-testid="spirit-name"]')).toContainText(/\w+ \w+/); // Generated name pattern
    await expect(page.locator('[data-testid="spirit-element"]')).toBeVisible();

    // Check initial spirit stats
    await expect(page.locator('[data-testid="spirit-level"]')).toContainText('Level 1');
    await expect(page.locator('[data-testid="spirit-experience"]')).toContainText('0 XP');
  });

  test('posting and engaging with spiritual content', async ({ page }) => {
    // Login as existing user
    await page.goto('/login');
    await loginAsTestUser(page, 'spiritual_seeker');

    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Create a new post
    await page.click('[data-testid="button-create-post"]');
    await page.fill(
      '[data-testid="input-post-content"]', 
      'Today I experienced a beautiful moment of clarity during sunrise meditation.'
    );
    await page.click('[data-testid="button-publish-post"]');

    // Verify post appears in feed
    await expect(page.locator('[data-testid^="post-"]').first()).toContainText('sunrise meditation');

    // Engage with another user's post
    const firstPost = page.locator('[data-testid^="post-"]').first();
    await firstPost.locator('[data-testid="button-like"]').click();
    
    // Share energy with the post
    await firstPost.locator('[data-testid="button-share-energy"]').click();
    await page.fill('[data-testid="input-energy-amount"]', '25');
    await page.click('[data-testid="button-confirm-energy"]');

    // Verify energy transaction
    await expect(page.locator('[data-testid="energy-balance"]')).toContainText(/\d+/);
    
    // Check spirit experience gain
    await page.click('[data-testid="spirit-avatar"]');
    await expect(page.locator('[data-testid="spirit-experience"]')).not.toContainText('0 XP');
  });

  test('oracle reading generation and interaction', async ({ page }) => {
    await page.goto('/login');
    await loginAsTestUser(page, 'premium_user');

    // Navigate to oracle section
    await page.click('[data-testid="nav-oracle"]');
    
    // Request daily reading
    await page.click('[data-testid="button-daily-reading"]');
    
    // Wait for AI-generated reading
    await expect(page.locator('[data-testid="oracle-reading"]')).toBeVisible({ timeout: 10000 });
    
    // Verify reading components
    await expect(page.locator('[data-testid="reading-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="reading-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="reading-chakra-focus"]')).toBeVisible();
    await expect(page.locator('[data-testid="reading-meditation"]')).toBeVisible();

    // Test tarot reading (premium feature)
    await page.click('[data-testid="button-tarot-reading"]');
    await page.fill('[data-testid="input-tarot-question"]', 'What guidance do I need for my spiritual growth?');
    await page.click('[data-testid="button-draw-cards"]');

    // Verify tarot cards are drawn
    await expect(page.locator('[data-testid="tarot-card"]')).toHaveCount(3);
    await expect(page.locator('[data-testid="tarot-interpretation"]')).toBeVisible({ timeout: 15000 });
  });

  test('3D starmap visualization interaction', async ({ page }) => {
    await page.goto('/login');
    await loginAsTestUser(page, 'community_member');

    // Navigate to starmap
    await page.click('[data-testid="nav-starmap"]');
    
    // Wait for 3D scene to load
    await expect(page.locator('[data-testid="starmap-canvas"]')).toBeVisible();
    await page.waitForTimeout(3000); // Allow WebGL initialization

    // Test macro view
    await expect(page.locator('[data-testid="starmap-mode-macro"]')).toHaveClass(/active/);
    
    // Switch to micro view
    await page.click('[data-testid="button-micro-view"]');
    await expect(page.locator('[data-testid="starmap-mode-micro"]')).toHaveClass(/active/);

    // Test user node interaction
    await page.hover('[data-testid="starmap-canvas"]');
    await page.click('[data-testid="starmap-canvas"]', { position: { x: 400, y: 300 } });
    
    // Verify user info popup
    await expect(page.locator('[data-testid="user-info-popup"]')).toBeVisible();
    
    // Test chakra filter
    await page.click('[data-testid="chakra-filter-heart"]');
    await page.waitForTimeout(1000); // Allow animation
    
    // Verify filtering applied
    await expect(page.locator('[data-testid="starmap-filter-active"]')).toContainText('heart');
  });
});
```

### Performance Testing

```typescript
// tests/performance/spiritual-platform.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Benchmarks', () => {
  test('dashboard loading performance', async ({ page }) => {
    // Start performance measurement
    await page.coverage.startJSCoverage();
    
    const startTime = Date.now();
    await page.goto('/dashboard');
    
    // Wait for critical spiritual content
    await expect(page.locator('[data-testid="spirit-avatar"]')).toBeVisible();
    await expect(page.locator('[data-testid="energy-balance"]')).toBeVisible();
    await expect(page.locator('[data-testid="posts-feed"]')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Performance assertions
    expect(loadTime).toBeLessThan(3000); // Under 3 seconds
    
    // Check Lighthouse metrics
    const lighthouse = await page.evaluate(() => {
      return window.performance.getEntriesByType('navigation')[0];
    });
    
    expect(lighthouse.loadEventEnd - lighthouse.fetchStart).toBeLessThan(2000);
  });

  test('3D starmap rendering performance', async ({ page }) => {
    await page.goto('/starmap');
    
    // Measure WebGL initialization time
    const webglStart = Date.now();
    await expect(page.locator('[data-testid="starmap-canvas"]')).toBeVisible();
    
    // Wait for 3D scene ready
    await page.waitForFunction(() => {
      return window.starmapRenderer && window.starmapRenderer.isReady;
    });
    
    const webglTime = Date.now() - webglStart;
    expect(webglTime).toBeLessThan(5000); // Under 5 seconds for WebGL init

    // Test frame rate during interaction
    const fps = await page.evaluate(async () => {
      let frameCount = 0;
      const startTime = performance.now();
      
      return new Promise((resolve) => {
        function frame() {
          frameCount++;
          if (performance.now() - startTime > 1000) {
            resolve(frameCount);
          } else {
            requestAnimationFrame(frame);
          }
        }
        requestAnimationFrame(frame);
      });
    });

    expect(fps).toBeGreaterThan(30); // Maintain 30+ FPS
  });

  test('API response times under load', async ({ page }) => {
    const apiResponses: number[] = [];
    
    // Monitor API calls
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const timing = response.timing();
        apiResponses.push(timing.responseEnd - timing.requestStart);
      }
    });

    // Navigate and interact to trigger API calls
    await page.goto('/dashboard');
    await page.click('[data-testid="button-refresh-feed"]');
    await page.click('[data-testid="nav-oracle"]');
    await page.click('[data-testid="button-daily-reading"]');

    // Wait for API calls to complete
    await page.waitForTimeout(2000);

    // Analyze API performance
    const avgResponseTime = apiResponses.reduce((a, b) => a + b, 0) / apiResponses.length;
    const maxResponseTime = Math.max(...apiResponses);

    expect(avgResponseTime).toBeLessThan(500); // Average under 500ms
    expect(maxResponseTime).toBeLessThan(2000); // Max under 2 seconds
  });
});
```

## 📊 Visual Regression Testing

### Chromatic Integration

```typescript
// tests/visual/spiritual-components.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { SpiritAvatar } from '@/components/SpiritAvatar';

const meta: Meta<typeof SpiritAvatar> = {
  title: 'Spiritual/SpiritAvatar',
  component: SpiritAvatar,
  parameters: {
    layout: 'centered',
    chromatic: {
      viewports: [320, 768, 1200], // Test responsive design
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpiritAvatar>;

export const FireElement: Story = {
  args: {
    spirit: {
      id: 'spirit-1',
      name: 'Ignis Soulforge',
      element: 'fire',
      level: 5,
      experience: 500,
      evolution: { stage: 'awakened', nextEvolution: 1000 }
    },
    size: 64
  },
};

export const WaterElementEvolved: Story = {
  args: {
    spirit: {
      id: 'spirit-2',
      name: 'Luna Dreamweaver',
      element: 'water',
      level: 15,
      experience: 1500,
      evolution: { stage: 'transcendent', nextEvolution: 2000 }
    },
    size: 96
  },
};

export const ChakraVisualization: Story = {
  args: {
    spirit: {
      id: 'spirit-3',
      name: 'Cosmic Guardian',
      element: 'ether',
      level: 25,
      experience: 2500,
      evolution: { stage: 'cosmic', nextEvolution: null }
    },
    size: 128,
    showChakraAura: true
  },
};
```

### Visual Testing Pipeline

```json
// .github/workflows/visual-testing.yml
name: Visual Regression Testing

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: 'build-storybook'
          exitOnceUploaded: true
```

## 🤖 Automated Testing with Browser Automation

### Production Monitoring Tests

```typescript
// tests/automation/production-monitoring.ts
import { BrowserlessService } from '@/lib/browserless';

export class ProductionMonitoringService {
  private browserless: BrowserlessService;

  async runSpiritualPlatformHealthCheck(): Promise<HealthCheckResult> {
    const results = await Promise.all([
      this.testUserAuthentication(),
      this.testSpiritGuideGeneration(),
      this.testEnergyTransactions(),
      this.testOracleReadings(),
      this.testStarmapVisualization()
    ]);

    return this.aggregateHealthResults(results);
  }

  private async testUserAuthentication(): Promise<TestResult> {
    const task = `
      Navigate to ascended.social
      Click the login button
      Verify that Replit Auth redirects properly
      Check that the login flow completes without errors
    `;

    const result = await this.browserless.executeTask(task, {
      timeout: 30000,
      viewport: { width: 1920, height: 1080 }
    });

    return {
      test: 'user_authentication',
      passed: result.success,
      duration: result.duration,
      details: result.details
    };
  }

  private async testSpiritGuideGeneration(): Promise<TestResult> {
    const task = `
      Log in as test user
      Navigate to spirit guide section
      Verify spirit avatar displays correctly
      Check that experience points are updating
      Validate spirit evolution mechanics
    `;

    return await this.executeMonitoringTask('spirit_guide_generation', task);
  }

  private async testEnergyTransactions(): Promise<TestResult> {
    const task = `
      Navigate to community feed
      Find a post to engage with
      Click the energy sharing button
      Enter an energy amount of 25
      Confirm the transaction
      Verify energy balance updates
      Check that the recipient receives energy
    `;

    return await this.executeMonitoringTask('energy_transactions', task);
  }

  private async testOracleReadings(): Promise<TestResult> {
    const task = `
      Navigate to oracle section
      Request a daily reading
      Wait for AI-generated content to load
      Verify reading includes all components:
      - Title and main message
      - Chakra focus
      - Practical advice
      - Meditation suggestion
      Check that reading is personalized to user
    `;

    return await this.executeMonitoringTask('oracle_readings', task);
  }

  private async testStarmapVisualization(): Promise<TestResult> {
    const task = `
      Navigate to 3D starmap
      Wait for WebGL scene to initialize
      Test macro view rendering
      Switch to micro view
      Interact with user nodes
      Check that connections display properly
      Verify chakra filtering works
    `;

    return await this.executeMonitoringTask('starmap_visualization', task);
  }

  private async executeMonitoringTask(testName: string, task: string): Promise<TestResult> {
    try {
      const result = await this.browserless.executeTask(task, {
        timeout: 60000,
        retries: 2
      });

      return {
        test: testName,
        passed: result.success,
        duration: result.duration,
        details: result.details,
        screenshot: result.screenshot
      };
    } catch (error) {
      return {
        test: testName,
        passed: false,
        duration: 0,
        details: error.message,
        error: error
      };
    }
  }
}
```

## 📈 Performance Monitoring

### Real-time Performance Metrics

```typescript
// tests/performance/spiritual-metrics.ts
export class SpiritualPerformanceMonitor {
  async measureSpiritualFeaturePerformance(): Promise<PerformanceReport> {
    const metrics = await Promise.all([
      this.measureSpiritAvatarRendering(),
      this.measureEnergyCalculations(),
      this.measureChakraAnalysis(),
      this.measureOracleResponseTime(),
      this.measureStarmapFrameRate()
    ]);

    return {
      timestamp: new Date().toISOString(),
      metrics: metrics,
      overallScore: this.calculatePerformanceScore(metrics),
      recommendations: this.generateOptimizationRecommendations(metrics)
    };
  }

  private async measureSpiritAvatarRendering(): Promise<PerformanceMetric> {
    const startTime = performance.now();
    
    // Simulate spirit avatar rendering with various evolution stages
    const avatarTests = [
      { level: 1, element: 'fire', evolution: 'nascent' },
      { level: 10, element: 'water', evolution: 'awakened' },
      { level: 25, element: 'air', evolution: 'transcendent' }
    ];

    for (const avatar of avatarTests) {
      await this.renderSpiritAvatar(avatar);
    }

    const duration = performance.now() - startTime;

    return {
      name: 'spirit_avatar_rendering',
      value: duration,
      unit: 'milliseconds',
      threshold: 100,
      passed: duration < 100
    };
  }

  private async measureEnergyCalculations(): Promise<PerformanceMetric> {
    const startTime = performance.now();
    
    // Run energy calculation stress test
    for (let i = 0; i < 1000; i++) {
      await this.calculateEnergyTransfer({
        fromUser: { aura: Math.random() * 100, chakra: this.randomChakra() },
        toUser: { aura: Math.random() * 100, chakra: this.randomChakra() },
        amount: Math.random() * 50
      });
    }

    const duration = performance.now() - startTime;
    const averageTime = duration / 1000;

    return {
      name: 'energy_calculations',
      value: averageTime,
      unit: 'milliseconds',
      threshold: 1,
      passed: averageTime < 1
    };
  }

  private async measureChakraAnalysis(): Promise<PerformanceMetric> {
    const startTime = performance.now();
    
    // Test chakra analysis with varying content lengths
    const testPosts = [
      'Short spiritual thought',
      'Medium length post about meditation and mindfulness practices that help center the mind',
      'Long form spiritual content discussing the interconnectedness of all beings and the journey toward enlightenment through various practices including meditation, energy work, chakra balancing, and community connection within the spiritual framework'
    ];

    for (const content of testPosts) {
      await this.analyzeChakraContent(content);
    }

    const duration = performance.now() - startTime;

    return {
      name: 'chakra_analysis',
      value: duration,
      unit: 'milliseconds',
      threshold: 2000,
      passed: duration < 2000
    };
  }

  private async measureOracleResponseTime(): Promise<PerformanceMetric> {
    const startTime = performance.now();
    
    // Simulate oracle reading generation
    await this.generateOracleReading({
      userId: 'test-user',
      question: 'What guidance do I need for my spiritual growth?',
      context: {
        auraLevel: 15,
        dominantChakra: 'heart',
        recentActivity: 'meditation_focused'
      }
    });

    const duration = performance.now() - startTime;

    return {
      name: 'oracle_response_time',
      value: duration,
      unit: 'milliseconds',
      threshold: 5000,
      passed: duration < 5000
    };
  }

  private async measureStarmapFrameRate(): Promise<PerformanceMetric> {
    let frameCount = 0;
    const startTime = performance.now();
    
    // Monitor frame rate for 3 seconds
    return new Promise((resolve) => {
      function frame() {
        frameCount++;
        if (performance.now() - startTime > 3000) {
          const fps = frameCount / 3;
          resolve({
            name: 'starmap_frame_rate',
            value: fps,
            unit: 'fps',
            threshold: 30,
            passed: fps >= 30
          });
        } else {
          requestAnimationFrame(frame);
        }
      }
      requestAnimationFrame(frame);
    });
  }

  private calculatePerformanceScore(metrics: PerformanceMetric[]): number {
    const passedTests = metrics.filter(m => m.passed).length;
    return (passedTests / metrics.length) * 100;
  }

  private generateOptimizationRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations = [];
    
    metrics.forEach(metric => {
      if (!metric.passed) {
        switch (metric.name) {
          case 'spirit_avatar_rendering':
            recommendations.push('Consider implementing sprite caching for spirit avatars');
            break;
          case 'energy_calculations':
            recommendations.push('Optimize energy calculation algorithms or implement caching');
            break;
          case 'chakra_analysis':
            recommendations.push('Consider implementing content analysis caching or async processing');
            break;
          case 'oracle_response_time':
            recommendations.push('Optimize AI prompt engineering or implement response caching');
            break;
          case 'starmap_frame_rate':
            recommendations.push('Optimize WebGL shaders or reduce particle count');
            break;
        }
      }
    });

    return recommendations;
  }
}
```

## 🔍 Test Reporting and Analytics

### Comprehensive Test Dashboard

```typescript
// tests/reporting/test-analytics.ts
export class TestAnalyticsService {
  async generateTestReport(timeframe: TimeRange): Promise<TestReport> {
    const testResults = await this.aggregateTestResults(timeframe);
    
    return {
      summary: {
        totalTests: testResults.length,
        passedTests: testResults.filter(r => r.passed).length,
        failedTests: testResults.filter(r => !r.passed).length,
        averageExecutionTime: this.calculateAverageTime(testResults),
        testCoverage: await this.calculateTestCoverage(),
        spiritualFeatureCoverage: await this.calculateSpiritualFeatureCoverage()
      },
      
      performanceMetrics: {
        apiResponseTimes: await this.getApiPerformanceMetrics(timeframe),
        renderingPerformance: await this.getRenderingMetrics(timeframe),
        spiritualCalculationPerformance: await this.getSpiritualCalculationMetrics(timeframe)
      },
      
      spiritualFeatureAnalysis: {
        spiritGuideTests: await this.getSpiritGuideTestResults(timeframe),
        energySystemTests: await this.getEnergySystemTestResults(timeframe),
        oracleSystemTests: await this.getOracleSystemTestResults(timeframe),
        starmapTests: await this.getStarmapTestResults(timeframe)
      },
      
      qualityMetrics: {
        bugDetectionRate: await this.calculateBugDetectionRate(timeframe),
        regressionPrevention: await this.calculateRegressionPrevention(timeframe),
        userExperienceScore: await this.calculateUXScore(timeframe)
      },
      
      recommendations: await this.generateTestingRecommendations(testResults)
    };
  }

  private async calculateSpiritualFeatureCoverage(): Promise<CoverageReport> {
    return {
      spiritGuideSystem: {
        creation: 95,
        evolution: 90,
        visualization: 85
      },
      energySystem: {
        calculations: 98,
        transactions: 92,
        resonance: 88
      },
      oracleSystem: {
        dailyReadings: 90,
        tarotReadings: 85,
        personalization: 80
      },
      starmapVisualization: {
        rendering: 85,
        interactions: 80,
        performance: 75
      },
      overallCoverage: 87
    };
  }
}
```

---

*May your tests be comprehensive, your bugs be few, and your spiritual platform bring peace and connection to all users! 🙏*
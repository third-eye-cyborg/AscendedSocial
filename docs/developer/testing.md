# Testing Guide

Comprehensive testing strategy for Ascended Social, covering unit tests, integration tests, and end-to-end testing with spiritual community features.

## 🧪 Testing Philosophy

### Spiritual-First Testing
Our testing approach reflects spiritual principles:
- **Integrity**: Tests verify authentic spiritual features work correctly
- **Harmony**: Test suites work together like a spiritual community
- **Growth**: Tests help the platform evolve while maintaining quality
- **Balance**: Comprehensive coverage without over-testing

### Quality Assurance Goals
- **User Experience**: Ensure spiritual features provide genuine value
- **Community Safety**: Verify moderation and safety features work correctly
- **Data Integrity**: Protect user spiritual data and growth tracking
- **Performance**: Maintain responsive experience during spiritual interactions

## 🏗️ Testing Architecture

### Testing Stack
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Supertest for API endpoint testing
- **End-to-End Tests**: Playwright for full user journey testing
- **Visual Regression**: Scrapybara for UI consistency testing
- **Performance**: Lighthouse CI for spiritual page performance

### Test Organization
```
tests/
├── unit/                    # Individual component and function tests
│   ├── components/          # React component tests
│   ├── hooks/              # Custom hook tests
│   ├── utils/              # Utility function tests
│   └── services/           # Service layer tests
├── integration/            # API and database integration tests
│   ├── api/               # API endpoint tests
│   ├── auth/              # Authentication flow tests
│   └── database/          # Database operation tests
├── e2e/                   # End-to-end user journey tests
│   ├── spiritual/         # Spiritual feature flows
│   ├── community/         # Community interaction tests
│   └── premium/           # Premium feature tests
├── visual/                # Visual regression tests
│   ├── components/        # Component visual tests
│   └── pages/            # Full page visual tests
└── fixtures/              # Test data and mocks
    ├── users.ts           # Mock user data
    ├── spirits.ts         # Mock spirit guide data
    └── posts.ts           # Mock spiritual content
```

## 🔧 Unit Testing

### Component Testing Strategy

#### Testing Spiritual Components
```typescript
// SpiritAvatar component test
import { render, screen } from '@testing-library/react';
import { SpiritAvatar } from '@/components/SpiritAvatar';

describe('SpiritAvatar', () => {
  const mockSpirit = {
    id: '123',
    name: 'Luna Dreamweaver',
    element: 'water',
    level: 7,
    experience: 650
  };

  it('displays spirit information correctly', () => {
    render(<SpiritAvatar spirit={mockSpirit} />);
    
    expect(screen.getByTestId('spirit-avatar-7')).toBeInTheDocument();
    expect(screen.getByText('Luna Dreamweaver')).toBeInTheDocument();
    expect(screen.getByText('Level 7')).toBeInTheDocument();
  });

  it('shows correct elemental symbol for water spirit', () => {
    render(<SpiritAvatar spirit={mockSpirit} />);
    
    // Water spirits show ocean wave symbol at level 7
    expect(screen.getByText('🌊')).toBeInTheDocument();
  });

  it('calculates correct glow intensity based on level', () => {
    render(<SpiritAvatar spirit={mockSpirit} />);
    
    const avatar = screen.getByTestId('spirit-avatar-7');
    const style = window.getComputedStyle(avatar);
    
    // Level 7 should have 14px glow (level * 2)
    expect(style.boxShadow).toContain('14px');
  });

  it('handles spirit evolution visual changes', () => {
    const highLevelSpirit = { ...mockSpirit, level: 15 };
    render(<SpiritAvatar spirit={highLevelSpirit} />);
    
    // Level 15 water spirit should show crystal ball symbol
    expect(screen.getByText('🔮')).toBeInTheDocument();
    expect(screen.getByTestId('spirit-tier-master')).toBeInTheDocument();
  });
});
```

#### Testing Energy System Components
```typescript
// EnergyMeter component test
describe('EnergyMeter', () => {
  it('displays current energy level correctly', () => {
    const user = { energy: 750 };
    render(<EnergyMeter user={user} />);
    
    expect(screen.getByText('750')).toBeInTheDocument();
    expect(screen.getByText('out of 1000 energy points')).toBeInTheDocument();
  });

  it('shows correct energy status badge', () => {
    const lowEnergyUser = { energy: 50 };
    render(<EnergyMeter user={lowEnergyUser} />);
    
    expect(screen.getByTestId('energy-status-critical')).toBeInTheDocument();
  });

  it('calculates energy percentage correctly', () => {
    const user = { energy: 250 };
    render(<EnergyMeter user={user} />);
    
    const progressBar = screen.getByTestId('energy-progress-bar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');
  });
});
```

### Hook Testing

#### Testing Custom Spiritual Hooks
```typescript
// useSpirit hook test
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSpirit } from '@/hooks/useSpirit';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useSpirit', () => {
  it('fetches spirit data correctly', async () => {
    const mockSpirit = {
      name: 'Ignis Soulforge',
      element: 'fire',
      level: 5
    };

    // Mock the API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSpirit),
      })
    ) as jest.MockedFunction<typeof fetch>;

    const { result } = renderHook(() => useSpirit(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockSpirit);
    });
  });

  it('handles spirit evolution updates', async () => {
    const { result } = renderHook(() => useSpirit(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.evolveSpirit).toBeDefined();
    });

    // Test spirit evolution mutation
    result.current.evolveSpirit.mutate({
      action: 'energy_share',
      experienceGain: 20
    });

    await waitFor(() => {
      expect(result.current.evolveSpirit.isSuccess).toBe(true);
    });
  });
});
```

### Service Testing

#### Testing AI Integration Services
```typescript
// OpenAI service tests
import { generateSpirit, generateDailyReading } from '@/server/openai';

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}));

describe('OpenAI Services', () => {
  describe('generateSpirit', () => {
    it('generates spirit from questionnaire', async () => {
      const questionnaire = {
        isSpiritual: true,
        spiritualPath: 'meditation',
        element: 'water',
        beliefs: 'Universal connection through mindfulness'
      };

      const mockAIResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              name: 'Serenity Flowkeeper',
              description: 'A calm spirit guide for meditation practitioners',
              element: 'water'
            })
          }
        }]
      };

      (OpenAI.prototype.chat.completions.create as jest.Mock)
        .mockResolvedValueOnce(mockAIResponse);

      const result = await generateSpirit(questionnaire);

      expect(result.name).toBe('Serenity Flowkeeper');
      expect(result.element).toBe('water');
      expect(result.description).toContain('meditation');
    });

    it('handles AI service failures gracefully', async () => {
      (OpenAI.prototype.chat.completions.create as jest.Mock)
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(generateSpirit({})).rejects.toThrow('Spirit generation failed');
    });
  });

  describe('generateDailyReading', () => {
    it('creates personalized daily reading', async () => {
      const mockReading = {
        title: 'Trust Your Inner Wisdom',
        content: 'Today calls for deep introspection...',
        guidance: 'Spend time in quiet meditation'
      };

      (OpenAI.prototype.chat.completions.create as jest.Mock)
        .mockResolvedValueOnce({
          choices: [{
            message: { content: JSON.stringify(mockReading) }
          }]
        });

      const result = await generateDailyReading();

      expect(result.title).toBe('Trust Your Inner Wisdom');
      expect(result.content).toContain('introspection');
    });
  });
});
```

## 🔗 Integration Testing

### API Endpoint Testing

#### Authentication Endpoints
```typescript
// Authentication integration tests
import request from 'supertest';
import { app } from '@/server';

describe('Authentication Endpoints', () => {
  describe('GET /api/auth/user', () => {
    it('returns user data for authenticated users', async () => {
      // Mock authenticated session
      const agent = request.agent(app);
      
      await agent
        .post('/api/auth/login')
        .send({ token: 'valid-test-token' });

      const response = await agent
        .get('/api/auth/user')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('energy');
    });

    it('returns 401 for unauthenticated requests', async () => {
      await request(app)
        .get('/api/auth/user')
        .expect(401);
    });
  });
});
```

#### Spiritual Feature Endpoints
```typescript
// Spirit guide API tests
describe('Spirit Guide Endpoints', () => {
  describe('GET /api/spirit', () => {
    it('returns user spirit guide', async () => {
      const response = await authenticatedRequest
        .get('/api/spirit')
        .expect(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        element: expect.stringMatching(/^(fire|water|earth|air)$/),
        level: expect.any(Number),
        experience: expect.any(Number)
      });
    });

    it('includes evolution history', async () => {
      const response = await authenticatedRequest
        .get('/api/spirit')
        .expect(200);

      expect(response.body.evolution).toBeInstanceOf(Array);
      
      if (response.body.evolution.length > 0) {
        expect(response.body.evolution[0]).toMatchObject({
          timestamp: expect.any(String),
          action: expect.any(String),
          experienceGain: expect.any(Number)
        });
      }
    });
  });

  describe('PUT /api/spirit/experience', () => {
    it('updates spirit experience correctly', async () => {
      const updateData = {
        action: 'like_engagement',
        experienceGain: 5,
        postId: 'test-post-id'
      };

      const response = await authenticatedRequest
        .put('/api/spirit/experience')
        .send(updateData)
        .expect(200);

      expect(response.body.experience).toBeGreaterThan(0);
    });

    it('handles level up correctly', async () => {
      // Set up spirit near level boundary
      await setupSpiritWithExperience(95);

      const response = await authenticatedRequest
        .put('/api/spirit/experience')
        .send({
          action: 'energy_share',
          experienceGain: 20
        })
        .expect(200);

      expect(response.body.level).toBeGreaterThan(1);
      expect(response.body.evolution).toHaveLength(1);
    });
  });
});
```

#### Energy System Integration
```typescript
// Energy system API tests
describe('Energy System Endpoints', () => {
  describe('POST /api/posts/:id/engage', () => {
    it('deducts energy for energy engagements', async () => {
      const user = await getUserWithEnergy(500);
      
      const response = await authenticatedRequest
        .post('/api/posts/test-post/engage')
        .send({ type: 'energy' })
        .expect(200);

      // Verify energy was deducted
      const updatedUser = await getUser(user.id);
      expect(updatedUser.energy).toBe(490);
    });

    it('rejects energy engagement with insufficient energy', async () => {
      await setUserEnergy(5); // Less than required 10

      await authenticatedRequest
        .post('/api/posts/test-post/engage')
        .send({ type: 'energy' })
        .expect(400, { message: 'Insufficient energy' });
    });

    it('awards correct spirit experience for energy actions', async () => {
      const initialSpirit = await getUserSpirit();
      
      await authenticatedRequest
        .post('/api/posts/test-post/engage')
        .send({ type: 'energy' })
        .expect(200);

      const updatedSpirit = await getUserSpirit();
      expect(updatedSpirit.experience).toBe(initialSpirit.experience + 20);
    });
  });
});
```

### Database Integration Testing

#### Spirit Evolution Testing
```typescript
// Database operations for spirit system
describe('Spirit Database Operations', () => {
  it('correctly updates spirit evolution history', async () => {
    const spirit = await createTestSpirit();
    
    await storage.updateSpiritExperience(spirit.id, {
      action: 'comment_engagement',
      experienceGain: 8,
      postId: 'test-post'
    });

    const updatedSpirit = await storage.getSpirit(spirit.id);
    
    expect(updatedSpirit.experience).toBe(8);
    expect(updatedSpirit.evolution).toHaveLength(1);
    expect(updatedSpirit.evolution[0]).toMatchObject({
      action: 'comment_engagement',
      experienceGain: 8
    });
  });

  it('handles level progression correctly', async () => {
    const spirit = await createTestSpirit({ experience: 95 });
    
    await storage.updateSpiritExperience(spirit.id, {
      action: 'energy_share',
      experienceGain: 20
    });

    const updatedSpirit = await storage.getSpirit(spirit.id);
    
    expect(updatedSpirit.level).toBe(2);
    expect(updatedSpirit.experience).toBe(115);
  });
});
```

## 🌐 End-to-End Testing

### User Journey Testing

#### Spiritual Onboarding Flow
```typescript
// E2E test for complete spiritual onboarding
import { test, expect } from '@playwright/test';

test.describe('Spiritual Onboarding', () => {
  test('complete onboarding creates spirit guide', async ({ page }) => {
    await page.goto('/');
    
    // Sign up process
    await page.click('[data-testid="button-signin"]');
    
    // Complete spiritual questionnaire
    await page.fill('[data-testid="input-beliefs"]', 
      'I believe in universal connection through mindfulness');
    await page.selectOption('[data-testid="select-spiritual-path"]', 'meditation');
    await page.selectOption('[data-testid="select-element"]', 'water');
    
    await page.click('[data-testid="button-complete-onboarding"]');
    
    // Verify spirit guide was created
    await expect(page.locator('[data-testid="spirit-name"]')).toContainText('water');
    await expect(page.locator('[data-testid="spirit-level"]')).toContainText('Level 1');
    
    // Verify user redirected to main feed
    await expect(page.url()).toContain('/home');
  });
});
```

#### Community Engagement Flow
```typescript
// E2E test for community engagement and spirit evolution
test.describe('Community Engagement', () => {
  test('user can engage with posts and evolve spirit', async ({ page }) => {
    await loginAsTestUser(page);
    
    // Navigate to home feed
    await page.goto('/');
    
    // Find a post and engage with it
    const firstPost = page.locator('[data-testid^="post-card-"]').first();
    await firstPost.locator('[data-testid="button-like"]').click();
    
    // Check spirit gained experience
    await page.click('[data-testid="link-spirit"]');
    await expect(page.locator('[data-testid="spirit-experience"]')).toContainText('5');
    
    // Try energy engagement
    await page.goto('/');
    await firstPost.locator('[data-testid="button-energy"]').click();
    
    // Verify energy was deducted
    await expect(page.locator('[data-testid="energy-level"]')).toContainText('990');
    
    // Verify higher spirit experience
    await page.click('[data-testid="link-spirit"]');
    await expect(page.locator('[data-testid="spirit-experience"]')).toContainText('25');
  });

  test('user can create post and receive engagements', async ({ page }) => {
    await loginAsTestUser(page);
    
    // Create a new post
    await page.fill('[data-testid="input-post-content"]', 
      'Today I experienced a profound meditation insight about interconnectedness.');
    await page.click('[data-testid="button-create-post"]');
    
    // Wait for post to appear
    await expect(page.locator('[data-testid^="post-card-"]').first())
      .toContainText('profound meditation insight');
    
    // Verify chakra categorization
    await expect(page.locator('[data-testid="post-chakra"]').first())
      .toContainText('crown');
  });
});
```

#### Premium Feature Testing
```typescript
// E2E test for premium features
test.describe('Premium Features', () => {
  test('premium user can access unlimited energy', async ({ page }) => {
    await loginAsPremiumUser(page);
    
    // Use energy multiple times beyond free limit
    for (let i = 0; i < 5; i++) {
      const post = page.locator('[data-testid^="post-card-"]').nth(i);
      await post.locator('[data-testid="button-energy"]').click();
    }
    
    // Energy should remain unlimited for premium users
    await expect(page.locator('[data-testid="energy-level"]')).toContainText('∞');
  });

  test('premium user can generate custom sigils', async ({ page }) => {
    await loginAsPremiumUser(page);
    
    await page.goto('/profile/settings');
    await page.click('[data-testid="button-generate-sigil"]');
    
    // Wait for AI generation
    await expect(page.locator('[data-testid="generated-sigil"]')).toBeVisible();
    
    // Set as profile image
    await page.click('[data-testid="button-set-profile-sigil"]');
    
    // Verify sigil appears in profile
    await expect(page.locator('[data-testid="profile-image"]'))
      .toContainText('◇'); // Should contain sigil symbols
  });
});
```

### Oracle System Testing
```typescript
// E2E test for Oracle features
test.describe('Oracle System', () => {
  test('user receives daily reading', async ({ page }) => {
    await loginAsTestUser(page);
    
    await page.goto('/oracle');
    
    // Verify daily reading is displayed
    await expect(page.locator('[data-testid="daily-reading-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="daily-reading-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="daily-reading-guidance"]')).toBeVisible();
  });

  test('premium user can generate tarot reading', async ({ page }) => {
    await loginAsPremiumUser(page);
    
    await page.goto('/oracle');
    
    // Ask a tarot question
    await page.fill('[data-testid="input-tarot-question"]', 
      'What guidance do I need for my spiritual growth?');
    await page.click('[data-testid="button-generate-tarot"]');
    
    // Wait for AI generation
    await expect(page.locator('[data-testid="tarot-card-past"]')).toBeVisible();
    await expect(page.locator('[data-testid="tarot-card-present"]')).toBeVisible();
    await expect(page.locator('[data-testid="tarot-card-future"]')).toBeVisible();
    
    // Verify interpretation is provided
    await expect(page.locator('[data-testid="tarot-interpretation"]')).toBeVisible();
  });
});
```

## 🎨 Visual Regression Testing

### Component Visual Testing
Using Scrapybara for automated screenshot testing:

```typescript
// Visual regression tests for spiritual components
import { test } from '@playwright/test';
import { takeScreenshot, compareScreenshots } from '@/tests/visual/utils';

test.describe('Spirit Avatar Visual Tests', () => {
  test('spirit avatar displays correctly for each element', async ({ page }) => {
    for (const element of ['fire', 'water', 'earth', 'air']) {
      await page.goto(`/test/spirit-avatar?element=${element}&level=5`);
      await takeScreenshot(page, `spirit-avatar-${element}-level-5`);
    }
  });

  test('spirit evolution visual changes', async ({ page }) => {
    for (let level = 1; level <= 20; level += 5) {
      await page.goto(`/test/spirit-avatar?element=fire&level=${level}`);
      await takeScreenshot(page, `spirit-evolution-fire-level-${level}`);
    }
  });
});

test.describe('Energy System Visual Tests', () => {
  test('energy meter displays correctly at different levels', async ({ page }) => {
    const energyLevels = [1000, 750, 500, 250, 50, 0];
    
    for (const energy of energyLevels) {
      await page.goto(`/test/energy-meter?energy=${energy}`);
      await takeScreenshot(page, `energy-meter-${energy}`);
    }
  });
});
```

### Page Visual Testing
```typescript
// Full page visual regression tests
test.describe('Page Visual Tests', () => {
  test('home feed displays consistently', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/');
    
    // Wait for dynamic content to load
    await page.waitForSelector('[data-testid^="post-card-"]');
    
    await takeScreenshot(page, 'home-feed-authenticated');
  });

  test('oracle page maintains mystical design', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/oracle');
    
    await page.waitForSelector('[data-testid="daily-reading-content"]');
    
    await takeScreenshot(page, 'oracle-page-daily-reading');
  });
});
```

## 📊 Performance Testing

### Spiritual Page Performance
```typescript
// Performance testing for spiritual features
import { test } from '@playwright/test';
import { injectLighthouse } from '@playwright-lighthouse/test';

test.describe('Performance Tests', () => {
  test('home feed loads quickly with spiritual content', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/');
    
    await injectLighthouse(page, {
      performance: 85,
      accessibility: 90,
      'best-practices': 85,
      seo: 80
    });
  });

  test('spirit page evolution animations are smooth', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/spirit');
    
    // Measure animation performance
    await page.evaluate(() => {
      performance.mark('spirit-animation-start');
    });
    
    await page.click('[data-testid="button-spirit-details"]');
    
    await page.evaluate(() => {
      performance.mark('spirit-animation-end');
      performance.measure('spirit-animation', 'spirit-animation-start', 'spirit-animation-end');
    });
    
    const animationDuration = await page.evaluate(() => {
      const measure = performance.getEntriesByName('spirit-animation')[0];
      return measure.duration;
    });
    
    // Animation should complete within 500ms
    expect(animationDuration).toBeLessThan(500);
  });
});
```

## 🛠️ Test Utilities

### Test Data Factory
```typescript
// Factory functions for creating test data
export const createTestUser = (overrides = {}) => ({
  id: 'test-user-' + Math.random().toString(36),
  email: 'test@example.com',
  username: 'spiritual_seeker',
  energy: 1000,
  aura: 0,
  isPremium: false,
  hasCompletedOnboarding: true,
  ...overrides
});

export const createTestSpirit = (overrides = {}) => ({
  id: 'test-spirit-' + Math.random().toString(36),
  name: 'Luna Dreamweaver',
  description: 'A wise guide for spiritual growth',
  element: 'water',
  level: 1,
  experience: 0,
  evolution: [],
  ...overrides
});

export const createTestPost = (overrides = {}) => ({
  id: 'test-post-' + Math.random().toString(36),
  content: 'Today I experienced profound spiritual insight during meditation.',
  chakra: 'crown',
  frequency: 8.5,
  authorId: 'test-author-id',
  ...overrides
});
```

### Mock Services
```typescript
// Mock spiritual AI services for testing
export const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn(() => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              name: 'Test Spirit',
              element: 'fire',
              description: 'A test spirit guide'
            })
          }
        }]
      }))
    }
  }
};

// Mock authentication for tests
export const mockAuth = {
  user: createTestUser(),
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn()
};
```

## 🚀 Running Tests

### Test Commands
```bash
# Run all unit tests
npm run test

# Run tests in watch mode during development
npm run test:watch

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run visual regression tests
npm run test:visual

# Run performance tests
npm run test:performance

# Generate coverage report
npm run test:coverage

# Run all tests (CI/CD pipeline)
npm run test:all
```

### Test Configuration
```json
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

*Testing ensures our spiritual platform maintains integrity, performance, and authentic user experience while supporting the community's growth and connection. Each test serves the higher purpose of protecting and nurturing authentic spiritual development.* 🧪✨
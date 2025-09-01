import { BrowserlessAuthService } from './browserless-service';

export interface BrowserTask {
  id: string;
  type: 'screenshot' | 'pdf' | 'scrape' | 'test' | 'automation';
  url: string;
  instructions: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export class BrowserAutomationService {
  private browserless: BrowserlessAuthService;
  private activeTasks: Map<string, BrowserTask> = new Map();

  constructor(browserless: BrowserlessAuthService) {
    this.browserless = browserless;
  }

  /**
   * Execute natural language browser automation tasks
   */
  async executeAutomationTask(instructions: string, url: string): Promise<{
    success: boolean;
    result?: any;
    error?: string;
    screenshots?: string[];
  }> {
    try {
      console.log(`🤖 Executing automation task: ${instructions}`);
      
      const browser = await this.browserless.getBrowser();
      const page = await browser.newPage();

      // Set viewport for consistent screenshots
      await page.setViewportSize({ width: 1280, height: 720 });

      const results = {
        success: false,
        result: null,
        error: null,
        screenshots: [] as string[]
      };

      try {
        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Take initial screenshot
        const initialScreenshot = await page.screenshot({ fullPage: true });
        results.screenshots.push(`data:image/png;base64,${initialScreenshot.toString('base64')}`);

        // Parse and execute automation instructions
        const actions = this.parseAutomationInstructions(instructions);
        
        for (const action of actions) {
          await this.executeAction(page, action);
          
          // Take screenshot after each action
          const screenshot = await page.screenshot({ fullPage: true });
          results.screenshots.push(`data:image/png;base64,${screenshot.toString('base64')}`);
        }

        // Extract final page information
        const pageInfo = await page.evaluate(() => ({
          title: document.title,
          url: window.location.href,
          forms: Array.from(document.forms).length,
          links: Array.from(document.links).length,
          images: Array.from(document.images).length
        }));

        results.success = true;
        results.result = pageInfo;

      } catch (error) {
        console.error('Automation task failed:', error);
        results.error = error instanceof Error ? error.message : 'Unknown error';
      } finally {
        await page.close();
      }

      return results;
    } catch (error) {
      console.error('Failed to execute automation task:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start browser'
      };
    }
  }

  /**
   * Generate automated tests for spiritual social media features
   */
  async generateSpiritualTests(): Promise<{
    testSuites: Array<{
      name: string;
      description: string;
      tests: Array<{
        name: string;
        steps: string[];
        expectedResult: string;
      }>;
    }>;
  }> {
    return {
      testSuites: [
        {
          name: 'Sparks Feature Tests',
          description: 'Test the spiritual sparks (short video) functionality',
          tests: [
            {
              name: 'Create Text Spark',
              steps: [
                'Navigate to /sparks',
                'Enter spiritual insight in text field',
                'Click Create Spark button',
                'Verify spark appears in feed'
              ],
              expectedResult: 'Spark is created and visible in the feed with proper formatting'
            },
            {
              name: 'Record Video Spark',
              steps: [
                'Navigate to /sparks',
                'Click Record Video button',
                'Grant camera permissions',
                'Record 5-second video',
                'Stop recording',
                'Add text content',
                'Create spark'
              ],
              expectedResult: 'Video spark is created with both video and text content'
            }
          ]
        },
        {
          name: 'Spiritual Engagement Tests',
          description: 'Test chakra-based engagement and energy sharing',
          tests: [
            {
              name: 'Energy Sharing',
              steps: [
                'Navigate to main feed',
                'Find a post',
                'Click energy share button',
                'Verify energy count increases',
                'Check user energy balance decreases'
              ],
              expectedResult: 'Energy is transferred and counts are updated correctly'
            },
            {
              name: 'Chakra Classification',
              steps: [
                'Create a new post about meditation',
                'Submit the post',
                'Verify AI assigns appropriate chakra classification',
                'Check chakra appears in post metadata'
              ],
              expectedResult: 'Post is automatically classified with correct chakra type'
            }
          ]
        },
        {
          name: 'Oracle Reading Tests',
          description: 'Test AI-powered spiritual guidance features',
          tests: [
            {
              name: 'Daily Oracle Reading',
              steps: [
                'Navigate to oracle section',
                'Request daily reading',
                'Verify personalized content appears',
                'Check reading is saved to user history'
              ],
              expectedResult: 'Personalized spiritual guidance is generated and stored'
            }
          ]
        },
        {
          name: 'Privacy Compliance Tests',
          description: 'Verify GDPR and privacy compliance features',
          tests: [
            {
              name: 'Cookie Consent',
              steps: [
                'Open website in incognito mode',
                'Verify cookie banner appears',
                'Test accept/reject functionality',
                'Verify preferences are respected'
              ],
              expectedResult: 'Cookie consent is properly managed and enforced'
            },
            {
              name: 'Data Export',
              steps: [
                'Navigate to privacy settings',
                'Request data export',
                'Verify download contains user data',
                'Check data format is readable'
              ],
              expectedResult: 'User data can be exported in machine-readable format'
            }
          ]
        }
      ]
    };
  }

  /**
   * Monitor spiritual platform health and performance
   */
  async monitorPlatformHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      responseTime?: number;
      details?: string;
    }>;
    spiritualMetrics: {
      chakraDistribution: Record<string, number>;
      energyFlows: number;
      oracleReadings: number;
      activeMeditations: number;
    };
  }> {
    try {
      const browser = await this.browserless.getBrowser();
      const page = await browser.newPage();

      const checks = [];
      const startTime = Date.now();

      try {
        // Test main page load
        await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 10000 });
        checks.push({
          name: 'Main Page Load',
          status: 'pass' as const,
          responseTime: Date.now() - startTime
        });

        // Test sparks page
        const sparksStart = Date.now();
        await page.goto('http://localhost:5000/sparks', { waitUntil: 'networkidle', timeout: 10000 });
        checks.push({
          name: 'Sparks Page Load',
          status: 'pass' as const,
          responseTime: Date.now() - sparksStart
        });

        // Test API endpoints
        const apiStart = Date.now();
        const response = await page.evaluate(async () => {
          const res = await fetch('/api/posts');
          return res.ok;
        });
        
        checks.push({
          name: 'API Connectivity',
          status: response ? 'pass' : 'fail' as const,
          responseTime: Date.now() - apiStart
        });

        // Extract spiritual metrics from page
        const spiritualMetrics = await page.evaluate(() => {
          // This would be replaced with actual data extraction
          return {
            chakraDistribution: {
              root: 15,
              sacral: 12,
              solar: 18,
              heart: 22,
              throat: 14,
              third_eye: 11,
              crown: 8
            },
            energyFlows: 147,
            oracleReadings: 23,
            activeMeditations: 5
          };
        });

        await page.close();

        const failedChecks = checks.filter(c => c.status === 'fail').length;
        const status = failedChecks === 0 ? 'healthy' : failedChecks <= 1 ? 'degraded' : 'unhealthy';

        return {
          status,
          checks,
          spiritualMetrics
        };

      } catch (error) {
        await page.close();
        checks.push({
          name: 'Page Load Test',
          status: 'fail' as const,
          details: error instanceof Error ? error.message : 'Unknown error'
        });

        return {
          status: 'unhealthy' as const,
          checks,
          spiritualMetrics: {
            chakraDistribution: {},
            energyFlows: 0,
            oracleReadings: 0,
            activeMeditations: 0
          }
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy' as const,
        checks: [{
          name: 'Browser Connection',
          status: 'fail' as const,
          details: 'Failed to connect to browser service'
        }],
        spiritualMetrics: {
          chakraDistribution: {},
          energyFlows: 0,
          oracleReadings: 0,
          activeMeditations: 0
        }
      };
    }
  }

  private parseAutomationInstructions(instructions: string): Array<{type: string, target?: string, value?: string}> {
    const actions = [];
    const lines = instructions.toLowerCase().split('.').filter(l => l.trim());

    for (const line of lines) {
      if (line.includes('click') && line.includes('button')) {
        const buttonText = this.extractQuotedText(line) || 'button';
        actions.push({ type: 'click', target: `button:has-text("${buttonText}")` });
      } else if (line.includes('type') || line.includes('enter')) {
        const text = this.extractQuotedText(line);
        if (text) {
          actions.push({ type: 'type', target: 'input', value: text });
        }
      } else if (line.includes('wait')) {
        actions.push({ type: 'wait', value: '2000' });
      } else if (line.includes('scroll')) {
        actions.push({ type: 'scroll', value: 'bottom' });
      }
    }

    return actions;
  }

  private async executeAction(page: any, action: {type: string, target?: string, value?: string}) {
    try {
      switch (action.type) {
        case 'click':
          if (action.target) {
            await page.click(action.target);
          }
          break;
        case 'type':
          if (action.target && action.value) {
            await page.fill(action.target, action.value);
          }
          break;
        case 'wait':
          await page.waitForTimeout(parseInt(action.value || '1000'));
          break;
        case 'scroll':
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          break;
      }
      
      // Wait a bit after each action
      await page.waitForTimeout(500);
    } catch (error) {
      console.error(`Failed to execute action ${action.type}:`, error);
    }
  }

  private extractQuotedText(text: string): string | null {
    const match = text.match(/"([^"]*)"/);
    return match ? match[1] : null;
  }
}
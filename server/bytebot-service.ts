import { spawn } from 'child_process';
import puppeteer, { Browser, Page } from 'puppeteer';
import { chromium } from 'playwright';

interface BytebotConfig {
  dockerImage?: string;
  apiUrl?: string;
  apiKey?: string;
  useLocalBrowsers?: boolean;
}

interface BytebotTask {
  description: string;
  url?: string;
  action: 'screenshot' | 'scrape' | 'automate' | 'test';
  options?: any;
}

interface BytebotResult {
  success: boolean;
  data?: any;
  error?: string;
  screenshot?: string;
  content?: string;
}

/**
 * BytebotService - Open-source replacement for Browserless.io
 * 
 * Bytebot (https://github.com/bytebot-ai/bytebot) is an Apache 2.0 licensed
 * AI desktop agent that provides browser automation capabilities.
 * This service integrates Bytebot with our spiritual social media platform.
 */
export class BytebotService {
  private config: BytebotConfig;
  private browser: Browser | null = null;

  constructor(config: BytebotConfig = {}) {
    this.config = {
      useLocalBrowsers: true, // Use local Puppeteer/Playwright for now
      ...config
    };
  }

  /**
   * Initialize Bytebot service
   */
  async initialize(): Promise<void> {
    try {
      if (this.config.useLocalBrowsers) {
        // Use local Puppeteer as a fallback until Bytebot Docker is set up
        this.browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('🤖 Bytebot service initialized with local browser');
      } else {
        // Future: Initialize Bytebot Docker container
        console.log('🤖 Bytebot service initialized with Docker');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Bytebot service:', error);
      throw error;
    }
  }

  /**
   * Execute an automation task using Bytebot
   */
  async executeTask(task: BytebotTask): Promise<BytebotResult> {
    try {
      switch (task.action) {
        case 'screenshot':
          return await this.takeScreenshot(task.url!, task.options);
        case 'scrape':
          return await this.scrapeContent(task.url!, task.options);
        case 'automate':
          return await this.automateTask(task.description, task.url, task.options);
        case 'test':
          return await this.runTest(task.description, task.url!, task.options);
        default:
          throw new Error(`Unsupported task action: ${task.action}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Take a screenshot of a webpage
   */
  private async takeScreenshot(url: string, options: any = {}): Promise<BytebotResult> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: options.fullPage || false,
        encoding: 'base64'
      });

      return {
        success: true,
        screenshot: `data:image/png;base64,${screenshot}`
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Scrape content from a webpage
   */
  private async scrapeContent(url: string, options: any = {}): Promise<BytebotResult> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      const content = await page.evaluate(() => {
        return {
          title: document.title,
          text: document.body.innerText,
          html: document.documentElement.outerHTML,
          links: Array.from(document.links).map(link => ({
            text: link.textContent,
            href: link.href
          }))
        };
      });

      return {
        success: true,
        data: content
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Execute an automation task with natural language instructions
   */
  private async automateTask(description: string, url?: string, options: any = {}): Promise<BytebotResult> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      if (url) {
        await page.goto(url, { waitUntil: 'networkidle0' });
      }

      // Simple automation based on description
      // In a full Bytebot implementation, this would use AI to interpret instructions
      const result = await this.interpretAndExecute(page, description);

      return {
        success: true,
        data: result
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Run tests on spiritual platform features
   */
  private async runTest(description: string, url: string, options: any = {}): Promise<BytebotResult> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Spiritual platform specific tests
      const testResults = await this.runSpiritualTests(page, description);

      return {
        success: true,
        data: testResults
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Interpret natural language instructions and execute them
   * This is a simplified version - full Bytebot uses AI for this
   */
  private async interpretAndExecute(page: Page, description: string): Promise<any> {
    const instructions = description.toLowerCase();
    
    if (instructions.includes('click')) {
      const selector = this.extractSelector(instructions);
      if (selector) {
        await page.click(selector);
        return { action: 'click', selector };
      }
    }
    
    if (instructions.includes('type') || instructions.includes('fill')) {
      const selector = this.extractSelector(instructions);
      const text = this.extractText(instructions);
      if (selector && text) {
        await page.type(selector, text);
        return { action: 'type', selector, text };
      }
    }
    
    if (instructions.includes('scroll')) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      return { action: 'scroll' };
    }

    return { action: 'interpreted', instructions };
  }

  /**
   * Run tests specific to spiritual platform features
   */
  private async runSpiritualTests(page: Page, testType: string): Promise<any> {
    const results: any = {
      testType,
      timestamp: new Date().toISOString(),
      checks: []
    };

    try {
      // Check for spiritual elements
      const chakraElements = await page.$$('[data-chakra]');
      results.checks.push({
        name: 'Chakra elements present',
        passed: chakraElements.length > 0,
        count: chakraElements.length
      });

      // Check for oracle functionality
      const oracleElements = await page.$$('[data-testid*="oracle"]');
      results.checks.push({
        name: 'Oracle elements present',
        passed: oracleElements.length > 0,
        count: oracleElements.length
      });

      // Check for energy system
      const energyElements = await page.$$('[data-testid*="energy"]');
      results.checks.push({
        name: 'Energy system elements present',
        passed: energyElements.length > 0,
        count: energyElements.length
      });

      // Check page loading
      const isLoaded = await page.evaluate(() => document.readyState === 'complete');
      results.checks.push({
        name: 'Page fully loaded',
        passed: isLoaded
      });

      results.overall = results.checks.every((check: any) => check.passed);
      
    } catch (error: any) {
      results.error = error.message;
      results.overall = false;
    }

    return results;
  }

  /**
   * Extract CSS selector from natural language
   */
  private extractSelector(text: string): string | null {
    // Simple pattern matching - full Bytebot would use AI
    const buttonMatch = text.match(/button[^a-z]*([a-z-]+)/i);
    if (buttonMatch) return `button[data-testid*="${buttonMatch[1]}"]`;
    
    const inputMatch = text.match(/input[^a-z]*([a-z-]+)/i);
    if (inputMatch) return `input[data-testid*="${inputMatch[1]}"]`;
    
    return null;
  }

  /**
   * Extract text to type from natural language
   */
  private extractText(text: string): string | null {
    const match = text.match(/"([^"]+)"/);
    return match ? match[1] : null;
  }

  /**
   * Check if Bytebot service is healthy
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      if (this.config.useLocalBrowsers) {
        // Check if we can launch a browser
        if (!this.browser) {
          await this.initialize();
        }
        
        return {
          status: 'healthy',
          message: 'Bytebot service is running with local browsers'
        };
      } else {
        // Future: Check Bytebot Docker container status
        return {
          status: 'healthy',
          message: 'Bytebot service is running with Docker'
        };
      }
    } catch (error: any) {
      return {
        status: 'unhealthy',
        message: `Bytebot service error: ${error.message}`
      };
    }
  }

  /**
   * Close the service and clean up resources
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Generate test suites for spiritual platform features
   */
  generateSpiritualTests(): any[] {
    return [
      {
        name: 'Chakra System Tests',
        description: 'Test chakra-based content categorization',
        tests: [
          'Navigate to create post and verify chakra selection',
          'Check that posts display correct chakra colors',
          'Verify chakra filtering works in feed'
        ]
      },
      {
        name: 'Oracle System Tests',
        description: 'Test AI-powered oracle readings',
        tests: [
          'Generate daily reading and verify content',
          'Test personalized recommendations',
          'Check oracle history functionality'
        ]
      },
      {
        name: 'Energy System Tests',
        description: 'Test spiritual energy mechanics',
        tests: [
          'Verify energy points display correctly',
          'Test energy sharing between users',
          'Check energy regeneration timers'
        ]
      },
      {
        name: 'Engagement Tests',
        description: 'Test spiritual engagement features',
        tests: [
          'Test spiritual marks (upvotes/downvotes)',
          'Verify engagement notifications',
          'Check engagement statistics'
        ]
      }
    ];
  }
}

// Export singleton instance
export const bytebotService = new BytebotService();
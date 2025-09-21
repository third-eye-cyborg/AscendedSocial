import { chromium, Browser as PlaywrightBrowser, Page as PlaywrightPage } from 'playwright';
import puppeteer, { Browser as PuppeteerBrowser, Page as PuppeteerPage } from 'puppeteer-core';

interface BrowserlessConfig {
  token: string;
  endpoint: string;
  defaultTimeout?: number;
}

interface ScreenshotOptions {
  fullPage?: boolean;
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface PDFOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  landscape?: boolean;
  printBackground?: boolean;
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

interface ScrapeOptions {
  selector?: string;
  waitForSelector?: string;
  timeout?: number;
  extractText?: boolean;
  extractLinks?: boolean;
  extractImages?: boolean;
}

interface FormData {
  selector: string;
  value: string;
  type?: 'input' | 'select' | 'textarea' | 'checkbox' | 'radio';
}

interface AutomationOptions {
  headless?: boolean;
  timeout?: number;
  viewport?: {
    width: number;
    height: number;
  };
  userAgent?: string;
  stealth?: boolean;
}

class BrowserlessService {
  private config: BrowserlessConfig | null = null;
  private playwrightBrowser: PlaywrightBrowser | null = null;
  private puppeteerBrowser: PuppeteerBrowser | null = null;

  constructor() {
    // Browserless service disabled - no longer auto-initializing
    // Initialize with environment variables if available
    // const token = process.env.BROWSERLESS_TOKEN;
    // const endpoint = process.env.BROWSERLESS_ENDPOINT || 'wss://production-sfo.browserless.io';
    
    // if (token) {
    //   this.initialize({ token, endpoint });
    // }
    console.log('📴 Browserless service disabled - not initializing');
  }

  public initialize(config: BrowserlessConfig): void {
    this.config = config;
    console.log('✨ Browserless service initialized with endpoint:', config.endpoint);
  }

  private getWebSocketUrl(): string {
    if (!this.config) {
      throw new Error('Browserless not configured. Please provide token and endpoint.');
    }
    return `${this.config.endpoint}?token=${this.config.token}`;
  }

  // Security: Redact token from URLs for logging
  private redactTokenFromUrl(url: string): string {
    return url.replace(/token=[^&]+/g, 'token=***');
  }

  private getRestApiUrl(): string {
    if (!this.config) {
      throw new Error('Browserless not configured. Please provide token and endpoint.');
    }
    // Convert WebSocket URL to REST API URL
    const restEndpoint = this.config.endpoint.replace('wss://', 'https://');
    return restEndpoint;
  }

  // Playwright Browser Management
  public async getPlaywrightBrowser(): Promise<PlaywrightBrowser> {
    if (!this.playwrightBrowser) {
      console.log('🎭 Connecting to Browserless with Playwright...');
      try {
        this.playwrightBrowser = await chromium.connectOverCDP(this.getWebSocketUrl());
        console.log('✅ Playwright browser connected');
      } catch (error: any) {
        // Security: Redact sensitive info before logging and rethrowing
        const sanitizedMessage = error.message ? error.message.replace(/token=[^&\s]+/g, 'token=***') : 'Unknown error';
        console.error('❌ Playwright connection failed:', { ...error, message: sanitizedMessage });
        throw new Error(`Failed to connect Playwright browser: ${sanitizedMessage}`);
      }
    }
    return this.playwrightBrowser;
  }

  public async closePlaywrightBrowser(): Promise<void> {
    if (this.playwrightBrowser) {
      await this.playwrightBrowser.close();
      this.playwrightBrowser = null;
      console.log('🎭 Playwright browser closed');
    }
  }

  // Puppeteer Browser Management
  public async getPuppeteerBrowser(): Promise<PuppeteerBrowser> {
    if (!this.puppeteerBrowser) {
      console.log('🎪 Connecting to Browserless with Puppeteer...');
      try {
        this.puppeteerBrowser = await puppeteer.connect({
          browserWSEndpoint: this.getWebSocketUrl(),
        });
        console.log('✅ Puppeteer browser connected');
      } catch (error: any) {
        // Security: Redact sensitive info before logging and rethrowing
        const sanitizedMessage = error.message ? error.message.replace(/token=[^&\s]+/g, 'token=***') : 'Unknown error';
        console.error('❌ Puppeteer connection failed:', { ...error, message: sanitizedMessage });
        // Handle rate limiting gracefully
        if (error.message && (error.message.includes('429') || error.message.includes('rate'))) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        throw new Error(`Failed to connect Puppeteer browser: ${sanitizedMessage}`);
      }
    }
    return this.puppeteerBrowser;
  }

  public async closePuppeteerBrowser(): Promise<void> {
    if (this.puppeteerBrowser) {
      await this.puppeteerBrowser.close();
      this.puppeteerBrowser = null;
      console.log('🎪 Puppeteer browser closed');
    }
  }

  // Screenshot Service - Playwright Implementation
  public async takeScreenshotPlaywright(
    url: string, 
    options: ScreenshotOptions = {}
  ): Promise<{ image: string; timestamp: string; metadata: any }> {
    const browser = await this.getPlaywrightBrowser();
    const context = await browser.newContext({
      viewport: { width: options.width || 1920, height: options.height || 1080 }
    });
    const page = await context.newPage();

    try {
      console.log(`📸 Taking screenshot of ${url} with Playwright`);
      await page.goto(url, { waitUntil: 'networkidle' });
      
      if (options.clip) {
        await page.setViewportSize({ 
          width: options.clip.width, 
          height: options.clip.height 
        });
      }

      const screenshot = await page.screenshot({
        fullPage: options.fullPage || false,
        type: options.format || 'png',
        quality: options.quality,
        clip: options.clip
      });

      const base64Image = Buffer.from(screenshot).toString('base64');
      const metadata = {
        url: page.url(),
        title: await page.title(),
        viewport: await page.viewportSize(),
        userAgent: await page.evaluate(() => navigator.userAgent)
      };

      return {
        image: `data:image/${options.format || 'png'};base64,${base64Image}`,
        timestamp: new Date().toISOString(),
        metadata
      };
    } finally {
      await context.close();
    }
  }

  // Screenshot Service - Puppeteer Implementation
  public async takeScreenshotPuppeteer(
    url: string, 
    options: ScreenshotOptions = {}
  ): Promise<{ image: string; timestamp: string; metadata: any }> {
    const browser = await this.getPuppeteerBrowser();
    const page = await browser.newPage();

    try {
      console.log(`📸 Taking screenshot of ${url} with Puppeteer`);
      await page.setViewport({ 
        width: options.width || 1920, 
        height: options.height || 1080 
      });
      
      await page.goto(url, { waitUntil: 'networkidle0' });

      const screenshot = await page.screenshot({
        fullPage: options.fullPage || false,
        type: options.format || 'png',
        quality: options.quality,
        clip: options.clip
      });

      const base64Image = Buffer.from(screenshot).toString('base64');
      const metadata = {
        url: page.url(),
        title: await page.title(),
        viewport: page.viewport(),
        userAgent: await page.evaluate(() => navigator.userAgent)
      };

      return {
        image: `data:image/${options.format || 'png'};base64,${base64Image}`,
        timestamp: new Date().toISOString(),
        metadata
      };
    } finally {
      await page.close();
    }
  }

  // PDF Generation Service - Playwright
  public async generatePDFPlaywright(
    url: string, 
    options: PDFOptions = {}
  ): Promise<{ pdf: string; timestamp: string; metadata: any }> {
    const browser = await this.getPlaywrightBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(`📄 Generating PDF of ${url} with Playwright`);
      await page.goto(url, { waitUntil: 'networkidle' });

      const pdf = await page.pdf({
        format: options.format || 'A4',
        landscape: options.landscape || false,
        printBackground: options.printBackground !== false,
        margin: options.margin || { top: '1in', right: '1in', bottom: '1in', left: '1in' }
      });

      const base64PDF = Buffer.from(pdf).toString('base64');
      const metadata = {
        url: page.url(),
        title: await page.title(),
        pageCount: 1 // Playwright doesn't provide page count directly
      };

      return {
        pdf: `data:application/pdf;base64,${base64PDF}`,
        timestamp: new Date().toISOString(),
        metadata
      };
    } finally {
      await context.close();
    }
  }

  // PDF Generation Service - Puppeteer  
  public async generatePDFPuppeteer(
    url: string, 
    options: PDFOptions = {}
  ): Promise<{ pdf: string; timestamp: string; metadata: any }> {
    const browser = await this.getPuppeteerBrowser();
    const page = await browser.newPage();

    try {
      console.log(`📄 Generating PDF of ${url} with Puppeteer`);
      await page.goto(url, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: options.format || 'A4',
        landscape: options.landscape || false,
        printBackground: options.printBackground !== false,
        margin: options.margin || { top: '1in', right: '1in', bottom: '1in', left: '1in' }
      });

      const base64PDF = Buffer.from(pdf).toString('base64');
      const metadata = {
        url: page.url(),
        title: await page.title()
      };

      return {
        pdf: `data:application/pdf;base64,${base64PDF}`,
        timestamp: new Date().toISOString(),
        metadata
      };
    } finally {
      await page.close();
    }
  }

  // Web Scraping Service - Playwright
  public async scrapeContentPlaywright(
    url: string, 
    options: ScrapeOptions = {}
  ): Promise<{ data: any; timestamp: string; metadata: any }> {
    const browser = await this.getPlaywrightBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(`🕷️ Scraping content from ${url} with Playwright`);
      await page.goto(url, { waitUntil: 'networkidle' });

      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { 
          timeout: options.timeout || 30000 
        });
      }

      let data: any = {};

      if (options.selector) {
        // Extract specific elements
        data.elements = await page.locator(options.selector).allTextContents();
      }

      if (options.extractText !== false) {
        data.text = await page.textContent('body') || '';
      }

      if (options.extractLinks) {
        data.links = await page.locator('a').evaluateAll(links => 
          links.map(link => ({
            text: link.textContent?.trim(),
            href: link.getAttribute('href'),
            target: link.getAttribute('target')
          }))
        );
      }

      if (options.extractImages) {
        data.images = await page.locator('img').evaluateAll(imgs => 
          imgs.map(img => ({
            alt: img.getAttribute('alt'),
            src: img.getAttribute('src'),
            width: img.getAttribute('width'),
            height: img.getAttribute('height')
          }))
        );
      }

      const metadata = {
        url: page.url(),
        title: await page.title(),
        description: await page.locator('meta[name="description"]').getAttribute('content') || '',
        keywords: await page.locator('meta[name="keywords"]').getAttribute('content') || ''
      };

      return {
        data,
        timestamp: new Date().toISOString(),
        metadata
      };
    } finally {
      await context.close();
    }
  }

  // Web Scraping Service - Puppeteer
  public async scrapeContentPuppeteer(
    url: string, 
    options: ScrapeOptions = {}
  ): Promise<{ data: any; timestamp: string; metadata: any }> {
    const browser = await this.getPuppeteerBrowser();
    const page = await browser.newPage();

    try {
      console.log(`🕷️ Scraping content from ${url} with Puppeteer`);
      await page.goto(url, { waitUntil: 'networkidle0' });

      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { 
          timeout: options.timeout || 30000 
        });
      }

      let data: any = {};

      if (options.selector) {
        data.elements = await page.$$eval(options.selector, elements => 
          elements.map(el => el.textContent?.trim())
        );
      }

      if (options.extractText !== false) {
        data.text = await page.$eval('body', el => el.textContent || '');
      }

      if (options.extractLinks) {
        data.links = await page.$$eval('a', links => 
          links.map(link => ({
            text: link.textContent?.trim(),
            href: link.getAttribute('href'),
            target: link.getAttribute('target')
          }))
        );
      }

      if (options.extractImages) {
        data.images = await page.$$eval('img', imgs => 
          imgs.map(img => ({
            alt: img.getAttribute('alt'),
            src: img.getAttribute('src'),
            width: img.getAttribute('width'),
            height: img.getAttribute('height')
          }))
        );
      }

      const metadata = {
        url: page.url(),
        title: await page.title(),
        description: await page.$eval('meta[name="description"]', el => 
          el.getAttribute('content')
        ).catch(() => ''),
        keywords: await page.$eval('meta[name="keywords"]', el => 
          el.getAttribute('content')
        ).catch(() => '')
      };

      return {
        data,
        timestamp: new Date().toISOString(),
        metadata
      };
    } finally {
      await page.close();
    }
  }

  // Form Automation Service - Playwright
  public async fillFormPlaywright(
    url: string, 
    formData: FormData[], 
    submitSelector?: string,
    options: AutomationOptions = {}
  ): Promise<{ success: boolean; screenshot?: string; timestamp: string }> {
    const browser = await this.getPlaywrightBrowser();
    const context = await browser.newContext({
      viewport: options.viewport || { width: 1920, height: 1080 },
      userAgent: options.userAgent
    });
    const page = await context.newPage();

    try {
      console.log(`📝 Filling form on ${url} with Playwright`);
      await page.goto(url, { waitUntil: 'networkidle' });

      // Fill form fields
      for (const field of formData) {
        const element = page.locator(field.selector);
        await element.waitFor({ timeout: options.timeout || 30000 });

        switch (field.type) {
          case 'input':
          case 'textarea':
            await element.fill(field.value);
            break;
          case 'select':
            await element.selectOption(field.value);
            break;
          case 'checkbox':
          case 'radio':
            if (field.value === 'true' || field.value === '1') {
              await element.check();
            } else {
              await element.uncheck();
            }
            break;
          default:
            await element.fill(field.value);
        }
        
        console.log(`✅ Filled field: ${field.selector}`);
      }

      // Submit form if selector provided
      if (submitSelector) {
        await page.locator(submitSelector).click();
        await page.waitForLoadState('networkidle');
        console.log('📤 Form submitted');
      }

      // Take screenshot of result
      const screenshot = await page.screenshot({ fullPage: true });
      const base64Image = Buffer.from(screenshot).toString('base64');

      return {
        success: true,
        screenshot: `data:image/png;base64,${base64Image}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Form filling failed:', error);
      return {
        success: false,
        timestamp: new Date().toISOString()
      };
    } finally {
      await context.close();
    }
  }

  // Form Automation Service - Puppeteer
  public async fillFormPuppeteer(
    url: string, 
    formData: FormData[], 
    submitSelector?: string,
    options: AutomationOptions = {}
  ): Promise<{ success: boolean; screenshot?: string; timestamp: string }> {
    const browser = await this.getPuppeteerBrowser();
    const page = await browser.newPage();

    try {
      console.log(`📝 Filling form on ${url} with Puppeteer`);
      
      if (options.viewport) {
        await page.setViewport(options.viewport);
      }
      
      if (options.userAgent) {
        await page.setUserAgent(options.userAgent);
      }

      await page.goto(url, { waitUntil: 'networkidle0' });

      // Fill form fields
      for (const field of formData) {
        await page.waitForSelector(field.selector, { timeout: options.timeout || 30000 });

        switch (field.type) {
          case 'input':
          case 'textarea':
            await page.type(field.selector, field.value);
            break;
          case 'select':
            await page.select(field.selector, field.value);
            break;
          case 'checkbox':
          case 'radio':
            if (field.value === 'true' || field.value === '1') {
              await page.click(field.selector);
            }
            break;
          default:
            await page.type(field.selector, field.value);
        }
        
        console.log(`✅ Filled field: ${field.selector}`);
      }

      // Submit form if selector provided
      if (submitSelector) {
        await page.click(submitSelector);
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log('📤 Form submitted');
      }

      // Take screenshot of result
      const screenshot = await page.screenshot({ fullPage: true });
      const base64Image = Buffer.from(screenshot).toString('base64');

      return {
        success: true,
        screenshot: `data:image/png;base64,${base64Image}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Form filling failed:', error);
      return {
        success: false,
        timestamp: new Date().toISOString()
      };
    } finally {
      await page.close();
    }
  }

  // Performance Testing - Playwright
  public async performanceTestPlaywright(
    url: string
  ): Promise<{ metrics: any; timestamp: string }> {
    const browser = await this.getPlaywrightBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(`⚡ Running performance test on ${url} with Playwright`);
      
      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          responseStart: navigation.responseStart - navigation.requestStart,
          responseEnd: navigation.responseEnd - navigation.requestStart
        };
      });

      return {
        metrics: {
          ...metrics,
          totalLoadTime: loadTime,
          url: page.url(),
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    } finally {
      await context.close();
    }
  }

  // Advanced Scraping with Custom Scripts - Playwright
  public async runCustomScriptPlaywright(
    url: string,
    script: string,
    options: AutomationOptions = {}
  ): Promise<{ result: any; screenshot?: string; timestamp: string }> {
    const browser = await this.getPlaywrightBrowser();
    const context = await browser.newContext({
      viewport: options.viewport || { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
      console.log(`🔧 Running custom script on ${url} with Playwright`);
      await page.goto(url, { waitUntil: 'networkidle' });

      // Execute custom script
      const result = await page.evaluate(script);

      // Take screenshot
      const screenshotBuffer = await page.screenshot({ fullPage: true });
      const screenshot = `data:image/png;base64,${Buffer.from(screenshotBuffer).toString('base64')}`;

      return {
        result,
        screenshot,
        timestamp: new Date().toISOString()
      };
    } finally {
      await context.close();
    }
  }

  // Enhanced Health Check with detailed monitoring
  public async healthCheck(): Promise<{ 
    status: string; 
    browserless: boolean; 
    playwright: boolean; 
    puppeteer: boolean;
    details: any;
    timestamp: string;
  }> {
    const startTime = Date.now();
    let playwrightOk = false;
    let puppeteerOk = false;
    let browserlessOk = false;
    const details: any = {
      config: !!this.config,
      endpoint: this.config?.endpoint,
      hasToken: !!this.config?.token,
      tests: {}
    };

    console.log('🔍 [BROWSERLESS-HEALTH] Starting comprehensive health check');

    try {
      // Test Browserless configuration
      if (this.config) {
        browserlessOk = true;
        details.tests.config = { success: true, duration: 0 };
        console.log('✅ [BROWSERLESS-HEALTH] Configuration check passed');
      } else {
        details.tests.config = { success: false, error: 'No configuration found' };
        console.warn('⚠️ [BROWSERLESS-HEALTH] No configuration found');
      }

      // Test Playwright connection with timeout
      const playwrightStart = Date.now();
      try {
        const pwBrowser = await Promise.race([
          this.getPlaywrightBrowser(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
        
        if (pwBrowser) {
          playwrightOk = true;
          details.tests.playwright = { 
            success: true, 
            duration: Date.now() - playwrightStart 
          };
          console.log(`✅ [BROWSERLESS-HEALTH] Playwright connection established in ${Date.now() - playwrightStart}ms`);
        }
      } catch (playwrightError: any) {
        const isRateLimit = playwrightError.message?.includes('429') || playwrightError.message?.includes('Too Many Requests');
        const isUsageLimit = playwrightError.message?.includes('usage limit') || 
                            playwrightError.message?.includes('401 Unauthorized') ||
                            playwrightError.message?.includes('upgrade to a paid plan');
        
        details.tests.playwright = { 
          success: false, 
          error: playwrightError.message,
          duration: Date.now() - playwrightStart,
          isRateLimit,
          isUsageLimit
        };
        
        if (isUsageLimit) {
          console.warn(`⚠️ [BROWSERLESS-HEALTH] Playwright test failed: Service usage limit reached`);
        } else {
          console.warn(`⚠️ [BROWSERLESS-HEALTH] Playwright test failed:`, playwrightError.message);
        }
      }

      // Test Puppeteer connection with timeout
      const puppeteerStart = Date.now();
      try {
        const ppBrowser = await Promise.race([
          this.getPuppeteerBrowser(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
        
        if (ppBrowser) {
          puppeteerOk = true;
          details.tests.puppeteer = { 
            success: true, 
            duration: Date.now() - puppeteerStart 
          };
          console.log(`✅ [BROWSERLESS-HEALTH] Puppeteer connection established in ${Date.now() - puppeteerStart}ms`);
        }
      } catch (puppeteerError: any) {
        const isRateLimit = puppeteerError.message?.includes('429') || puppeteerError.message?.includes('Too Many Requests');
        const isUsageLimit = puppeteerError.message?.includes('usage limit') || 
                            puppeteerError.message?.includes('401 Unauthorized') ||
                            puppeteerError.message?.includes('upgrade to a paid plan');
        
        details.tests.puppeteer = { 
          success: false, 
          error: puppeteerError.message,
          duration: Date.now() - puppeteerStart,
          isRateLimit,
          isUsageLimit
        };
        
        if (isUsageLimit) {
          console.warn(`⚠️ [BROWSERLESS-HEALTH] Puppeteer test failed: Service usage limit reached`);
        } else {
          console.warn(`⚠️ [BROWSERLESS-HEALTH] Puppeteer test failed:`, puppeteerError.message);
        }
      }

    } catch (error: any) {
      console.error('❌ [BROWSERLESS-HEALTH] Health check failed:', error.message);
      details.globalError = error.message;
    }

    const totalDuration = Date.now() - startTime;
    const healthyCount = [browserlessOk, playwrightOk, puppeteerOk].filter(Boolean).length;
    
    // Check if failures are due to usage limits (should be degraded, not unhealthy)
    const hasUsageLimitErrors = (details.tests.playwright?.isUsageLimit || details.tests.puppeteer?.isUsageLimit);
    
    let status: string;
    if (healthyCount === 3) {
      status = 'healthy';
    } else if (healthyCount > 0 || hasUsageLimitErrors) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }
    
    console.log(`📊 [BROWSERLESS-HEALTH] Health check completed in ${totalDuration}ms - Status: ${status} (${healthyCount}/3 services)${hasUsageLimitErrors ? ' - Usage limits detected' : ''}`);

    return {
      status,
      browserless: browserlessOk,
      playwright: playwrightOk,
      puppeteer: puppeteerOk,
      details: {
        ...details,
        totalDuration,
        healthyServices: healthyCount,
        totalServices: 3
      },
      timestamp: new Date().toISOString()
    };
  }

  // Cleanup
  public async cleanup(): Promise<void> {
    await Promise.allSettled([
      this.closePlaywrightBrowser(),
      this.closePuppeteerBrowser()
    ]);
    console.log('🧹 Browserless service cleanup completed');
  }
}

// Browserless service disabled - not exporting singleton instance
// export const browserlessService = new BrowserlessService();
export { 
  BrowserlessService, 
  type BrowserlessConfig, 
  type ScreenshotOptions, 
  type PDFOptions, 
  type ScrapeOptions, 
  type FormData, 
  type AutomationOptions 
};
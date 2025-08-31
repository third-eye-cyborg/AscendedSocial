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
    // Initialize with environment variables if available
    const token = process.env.BROWSERLESS_TOKEN;
    const endpoint = process.env.BROWSERLESS_ENDPOINT || 'wss://chrome.browserless.io';
    
    if (token) {
      this.initialize({ token, endpoint });
    }
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

  // Playwright Browser Management
  public async getPlaywrightBrowser(): Promise<PlaywrightBrowser> {
    if (!this.playwrightBrowser) {
      console.log('🎭 Connecting to Browserless with Playwright...');
      this.playwrightBrowser = await chromium.connectOverCDP(this.getWebSocketUrl());
      console.log('✅ Playwright browser connected');
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
      this.puppeteerBrowser = await puppeteer.connect({
        browserWSEndpoint: this.getWebSocketUrl(),
      });
      console.log('✅ Puppeteer browser connected');
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

  // Health Check
  public async healthCheck(): Promise<{ status: string; browserless: boolean; playwright: boolean; puppeteer: boolean }> {
    let playwrightOk = false;
    let puppeteerOk = false;
    let browserlessOk = false;

    try {
      // Test Browserless connection
      if (this.config) {
        browserlessOk = true;
      }

      // Test Playwright connection
      const pwBrowser = await this.getPlaywrightBrowser();
      if (pwBrowser) {
        playwrightOk = true;
      }

      // Test Puppeteer connection  
      const ppBrowser = await this.getPuppeteerBrowser();
      if (ppBrowser) {
        puppeteerOk = true;
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }

    return {
      status: (browserlessOk && playwrightOk && puppeteerOk) ? 'healthy' : 'degraded',
      browserless: browserlessOk,
      playwright: playwrightOk,
      puppeteer: puppeteerOk
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

export const browserlessService = new BrowserlessService();
export { 
  BrowserlessService, 
  type BrowserlessConfig, 
  type ScreenshotOptions, 
  type PDFOptions, 
  type ScrapeOptions, 
  type FormData, 
  type AutomationOptions 
};
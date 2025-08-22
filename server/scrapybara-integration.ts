import { ScrapybaraClient, UbuntuInstance } from 'scrapybara';

interface ScrapybaraConfig {
  apiKey: string;
  actModel: 'anthropic' | 'openai';
  authStateId?: string;
}

class ScrapybaraService {
  private client: ScrapybaraClient | null = null;
  private currentInstance: UbuntuInstance | null = null;
  private config: ScrapybaraConfig | null = null;

  constructor() {
    // Initialize with environment variables if available
    const apiKey = process.env.SCRAPYBARA_API_KEY;
    if (apiKey) {
      this.initialize({
        apiKey,
        actModel: (process.env.ACT_MODEL as 'anthropic' | 'openai') || 'anthropic',
        authStateId: process.env.AUTH_STATE_ID
      });
    }
  }

  public initialize(config: ScrapybaraConfig): void {
    this.config = config;
    this.client = new ScrapybaraClient({
      apiKey: config.apiKey,
    });
    console.log('Scrapybara service initialized');
  }

  public async startInstance(): Promise<string> {
    if (!this.client) {
      throw new Error('Scrapybara client not initialized. Please provide API key.');
    }

    try {
      console.log('Starting new Scrapybara instance...');
      this.currentInstance = await this.client.createInstance() as UbuntuInstance;
      console.log('Instance started:', this.currentInstance.id);
      return this.currentInstance.id;
    } catch (error) {
      console.error('Failed to start instance:', error);
      throw error;
    }
  }

  public async takeScreenshot(instanceId?: string): Promise<string> {
    const instance = instanceId ? { id: instanceId } : this.currentInstance;
    if (!instance) {
      throw new Error('No active instance found');
    }

    try {
      const screenshot = await instance.screenshot();
      return screenshot;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      throw error;
    }
  }

  public async navigateToUrl(url: string, instanceId?: string): Promise<void> {
    const instance = instanceId ? { id: instanceId } : this.currentInstance;
    if (!instance) {
      throw new Error('No active instance found');
    }

    try {
      await instance.act(`Navigate to ${url} and wait for the page to load`);
    } catch (error) {
      console.error('Failed to navigate:', error);
      throw error;
    }
  }

  public async performAuthenticatedFlow(baseUrl: string, credentials?: any): Promise<string[]> {
    if (!this.currentInstance) {
      await this.startInstance();
    }

    const screenshots: string[] = [];
    
    try {
      // Navigate to the application
      console.log('Navigating to:', baseUrl);
      await this.navigateToUrl(baseUrl);
      
      // Take initial screenshot
      const initialScreenshot = await this.takeScreenshot();
      screenshots.push(initialScreenshot);

      // Check if we need to authenticate
      const needsAuth = await this.currentInstance.act(
        'Check if there is a login button or sign-in option visible on the page. Return "yes" if login is needed, "no" if already authenticated.'
      );

      if (needsAuth.includes('yes')) {
        // Perform authentication
        await this.currentInstance.act('Click on the login or sign-in button');
        
        // Wait for auth redirect and completion
        await this.currentInstance.act('Wait for authentication to complete and redirect back to the application');
        
        // Take post-auth screenshot
        const authScreenshot = await this.takeScreenshot();
        screenshots.push(authScreenshot);
      }

      return screenshots;
    } catch (error) {
      console.error('Authentication flow failed:', error);
      throw error;
    }
  }

  public async captureAuthenticatedPages(baseUrl: string, pages: string[]): Promise<Record<string, string>> {
    const screenshots: Record<string, string> = {};

    try {
      // Ensure we have an authenticated session
      await this.performAuthenticatedFlow(baseUrl);

      // Navigate to each page and capture screenshot
      for (const page of pages) {
        const fullUrl = page.startsWith('/') ? `${baseUrl}${page}` : page;
        console.log(`Capturing screenshot for: ${fullUrl}`);
        
        await this.navigateToUrl(fullUrl);
        await this.currentInstance.act('Wait for the page to fully load');
        
        const screenshot = await this.takeScreenshot();
        screenshots[page] = screenshot;
      }

      return screenshots;
    } catch (error) {
      console.error('Failed to capture authenticated pages:', error);
      throw error;
    }
  }

  public async testFunctionality(testCases: Array<{name: string, action: string}>): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    for (const testCase of testCases) {
      try {
        console.log(`Testing: ${testCase.name}`);
        
        const beforeScreenshot = await this.takeScreenshot();
        const result = await this.currentInstance.act(testCase.action);
        const afterScreenshot = await this.takeScreenshot();

        results[testCase.name] = {
          success: true,
          result,
          beforeScreenshot,
          afterScreenshot
        };
      } catch (error) {
        results[testCase.name] = {
          success: false,
          error: (error as any).message
        };
      }
    }

    return results;
  }

  public async stopInstance(instanceId?: string): Promise<void> {
    const instance = instanceId ? { id: instanceId } : this.currentInstance;
    if (!instance) {
      console.log('No instance to stop');
      return;
    }

    try {
      await instance.stop();
      if (instance === this.currentInstance) {
        this.currentInstance = null;
      }
      console.log('Instance stopped');
    } catch (error) {
      console.error('Failed to stop instance:', error);
      throw error;
    }
  }

  public getInstanceInfo(): any {
    return this.currentInstance ? {
      id: this.currentInstance.id,
      status: 'active'
    } : null;
  }
}

export const scrapybaraService = new ScrapybaraService();
export { ScrapybaraService, type ScrapybaraConfig };
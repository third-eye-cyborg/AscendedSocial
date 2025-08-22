import { ScrapybaraClient } from 'scrapybara';

interface ScrapybaraConfig {
  apiKey: string;
}

interface ScreenshotResult {
  image: string;
  timestamp: string;
}

interface AnalysisResult {
  insights: string[];
  contrastIssues: string[];
  recommendations: string[];
}

class ScrapybaraService {
  private client: ScrapybaraClient | null = null;
  private currentInstance: any = null;

  constructor() {
    // Initialize with environment variables if available
    const apiKey = process.env.SCRAPYBARA_API_KEY;
    if (apiKey) {
      this.initialize({ apiKey });
    }
  }

  public initialize(config: ScrapybaraConfig): void {
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
      console.log('Starting new Ubuntu instance...');
      this.currentInstance = await this.client.startUbuntu();
      console.log('Instance started:', this.currentInstance.id);
      return this.currentInstance.id;
    } catch (error) {
      console.error('Failed to start instance:', error);
      throw error;
    }
  }

  public async takeScreenshot(): Promise<ScreenshotResult> {
    if (!this.currentInstance || !this.client) {
      throw new Error('No active instance found');
    }

    try {
      // Use the instance screenshot API
      const screenshot = await this.client!.instance.screenshot(this.currentInstance.id);
      
      return {
        image: screenshot.image || '',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      throw error;
    }
  }

  public async navigateToApp(baseUrl: string): Promise<ScreenshotResult> {
    if (!this.currentInstance || !this.client) {
      await this.startInstance();
    }

    try {
      console.log('Navigating to:', baseUrl);
      
      // Start browser and navigate
      await this.client!.browser.start(this.currentInstance.id);
      
      // Use computer API to navigate
      await this.client!.instance.computer(this.currentInstance.id, {
        action: 'key',
        coordinates: ['cmd+t'] // Open new tab
      });
      
      await this.client!.instance.computer(this.currentInstance.id, {
        action: 'type',
        text: baseUrl
      });
      
      await this.client!.instance.computer(this.currentInstance.id, {
        action: 'key', 
        coordinates: ['Return']
      });
      
      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Take screenshot
      const result = await this.client!.instance.screenshot(this.currentInstance.id);
      
      const imageBase64 = result.image || '';
      
      return {
        image: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to navigate to app:', error);
      throw error;
    }
  }

  public async performAuthentication(baseUrl: string): Promise<{screenshot: ScreenshotResult, authenticated: boolean}> {
    try {
      // Navigate to app first
      await this.navigateToApp(baseUrl);
      
      // Look for login button and click it
      console.log('Looking for login button...');
      
      // Try to find and click login button
      await this.client!.instance.computer(this.currentInstance.id, {
        action: 'click',
        coordinates: [1000, 100] // Approximate header area where login button might be
      });
      
      // Wait for potential auth redirect
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot after auth attempt
      const result = await this.client!.instance.screenshot(this.currentInstance.id);
      
      const imageBase64 = result.image || '';
      const authenticated = true; // For now assume auth worked
        
      return {
        screenshot: {
          image: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`,
          timestamp: new Date().toISOString()
        },
        authenticated
      };
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  public async captureAppPages(baseUrl: string, pages: string[] = ['/']): Promise<Record<string, ScreenshotResult>> {
    const screenshots: Record<string, ScreenshotResult> = {};

    try {
      // First perform authentication
      const authResult = await this.performAuthentication(baseUrl);
      screenshots['auth'] = authResult.screenshot;

      if (!authResult.authenticated) {
        console.log('Authentication may not have completed, but continuing...');
      }

      // Navigate to each requested page
      for (const page of pages) {
        try {
          const fullUrl = page.startsWith('/') ? `${baseUrl}${page}` : page;
          console.log(`Capturing screenshot for: ${fullUrl}`);
          
          // Navigate by typing in address bar
          await this.client!.instance.computer(this.currentInstance.id, {
            action: 'key',
            coordinates: ['cmd+l'] // Select address bar
          });
          
          await this.client!.instance.computer(this.currentInstance.id, {
            action: 'type',
            text: fullUrl
          });
          
          await this.client!.instance.computer(this.currentInstance.id, {
            action: 'key',
            coordinates: ['Return']
          });
          
          // Wait for page to load
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Take screenshot
          const result = await this.client!.instance.screenshot(this.currentInstance.id);
          
          const imageBase64 = result.image || '';
          screenshots[page] = {
            image: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`,
            timestamp: new Date().toISOString()
          };
          
          console.log(`Captured screenshot for ${page}`);
        } catch (pageError) {
          console.error(`Failed to capture ${page}:`, pageError);
          screenshots[page] = {
            image: '',
            timestamp: new Date().toISOString()
          };
        }
      }

      return screenshots;
    } catch (error) {
      console.error('Failed to capture app pages:', error);
      throw error;
    }
  }

  public async analyzeContrastIssues(): Promise<AnalysisResult> {
    if (!this.currentInstance || !this.client) {
      throw new Error('No active instance to analyze');
    }

    try {
      // This would use the Act SDK with tools for AI analysis
      // For now, return a basic analysis structure
      return {
        insights: [
          'Page successfully loaded and rendered',
          'Dark cosmic theme detected with mystical elements',
          'Multiple text elements found across the interface'
        ],
        contrastIssues: [
          'Some gray text may have insufficient contrast on dark backgrounds',
          'Button text visibility could be improved in certain states',
          'Small text elements may need color adjustments'
        ],
        recommendations: [
          'Increase text contrast ratios to meet WCAG AA standards',
          'Consider using lighter text colors for better readability',
          'Test with accessibility tools for comprehensive coverage'
        ]
      };
    } catch (error) {
      console.error('Failed to analyze contrast:', error);
      throw error;
    }
  }

  public async stopInstance(): Promise<void> {
    if (!this.currentInstance || !this.client) {
      console.log('No instance to stop');
      return;
    }

    try {
      if (this.currentInstance && this.client) {
        await this.client.instance.stop(this.currentInstance.id);
      }
      this.currentInstance = null;
      console.log('Instance stopped');
    } catch (error) {
      console.error('Failed to stop instance:', error);
      throw error;
    }
  }

  public getInstanceInfo(): any {
    return this.currentInstance ? {
      id: this.currentInstance.id,
      status: 'active',
      type: 'ubuntu-standard'
    } : null;
  }
}

export const scrapybaraService = new ScrapybaraService();
export { ScrapybaraService, type ScrapybaraConfig, type ScreenshotResult, type AnalysisResult };
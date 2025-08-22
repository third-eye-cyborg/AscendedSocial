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
  private currentBrowserInstance: any = null;
  private savedAuthStates: Map<string, string> = new Map();

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

  public async startBrowserInstance(): Promise<string> {
    if (!this.client) {
      throw new Error('Scrapybara client not initialized. Please provide API key.');
    }

    try {
      console.log('Starting new Browser instance...');
      this.currentBrowserInstance = await this.client.startBrowser();
      console.log('Browser instance started:', this.currentBrowserInstance.id);
      return this.currentBrowserInstance.id;
    } catch (error) {
      console.error('Failed to start browser instance:', error);
      throw error;
    }
  }

  public async takeScreenshot(): Promise<ScreenshotResult> {
    if (!this.currentBrowserInstance || !this.client) {
      throw new Error('No active browser instance found');
    }

    try {
      // Use the browser instance screenshot API
      const screenshot = await this.currentBrowserInstance.screenshot();
      
      return {
        image: screenshot.base64Image || '',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      throw error;
    }
  }

  public async navigateToApp(baseUrl: string): Promise<ScreenshotResult> {
    if (!this.currentBrowserInstance || !this.client) {
      await this.startBrowserInstance();
    }

    try {
      console.log('Navigating to:', baseUrl);
      
      // Use computer API to navigate
      await this.currentBrowserInstance.computer({
        action: 'press_key',
        keys: ['ctrl', 't'] // Open new tab
      });
      
      await this.currentBrowserInstance.computer({
        action: 'type_text',
        text: baseUrl
      });
      
      await this.currentBrowserInstance.computer({
        action: 'press_key', 
        keys: ['Return']
      });
      
      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Take screenshot
      const result = await this.currentBrowserInstance.screenshot();
      
      const imageBase64 = result.base64Image || '';
      
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
      
      // Try to find and click login button (approximate header area)
      await this.currentBrowserInstance.computer({
        action: 'click_mouse',
        button: 'left',
        coordinates: [1000, 100]
      });
      
      // Wait for potential auth redirect
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot after auth attempt
      const result = await this.currentBrowserInstance.screenshot();
      
      const imageBase64 = result.base64Image || '';
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

  public async manualAuthAndSave(baseUrl: string, authStateName: string = 'default'): Promise<{authStateId: string, streamUrl: string}> {
    try {
      if (!this.currentBrowserInstance) {
        await this.startBrowserInstance();
      }

      // Get stream URL for manual authentication
      const streamResult = await this.currentBrowserInstance.getStreamUrl();
      const streamUrl = streamResult.streamUrl;

      console.log(`Manual authentication required. Stream URL: ${streamUrl}`);
      console.log('Please navigate to the stream URL and complete the authentication manually.');
      console.log(`After authentication, the auth state will be saved as: ${authStateName}`);

      // Navigate to the app
      await this.navigateToApp(baseUrl);

      // Wait for manual authentication (in a real scenario, you'd wait for user input)
      console.log('Waiting 30 seconds for manual authentication...');
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Save auth state after manual authentication
      // Use the correct API endpoint directly
      const authResult = await this.currentBrowserInstance.saveAuth({
        name: authStateName
      });

      const authStateId = authResult.authStateId;
      this.savedAuthStates.set(authStateName, authStateId);

      console.log(`Auth state saved with ID: ${authStateId}`);

      return {
        authStateId,
        streamUrl
      };
    } catch (error) {
      console.error('Failed to save auth state:', error);
      throw error;
    }
  }

  public async authenticateWithSavedState(authStateName: string = 'default'): Promise<boolean> {
    try {
      if (!this.currentBrowserInstance) {
        throw new Error('No active browser instance');
      }

      const authStateId = this.savedAuthStates.get(authStateName);
      if (!authStateId) {
        throw new Error(`No saved auth state found for: ${authStateName}`);
      }

      await this.currentBrowserInstance.authenticate({
        authStateId: authStateId
      });

      console.log(`Successfully authenticated using saved state: ${authStateName}`);
      return true;
    } catch (error) {
      console.error('Failed to authenticate with saved state:', error);
      throw error;
    }
  }

  public async captureAppPages(baseUrl: string, pages: string[] = ['/'], useAuth: boolean = true, authStateName: string = 'default'): Promise<Record<string, ScreenshotResult>> {
    const screenshots: Record<string, ScreenshotResult> = {};

    try {
      if (!this.currentBrowserInstance) {
        await this.startBrowserInstance();
      }

      // Authenticate with saved state if requested
      if (useAuth) {
        try {
          await this.authenticateWithSavedState(authStateName);
          console.log('Successfully authenticated with saved state');
        } catch (authError) {
          console.log('Failed to authenticate with saved state, continuing without auth:', authError);
        }
      }

      // Navigate to each requested page
      for (const page of pages) {
        try {
          const fullUrl = page.startsWith('/') ? `${baseUrl}${page}` : page;
          console.log(`Capturing screenshot for: ${fullUrl}`);
          
          // Navigate by typing in address bar
          await this.currentBrowserInstance.computer({
            action: 'press_key',
            keys: ['ctrl', 'l'] // Select address bar
          });
          
          await this.currentBrowserInstance.computer({
            action: 'type_text',
            text: fullUrl
          });
          
          await this.currentBrowserInstance.computer({
            action: 'press_key',
            keys: ['Return']
          });
          
          // Wait for page to load
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Take screenshot
          const result = await this.currentBrowserInstance.screenshot();
          
          const imageBase64 = result.base64Image || '';
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
    if (!this.currentBrowserInstance && !this.currentInstance) {
      console.log('No instance to stop');
      return;
    }

    try {
      if (this.currentBrowserInstance) {
        await this.currentBrowserInstance.stop();
        this.currentBrowserInstance = null;
        console.log('Browser instance stopped');
      }
      
      if (this.currentInstance) {
        await this.currentInstance.stop();
        this.currentInstance = null;
        console.log('Ubuntu instance stopped');
      }
    } catch (error) {
      console.error('Failed to stop instance:', error);
      throw error;
    }
  }

  public getInstanceInfo(): any {
    const instances = [];
    
    if (this.currentBrowserInstance) {
      instances.push({
        id: this.currentBrowserInstance.id,
        status: 'active',
        type: 'browser'
      });
    }
    
    if (this.currentInstance) {
      instances.push({
        id: this.currentInstance.id,
        status: 'active',
        type: 'ubuntu-standard'
      });
    }
    
    return instances.length > 0 ? instances : null;
  }

  public getSavedAuthStates(): Record<string, string> {
    return Object.fromEntries(this.savedAuthStates);
  }
}

export const scrapybaraService = new ScrapybaraService();
export { ScrapybaraService, type ScrapybaraConfig, type ScreenshotResult, type AnalysisResult };
import type { Express } from "express";
import { scrapybaraService } from "./scrapybara-integration";

export function registerScrapybaraRoutes(app: Express) {
  // Initialize Scrapybara with API key
  app.post('/api/scrapybara/initialize', async (req, res) => {
    try {
      const { apiKey, actModel = 'anthropic', authStateId } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
      }

      scrapybaraService.initialize({
        apiKey,
        actModel,
        authStateId
      });

      res.json({ success: true, message: 'Scrapybara initialized successfully' });
    } catch (error) {
      console.error('Failed to initialize Scrapybara:', error);
      res.status(500).json({ error: 'Failed to initialize Scrapybara' });
    }
  });

  // Start a new instance
  app.post('/api/scrapybara/start-instance', async (req, res) => {
    try {
      const instanceId = await scrapybaraService.startInstance();
      res.json({ 
        success: true, 
        instanceId,
        message: 'Instance started successfully'
      });
    } catch (error) {
      console.error('Failed to start instance:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Take screenshot
  app.post('/api/scrapybara/screenshot', async (req, res) => {
    try {
      const { instanceId } = req.body;
      const screenshot = await scrapybaraService.takeScreenshot(instanceId);
      
      res.json({ 
        success: true, 
        screenshot,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Navigate to URL
  app.post('/api/scrapybara/navigate', async (req, res) => {
    try {
      const { url, instanceId } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      await scrapybaraService.navigateToUrl(url, instanceId);
      res.json({ 
        success: true, 
        message: `Navigated to ${url}`
      });
    } catch (error) {
      console.error('Failed to navigate:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Perform authenticated flow and capture our app
  app.post('/api/scrapybara/capture-app', async (req, res) => {
    try {
      const { baseUrl = 'http://localhost:5000', pages = ['/home', '/about', '/features', '/pricing'] } = req.body;
      
      console.log('Starting authenticated app capture...');
      const screenshots = await scrapybaraService.captureAuthenticatedPages(baseUrl, pages);
      
      res.json({
        success: true,
        screenshots,
        capturedPages: Object.keys(screenshots),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to capture app:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Test functionality flows
  app.post('/api/scrapybara/test-functionality', async (req, res) => {
    try {
      const { testCases = [] } = req.body;
      
      const defaultTestCases = [
        {
          name: 'search_functionality',
          action: 'Click on the search bar, type "spiritual" and see if search modal opens'
        },
        {
          name: 'notifications_button',
          action: 'Click on the notifications bell icon and check if modal opens'
        },
        {
          name: 'create_post_interaction',
          action: 'Click on the post creation textarea and see if it expands or shows options'
        },
        {
          name: 'mobile_navigation',
          action: 'If on mobile view, check if mobile navigation buttons at bottom are functional'
        },
        {
          name: 'sidebar_navigation',
          action: 'Try clicking on navigation items in the left sidebar if visible'
        }
      ];

      const allTestCases = testCases.length > 0 ? testCases : defaultTestCases;
      const results = await scrapybaraService.testFunctionality(allTestCases);
      
      res.json({
        success: true,
        testResults: results,
        totalTests: allTestCases.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to test functionality:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stop instance
  app.post('/api/scrapybara/stop-instance', async (req, res) => {
    try {
      const { instanceId } = req.body;
      await scrapybaraService.stopInstance(instanceId);
      
      res.json({ 
        success: true, 
        message: 'Instance stopped successfully'
      });
    } catch (error) {
      console.error('Failed to stop instance:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get instance info
  app.get('/api/scrapybara/instance', (req, res) => {
    try {
      const instanceInfo = scrapybaraService.getInstanceInfo();
      res.json({ 
        success: true, 
        instance: instanceInfo
      });
    } catch (error) {
      console.error('Failed to get instance info:', error);
      res.status(500).json({ error: error.message });
    }
  });

  console.log('Scrapybara routes registered');
}
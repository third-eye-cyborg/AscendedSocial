import type { Express } from "express";
import { scrapybaraService } from "./scrapybara-service";

export function registerScrapybaraRoutes(app: Express) {
  // Start instance and capture authenticated app
  app.post('/api/scrapybara/capture-app', async (req, res) => {
    try {
      const { baseUrl = 'http://localhost:5000', pages = ['/'] } = req.body;
      
      console.log('Starting app capture with Scrapybara SDK 2.0...');
      const screenshots = await scrapybaraService.captureAppPages(baseUrl, pages);
      
      res.json({
        success: true,
        screenshots,
        capturedPages: Object.keys(screenshots),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to capture app:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        details: error.stack
      });
    }
  });

  // Navigate to app and take screenshot
  app.post('/api/scrapybara/navigate', async (req, res) => {
    try {
      const { url = 'http://localhost:5000' } = req.body;
      
      const result = await scrapybaraService.navigateToApp(url);
      
      res.json({
        success: true,
        screenshot: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to navigate:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Perform authentication flow
  app.post('/api/scrapybara/authenticate', async (req, res) => {
    try {
      const { baseUrl = 'http://localhost:5000' } = req.body;
      
      const result = await scrapybaraService.performAuthentication(baseUrl);
      
      res.json({
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to authenticate:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Analyze contrast issues
  app.post('/api/scrapybara/analyze-contrast', async (req, res) => {
    try {
      const analysis = await scrapybaraService.analyzeContrastIssues();
      
      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to analyze contrast:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Take screenshot of current page
  app.post('/api/scrapybara/screenshot', async (req, res) => {
    try {
      const screenshot = await scrapybaraService.takeScreenshot();
      
      res.json({ 
        success: true, 
        screenshot,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to take screenshot:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Stop instance
  app.post('/api/scrapybara/stop', async (req, res) => {
    try {
      await scrapybaraService.stopInstance();
      
      res.json({ 
        success: true, 
        message: 'Instance stopped successfully'
      });
    } catch (error: any) {
      console.error('Failed to stop instance:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
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
    } catch (error: any) {
      console.error('Failed to get instance info:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Start a new instance manually
  app.post('/api/scrapybara/start', async (req, res) => {
    try {
      const instanceId = await scrapybaraService.startInstance();
      
      res.json({
        success: true,
        instanceId,
        message: 'Instance started successfully'
      });
    } catch (error: any) {
      console.error('Failed to start instance:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  console.log('Scrapybara routes registered');
}
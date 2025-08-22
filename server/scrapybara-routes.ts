import type { Express } from "express";
import { scrapybaraService } from "./scrapybara-service";

export function registerScrapybaraRoutes(app: Express) {
  // Start browser instance for auth setup
  app.post('/api/scrapybara/start-browser', async (req, res) => {
    try {
      const instanceId = await scrapybaraService.startBrowserInstance();
      
      res.json({
        success: true,
        instanceId,
        message: 'Browser instance started successfully'
      });
    } catch (error: any) {
      console.error('Failed to start browser instance:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Setup manual authentication and save auth state
  app.post('/api/scrapybara/setup-auth', async (req, res) => {
    try {
      const { baseUrl = 'http://localhost:5000', authStateName = 'default' } = req.body;
      
      const result = await scrapybaraService.manualAuthAndSave(baseUrl, authStateName);
      
      res.json({
        success: true,
        authStateId: result.authStateId,
        streamUrl: result.streamUrl,
        message: `Auth state saved as: ${authStateName}`,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to setup auth:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Authenticate using saved auth state
  app.post('/api/scrapybara/authenticate-saved', async (req, res) => {
    try {
      const { authStateName = 'default' } = req.body;
      
      const authenticated = await scrapybaraService.authenticateWithSavedState(authStateName);
      
      res.json({
        success: true,
        authenticated,
        message: `Authenticated using saved state: ${authStateName}`,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to authenticate with saved state:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Get saved auth states
  app.get('/api/scrapybara/auth-states', (req, res) => {
    try {
      const authStates = scrapybaraService.getSavedAuthStates();
      res.json({
        success: true,
        authStates,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Failed to get auth states:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // Start instance and capture authenticated app
  app.post('/api/scrapybara/capture-app', async (req, res) => {
    try {
      const { 
        baseUrl = 'http://localhost:5000', 
        pages = ['/'],
        useAuth = true,
        authStateName = 'default'
      } = req.body;
      
      console.log('Starting authenticated app capture...');
      const screenshots = await scrapybaraService.captureAppPages(baseUrl, pages, useAuth, authStateName);
      
      res.json({
        success: true,
        screenshots,
        capturedPages: Object.keys(screenshots),
        useAuth,
        authStateName,
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
import { Express } from 'express';
import { z } from 'zod';
import { BrowserlessAuthService } from './browserless-auth-service';

// Initialize the authenticated browserless service
const authBrowserlessService = new BrowserlessAuthService();

// Schemas for validation
const AuthScreenshotSchema = z.object({
  path: z.string().default('/'),
  options: z.object({
    viewport: z.object({
      width: z.number().default(1920),
      height: z.number().default(1080)
    }).optional(),
    userAgent: z.string().optional(),
    bypassAuth: z.boolean().default(true),
    timeout: z.number().optional()
  }).optional()
});

const AuthPDFSchema = z.object({
  path: z.string().default('/'),
  options: z.object({
    viewport: z.object({
      width: z.number().default(1920),
      height: z.number().default(1080)
    }).optional(),
    timeout: z.number().optional()
  }).optional()
});

const UserFlowSchema = z.object({
  steps: z.array(z.object({
    action: z.enum(['goto', 'click', 'fill', 'screenshot', 'wait']),
    selector: z.string().optional(),
    value: z.string().optional(),
    path: z.string().optional(),
    timeout: z.number().optional()
  })),
  options: z.object({
    viewport: z.object({
      width: z.number().default(1920),
      height: z.number().default(1080)
    }).optional(),
    timeout: z.number().optional()
  }).optional()
});

const AuthScrapeSchema = z.object({
  path: z.string(),
  selectors: z.array(z.string()).default([]),
  options: z.object({
    timeout: z.number().optional()
  }).optional()
});

export function registerBrowserlessAuthRoutes(app: Express) {
  // Health check for authenticated browserless service
  app.get('/api/browserless/auth/health', async (req, res) => {
    try {
      const health = await authBrowserlessService.healthCheck();
      res.json({
        success: true,
        authenticated: true,
        ...health,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Auth browserless health check failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Take authenticated screenshot
  app.post('/api/browserless/auth/screenshot', async (req, res) => {
    try {
      const { path, options } = AuthScreenshotSchema.parse(req.body);
      
      const result = await authBrowserlessService.takeAuthenticatedScreenshot(path, options);
      
      res.json({
        success: true,
        authenticated: true,
        data: result
      });
    } catch (error: any) {
      console.error('Authenticated screenshot failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Generate authenticated PDF
  app.post('/api/browserless/auth/pdf', async (req, res) => {
    try {
      const { path, options } = AuthPDFSchema.parse(req.body);
      
      const result = await authBrowserlessService.generateAuthenticatedPDF(path, options);
      
      res.json({
        success: true,
        authenticated: true,
        data: result
      });
    } catch (error: any) {
      console.error('Authenticated PDF generation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Test user flow with authentication
  app.post('/api/browserless/auth/test-flow', async (req, res) => {
    try {
      const { steps, options } = UserFlowSchema.parse(req.body);
      
      const result = await authBrowserlessService.testUserFlow(steps, options);
      
      res.json({
        success: true,
        authenticated: true,
        data: result
      });
    } catch (error: any) {
      console.error('Authenticated user flow test failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Scrape authenticated content
  app.post('/api/browserless/auth/scrape', async (req, res) => {
    try {
      const { path, selectors, options } = AuthScrapeSchema.parse(req.body);
      
      const result = await authBrowserlessService.scrapeAuthenticatedContent(path, selectors, options);
      
      res.json({
        success: true,
        authenticated: true,
        data: result
      });
    } catch (error: any) {
      console.error('Authenticated scraping failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get test user info
  app.get('/api/browserless/auth/test-user', (req, res) => {
    res.json({
      success: true,
      testUser: {
        id: '25531750',
        email: 'test@ascended.social',
        name: 'Spiritual Test User',
        replit: {
          id: '25531750',
          username: 'spiritual-tester'
        }
      },
      note: 'This is the test user data used for authenticated browser automation'
    });
  });

  console.log('🤖 Authenticated browserless routes registered');
}
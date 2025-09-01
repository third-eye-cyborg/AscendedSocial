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
  // Enhanced health check with comprehensive monitoring
  app.get('/api/browserless/auth/health', async (req, res) => {
    const startTime = Date.now();
    const healthId = `auth-health-${Date.now()}`;
    
    console.log(`🔍 [AUTH-HEALTH] ${healthId} - Starting authenticated health check`);
    
    try {
      const health = await authBrowserlessService.healthCheck();
      const duration = Date.now() - startTime;
      
      console.log(`✅ [AUTH-HEALTH] ${healthId} - Health check passed in ${duration}ms`);
      
      res.json({
        success: true,
        authenticated: true,
        healthId,
        duration,
        service: 'browserless-auth',
        ...health,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const isRateLimit = error.message?.includes('429') || error.message?.includes('Too Many Requests');
      
      console.error(`❌ [AUTH-HEALTH] ${healthId} - Failed after ${duration}ms:`, {
        error: error.message,
        isRateLimit,
        stack: error.stack?.split('\n').slice(0, 3)
      });
      
      const statusCode = isRateLimit ? 429 : 500;
      const errorMessage = isRateLimit 
        ? 'Service temporarily rate-limited, functionality may be degraded'
        : 'Health check failed';
      
      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        healthId,
        duration,
        isRateLimit,
        degradedMode: isRateLimit,
        timestamp: new Date().toISOString(),
        service: 'browserless-auth'
      });
    }
  });

  // Enhanced authenticated screenshot with validation and monitoring
  app.post('/api/browserless/auth/screenshot', async (req, res) => {
    const startTime = Date.now();
    const screenshotId = `auth-screenshot-${Date.now()}`;
    
    try {
      const { path, options } = AuthScreenshotSchema.parse(req.body);
      
      console.log(`📸 [AUTH-SCREENSHOT] ${screenshotId} - Starting authenticated screenshot for: ${path}`);
      
      const result = await authBrowserlessService.takeAuthenticatedScreenshot(path, {
        ...options,
        timeout: Math.min(options?.timeout || 30000, 60000) // Cap at 60s
      });
      
      const duration = Date.now() - startTime;
      
      if (result.success) {
        console.log(`✅ [AUTH-SCREENSHOT] ${screenshotId} - Completed successfully in ${duration}ms`);
        
        res.json({
          success: true,
          authenticated: true,
          screenshotId,
          duration,
          service: 'browserless-auth',
          data: {
            ...result,
            metadata: {
              ...result.metadata,
              screenshotId,
              duration
            }
          }
        });
      } else {
        console.warn(`⚠️ [AUTH-SCREENSHOT] ${screenshotId} - Completed with errors in ${duration}ms`);
        
        res.status(500).json({
          success: false,
          error: result.error || 'Screenshot capture failed',
          screenshotId,
          duration,
          service: 'browserless-auth'
        });
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const isRateLimit = error.message?.includes('429') || error.message?.includes('Too Many Requests');
      const isValidationError = error.name === 'ZodError';
      
      console.error(`❌ [AUTH-SCREENSHOT] ${screenshotId} - Failed after ${duration}ms:`, {
        error: error.message,
        isRateLimit,
        isValidationError,
        path: req.body.path
      });
      
      let statusCode = 500;
      let errorMessage = error.message;
      
      if (isValidationError) {
        statusCode = 400;
        errorMessage = 'Invalid request parameters';
      } else if (isRateLimit) {
        statusCode = 429;
        errorMessage = 'Screenshot service temporarily unavailable due to rate limiting';
      }
      
      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        screenshotId,
        duration,
        isRateLimit,
        isValidationError,
        degradedMode: isRateLimit,
        timestamp: new Date().toISOString(),
        service: 'browserless-auth'
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
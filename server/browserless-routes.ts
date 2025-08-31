import type { Express } from "express";
import { browserlessService } from "./browserless-service";
import { z } from "zod";

// Validation schemas
const ScreenshotSchema = z.object({
  url: z.string().url(),
  engine: z.enum(['playwright', 'puppeteer']).default('playwright'),
  options: z.object({
    fullPage: z.boolean().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    format: z.enum(['png', 'jpeg']).optional(),
    quality: z.number().min(0).max(100).optional(),
    clip: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number()
    }).optional()
  }).optional()
});

const PDFSchema = z.object({
  url: z.string().url(),
  engine: z.enum(['playwright', 'puppeteer']).default('playwright'),
  options: z.object({
    format: z.enum(['A4', 'Letter', 'Legal']).optional(),
    landscape: z.boolean().optional(),
    printBackground: z.boolean().optional(),
    margin: z.object({
      top: z.string().optional(),
      right: z.string().optional(),
      bottom: z.string().optional(),
      left: z.string().optional()
    }).optional()
  }).optional()
});

const ScrapeSchema = z.object({
  url: z.string().url(),
  engine: z.enum(['playwright', 'puppeteer']).default('playwright'),
  options: z.object({
    selector: z.string().optional(),
    waitForSelector: z.string().optional(),
    timeout: z.number().optional(),
    extractText: z.boolean().optional(),
    extractLinks: z.boolean().optional(),
    extractImages: z.boolean().optional()
  }).optional()
});

const FormFillSchema = z.object({
  url: z.string().url(),
  engine: z.enum(['playwright', 'puppeteer']).default('playwright'),
  formData: z.array(z.object({
    selector: z.string(),
    value: z.string(),
    type: z.enum(['input', 'select', 'textarea', 'checkbox', 'radio']).optional()
  })),
  submitSelector: z.string().optional(),
  options: z.object({
    headless: z.boolean().optional(),
    timeout: z.number().optional(),
    viewport: z.object({
      width: z.number(),
      height: z.number()
    }).optional(),
    userAgent: z.string().optional(),
    stealth: z.boolean().optional()
  }).optional()
});

const CustomScriptSchema = z.object({
  url: z.string().url(),
  script: z.string(),
  options: z.object({
    viewport: z.object({
      width: z.number(),
      height: z.number()
    }).optional(),
    userAgent: z.string().optional(),
    timeout: z.number().optional()
  }).optional()
});

export function registerBrowserlessRoutes(app: Express) {
  // Health check endpoint
  app.get('/api/browserless/health', async (req, res) => {
    try {
      const health = await browserlessService.healthCheck();
      res.json({
        success: true,
        ...health,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Health check failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Screenshot endpoint
  app.post('/api/browserless/screenshot', async (req, res) => {
    try {
      const { url, engine, options } = ScreenshotSchema.parse(req.body);
      
      let result;
      if (engine === 'puppeteer') {
        result = await browserlessService.takeScreenshotPuppeteer(url, options);
      } else {
        result = await browserlessService.takeScreenshotPlaywright(url, options);
      }
      
      res.json({
        success: true,
        engine,
        data: result
      });
    } catch (error: any) {
      console.error('Screenshot failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // PDF generation endpoint
  app.post('/api/browserless/pdf', async (req, res) => {
    try {
      const { url, engine, options } = PDFSchema.parse(req.body);
      
      let result;
      if (engine === 'puppeteer') {
        result = await browserlessService.generatePDFPuppeteer(url, options);
      } else {
        result = await browserlessService.generatePDFPlaywright(url, options);
      }
      
      res.json({
        success: true,
        engine,
        data: result
      });
    } catch (error: any) {
      console.error('PDF generation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Web scraping endpoint
  app.post('/api/browserless/scrape', async (req, res) => {
    try {
      const { url, engine, options } = ScrapeSchema.parse(req.body);
      
      let result;
      if (engine === 'puppeteer') {
        result = await browserlessService.scrapeContentPuppeteer(url, options);
      } else {
        result = await browserlessService.scrapeContentPlaywright(url, options);
      }
      
      res.json({
        success: true,
        engine,
        data: result
      });
    } catch (error: any) {
      console.error('Scraping failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Form filling endpoint
  app.post('/api/browserless/fill-form', async (req, res) => {
    try {
      const { url, engine, formData, submitSelector, options } = FormFillSchema.parse(req.body);
      
      let result;
      if (engine === 'puppeteer') {
        result = await browserlessService.fillFormPuppeteer(url, formData, submitSelector, options);
      } else {
        result = await browserlessService.fillFormPlaywright(url, formData, submitSelector, options);
      }
      
      res.json({
        success: true,
        engine,
        data: result
      });
    } catch (error: any) {
      console.error('Form filling failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Performance testing endpoint
  app.post('/api/browserless/performance', async (req, res) => {
    try {
      const { url } = z.object({ url: z.string().url() }).parse(req.body);
      
      const result = await browserlessService.performanceTestPlaywright(url);
      
      res.json({
        success: true,
        engine: 'playwright',
        ...result
      });
    } catch (error: any) {
      console.error('Performance test failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Custom script execution endpoint
  app.post('/api/browserless/execute', async (req, res) => {
    try {
      const { url, script, options } = CustomScriptSchema.parse(req.body);
      
      const result = await browserlessService.runCustomScriptPlaywright(url, script, options);
      
      res.json({
        success: true,
        engine: 'playwright',
        ...result
      });
    } catch (error: any) {
      console.error('Script execution failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Batch operations endpoint
  app.post('/api/browserless/batch', async (req, res) => {
    try {
      const { operations } = z.object({
        operations: z.array(z.object({
          type: z.enum(['screenshot', 'pdf', 'scrape']),
          url: z.string().url(),
          engine: z.enum(['playwright', 'puppeteer']).optional(),
          options: z.any().optional()
        }))
      }).parse(req.body);

      const results = [];
      
      for (const operation of operations) {
        try {
          let result;
          const engine = operation.engine || 'playwright';
          
          switch (operation.type) {
            case 'screenshot':
              if (engine === 'puppeteer') {
                result = await browserlessService.takeScreenshotPuppeteer(operation.url, operation.options);
              } else {
                result = await browserlessService.takeScreenshotPlaywright(operation.url, operation.options);
              }
              break;
            case 'pdf':
              if (engine === 'puppeteer') {
                result = await browserlessService.generatePDFPuppeteer(operation.url, operation.options);
              } else {
                result = await browserlessService.generatePDFPlaywright(operation.url, operation.options);
              }
              break;
            case 'scrape':
              if (engine === 'puppeteer') {
                result = await browserlessService.scrapeContentPuppeteer(operation.url, operation.options);
              } else {
                result = await browserlessService.scrapeContentPlaywright(operation.url, operation.options);
              }
              break;
          }
          
          results.push({
            operation,
            success: true,
            result,
            engine
          });
        } catch (error: any) {
          results.push({
            operation,
            success: false,
            error: error.message,
            engine: operation.engine || 'playwright'
          });
        }
      }

      res.json({
        success: true,
        results,
        completed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Batch operation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Initialize Browserless with credentials
  app.post('/api/browserless/initialize', async (req, res) => {
    try {
      const { token, endpoint } = z.object({
        token: z.string(),
        endpoint: z.string().url().optional()
      }).parse(req.body);

      browserlessService.initialize({
        token,
        endpoint: endpoint || 'wss://chrome.browserless.io',
        defaultTimeout: 30000
      });

      // Test the connection
      const health = await browserlessService.healthCheck();

      res.json({
        success: true,
        message: 'Browserless service initialized successfully',
        health,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Browserless initialization failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Cleanup endpoint
  app.post('/api/browserless/cleanup', async (req, res) => {
    try {
      await browserlessService.cleanup();
      
      res.json({
        success: true,
        message: 'Browserless cleanup completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Cleanup failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  console.log('🌐 Browserless routes registered');
}
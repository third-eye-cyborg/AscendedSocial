import type { Express } from "express";
import { isAuthenticated } from "./replitAuth";
import { ComplianceScanner } from "./compliance-scanner";
import { BrowserAutomationService } from "./browser-automation-service";
import { browserlessService } from "./browserless-service";

// Initialize services
const complianceScanner = new ComplianceScanner();
const browserAutomation = new BrowserAutomationService(browserlessService);

export function registerComplianceRoutes(app: Express) {
  // Privacy compliance scanning
  app.get('/api/compliance/privacy', isAuthenticated, async (req, res) => {
    try {
      console.log('🔍 Running privacy compliance scan...');
      const results = await complianceScanner.runPrivacyCompliance();
      
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        privacy: results
      });
    } catch (error: any) {
      console.error('Privacy compliance scan failed:', error);
      res.status(500).json({
        success: false,
        error: 'Privacy compliance scan failed',
        details: error.message
      });
    }
  });

  // Security vulnerability scanning
  app.get('/api/compliance/security', isAuthenticated, async (req, res) => {
    try {
      console.log('🛡️ Running security vulnerability scan...');
      const results = await complianceScanner.runSecurityScan();
      
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        security: results
      });
    } catch (error: any) {
      console.error('Security scan failed:', error);
      res.status(500).json({
        success: false,
        error: 'Security scan failed',
        details: error.message
      });
    }
  });

  // Generate comprehensive compliance report
  app.get('/api/compliance/report', isAuthenticated, async (req, res) => {
    try {
      const format = req.query.format as 'json' | 'html' || 'json';
      console.log(`📋 Generating compliance report in ${format} format...`);
      
      const report = await complianceScanner.generateComplianceReport(format);
      
      if (format === 'html') {
        res.setHeader('Content-Type', 'text/html');
        res.send(report);
      } else {
        res.json({
          success: true,
          report
        });
      }
    } catch (error: any) {
      console.error('Compliance report generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate compliance report',
        details: error.message
      });
    }
  });

  console.log('✅ Compliance scanning routes registered');
}

export function registerAutomationRoutes(app: Express) {
  // Execute browser automation task
  app.post('/api/automation/execute', isAuthenticated, async (req, res) => {
    try {
      const { instructions, url } = req.body;
      
      if (!instructions || !url) {
        return res.status(400).json({
          success: false,
          error: 'Instructions and URL are required'
        });
      }

      console.log(`🤖 Executing automation: ${instructions}`);
      const results = await browserAutomation.executeAutomationTask(instructions, url);
      
      res.json({
        success: results.success,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Browser automation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Browser automation failed',
        details: error.message
      });
    }
  });

  // Generate spiritual platform test suites
  app.get('/api/automation/tests/spiritual', isAuthenticated, async (req, res) => {
    try {
      console.log('🕉️ Generating spiritual platform test suites...');
      const testSuites = await browserAutomation.generateSpiritualTests();
      
      res.json({
        success: true,
        testSuites,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Test generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Test generation failed',
        details: error.message
      });
    }
  });

  // Monitor platform health with spiritual metrics
  app.get('/api/automation/monitor', isAuthenticated, async (req, res) => {
    try {
      console.log('📊 Monitoring spiritual platform health...');
      const healthStatus = await browserAutomation.monitorPlatformHealth();
      
      res.json({
        success: true,
        monitoring: healthStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Platform monitoring failed:', error);
      res.status(500).json({
        success: false,
        error: 'Platform monitoring failed',
        details: error.message
      });
    }
  });

  // Run automated tests for specific features
  app.post('/api/automation/test/:feature', isAuthenticated, async (req, res) => {
    try {
      const { feature } = req.params;
      const baseUrl = req.body.baseUrl || 'http://localhost:5000';
      
      console.log(`🧪 Testing ${feature} functionality...`);
      
      // Generate test instructions based on feature
      let instructions = '';
      let url = baseUrl;
      
      switch (feature) {
        case 'sparks':
          instructions = 'Navigate to sparks page. Check if video recording button is present. Verify spark creation form is functional.';
          url = `${baseUrl}/sparks`;
          break;
        case 'posts':
          instructions = 'Navigate to main feed. Verify posts are loading. Check engagement buttons work.';
          break;
        case 'oracle':
          instructions = 'Navigate to oracle section. Check daily reading generation. Verify personalized content appears.';
          url = `${baseUrl}/oracle`;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Unknown feature. Supported: sparks, posts, oracle'
          });
      }
      
      const results = await browserAutomation.executeAutomationTask(instructions, url);
      
      res.json({
        success: results.success,
        feature,
        testResults: results,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error(`Feature test failed for ${req.params.feature}:`, error);
      res.status(500).json({
        success: false,
        error: 'Feature test failed',
        details: error.message
      });
    }
  });

  console.log('🤖 Browser automation routes registered');
}
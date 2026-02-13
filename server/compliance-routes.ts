import express from "express";
import { isAuthenticated } from "./replitAuth";
import { ComplianceScanner } from "./compliance-scanner";
import { BrowserAutomationService } from "./browser-automation-service";
import { bytebotService } from "./bytebot-service";

const router = express.Router();

// Initialize services
const complianceScanner = new ComplianceScanner();
// Bytebot service enabled - automation service using open-source Bytebot
const browserAutomation = new BrowserAutomationService(bytebotService);

// Privacy compliance scanning
router.get('/privacy', isAuthenticated, async (req, res) => {
    try {
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
router.get('/security', isAuthenticated, async (req, res) => {
    try {
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
router.get('/report', isAuthenticated, async (req, res) => {
    try {
      const format = req.query.format as 'json' | 'html' || 'json';
      
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


// Execute browser automation task - ENABLED (using Bytebot OS)
router.post('/automation/execute', isAuthenticated, async (req, res) => {
    try {
      const { instructions, url } = req.body;
      
      if (!instructions || !url) {
        return res.status(400).json({
          success: false,
          error: 'Instructions and URL are required'
        });
      }

      const results = await browserAutomation.executeAutomationTask(instructions, url);
      
      res.json({
        success: results.success,
        results,
        timestamp: new Date().toISOString(),
        service: 'Bytebot OS (open-source)'
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

// Generate spiritual platform test suites - ENABLED (using Bytebot OS)
router.get('/automation/tests/spiritual', isAuthenticated, async (req, res) => {
    try {
      const testSuites = await browserAutomation.generateSpiritualTests();
      
      res.json({
        success: true,
        testSuites,
        timestamp: new Date().toISOString(),
        service: 'Bytebot OS (open-source)'
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

// Monitor platform health with spiritual metrics - ENABLED (using Bytebot OS)
router.get('/automation/monitor', isAuthenticated, async (req, res) => {
    try {
      const healthStatus = await browserAutomation.monitorPlatformHealth();
      
      res.json({
        success: true,
        monitoring: healthStatus,
        timestamp: new Date().toISOString(),
        service: 'Bytebot OS (open-source)'
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
router.post('/automation/test/:feature', isAuthenticated, async (req, res) => {
    try {
      const { feature } = req.params;
      const baseUrl = req.body.baseUrl || 'http://localhost:5000';
      
      
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
      
      // Use Bytebot for automation
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



export default router;
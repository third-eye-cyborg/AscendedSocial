import express from "express";
import { isAuthenticated } from "./replitAuth";
import { ComplianceScanner } from "./compliance-scanner";
import { BrowserAutomationService } from "./browser-automation-service";
// Browserless service disabled - import commented out
// import { browserlessService } from "./browserless-service";

const router = express.Router();

// Initialize services
const complianceScanner = new ComplianceScanner();
// Browserless service disabled - automation service temporarily disabled
// const browserAutomation = new BrowserAutomationService(browserlessService);

// Privacy compliance scanning
router.get('/privacy', isAuthenticated, async (req, res) => {
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
router.get('/security', isAuthenticated, async (req, res) => {
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
router.get('/report', isAuthenticated, async (req, res) => {
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


// Execute browser automation task - DISABLED (browserless service removed)
router.post('/automation/execute', isAuthenticated, async (req, res) => {
    res.status(503).json({
      success: false,
      error: 'Browser automation service temporarily disabled',
      message: 'Browserless service has been removed and will be replaced with bytesbot os'
    });
  });

// Generate spiritual platform test suites - DISABLED (browserless service removed)
router.get('/automation/tests/spiritual', isAuthenticated, async (req, res) => {
    res.status(503).json({
      success: false,
      error: 'Browser automation service temporarily disabled',
      message: 'Browserless service has been removed and will be replaced with bytesbot os'
    });
  });

// Monitor platform health with spiritual metrics - DISABLED (browserless service removed)
router.get('/automation/monitor', isAuthenticated, async (req, res) => {
    res.status(503).json({
      success: false,
      error: 'Browser automation service temporarily disabled',
      message: 'Browserless service has been removed and will be replaced with bytesbot os'
    });
  });

// Run automated tests for specific features
router.post('/automation/test/:feature', isAuthenticated, async (req, res) => {
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
      
      // Browser automation disabled
      const results = { success: false, error: 'Browser automation disabled' };
      
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


console.log('✅ Compliance and automation routes registered');

export default router;
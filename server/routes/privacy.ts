import { Router } from 'express';
import { z } from 'zod';
import { getFidesManager } from '../lib/fides-integration';
import { getPrivacyStackManager } from '../lib/privacy-stack';
import { getD1Manager } from '../lib/cloudflare-d1-integration';
import { createDataSubjectRequestSchema, updateConsentSchema } from '../../shared/schemas/privacy';

const router = Router();

// Initialize privacy managers (will need proper config from environment)
const fidesConfig = {
  apiUrl: process.env.FIDES_API_URL || 'http://localhost:8080',
  apiKey: process.env.FIDES_API_KEY,
  webhookSecret: process.env.FIDES_WEBHOOK_SECRET,
  enableAutomaticDeletion: true,
  dataRetentionDays: 365
};

const privacyStackConfig = {
  fides: { enabled: true, endpoint: fidesConfig.apiUrl, apiKey: fidesConfig.apiKey },
  snyk: { enabled: !!process.env.SNYK_API_KEY, apiKey: process.env.SNYK_API_KEY },
  bearer: { enabled: !!process.env.BEARER_API_KEY, apiKey: process.env.BEARER_API_KEY },
  semgrep: { enabled: true }, // Replit Semgrep
  revenuecat: { enabled: !!process.env.REVENUECAT_PUBLIC_KEY, publicKey: process.env.REVENUECAT_PUBLIC_KEY },
  paddle: { enabled: !!process.env.PADDLE_VENDOR_ID, vendorId: process.env.PADDLE_VENDOR_ID }
};

// Initialize managers
const fidesManager = getFidesManager(fidesConfig);
const privacyStack = getPrivacyStackManager(privacyStackConfig);

// Initialize Cloudflare D1 for consent auditing
let d1Manager: ReturnType<typeof getD1Manager> | null = null;

if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_D1_DATABASE_ID) {
  const d1Config = {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
  };
  
  d1Manager = getD1Manager(d1Config);
  d1Manager.initialize()
    .then(() => d1Manager!.initializeSchema())
    .catch(console.error);
}

// Initialize on startup
fidesManager.initialize().catch(console.error);
privacyStack.initialize().catch(console.error);

/**
 * Submit Data Subject Access Request (DSAR)
 * POST /api/privacy/dsar
 */
router.post('/dsar', async (req, res) => {
  try {
    const requestData = createDataSubjectRequestSchema.parse(req.body);
    
    const result = await fidesManager.submitDataSubjectRequest(requestData);
    
    if (result.success) {
      res.json({
        success: true,
        requestId: result.requestId,
        estimatedCompletion: result.estimatedCompletion,
        message: 'Data subject request submitted successfully. You will receive an email confirmation shortly.'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('DSAR submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit data subject request'
    });
  }
});

/**
 * Get DSAR status
 * GET /api/privacy/dsar/:requestId
 */
router.get('/dsar/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // In real implementation, this would query Fides for request status
    const status = {
      requestId,
      status: 'processing',
      submittedAt: new Date(),
      estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      progress: 45
    };
    
    res.json(status);
  } catch (error) {
    console.error('DSAR status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get request status'
    });
  }
});

/**
 * Update user consent preferences
 * POST /api/privacy/consent
 */
router.post('/consent', async (req, res) => {
  try {
    const consentUpdate = updateConsentSchema.parse(req.body);
    
    const consentData = {
      userId: req.user?.id,
      sessionId: req.sessionID || 'anonymous',
      purposes: consentUpdate.purposes || {},
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    };
    
    const result = await fidesManager.updateConsent(consentData);
    
    if (result.success) {
      res.json({
        success: true,
        consentId: result.consentId,
        message: 'Consent preferences updated successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Consent update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update consent preferences'
    });
  }
});

/**
 * Log consent event for auditing (self-hosted in Cloudflare D1)
 * POST /api/privacy/consent/audit
 */
router.post('/consent/audit', async (req, res) => {
  try {
    const { event, preferences, timestamp } = req.body;
    
    const userId = req.user?.id || 'anonymous';
    const sessionId = req.sessionID || 'anonymous';
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    const auditLog = {
      event: event || 'consent_updated',
      preferences: preferences || {},
      timestamp: timestamp || new Date().toISOString(),
      userId,
      sessionId,
      ipAddress,
      userAgent,
      source: 'termshub'
    };

    let consentId: number | undefined;

    // Store in Cloudflare D1 database (EU region) for GDPR compliance
    if (d1Manager) {
      try {
        const purposes = Object.keys(preferences || {}).join(', ') || 'general';
        const consentText = JSON.stringify(preferences || {});
        
        const result = await d1Manager.logConsent({
          userId,
          userIp: ipAddress,
          consentTimestamp: auditLog.timestamp,
          consentVersion: 'v1.0',
          consentText,
          consentMethod: 'web_form',
          purpose: purposes,
          consentStatus: 'active',
          event: auditLog.event,
          sessionId,
          userAgent,
          source: auditLog.source,
        });

        consentId = result.consentId;
        console.log('✅ Consent logged to D1:', { consentId });
      } catch (d1Error) {
        console.error('❌ Failed to log to D1:', d1Error);
      }
    } else {
      console.log('⚠️ D1 not configured, consent logged to console only:', auditLog);
    }

    res.json({
      success: true,
      consentId,
      message: 'Consent event logged successfully'
    });
  } catch (error) {
    console.error('Consent audit error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log consent event'
    });
  }
});

/**
 * Handle "Do Not Sell" request (CCPA)
 * POST /api/privacy/do-not-sell
 */
router.post('/do-not-sell', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !z.string().email().safeParse(email).success) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      });
    }
    
    const result = await fidesManager.handleDoNotSellRequest(email);
    
    if (result) {
      res.json({
        success: true,
        message: 'Do Not Sell request processed successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to process Do Not Sell request'
      });
    }
  } catch (error) {
    console.error('Do Not Sell error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process Do Not Sell request'
    });
  }
});

/**
 * Get privacy compliance status
 * GET /api/privacy/compliance-status
 */
router.get('/compliance-status', async (req, res) => {
  try {
    const status = privacyStack.getComplianceStatus();
    const report = await fidesManager.generateComplianceReport();
    
    res.json({
      ...status,
      fidesReport: report
    });
  } catch (error) {
    console.error('Compliance status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get compliance status'
    });
  }
});

/**
 * Export user data (data portability)
 * POST /api/privacy/export
 */
router.post('/export', async (req, res) => {
  try {
    const { email, verificationToken } = req.body;
    
    if (!email || !z.string().email().safeParse(email).success) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      });
    }
    
    // In real implementation, verify the token first
    
    const requestId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const exportData = await fidesManager.exportUserData(email, requestId);
    
    res.json({
      success: true,
      requestId,
      downloadUrl: `/api/privacy/download/${requestId}`, // Temporary URL
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      dataSize: JSON.stringify(exportData).length
    });
    
  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export data'
    });
  }
});

/**
 * Delete user data
 * POST /api/privacy/delete
 */
router.post('/delete', async (req, res) => {
  try {
    const { email, verificationToken } = req.body;
    
    if (!email || !z.string().email().safeParse(email).success) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      });
    }
    
    // In real implementation, verify the token first
    
    const requestId = `delete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const success = await fidesManager.processDataDeletion(email, requestId);
    
    if (success) {
      res.json({
        success: true,
        requestId,
        message: 'Data deletion request processed successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to process data deletion'
      });
    }
    
  } catch (error) {
    console.error('Data deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete data'
    });
  }
});

/**
 * Webhook endpoint for Fides events
 * POST /api/privacy/webhooks/fides
 */
router.post('/webhooks/fides', async (req, res) => {
  try {
    // Verify webhook signature in real implementation
    const event = req.body;
    
    console.log('Received Fides webhook:', event.type);
    
    // Process webhook event
    switch (event.type) {
      case 'dsar.completed':
        // Handle DSAR completion
        break;
      case 'data.deleted':
        // Handle data deletion confirmation
        break;
      case 'consent.updated':
        // Handle consent change
        break;
      default:
        console.log('Unhandled Fides webhook:', event.type);
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('Fides webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
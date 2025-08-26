import type { Express } from "express";
import { zeroTrust } from "./cloudflareZeroTrust";
import { 
  validateZeroTrustToken, 
  requireZeroTrustGroup,
  zeroTrustProtection,
  getZeroTrustUser,
  ZeroTrustRequest
} from "./zeroTrustMiddleware";
import { isAuthenticated } from "./replitAuth";

export function registerZeroTrustRoutes(app: Express): void {
  // Admin-only routes for Zero Trust management
  const adminProtection = zeroTrustProtection({
    requireGroups: ['Admin Access Policy'],
    bypassInDevelopment: true
  });

  // Get Zero Trust status and configuration
  app.get("/api/zero-trust/status", isAuthenticated, async (req, res) => {
    try {
      const isConfigured = !!zeroTrust;
      const config = isConfigured ? {
        teamDomain: process.env.CLOUDFLARE_TEAM_DOMAIN,
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID ? '****' + process.env.CLOUDFLARE_ACCOUNT_ID.slice(-4) : null,
        hasApiToken: !!process.env.CLOUDFLARE_API_TOKEN,
        hasAudTag: !!process.env.CLOUDFLARE_AUD_TAG,
      } : null;

      res.json({
        isConfigured,
        config,
        features: {
          applicationProtection: isConfigured,
          accessPolicies: isConfigured,
          userManagement: isConfigured,
          servicetokens: isConfigured,
          accessLogs: isConfigured,
        }
      });
    } catch (error) {
      console.error("Error getting Zero Trust status:", error);
      res.status(500).json({ error: "Failed to get Zero Trust status" });
    }
  });

  // Get current user's Zero Trust info
  app.get("/api/zero-trust/user", validateZeroTrustToken, (req: ZeroTrustRequest, res) => {
    const zeroTrustUser = getZeroTrustUser(req);
    
    if (!zeroTrustUser) {
      return res.json({ 
        authenticated: false,
        message: "No Zero Trust authentication found"
      });
    }

    res.json({
      authenticated: true,
      user: {
        id: zeroTrustUser.id,
        email: zeroTrustUser.email,
        name: zeroTrustUser.name,
        groups: zeroTrustUser.groups,
        identity_provider: zeroTrustUser.identity_provider,
      }
    });
  });

  // Admin: Get all applications
  app.get("/api/zero-trust/applications", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const applications = await zeroTrust.getAccessApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error getting applications:", error);
      res.status(500).json({ error: "Failed to get applications" });
    }
  });

  // Admin: Create new application
  app.post("/api/zero-trust/applications", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const applicationData = req.body;
      const application = await zeroTrust.createAccessApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  // Admin: Update application
  app.put("/api/zero-trust/applications/:appId", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const { appId } = req.params;
      const updates = req.body;
      const application = await zeroTrust.updateAccessApplication(appId, updates);
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // Admin: Delete application
  app.delete("/api/zero-trust/applications/:appId", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const { appId } = req.params;
      const success = await zeroTrust.deleteAccessApplication(appId);
      
      if (success) {
        res.json({ message: "Application deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete application" });
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // Admin: Get all policies
  app.get("/api/zero-trust/policies", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const policies = await zeroTrust.getAccessPolicies();
      res.json(policies);
    } catch (error) {
      console.error("Error getting policies:", error);
      res.status(500).json({ error: "Failed to get policies" });
    }
  });

  // Admin: Create new policy
  app.post("/api/zero-trust/policies", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const policyData = req.body;
      const policy = await zeroTrust.createAccessPolicy(policyData);
      res.status(201).json(policy);
    } catch (error) {
      console.error("Error creating policy:", error);
      res.status(500).json({ error: "Failed to create policy" });
    }
  });

  // Admin: Get all groups
  app.get("/api/zero-trust/groups", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const groups = await zeroTrust.getAccessGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error getting groups:", error);
      res.status(500).json({ error: "Failed to get groups" });
    }
  });

  // Admin: Create new group
  app.post("/api/zero-trust/groups", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const groupData = req.body;
      const group = await zeroTrust.createAccessGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ error: "Failed to create group" });
    }
  });

  // Admin: Get service tokens
  app.get("/api/zero-trust/service-tokens", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const tokens = await zeroTrust.getServiceTokens();
      // Don't return actual secrets, just metadata
      const sanitizedTokens = tokens.map(token => ({
        id: token.id,
        name: token.name,
        client_id: token.client_id,
        // client_secret is omitted for security
      }));
      
      res.json(sanitizedTokens);
    } catch (error) {
      console.error("Error getting service tokens:", error);
      res.status(500).json({ error: "Failed to get service tokens" });
    }
  });

  // Admin: Create service token
  app.post("/api/zero-trust/service-tokens", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const tokenData = req.body;
      const token = await zeroTrust.createServiceToken(tokenData);
      
      // Return the full token including secret only once during creation
      res.status(201).json(token);
    } catch (error) {
      console.error("Error creating service token:", error);
      res.status(500).json({ error: "Failed to create service token" });
    }
  });

  // Admin: Get access users
  app.get("/api/zero-trust/users", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const users = await zeroTrust.getAccessUsers();
      res.json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  // Admin: Get access logs
  app.get("/api/zero-trust/logs", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      const { limit, since, until, direction } = req.query;
      
      const logs = await zeroTrust.getAccessLogs({
        limit: limit ? parseInt(limit as string) : undefined,
        since: since as string,
        until: until as string,
        direction: direction as 'asc' | 'desc'
      });
      
      res.json(logs);
    } catch (error) {
      console.error("Error getting access logs:", error);
      res.status(500).json({ error: "Failed to get access logs" });
    }
  });

  // Admin: Setup spiritual platform defaults
  app.post("/api/zero-trust/setup-defaults", adminProtection, async (req, res) => {
    try {
      if (!zeroTrust) {
        return res.status(503).json({ error: "Zero Trust not configured" });
      }

      await zeroTrust.setupSpiritualPlatformDefaults();
      res.json({ message: "Spiritual platform defaults created successfully" });
    } catch (error) {
      console.error("Error setting up defaults:", error);
      res.status(500).json({ error: "Failed to setup defaults" });
    }
  });

  // Protected route example - Premium features
  app.get("/api/premium/zero-trust-protected", 
    zeroTrustProtection({
      requireGroups: ['Premium Spiritual Members'],
      bypassInDevelopment: true
    }), 
    (req: ZeroTrustRequest, res) => {
      const zeroTrustUser = getZeroTrustUser(req);
      res.json({
        message: "Welcome to premium spiritual features!",
        user: zeroTrustUser?.email,
        groups: zeroTrustUser?.groups,
        features: [
          "Advanced Spiritual Readings",
          "Premium Oracle Access",
          "Elite Community Features",
          "Personalized Spirit Guides"
        ]
      });
    }
  );

  // Health check endpoint for Zero Trust
  app.get("/api/zero-trust/health", async (req, res) => {
    const isConfigured = !!zeroTrust;
    const isHealthy = isConfigured && process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN;
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      configured: isConfigured,
      timestamp: new Date().toISOString(),
      services: {
        access_applications: isConfigured,
        access_policies: isConfigured,
        access_groups: isConfigured,
        service_tokens: isConfigured,
        jwt_validation: isConfigured,
      }
    });
  });
}
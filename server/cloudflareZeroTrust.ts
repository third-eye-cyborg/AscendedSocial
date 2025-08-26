import jwt from 'jsonwebtoken';
import axios, { AxiosInstance } from 'axios';

export interface ZeroTrustConfig {
  accountId: string;
  apiToken: string;
  teamDomain: string;
}

export interface AccessApplication {
  id?: string;
  name: string;
  domain: string;
  type: 'self_hosted' | 'saas' | 'ssh' | 'vnc' | 'app_launcher';
  session_duration?: string;
  auto_redirect_to_identity?: boolean;
  enable_binding_cookie?: boolean;
  allowed_idps?: string[];
  policies?: string[];
}

export interface AccessPolicy {
  id?: string;
  name: string;
  decision: 'allow' | 'deny' | 'non_identity' | 'bypass';
  precedence?: number;
  include: PolicyRule[];
  exclude?: PolicyRule[];
  require?: PolicyRule[];
  session_duration?: string;
}

export interface PolicyRule {
  email?: string[];
  email_domain?: string[];
  ip?: string[];
  country?: string[];
  group?: string[];
  service_token?: string[];
  any_valid_service_token?: boolean;
  authentication_method?: string[];
}

export interface AccessGroup {
  id?: string;
  name: string;
  include: PolicyRule[];
  exclude?: PolicyRule[];
  require?: PolicyRule[];
}

export interface ServiceToken {
  id?: string;
  name: string;
  client_id?: string;
  client_secret?: string;
  duration?: string;
}

export interface ZeroTrustUser {
  id: string;
  email: string;
  name?: string;
  user_uuid?: string;
  account_id?: string;
  identity_provider?: string;
  groups?: string[];
}

export class CloudflareZeroTrustService {
  private client: AxiosInstance;
  private accountId: string;
  private teamDomain: string;

  constructor(config: ZeroTrustConfig) {
    this.accountId = config.accountId;
    this.teamDomain = config.teamDomain;
    
    this.client = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // JWT Token Validation
  async validateAccessToken(token: string, audTag?: string): Promise<ZeroTrustUser | null> {
    try {
      // Get Cloudflare's public keys for JWT verification
      const certsResponse = await axios.get(
        `https://${this.teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`
      );
      
      const publicKeys = certsResponse.data;
      
      // Decode and verify the JWT
      const decoded = jwt.verify(token, publicKeys, {
        algorithms: ['RS256'],
        audience: audTag,
      }) as any;

      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        user_uuid: decoded.sub,
        account_id: decoded.account_id,
        identity_provider: decoded.identity_nonce,
        groups: decoded.groups || [],
      };
    } catch (error) {
      console.error('JWT validation failed:', error);
      return null;
    }
  }

  // Access Applications Management
  async createAccessApplication(app: AccessApplication): Promise<AccessApplication> {
    try {
      const response = await this.client.post(
        `/accounts/${this.accountId}/access/apps`,
        app
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to create access application:', error);
      throw error;
    }
  }

  async getAccessApplications(): Promise<AccessApplication[]> {
    try {
      const response = await this.client.get(`/accounts/${this.accountId}/access/apps`);
      return response.data.result;
    } catch (error) {
      console.error('Failed to get access applications:', error);
      throw error;
    }
  }

  async updateAccessApplication(appId: string, updates: Partial<AccessApplication>): Promise<AccessApplication> {
    try {
      const response = await this.client.put(
        `/accounts/${this.accountId}/access/apps/${appId}`,
        updates
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to update access application:', error);
      throw error;
    }
  }

  async deleteAccessApplication(appId: string): Promise<boolean> {
    try {
      await this.client.delete(`/accounts/${this.accountId}/access/apps/${appId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete access application:', error);
      return false;
    }
  }

  // Access Policies Management
  async createAccessPolicy(policy: AccessPolicy): Promise<AccessPolicy> {
    try {
      const response = await this.client.post(
        `/accounts/${this.accountId}/access/policies`,
        policy
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to create access policy:', error);
      throw error;
    }
  }

  async getAccessPolicies(): Promise<AccessPolicy[]> {
    try {
      const response = await this.client.get(`/accounts/${this.accountId}/access/policies`);
      return response.data.result;
    } catch (error) {
      console.error('Failed to get access policies:', error);
      throw error;
    }
  }

  async updateAccessPolicy(policyId: string, updates: Partial<AccessPolicy>): Promise<AccessPolicy> {
    try {
      const response = await this.client.put(
        `/accounts/${this.accountId}/access/policies/${policyId}`,
        updates
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to update access policy:', error);
      throw error;
    }
  }

  async deleteAccessPolicy(policyId: string): Promise<boolean> {
    try {
      await this.client.delete(`/accounts/${this.accountId}/access/policies/${policyId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete access policy:', error);
      return false;
    }
  }

  // Access Groups Management
  async createAccessGroup(group: AccessGroup): Promise<AccessGroup> {
    try {
      const response = await this.client.post(
        `/accounts/${this.accountId}/access/groups`,
        group
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to create access group:', error);
      throw error;
    }
  }

  async getAccessGroups(): Promise<AccessGroup[]> {
    try {
      const response = await this.client.get(`/accounts/${this.accountId}/access/groups`);
      return response.data.result;
    } catch (error) {
      console.error('Failed to get access groups:', error);
      throw error;
    }
  }

  async updateAccessGroup(groupId: string, updates: Partial<AccessGroup>): Promise<AccessGroup> {
    try {
      const response = await this.client.put(
        `/accounts/${this.accountId}/access/groups/${groupId}`,
        updates
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to update access group:', error);
      throw error;
    }
  }

  async deleteAccessGroup(groupId: string): Promise<boolean> {
    try {
      await this.client.delete(`/accounts/${this.accountId}/access/groups/${groupId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete access group:', error);
      return false;
    }
  }

  // Service Tokens Management
  async createServiceToken(token: ServiceToken): Promise<ServiceToken> {
    try {
      const response = await this.client.post(
        `/accounts/${this.accountId}/access/service_tokens`,
        token
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to create service token:', error);
      throw error;
    }
  }

  async getServiceTokens(): Promise<ServiceToken[]> {
    try {
      const response = await this.client.get(`/accounts/${this.accountId}/access/service_tokens`);
      return response.data.result;
    } catch (error) {
      console.error('Failed to get service tokens:', error);
      throw error;
    }
  }

  async deleteServiceToken(tokenId: string): Promise<boolean> {
    try {
      await this.client.delete(`/accounts/${this.accountId}/access/service_tokens/${tokenId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete service token:', error);
      return false;
    }
  }

  // User Management
  async getAccessUsers(): Promise<ZeroTrustUser[]> {
    try {
      const response = await this.client.get(`/accounts/${this.accountId}/access/users`);
      return response.data.result;
    } catch (error) {
      console.error('Failed to get access users:', error);
      throw error;
    }
  }

  // Utility Methods
  async getAccessLogs(options?: {
    direction?: 'desc' | 'asc';
    limit?: number;
    since?: string;
    until?: string;
  }): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (options?.direction) params.append('direction', options.direction);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.since) params.append('since', options.since);
      if (options?.until) params.append('until', options.until);

      const response = await this.client.get(
        `/accounts/${this.accountId}/access/logs/access_requests?${params}`
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to get access logs:', error);
      throw error;
    }
  }

  // Validate service token for API requests
  validateServiceToken(clientId: string, clientSecret: string): boolean {
    // This would normally validate against Cloudflare's service token validation endpoint
    // For now, we'll do basic format validation
    return clientId && clientSecret && 
           clientId.includes('.access') && 
           clientSecret.length > 10;
  }

  // Create default spiritual platform policies
  async setupSpiritualPlatformDefaults(): Promise<void> {
    try {
      // Create spiritual community access group
      const spiritualGroup = await this.createAccessGroup({
        name: 'Spiritual Community Members',
        include: [
          {
            email_domain: ['example.com'], // Replace with your domain
          }
        ]
      });

      // Create premium members group
      const premiumGroup = await this.createAccessGroup({
        name: 'Premium Spiritual Members',
        include: [
          {
            group: [spiritualGroup.id!]
          }
        ]
      });

      // Create policy for admin access
      await this.createAccessPolicy({
        name: 'Admin Access Policy',
        decision: 'allow',
        precedence: 1,
        include: [
          {
            email: ['admin@yourplatform.com'] // Replace with admin emails
          }
        ],
        session_duration: '24h'
      });

      // Create policy for community access
      await this.createAccessPolicy({
        name: 'Community Access Policy',
        decision: 'allow',
        precedence: 2,
        include: [
          {
            group: [spiritualGroup.id!]
          }
        ],
        session_duration: '8h'
      });

      // Create policy for premium features
      await this.createAccessPolicy({
        name: 'Premium Features Policy',
        decision: 'allow',
        precedence: 3,
        include: [
          {
            group: [premiumGroup.id!]
          }
        ],
        session_duration: '12h'
      });

      console.log('✅ Spiritual platform Zero Trust defaults created successfully');
    } catch (error) {
      console.error('Failed to setup spiritual platform defaults:', error);
      throw error;
    }
  }
}

// Initialize Zero Trust service if environment variables are available
export const zeroTrust = process.env.CLOUDFLARE_ACCOUNT_ID && 
                         process.env.CLOUDFLARE_API_TOKEN && 
                         process.env.CLOUDFLARE_TEAM_DOMAIN 
  ? new CloudflareZeroTrustService({
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      apiToken: process.env.CLOUDFLARE_API_TOKEN,
      teamDomain: process.env.CLOUDFLARE_TEAM_DOMAIN,
    })
  : null;
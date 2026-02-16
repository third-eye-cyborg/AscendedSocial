/**
 * Cloudflare D1 Integration for GDPR-Compliant Consent Audit Logs
 * Stores consent data in EU-region database for compliance
 */

export interface D1Config {
  accountId: string;
  apiToken: string;
  databaseId: string;
}

export interface ConsentAuditLog {
  userId: string;
  userIp: string;
  consentTimestamp: string;
  consentVersion: string;
  consentText: string;
  consentMethod: string;
  purpose: string;
  consentStatus: 'active' | 'withdrawn' | 'expired';
  withdrawalTimestamp?: string;
  metadata?: string;
  event?: string;
  sessionId?: string;
  userAgent?: string;
  source?: string;
}

export interface ConsentHistory {
  id: number;
  userId: string;
  userIp: string;
  consentTimestamp: string;
  consentVersion: string;
  consentText: string;
  consentMethod: string;
  purpose: string;
  consentStatus: string;
  withdrawalTimestamp?: string;
  metadata?: string;
  createdAt: string;
}

export class CloudflareD1Manager {
  private config: D1Config;
  private isInitialized: boolean = false;

  constructor(config: D1Config) {
    this.config = config;
  }

  /**
   * Initialize D1 connection and verify database
   */
  async initialize(): Promise<void> {
    console.log('💾 Initializing Cloudflare D1 consent storage...');

    try {
      if (!this.config.accountId || !this.config.apiToken || !this.config.databaseId) {
        throw new Error('Cloudflare D1 credentials not configured');
      }

      await this.testConnection();
      this.isInitialized = true;
      console.log('✅ Cloudflare D1 consent storage initialized');
    } catch (error) {
      console.error('❌ Failed to initialize D1:', error);
      throw error;
    }
  }

  /**
   * Test D1 API connection
   */
  private async testConnection(): Promise<void> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/d1/database/${this.config.databaseId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`D1 API connection failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ D1 API connection successful');
  }

  /**
   * Execute SQL query on D1 database
   */
  private async executeQuery(sql: string, params: any[] = []): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('D1 not initialized');
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/d1/database/${this.config.databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`D1 query failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result.result;
  }

  /**
   * Initialize database schema
   */
  async initializeSchema(): Promise<void> {
    console.log('📊 Initializing D1 consent schema...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS consent_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        user_ip TEXT,
        consent_timestamp TEXT NOT NULL,
        consent_version TEXT NOT NULL,
        consent_text TEXT NOT NULL,
        consent_method TEXT NOT NULL,
        purpose TEXT NOT NULL,
        consent_status TEXT DEFAULT 'active',
        withdrawal_timestamp TEXT,
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_user_id ON consent_log(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_consent_status ON consent_log(consent_status);',
      'CREATE INDEX IF NOT EXISTS idx_consent_timestamp ON consent_log(consent_timestamp);',
    ];

    try {
      await this.executeQuery(createTableSQL);
      for (const indexSQL of createIndexes) {
        await this.executeQuery(indexSQL);
      }
      console.log('✅ D1 consent schema initialized');
    } catch (error) {
      console.error('❌ Failed to initialize schema:', error);
      throw error;
    }
  }

  /**
   * Log consent event to D1
   */
  async logConsent(log: ConsentAuditLog): Promise<{ success: boolean; consentId?: number }> {
    if (!this.isInitialized) {
      throw new Error('D1 not initialized');
    }

    console.log('📝 Logging consent to D1:', { userId: log.userId, purpose: log.purpose });

    try {
      const sql = `
        INSERT INTO consent_log 
        (user_id, user_ip, consent_timestamp, consent_version, consent_text, 
         consent_method, purpose, consent_status, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const metadata = log.metadata || JSON.stringify({
        event: log.event,
        sessionId: log.sessionId,
        userAgent: log.userAgent,
        source: log.source,
      });

      const params = [
        log.userId,
        log.userIp,
        log.consentTimestamp,
        log.consentVersion || 'v1.0',
        log.consentText || 'Consent preferences updated',
        log.consentMethod || 'web_form',
        log.purpose,
        log.consentStatus || 'active',
        metadata,
      ];

      const result = await this.executeQuery(sql, params);
      
      const consentId = result[0]?.meta?.last_row_id;
      
      console.log('✅ Consent logged to D1:', { consentId });
      
      return { success: true, consentId };
    } catch (error) {
      console.error('❌ Failed to log consent to D1:', error);
      return { success: false };
    }
  }

  /**
   * Withdraw consent for a user
   */
  async withdrawConsent(userId: string): Promise<{ success: boolean }> {
    if (!this.isInitialized) {
      throw new Error('D1 not initialized');
    }

    console.log('🚫 Withdrawing consent for:', userId);

    try {
      const sql = `
        UPDATE consent_log 
        SET consent_status = 'withdrawn',
            withdrawal_timestamp = ?
        WHERE user_id = ? AND consent_status = 'active'
      `;

      const params = [new Date().toISOString(), userId];
      await this.executeQuery(sql, params);

      console.log('✅ Consent withdrawn successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to withdraw consent:', error);
      return { success: false };
    }
  }

  /**
   * Get consent history for a user (GDPR access request)
   */
  async getConsentHistory(userId: string): Promise<ConsentHistory[]> {
    if (!this.isInitialized) {
      throw new Error('D1 not initialized');
    }

    console.log('📜 Retrieving consent history for:', userId);

    try {
      const sql = `
        SELECT * FROM consent_log 
        WHERE user_id = ? 
        ORDER BY consent_timestamp DESC
      `;

      const params = [userId];
      const result = await this.executeQuery(sql, params);

      const consents = result[0]?.results || [];
      
      console.log(`✅ Retrieved ${consents.length} consent records`);
      
      return consents;
    } catch (error) {
      console.error('❌ Failed to retrieve consent history:', error);
      return [];
    }
  }

  /**
   * Delete all consent data for a user (GDPR right to be forgotten)
   */
  async deleteUserConsents(userId: string): Promise<{ success: boolean }> {
    if (!this.isInitialized) {
      throw new Error('D1 not initialized');
    }

    console.log('🗑️ Deleting all consents for:', userId);

    try {
      const sql = 'DELETE FROM consent_log WHERE user_id = ?';
      const params = [userId];
      await this.executeQuery(sql, params);

      console.log('✅ User consents deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete user consents:', error);
      return { success: false };
    }
  }

  /**
   * Get consent statistics
   */
  async getConsentStatistics(): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('D1 not initialized');
    }

    try {
      const sql = `
        SELECT 
          consent_status,
          COUNT(*) as count
        FROM consent_log
        GROUP BY consent_status
      `;

      const result = await this.executeQuery(sql);
      const stats = result[0]?.results || [];
      
      return stats.reduce((acc: any, stat: any) => {
        acc[stat.consent_status] = stat.count;
        return acc;
      }, {});
    } catch (error) {
      console.error('❌ Failed to get consent statistics:', error);
      return {};
    }
  }
}

let d1Manager: CloudflareD1Manager | null = null;

export function getD1Manager(config?: D1Config): CloudflareD1Manager {
  if (!d1Manager && config) {
    d1Manager = new CloudflareD1Manager(config);
  }

  if (!d1Manager) {
    throw new Error('D1 Manager not initialized');
  }

  return d1Manager;
}

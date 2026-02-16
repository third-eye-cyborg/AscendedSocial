/**
 * Mobile Sync Client for Notion Integration
 * 
 * This client can be used in your mobile Replit to sync documentation
 * with the main backend's Notion workspace.
 */

interface MobileSyncConfig {
  backendUrl: string;
  apiKey?: string;
  syncInterval?: number;
  watchPaths?: string[];
}

interface SyncResult {
  file: string;
  status: 'success' | 'failed' | 'skipped';
  pageId?: string;
  error?: string;
  timestamp: string;
}

class MobileSyncClient {
  private config: MobileSyncConfig;
  private syncInProgress: boolean = false;
  private syncResults: SyncResult[] = [];
  private lastSyncTime: Date | null = null;

  constructor(config: MobileSyncConfig) {
    this.config = {
      syncInterval: 60000, // 1 minute default
      watchPaths: ['*.md', 'docs/**/*.md', 'src/**/*.ts', 'src/**/*.tsx'],
      ...config
    };
  }

  /**
   * Initialize the mobile sync client
   */
  async init(): Promise<void> {
    try {
      console.log('📱 Initializing Mobile Sync Client...');
      
      // Test connection to backend
      const response = await this.makeRequest('GET', '/api/auto-sync/status');
      
      if (!response.success) {
        throw new Error('Failed to connect to backend auto-sync service');
      }

      console.log('✅ Mobile Sync Client initialized successfully');
      console.log(`🔗 Backend URL: ${this.config.backendUrl}`);
      console.log(`⏰ Sync interval: ${this.config.syncInterval}ms`);
    } catch (error: any) {
      console.error('❌ Failed to initialize Mobile Sync Client:', error.message);
      throw error;
    }
  }

  /**
   * Start automatic syncing
   */
  async startAutoSync(): Promise<void> {
    try {
      console.log('🚀 Starting mobile auto-sync...');
      
      // Initialize backend auto-sync service
      await this.makeRequest('POST', '/api/auto-sync/init', {
        watchPaths: this.config.watchPaths,
        syncInterval: this.config.syncInterval,
        mobileSync: true,
        includeCodeFiles: true
      });

      // Start the service
      await this.makeRequest('POST', '/api/auto-sync/start');

      // Start periodic sync
      this.startPeriodicSync();
      
      console.log('✅ Mobile auto-sync started');
    } catch (error: any) {
      console.error('❌ Failed to start mobile auto-sync:', error.message);
      throw error;
    }
  }

  /**
   * Stop automatic syncing
   */
  async stopAutoSync(): Promise<void> {
    try {
      await this.makeRequest('POST', '/api/auto-sync/stop');
      console.log('✅ Mobile auto-sync stopped');
    } catch (error: any) {
      console.error('❌ Failed to stop mobile auto-sync:', error.message);
    }
  }

  /**
   * Sync all mobile documentation
   */
  async syncAllDocs(): Promise<SyncResult[]> {
    if (this.syncInProgress) {
      console.log('⏳ Sync already in progress, skipping');
      return [];
    }

    this.syncInProgress = true;
    const results: SyncResult[] = [];

    try {
      console.log('📱 Syncing all mobile documentation...');
      
      // Sync mobile-specific docs
      const mobileResponse = await this.makeRequest('POST', '/api/auto-sync/sync-mobile', {
        platform: 'all'
      });

      if (mobileResponse.success) {
        results.push(...mobileResponse.results);
      }

      // Sync all docs
      const allDocsResponse = await this.makeRequest('POST', '/api/auto-sync/sync-all');

      if (allDocsResponse.success) {
        results.push(...allDocsResponse.results);
      }

      this.lastSyncTime = new Date();
      console.log(`✅ Mobile sync completed: ${results.filter(r => r.status === 'success').length} files synced`);
    } catch (error: any) {
      console.error('❌ Mobile sync failed:', error.message);
    } finally {
      this.syncInProgress = false;
    }

    return results;
  }

  /**
   * Sync specific mobile documentation files
   */
  async syncMobileDocs(platform: 'ios' | 'android' | 'web' | 'all' = 'all'): Promise<SyncResult[]> {
    try {
      console.log(`📱 Syncing mobile docs for platform: ${platform}`);
      
      const response = await this.makeRequest('POST', '/api/auto-sync/sync-mobile', {
        platform
      });

      if (response.success) {
        this.syncResults.push(...response.results);
        console.log(`✅ Mobile docs synced: ${response.results.length} files`);
        return response.results;
      } else {
        throw new Error(response.error || 'Failed to sync mobile docs');
      }
    } catch (error: any) {
      console.error('❌ Mobile docs sync failed:', error.message);
      throw error;
    }
  }

  /**
   * Get sync status
   */
  async getStatus(): Promise<any> {
    try {
      const response = await this.makeRequest('GET', '/api/auto-sync/status');
      return response.status;
    } catch (error: any) {
      console.error('❌ Failed to get sync status:', error.message);
      throw error;
    }
  }

  /**
   * Start periodic sync
   */
  private startPeriodicSync(): void {
    setInterval(async () => {
      if (this.syncInProgress) {
        console.log('⏳ Periodic sync skipped - sync already in progress');
        return;
      }
      
      console.log('🔄 Starting periodic mobile sync...');
      await this.syncAllDocs();
    }, this.config.syncInterval);
  }

  /**
   * Make HTTP request to backend
   */
  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.config.backendUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`❌ Request failed: ${method} ${endpoint}`, error.message);
      throw error;
    }
  }

  /**
   * Get sync history
   */
  getSyncHistory(): SyncResult[] {
    return this.syncResults;
  }

  /**
   * Clear sync history
   */
  clearHistory(): void {
    this.syncResults = [];
    console.log('🧹 Mobile sync history cleared');
  }
}

// Example usage for mobile Replit
export const createMobileSyncClient = (backendUrl: string, apiKey?: string) => {
  return new MobileSyncClient({
    backendUrl,
    apiKey,
    syncInterval: 60000, // 1 minute
    watchPaths: [
      '*.md',
      'docs/**/*.md',
      'src/**/*.ts',
      'src/**/*.tsx',
      'components/**/*.tsx',
      'screens/**/*.tsx',
      'utils/**/*.ts'
    ]
  });
};

// Example usage:
/*
const mobileSync = createMobileSyncClient(
  'https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev',
  'your-api-key-here'
);

// Initialize and start auto-sync
await mobileSync.init();
await mobileSync.startAutoSync();

// Manual sync
const results = await mobileSync.syncAllDocs();
console.log('Sync results:', results);

// Get status
const status = await mobileSync.getStatus();
console.log('Sync status:', status);
*/

export { MobileSyncClient };

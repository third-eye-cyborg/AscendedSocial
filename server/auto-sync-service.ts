import { promises as fs } from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { notion, createOrUpdateDocumentationPage, findDatabaseByTitle } from './notion.js';

interface AutoSyncConfig {
  watchPaths: string[];
  syncInterval: number;
  mobileSync: boolean;
  includeCodeFiles: boolean;
  notionPageId?: string;
}

interface SyncResult {
  file: string;
  status: 'success' | 'failed' | 'skipped';
  pageId?: string;
  error?: string;
  timestamp: Date;
}

class AutoSyncService {
  private config: AutoSyncConfig;
  private watcher?: chokidar.FSWatcher;
  private syncInProgress: boolean = false;
  private syncResults: SyncResult[] = [];
  private lastSyncTime: Date | null = null;

  constructor(config: Partial<AutoSyncConfig> = {}) {
    this.config = {
      watchPaths: config.watchPaths || ['../*.md', '../docs/**/*.md', '../server/**/*.ts'],
      syncInterval: config.syncInterval || 30000, // 30 seconds
      mobileSync: config.mobileSync || false,
      includeCodeFiles: config.includeCodeFiles || false,
      notionPageId: config.notionPageId || process.env.NOTION_PAGE_ID,
      ...config
    };
  }

  /**
   * Start the auto-sync service
   */
  async start(): Promise<void> {
    try {
      console.log('🚀 Starting Auto-Sync Service...');
      
      // Initialize Notion connection
      if (!process.env.NOTION_INTEGRATION_SECRET) {
        throw new Error('NOTION_INTEGRATION_SECRET not found in environment variables');
      }

      // Start file watcher
      await this.startFileWatcher();
      
      // Start periodic sync
      this.startPeriodicSync();
      
      console.log('✅ Auto-Sync Service started successfully');
      console.log(`📁 Watching paths: ${this.config.watchPaths.join(', ')}`);
      console.log(`⏰ Sync interval: ${this.config.syncInterval}ms`);
      console.log(`📱 Mobile sync: ${this.config.mobileSync ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      console.error('❌ Failed to start Auto-Sync Service:', error.message);
      throw error;
    }
  }

  /**
   * Stop the auto-sync service
   */
  async stop(): Promise<void> {
    try {
      if (this.watcher) {
        await this.watcher.close();
        this.watcher = undefined;
      }
      console.log('✅ Auto-Sync Service stopped');
    } catch (error: any) {
      console.error('❌ Error stopping Auto-Sync Service:', error.message);
    }
  }

  /**
   * Start file system watcher
   */
  private async startFileWatcher(): Promise<void> {
    this.watcher = chokidar.watch(this.config.watchPaths, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000, // Wait 1 second after file stops changing
        pollInterval: 100
      }
    });

    this.watcher.on('change', async (filePath) => {
      if (this.syncInProgress) {
        console.log(`⏳ Sync already in progress, skipping: ${filePath}`);
        return;
      }
      
      await this.syncFile(filePath);
    });

    this.watcher.on('add', async (filePath) => {
      if (this.syncInProgress) {
        console.log(`⏳ Sync already in progress, skipping: ${filePath}`);
        return;
      }
      
      await this.syncFile(filePath);
    });
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
      
      console.log('🔄 Starting periodic sync...');
      await this.syncAllFiles();
    }, this.config.syncInterval);
  }

  /**
   * Sync a single file to Notion
   */
  async syncFile(filePath: string): Promise<SyncResult> {
    const result: SyncResult = {
      file: filePath,
      status: 'failed',
      timestamp: new Date()
    };

    try {
      // Check if file should be synced
      if (!this.shouldSyncFile(filePath)) {
        result.status = 'skipped';
        return result;
      }

      console.log(`📝 Syncing file: ${filePath}`);
      
      const content = await fs.readFile(filePath, 'utf-8');
      const pageId = await createOrUpdateDocumentationPage(content);
      
      result.status = 'success';
      result.pageId = pageId;
      
      console.log(`✅ Successfully synced: ${filePath} → ${pageId}`);
    } catch (error: any) {
      result.error = error.message;
      console.error(`❌ Failed to sync ${filePath}:`, error.message);
    }

    this.syncResults.push(result);
    return result;
  }

  /**
   * Sync all files matching watch patterns
   */
  async syncAllFiles(): Promise<SyncResult[]> {
    if (this.syncInProgress) {
      console.log('⏳ Sync already in progress, skipping');
      return [];
    }

    this.syncInProgress = true;
    const results: SyncResult[] = [];

    try {
      console.log('🔄 Starting full sync...');
      
      for (const pattern of this.config.watchPaths) {
        const files = await this.getFilesMatchingPattern(pattern);
        
        for (const file of files) {
          const result = await this.syncFile(file);
          results.push(result);
        }
      }

      this.lastSyncTime = new Date();
      console.log(`✅ Full sync completed: ${results.filter(r => r.status === 'success').length} files synced`);
    } catch (error: any) {
      console.error('❌ Full sync failed:', error.message);
    } finally {
      this.syncInProgress = false;
    }

    return results;
  }

  /**
   * Sync mobile-specific documentation
   */
  async syncMobileDocs(platform: string = 'all'): Promise<SyncResult[]> {
    const mobileDocs = [
      { file: '../mobile-sync-docs.md', title: 'Mobile Sync Documentation' },
      { file: '../mobile-auth-setup.md', title: 'Mobile Authentication Setup' },
      { file: '../mobile-api-docs.md', title: 'Mobile API Documentation' },
      { file: '../mobile-deployment.md', title: 'Mobile Deployment Guide' }
    ];

    const results: SyncResult[] = [];
    
    for (const doc of mobileDocs) {
      try {
        const content = await fs.readFile(doc.file, 'utf-8');
        const pageId = await this.createNotionPage(doc.title, content);
        
        results.push({
          file: doc.file,
          status: 'success',
          pageId,
          timestamp: new Date()
        });
        
        console.log(`📱 Synced mobile doc: ${doc.title} → ${pageId}`);
      } catch (error: any) {
        results.push({
          file: doc.file,
          status: 'failed',
          error: error.message,
          timestamp: new Date()
        });
        
        console.error(`❌ Failed to sync mobile doc ${doc.title}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Create a new Notion page
   */
  private async createNotionPage(title: string, content: string): Promise<string> {
    const page = await notion.pages.create({
      parent: {
        type: "page_id",
        page_id: this.config.notionPageId!
      },
      properties: {
        title: {
          title: [{ text: { content: title } }]
        }
      }
    });

    // Add content as blocks
    const blocks = this.convertMarkdownToBlocks(content);
    if (blocks.length > 0) {
      await notion.blocks.children.append({
        block_id: page.id,
        children: blocks
      });
    }

    return page.id;
  }

  /**
   * Check if a file should be synced
   */
  private shouldSyncFile(filePath: string): boolean {
    // Skip if it's a code file and includeCodeFiles is false
    if (!this.config.includeCodeFiles && (filePath.endsWith('.ts') || filePath.endsWith('.js'))) {
      return false;
    }

    // Skip if it's a test file
    if (filePath.includes('test') || filePath.includes('spec')) {
      return false;
    }

    // Skip if it's a build file
    if (filePath.includes('dist') || filePath.includes('build')) {
      return false;
    }

    return true;
  }

  /**
   * Get files matching a glob pattern
   */
  private async getFilesMatchingPattern(pattern: string): Promise<string[]> {
    const { glob } = require('glob');
    return await glob(pattern);
  }

  /**
   * Convert markdown content to Notion blocks
   */
  private convertMarkdownToBlocks(content: string): any[] {
    const lines = content.split('\n');
    const blocks: any[] = [];
    
    for (const line of lines) {
      if (!line.trim()) {
        continue; // Skip empty lines
      }
      
      if (line.startsWith('# ')) {
        blocks.push({
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [{
              type: "text",
              text: { content: line.substring(2) }
            }]
          }
        });
      } else if (line.startsWith('## ')) {
        blocks.push({
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{
              type: "text",
              text: { content: line.substring(3) }
            }]
          }
        });
      } else if (line.startsWith('### ')) {
        blocks.push({
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [{
              type: "text",
              text: { content: line.substring(4) }
            }]
          }
        });
      } else if (line.startsWith('- ') || line.startsWith('  - ')) {
        const content = line.startsWith('  - ') ? line.substring(4) : line.substring(2);
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{
              type: "text",
              text: { content }
            }]
          }
        });
      } else {
        // Regular paragraph
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{
              type: "text",
              text: { content: line }
            }]
          }
        });
      }
    }

    return blocks;
  }

  /**
   * Get sync status and statistics
   */
  getStatus(): {
    isRunning: boolean;
    lastSyncTime: Date | null;
    totalFiles: number;
    successfulSyncs: number;
    failedSyncs: number;
    skippedSyncs: number;
    recentResults: SyncResult[];
  } {
    const recentResults = this.syncResults.slice(-10); // Last 10 results
    
    return {
      isRunning: this.watcher !== undefined,
      lastSyncTime: this.lastSyncTime,
      totalFiles: this.syncResults.length,
      successfulSyncs: this.syncResults.filter(r => r.status === 'success').length,
      failedSyncs: this.syncResults.filter(r => r.status === 'failed').length,
      skippedSyncs: this.syncResults.filter(r => r.status === 'skipped').length,
      recentResults
    };
  }

  /**
   * Clear sync history
   */
  clearHistory(): void {
    this.syncResults = [];
    console.log('🧹 Sync history cleared');
  }
}

export { AutoSyncService };

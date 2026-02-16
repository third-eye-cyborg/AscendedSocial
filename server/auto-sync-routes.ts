import express, { Request, Response } from 'express';
import { AutoSyncService } from './auto-sync-service.js';

const router = express.Router();
console.log('🔄 Auto-Sync routes registered');

// Global auto-sync service instance
let autoSyncService: AutoSyncService | null = null;

// Initialize auto-sync service
router.post('/init', async (req: Request, res: Response) => {
  try {
    const { watchPaths, syncInterval, mobileSync, includeCodeFiles } = req.body;
    
    autoSyncService = new AutoSyncService({
      watchPaths: watchPaths || ['../*.md', '../docs/**/*.md', '../server/**/*.ts'],
      syncInterval: syncInterval || 30000,
      mobileSync: mobileSync || false,
      includeCodeFiles: includeCodeFiles || false
    });

    await autoSyncService.start();
    
    res.json({
      success: true,
      message: 'Auto-sync service initialized and started',
      config: {
        watchPaths: autoSyncService['config'].watchPaths,
        syncInterval: autoSyncService['config'].syncInterval,
        mobileSync: autoSyncService['config'].mobileSync,
        includeCodeFiles: autoSyncService['config'].includeCodeFiles
      }
    });
  } catch (error: any) {
    console.error('❌ Auto-sync initialization failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize auto-sync service',
      details: error.message
    });
  }
});

// Start auto-sync service
router.post('/start', async (req: Request, res: Response) => {
  try {
    if (!autoSyncService) {
      return res.status(400).json({
        success: false,
        error: 'Auto-sync service not initialized. Call /init first.'
      });
    }

    await autoSyncService.start();
    
    res.json({
      success: true,
      message: 'Auto-sync service started',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Auto-sync start failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start auto-sync service',
      details: error.message
    });
  }
});

// Stop auto-sync service
router.post('/stop', async (req: Request, res: Response) => {
  try {
    if (!autoSyncService) {
      return res.status(400).json({
        success: false,
        error: 'Auto-sync service not initialized'
      });
    }

    await autoSyncService.stop();
    
    res.json({
      success: true,
      message: 'Auto-sync service stopped',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Auto-sync stop failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop auto-sync service',
      details: error.message
    });
  }
});

// Sync all files
router.post('/sync-all', async (req: Request, res: Response) => {
  try {
    if (!autoSyncService) {
      return res.status(400).json({
        success: false,
        error: 'Auto-sync service not initialized. Call /init first.'
      });
    }

    const results = await autoSyncService.syncAllFiles();
    
    res.json({
      success: true,
      message: `Synced ${results.length} files`,
      results: results.map(r => ({
        file: r.file,
        status: r.status,
        pageId: r.pageId,
        error: r.error,
        timestamp: r.timestamp
      })),
      summary: {
        total: results.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        skipped: results.filter(r => r.status === 'skipped').length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Sync all failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync all files',
      details: error.message
    });
  }
});

// Sync mobile documentation
router.post('/sync-mobile', async (req: Request, res: Response) => {
  try {
    if (!autoSyncService) {
      return res.status(400).json({
        success: false,
        error: 'Auto-sync service not initialized. Call /init first.'
      });
    }

    const { platform = 'all' } = req.body;
    const results = await autoSyncService.syncMobileDocs(platform);
    
    res.json({
      success: true,
      message: `Synced mobile documentation for platform: ${platform}`,
      platform,
      results: results.map(r => ({
        file: r.file,
        status: r.status,
        pageId: r.pageId,
        error: r.error,
        timestamp: r.timestamp
      })),
      summary: {
        total: results.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Mobile sync failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync mobile documentation',
      details: error.message
    });
  }
});

// Get sync status
router.get('/status', async (req: Request, res: Response) => {
  try {
    if (!autoSyncService) {
      return res.status(400).json({
        success: false,
        error: 'Auto-sync service not initialized'
      });
    }

    const status = autoSyncService.getStatus();
    
    res.json({
      success: true,
      status: {
        isRunning: status.isRunning,
        lastSyncTime: status.lastSyncTime,
        statistics: {
          totalFiles: status.totalFiles,
          successfulSyncs: status.successfulSyncs,
          failedSyncs: status.failedSyncs,
          skippedSyncs: status.skippedSyncs
        },
        recentResults: status.recentResults
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sync status',
      details: error.message
    });
  }
});

// Clear sync history
router.post('/clear-history', async (req: Request, res: Response) => {
  try {
    if (!autoSyncService) {
      return res.status(400).json({
        success: false,
        error: 'Auto-sync service not initialized'
      });
    }

    autoSyncService.clearHistory();
    
    res.json({
      success: true,
      message: 'Sync history cleared',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Clear history failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear sync history',
      details: error.message
    });
  }
});

// Update configuration
router.post('/config', async (req: Request, res: Response) => {
  try {
    if (!autoSyncService) {
      return res.status(400).json({
        success: false,
        error: 'Auto-sync service not initialized. Call /init first.'
      });
    }

    const { watchPaths, syncInterval, mobileSync, includeCodeFiles } = req.body;
    
    // Stop current service
    await autoSyncService.stop();
    
    // Create new service with updated config
    autoSyncService = new AutoSyncService({
      watchPaths: watchPaths || autoSyncService['config'].watchPaths,
      syncInterval: syncInterval || autoSyncService['config'].syncInterval,
      mobileSync: mobileSync !== undefined ? mobileSync : autoSyncService['config'].mobileSync,
      includeCodeFiles: includeCodeFiles !== undefined ? includeCodeFiles : autoSyncService['config'].includeCodeFiles
    });

    await autoSyncService.start();
    
    res.json({
      success: true,
      message: 'Configuration updated and service restarted',
      config: {
        watchPaths: autoSyncService['config'].watchPaths,
        syncInterval: autoSyncService['config'].syncInterval,
        mobileSync: autoSyncService['config'].mobileSync,
        includeCodeFiles: autoSyncService['config'].includeCodeFiles
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Config update failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update configuration',
      details: error.message
    });
  }
});

export default router;

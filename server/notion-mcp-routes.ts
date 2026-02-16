import express, { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const router = express.Router();
console.log('📚 Notion MCP routes registered');

// Initialize Notion MCP server (loaded dynamically to avoid hard dependency on MCP SDK)
let notionMCPServer: any | null = null;

// Initialize Notion MCP server endpoint
router.post('/init', async (req: Request, res: Response) => {
  try {
    const { NotionMCPServer } = await import('./notion-mcp-server.js');
    notionMCPServer = new NotionMCPServer({
      watchPaths: ['../*.md', '../docs/**/*.md', '../server/**/*.ts'],
      autoSync: true,
      syncInterval: 30000
    });
    
    res.json({
      success: true,
      message: 'Notion MCP server initialized with auto-sync enabled',
      capabilities: [
        'sync_documentation',
        'sync_all_docs',
        'create_notion_page',
        'update_notion_page',
        'get_notion_databases',
        'sync_mobile_docs',
        'start_auto_sync',
        'stop_auto_sync'
      ],
      autoSync: true
    });
  } catch (error: any) {
    const message = error?.code === 'ERR_MODULE_NOT_FOUND'
      ? 'Notion MCP dependencies are not installed. Skipping initialization.'
      : 'Failed to initialize Notion MCP server';
    console.error('❌ Notion MCP initialization failed:', error);
    res.status(503).json({
      success: false,
      error: message,
      details: error?.message
    });
  }
});

// Get Notion MCP tools list
router.get('/tools', async (req: Request, res: Response) => {
  try {
    const tools = [
      {
        name: 'sync_documentation',
        description: 'Sync a specific documentation file to Notion',
        category: 'documentation',
        parameters: ['filePath', 'forceUpdate']
      },
      {
        name: 'sync_all_docs',
        description: 'Sync all documentation files in the project to Notion',
        category: 'documentation',
        parameters: ['includeCodeFiles']
      },
      {
        name: 'create_notion_page',
        description: 'Create a new page in Notion with content',
        category: 'content-management',
        parameters: ['title', 'content', 'parentPageId']
      },
      {
        name: 'update_notion_page',
        description: 'Update an existing Notion page with new content',
        category: 'content-management',
        parameters: ['pageId', 'content']
      },
      {
        name: 'get_notion_databases',
        description: 'Get all databases in the Notion workspace',
        category: 'workspace-management',
        parameters: []
      },
      {
        name: 'sync_mobile_docs',
        description: 'Sync mobile-specific documentation to Notion',
        category: 'mobile-integration',
        parameters: ['platform']
      },
      {
        name: 'start_auto_sync',
        description: 'Start automatic file watching and syncing',
        category: 'automation',
        parameters: ['watchPaths']
      },
      {
        name: 'stop_auto_sync',
        description: 'Stop automatic file watching and syncing',
        category: 'automation',
        parameters: []
      }
    ];

    res.json({
      success: true,
      tools,
      totalTools: tools.length,
      autoSyncEnabled: notionMCPServer !== null
    });
  } catch (error: any) {
    console.error('❌ Notion MCP tools listing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list Notion MCP tools',
      details: error.message
    });
  }
});

// Execute Notion MCP tool
router.post('/execute/:toolName', async (req: Request, res: Response) => {
  try {
    const { toolName } = req.params;
    const { arguments: args } = req.body;

    if (!notionMCPServer) {
      return res.status(400).json({
        success: false,
        error: 'Notion MCP server not initialized. Call /init first.'
      });
    }

    // Create a mock MCP request
    const mockRequest = {
      params: {
        name: toolName,
        arguments: args || {}
      }
    };

    // Execute the tool based on the tool name
    let result;
    switch (toolName) {
      case 'sync_documentation':
        result = await notionMCPServer['syncDocumentation'](args.filePath, args.forceUpdate);
        break;
      case 'sync_all_docs':
        result = await notionMCPServer['syncAllDocumentation'](args.includeCodeFiles);
        break;
      case 'create_notion_page':
        result = await notionMCPServer['createNotionPage'](args.title, args.content, args.parentPageId);
        break;
      case 'update_notion_page':
        result = await notionMCPServer['updateNotionPage'](args.pageId, args.content);
        break;
      case 'get_notion_databases':
        result = await notionMCPServer['getNotionDatabases']();
        break;
      case 'sync_mobile_docs':
        result = await notionMCPServer['syncMobileDocs'](args.platform);
        break;
      case 'start_auto_sync':
        result = await notionMCPServer['startAutoSync'](args.watchPaths);
        break;
      case 'stop_auto_sync':
        result = await notionMCPServer['stopAutoSync']();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown tool: ${toolName}`
        });
    }

    res.json({
      success: true,
      tool: toolName,
      result: result.content[0].text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error(`❌ Notion MCP tool execution failed for ${req.params.toolName}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to execute Notion MCP tool: ${req.params.toolName}`,
      details: error.message
    });
  }
});

// Quick sync endpoint for immediate documentation sync
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const { filePath, includeCodeFiles = false } = req.body;

    if (!notionMCPServer) {
      return res.status(400).json({
        success: false,
        error: 'Notion MCP server not initialized. Call /init first.'
      });
    }

    let result;
    if (filePath) {
      result = await notionMCPServer['syncDocumentation'](filePath, true);
    } else {
      result = await notionMCPServer['syncAllDocumentation'](includeCodeFiles);
    }

    res.json({
      success: true,
      message: result.content[0].text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Quick sync failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync documentation',
      details: error.message
    });
  }
});

// Mobile-specific sync endpoint
router.post('/sync-mobile', async (req: Request, res: Response) => {
  try {
    const { platform = 'all' } = req.body;

    if (!notionMCPServer) {
      return res.status(400).json({
        success: false,
        error: 'Notion MCP server not initialized. Call /init first.'
      });
    }

    const result = await notionMCPServer['syncMobileDocs'](platform);

    res.json({
      success: true,
      message: result.content[0].text,
      platform,
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

// Auto-sync control endpoints
router.post('/auto-sync/start', async (req: Request, res: Response) => {
  try {
    const { watchPaths } = req.body;

    if (!notionMCPServer) {
      return res.status(400).json({
        success: false,
        error: 'Notion MCP server not initialized. Call /init first.'
      });
    }

    const result = await notionMCPServer['startAutoSync'](watchPaths);

    res.json({
      success: true,
      message: result.content[0].text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Auto-sync start failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start auto-sync',
      details: error.message
    });
  }
});

router.post('/auto-sync/stop', async (req: Request, res: Response) => {
  try {
    if (!notionMCPServer) {
      return res.status(400).json({
        success: false,
        error: 'Notion MCP server not initialized. Call /init first.'
      });
    }

    const result = await notionMCPServer['stopAutoSync']();

    res.json({
      success: true,
      message: result.content[0].text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Auto-sync stop failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop auto-sync',
      details: error.message
    });
  }
});

// Status endpoint
router.get('/status', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      status: 'operational',
      version: '1.0.0',
      protocol: 'Model Context Protocol',
      capabilities: {
        tools: true,
        autoSync: notionMCPServer !== null,
        mobileSync: true,
        documentationSync: true
      },
      notion: {
        connected: !!process.env.NOTION_INTEGRATION_SECRET,
        pageId: process.env.NOTION_PAGE_ID
      }
    });
  } catch (error: any) {
    console.error('❌ Notion MCP status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Notion MCP status',
      details: error.message
    });
  }
});

export default router;

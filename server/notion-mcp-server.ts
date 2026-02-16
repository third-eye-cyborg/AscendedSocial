import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import { notion, NOTION_PAGE_ID, createOrUpdateDocumentationPage, findDatabaseByTitle } from './notion.js';
import chokidar from 'chokidar';

interface NotionMCPServerConfig {
  watchPaths?: string[];
  syncInterval?: number;
  autoSync?: boolean;
}

class NotionMCPServer {
  private server: Server;
  private config: NotionMCPServerConfig;
  private watcher?: chokidar.FSWatcher;
  private syncInProgress: boolean = false;

  constructor(config: NotionMCPServerConfig = {}) {
    this.config = {
      watchPaths: config.watchPaths || ['../*.md', '../docs/**/*.md', '../server/**/*.ts'],
      syncInterval: config.syncInterval || 30000, // 30 seconds
      autoSync: config.autoSync !== false,
      ...config
    };

    this.server = new Server(
      {
        name: 'notion-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
    
    if (this.config.autoSync) {
      this.startFileWatcher();
    }
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'sync_documentation',
            description: 'Sync project documentation files to Notion',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the documentation file to sync'
                },
                forceUpdate: {
                  type: 'boolean',
                  description: 'Force update even if file hasn\'t changed',
                  default: false
                }
              }
            }
          },
          {
            name: 'sync_all_docs',
            description: 'Sync all documentation files in the project to Notion',
            inputSchema: {
              type: 'object',
              properties: {
                includeCodeFiles: {
                  type: 'boolean',
                  description: 'Include TypeScript/JavaScript files as documentation',
                  default: false
                }
              }
            }
          },
          {
            name: 'create_notion_page',
            description: 'Create a new page in Notion with content',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the page'
                },
                content: {
                  type: 'string',
                  description: 'Content of the page (markdown format)'
                },
                parentPageId: {
                  type: 'string',
                  description: 'Parent page ID (optional, defaults to main workspace)'
                }
              },
              required: ['title', 'content']
            }
          },
          {
            name: 'update_notion_page',
            description: 'Update an existing Notion page with new content',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: {
                  type: 'string',
                  description: 'ID of the page to update'
                },
                content: {
                  type: 'string',
                  description: 'New content for the page (markdown format)'
                }
              },
              required: ['pageId', 'content']
            }
          },
          {
            name: 'get_notion_databases',
            description: 'Get all databases in the Notion workspace',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'sync_mobile_docs',
            description: 'Sync mobile-specific documentation to Notion',
            inputSchema: {
              type: 'object',
              properties: {
                platform: {
                  type: 'string',
                  enum: ['ios', 'android', 'web', 'all'],
                  description: 'Mobile platform to sync docs for',
                  default: 'all'
                }
              }
            }
          },
          {
            name: 'start_auto_sync',
            description: 'Start automatic file watching and syncing',
            inputSchema: {
              type: 'object',
              properties: {
                watchPaths: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Paths to watch for changes'
                }
              }
            }
          },
          {
            name: 'stop_auto_sync',
            description: 'Stop automatic file watching and syncing',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'sync_documentation':
            return await this.syncDocumentation(args.filePath, args.forceUpdate);
          
          case 'sync_all_docs':
            return await this.syncAllDocumentation(args.includeCodeFiles);
          
          case 'create_notion_page':
            return await this.createNotionPage(args.title, args.content, args.parentPageId);
          
          case 'update_notion_page':
            return await this.updateNotionPage(args.pageId, args.content);
          
          case 'get_notion_databases':
            return await this.getNotionDatabases();
          
          case 'sync_mobile_docs':
            return await this.syncMobileDocs(args.platform);
          
          case 'start_auto_sync':
            return await this.startAutoSync(args.watchPaths);
          
          case 'stop_auto_sync':
            return await this.stopAutoSync();
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ]
        };
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('Notion MCP Server error:', error);
    };

    process.on('SIGINT', async () => {
      await this.stopAutoSync();
      process.exit(0);
    });
  }

  private async syncDocumentation(filePath: string, forceUpdate: boolean = false): Promise<any> {
    try {
      if (!filePath) {
        throw new Error('File path is required');
      }

      const fullPath = path.resolve(filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      
      const pageId = await createOrUpdateDocumentationPage(content);
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Successfully synced ${filePath} to Notion\nPage ID: ${pageId}`
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to sync documentation: ${error.message}`);
    }
  }

  private async syncAllDocumentation(includeCodeFiles: boolean = false): Promise<any> {
    try {
      const results = [];
      const watchPaths = this.config.watchPaths || [];
      
      for (const pattern of watchPaths) {
        const files = await this.getFilesMatchingPattern(pattern);
        
        for (const file of files) {
          if (!includeCodeFiles && (file.endsWith('.ts') || file.endsWith('.js'))) {
            continue;
          }
          
          try {
            const content = await fs.readFile(file, 'utf-8');
            const pageId = await createOrUpdateDocumentationPage(content);
            results.push({ file, pageId, status: 'success' });
          } catch (error: any) {
            results.push({ file, error: error.message, status: 'failed' });
          }
        }
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Synced ${results.filter(r => r.status === 'success').length} files to Notion\n\nResults:\n${results.map(r => 
              r.status === 'success' 
                ? `✅ ${r.file} → ${r.pageId}`
                : `❌ ${r.file} → ${r.error}`
            ).join('\n')}`
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to sync all documentation: ${error.message}`);
    }
  }

  private async createNotionPage(title: string, content: string, parentPageId?: string): Promise<any> {
    try {
      const page = await notion.pages.create({
        parent: {
          type: "page_id",
          page_id: parentPageId || NOTION_PAGE_ID
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

      return {
        content: [
          {
            type: 'text',
            text: `✅ Created Notion page: ${title}\nPage ID: ${page.id}`
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to create Notion page: ${error.message}`);
    }
  }

  private async updateNotionPage(pageId: string, content: string): Promise<any> {
    try {
      // Clear existing content
      const existingBlocks = await notion.blocks.children.list({
        block_id: pageId
      });
      
      for (const block of existingBlocks.results) {
        await notion.blocks.delete({
          block_id: block.id
        });
      }

      // Add new content
      const blocks = this.convertMarkdownToBlocks(content);
      if (blocks.length > 0) {
        await notion.blocks.children.append({
          block_id: pageId,
          children: blocks
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: `✅ Updated Notion page: ${pageId}`
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to update Notion page: ${error.message}`);
    }
  }

  private async getNotionDatabases(): Promise<any> {
    try {
      const databases = await notion.search({
        filter: {
          property: 'object',
          value: 'database'
        }
      });

      const dbList = databases.results.map((db: any) => ({
        id: db.id,
        title: db.title?.[0]?.plain_text || 'Untitled',
        url: db.url
      }));

      return {
        content: [
          {
            type: 'text',
            text: `📊 Found ${dbList.length} databases:\n\n${dbList.map(db => 
              `• ${db.title} (${db.id})\n  ${db.url}`
            ).join('\n\n')}`
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to get Notion databases: ${error.message}`);
    }
  }

  private async syncMobileDocs(platform: string = 'all'): Promise<any> {
    try {
      const mobileDocs = [
        { file: '../mobile-sync-docs.md', title: 'Mobile Sync Documentation' },
        { file: '../mobile-auth-setup.md', title: 'Mobile Authentication Setup' },
        { file: '../mobile-api-docs.md', title: 'Mobile API Documentation' }
      ];

      const results = [];
      
      for (const doc of mobileDocs) {
        try {
          const content = await fs.readFile(doc.file, 'utf-8');
          const pageId = await this.createNotionPage(doc.title, content);
          results.push({ file: doc.file, title: doc.title, status: 'success' });
        } catch (error: any) {
          results.push({ file: doc.file, title: doc.title, error: error.message, status: 'failed' });
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `📱 Synced mobile documentation for platform: ${platform}\n\nResults:\n${results.map(r => 
              r.status === 'success' 
                ? `✅ ${r.title}`
                : `❌ ${r.title} → ${r.error}`
            ).join('\n')}`
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to sync mobile docs: ${error.message}`);
    }
  }

  private async startAutoSync(watchPaths?: string[]): Promise<any> {
    try {
      if (this.watcher) {
        await this.stopAutoSync();
      }

      const paths = watchPaths || this.config.watchPaths || [];
      this.watcher = chokidar.watch(paths, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true
      });

      this.watcher.on('change', async (filePath) => {
        if (this.syncInProgress) return;
        
        this.syncInProgress = true;
        try {
          console.log(`📝 File changed: ${filePath}`);
          await this.syncDocumentation(filePath);
          console.log(`✅ Auto-synced: ${filePath}`);
        } catch (error: any) {
          console.error(`❌ Auto-sync failed for ${filePath}:`, error.message);
        } finally {
          this.syncInProgress = false;
        }
      });

      return {
        content: [
          {
            type: 'text',
            text: `✅ Auto-sync started\nWatching paths: ${paths.join(', ')}`
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to start auto-sync: ${error.message}`);
    }
  }

  private async stopAutoSync(): Promise<any> {
    try {
      if (this.watcher) {
        await this.watcher.close();
        this.watcher = undefined;
      }

      return {
        content: [
          {
            type: 'text',
            text: '✅ Auto-sync stopped'
          }
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to stop auto-sync: ${error.message}`);
    }
  }

  private async getFilesMatchingPattern(pattern: string): Promise<string[]> {
    const { glob } = require('glob');
    return await glob(pattern);
  }

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

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('🚀 Notion MCP Server started');
  }
}

export { NotionMCPServer };
